import { execFile } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { basename, dirname, isAbsolute, relative, resolve } from "node:path";
import { promisify } from "node:util";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Type } from "@sinclair/typebox";

const execFileAsync = promisify(execFile);
const DEFAULT_GREP_LIMIT = 100;
const DEFAULT_FIND_LIMIT = 200;
const MAX_BUFFER = 1024 * 1024 * 20;

function shellQuote(value: string): string {
	return `'${value.replaceAll("'", `'\\''`)}'`;
}

function resolveSearchPath(cwd: string, input?: string): { root: string; file?: string; displayPrefix: string } {
	if (!input) return { root: cwd, displayPrefix: "" };

	const absolute = isAbsolute(input) ? input : resolve(cwd, input);
	if (existsSync(absolute)) {
		const stat = statSync(absolute);
		if (stat.isDirectory()) return { root: absolute, displayPrefix: "" };
		return { root: dirname(absolute), file: basename(absolute), displayPrefix: "" };
	}

	return { root: cwd, file: input, displayPrefix: "" };
}

function toDisplayPath(root: string, file: string): string {
	const path = relative(root, resolve(root, file)) || file;
	return path.startsWith("..") ? file : path;
}

function buildFindCommand(root: string, fileConstraint?: string): string {
	const parts = ["find", shellQuote(root), "-type", "f"];
	if (fileConstraint) {
		if (fileConstraint.includes("*") || fileConstraint.includes("?") || fileConstraint.includes("[")) {
			parts.push("-path", shellQuote(`*${fileConstraint}*`));
		} else if (fileConstraint.includes("/")) {
			parts.push("-path", shellQuote(`*${fileConstraint}*`));
		} else {
			parts.push("-name", shellQuote(fileConstraint));
		}
	}
	return parts.join(" ");
}

async function listFiles(root: string, fileConstraint?: string): Promise<string[]> {
	const command = buildFindCommand(root, fileConstraint);
	const { stdout } = await execFileAsync("/bin/sh", ["-c", command], { maxBuffer: MAX_BUFFER });
	return stdout.split("\n").filter(Boolean);
}

function fuzzyScore(query: string, candidate: string): number {
	const q = query.toLowerCase();
	const c = candidate.toLowerCase();
	if (!q) return 1;
	if (c === q) return 100;
	if (basename(c) === q) return 95;
	if (basename(c).includes(q)) return 80 - basename(c).length / 1000;
	if (c.includes(q)) return 60 - c.length / 1000;

	let qi = 0;
	for (let ci = 0; ci < c.length && qi < q.length; ci++) {
		if (c[ci] === q[qi]) qi++;
	}
	return qi === q.length ? 30 - c.length / 1000 : 0;
}

function makeMatcher(pattern: string, literal: boolean, ignoreCase?: boolean): (line: string) => boolean {
	if (!literal) {
		const flags = ignoreCase ? "i" : undefined;
		const regex = new RegExp(pattern, flags);
		return (line) => regex.test(line);
	}

	const smartIgnoreCase = ignoreCase === true || (ignoreCase !== false && pattern.toLowerCase() === pattern);
	const needle = smartIgnoreCase ? pattern.toLowerCase() : pattern;
	return (line) => (smartIgnoreCase ? line.toLowerCase() : line).includes(needle);
}

export default function universalSearch(pi: ExtensionAPI) {
	let activeCwd = process.cwd();

	pi.on("session_start", async (_event, ctx) => {
		activeCwd = ctx.cwd;
	});

	const grepSchema = Type.Object({
		pattern: Type.String({ description: "Search pattern (plain text or regex)" }),
		path: Type.Optional(Type.String({ description: "Directory or file constraint. Absolute paths and gitignored paths are supported." })),
		ignoreCase: Type.Optional(Type.Boolean({ description: "Case-insensitive search" })),
		literal: Type.Optional(Type.Boolean({ description: "Treat pattern as literal string instead of regex (default: true)" })),
		context: Type.Optional(Type.Number({ description: "Number of lines to show before and after each match (default: 0)" })),
		limit: Type.Optional(Type.Number({ description: `Maximum number of matches to return (default: ${DEFAULT_GREP_LIMIT})` })),
	});

	pi.registerTool({
		name: "grep",
		label: "grep (universal)",
		description: "Search file contents. Supports project paths, absolute paths outside the project, node_modules, symlinks, and gitignored paths.",
		promptSnippet: "Search file contents for patterns (universal: supports absolute, ignored, and symlink paths)",
		parameters: grepSchema,
		async execute(_id, params) {
			const target = resolveSearchPath(activeCwd, params.path);
			const files = await listFiles(target.root, target.file);
			const matcher = makeMatcher(params.pattern, params.literal !== false, params.ignoreCase);
			const context = Math.max(0, params.context ?? 0);
			const limit = Math.max(1, params.limit ?? DEFAULT_GREP_LIMIT);
			const output: string[] = [];

			for (const file of files) {
				let text: string;
				try {
					text = await readFile(file, "utf8");
				} catch {
					continue;
				}
				if (text.includes("\u0000")) continue;

				const lines = text.split(/\r?\n/);
				for (let i = 0; i < lines.length; i++) {
					if (!matcher(lines[i] ?? "")) continue;
					const rel = toDisplayPath(target.root, file);
					for (let j = Math.max(0, i - context); j < i; j++) output.push(`${rel}-${j + 1}- ${lines[j]}`);
					output.push(`${rel}:${i + 1}: ${lines[i]}`);
					for (let j = i + 1; j <= Math.min(lines.length - 1, i + context); j++) output.push(`${rel}-${j + 1}- ${lines[j]}`);
					if (output.length >= limit) {
						return { content: [{ type: "text", text: `${output.slice(0, limit).join("\n")}\n\n[${limit} matches limit reached. Use limit=${limit * 2} for more]` }] };
					}
				}
			}

			return { content: [{ type: "text", text: output.length > 0 ? output.join("\n") : "No matches found" }] };
		},
	});

	const findSchema = Type.Object({
		pattern: Type.String({ description: "Fuzzy search query for file names. Supports absolute paths and globs." }),
		path: Type.Optional(Type.String({ description: "Directory to search in" })),
		limit: Type.Optional(Type.Number({ description: `Maximum number of results (default: ${DEFAULT_FIND_LIMIT})` })),
	});

	pi.registerTool({
		name: "find",
		label: "find (universal)",
		description: "Find files by name. Supports project paths, absolute paths outside the project, node_modules, symlinks, and gitignored paths.",
		promptSnippet: "Find files by name (universal: supports absolute, ignored, and symlink paths)",
		parameters: findSchema,
		async execute(_id, params) {
			const explicitTarget = !params.path && (isAbsolute(params.pattern) || existsSync(resolve(activeCwd, params.pattern)))
				? resolveSearchPath(activeCwd, params.pattern)
				: undefined;
			const target = explicitTarget ?? resolveSearchPath(activeCwd, params.path);
			const query = explicitTarget?.file ?? params.pattern;
			const limit = Math.max(1, params.limit ?? DEFAULT_FIND_LIMIT);
			const files = await listFiles(target.root, explicitTarget?.file);
			const scored = files
				.map((file) => ({ file: toDisplayPath(target.root, file), score: fuzzyScore(query, toDisplayPath(target.root, file)) }))
				.filter((item) => item.score > 0)
				.sort((a, b) => b.score - a.score || a.file.localeCompare(b.file));

			const output = scored.slice(0, limit).map((item) => item.file).join("\n");
			const notice = scored.length > limit ? `\n\n[${limit} results limit reached. Use limit=${limit * 2} for more, or refine pattern]` : "";
			return { content: [{ type: "text", text: output ? `${output}${notice}` : "No files found matching pattern" }] };
		},
	});
}
