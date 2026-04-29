import { StringEnum } from "@mariozechner/pi-ai";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Editor, Key, Text, matchesKey, truncateToWidth, type EditorTheme } from "@mariozechner/pi-tui";
import { Type } from "@sinclair/typebox";

type QuestionType = "text" | "single_select" | "yes_no";

type AnswerSource = "typed" | "selected";

interface InterviewOption {
	value: string;
	label: string;
	description?: string;
}

interface InterviewQuestion {
	id: string;
	label: string;
	prompt: string;
	type: QuestionType;
	options: InterviewOption[];
	required: boolean;
	allowCustom: boolean;
	placeholder?: string;
}

interface InterviewAnswer {
	id: string;
	label: string;
	prompt: string;
	type: QuestionType;
	value: string;
	display: string;
	source: AnswerSource;
}

interface InterviewDetails {
	title?: string;
	preface?: string;
	questions: InterviewQuestion[];
	answers: InterviewAnswer[];
	cancelled: boolean;
	timestamp: number;
}

const OptionSchema = Type.Object({
	value: Type.String({ description: "Returned value for this option" }),
	label: Type.String({ description: "Display label for this option" }),
	description: Type.Optional(Type.String({ description: "Optional help text for this option" })),
});

const QuestionSchema = Type.Object({
	id: Type.String({ description: "Stable identifier for the question" }),
	label: Type.Optional(Type.String({ description: "Short label shown in the tab bar" })),
	prompt: Type.String({ description: "The question shown to the user" }),
	type: Type.Optional(
		StringEnum(["text", "single_select", "yes_no"] as const, {
			description: "Question type. Defaults to text.",
		}),
	),
	options: Type.Optional(Type.Array(OptionSchema, { description: "Options for single_select questions" })),
	required: Type.Optional(Type.Boolean({ description: "Whether an answer is required. Defaults to true." })),
	allowCustom: Type.Optional(
		Type.Boolean({
			description: "For single_select questions, allow a custom typed answer. Defaults to true.",
		}),
	),
	placeholder: Type.Optional(Type.String({ description: "Optional placeholder / hint for text questions" })),
});

const InterviewSchema = Type.Object({
	title: Type.Optional(Type.String({ description: "Optional title for the interview UI" })),
	preface: Type.Optional(Type.String({ description: "Short context shown above the questions" })),
	questions: Type.Array(QuestionSchema, {
		description:
			"Questions to ask the user. Use 2-8 targeted questions when you need to clarify goals, constraints, workflow, or evaluation criteria.",
	}),
});

function normalizeQuestion(input: {
	id: string;
	label?: string;
	prompt: string;
	type?: QuestionType;
	options?: InterviewOption[];
	required?: boolean;
	allowCustom?: boolean;
	placeholder?: string;
}): InterviewQuestion {
	const type = input.type ?? "text";
	let options = input.options ?? [];
	if (type === "yes_no") {
		options = [
			{ value: "yes", label: "Yes" },
			{ value: "no", label: "No" },
		];
	}
	return {
		id: input.id,
		label: input.label ?? input.id,
		prompt: input.prompt,
		type,
		options,
		required: input.required !== false,
		allowCustom: input.allowCustom !== false,
		placeholder: input.placeholder,
	};
}

function formatInterviewSummary(details: InterviewDetails): string {
	if (details.answers.length === 0) return "No answers captured.";
	return details.answers.map((answer) => `${answer.label}: ${answer.display}`).join("\n");
}

function buildDeepResearchDraft(details: InterviewDetails | undefined): string {
	const title = details?.title?.trim() || "Deep Research request";
	const captured = details?.answers ?? [];
	const capturedSection =
		captured.length > 0
			? captured
					.map((answer) => `- ${answer.label}: ${answer.display}`)
					.join("\n")
			: "- No structured intake captured yet. Infer from the conversation and identify the biggest unknowns.";

	return `# ${title}

I need help scoping a research task before doing final synthesis.

## What I know so far
${capturedSection}

## Your job
1. Grill me on the most important missing assumptions, constraints, and decision criteria.
2. Keep asking focused follow-up questions until we have a shared understanding of the goal.
3. Once the problem is well-scoped, produce a final Deep Research query I can paste into ChatGPT Deep Research.

## When you produce the final query
Make it:
- specific about the decision to be made
- explicit about success criteria and constraints
- clear about the deliverables expected from Deep Research
- practical and implementation-oriented
- structured so the research covers options, tradeoffs, risks, and a recommendation
`;
}

function findLatestInterview(ctx: Parameters<NonNullable<Parameters<ExtensionAPI["on"]>[1]>>[1]): InterviewDetails | undefined {
	const branch = ctx.sessionManager.getBranch();
	for (let i = branch.length - 1; i >= 0; i--) {
		const entry = branch[i];
		if (entry.type !== "message") continue;
		const message = entry.message;
		if (!("role" in message) || message.role !== "toolResult") continue;
		if (message.toolName !== "interview_user") continue;
		const details = message.details as InterviewDetails | undefined;
		if (details && Array.isArray(details.answers)) return details;
	}
	return undefined;
}

export default function researchInterview(pi: ExtensionAPI) {
	let latestInterview: InterviewDetails | undefined;

	const clearWidget = (ctx: { ui: { setWidget: (id: string, widget: string[] | undefined) => void } }) => {
		ctx.ui.setWidget("research-interview", undefined);
	};

	pi.on("session_start", async (_event, ctx) => {
		latestInterview = findLatestInterview(ctx);
		clearWidget(ctx);
	});

	pi.registerCommand("draft-dr-query", {
		description: "Load a Deep Research prompt draft into the editor, using the latest interview answers if available",
		handler: async (_args, ctx) => {
			ctx.ui.setEditorText(buildDeepResearchDraft(findLatestInterview(ctx)));
			ctx.ui.notify("Loaded Deep Research draft into the editor", "info");
		},
	});

	pi.registerTool({
		name: "interview_user",
		label: "Interview User",
		description:
			"Ask the user a short structured intake questionnaire. Use this when the task is underspecified and you need to gather the most important requirements, constraints, workflow details, or decision criteria before proceeding.",
		promptSnippet: "Interview the user with 2-8 focused clarification questions and capture the answers in a structured way.",
		promptGuidelines: [
			"Use interview_user when the user wants help scoping research, writing a request, choosing among options, or defining requirements but has not provided enough specifics yet.",
			"Prefer 2-8 high-value questions over a long exhaustive list.",
			"Ask about goals, success criteria, constraints, workflow, and decision criteria before making a recommendation.",
		],
		parameters: InterviewSchema,

		async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
			const normalizedQuestions = params.questions.map(normalizeQuestion);
			const title = params.title?.trim() || "Structured intake";

			if (!ctx.hasUI) {
				return {
					content: [{ type: "text", text: "Error: interview_user requires interactive mode." }],
					details: {
						title,
						preface: params.preface,
						questions: normalizedQuestions,
						answers: [],
						cancelled: true,
						timestamp: Date.now(),
					} as InterviewDetails,
				};
			}

			if (normalizedQuestions.length === 0) {
				return {
					content: [{ type: "text", text: "Error: No questions provided." }],
					details: {
						title,
						preface: params.preface,
						questions: [],
						answers: [],
						cancelled: true,
						timestamp: Date.now(),
					} as InterviewDetails,
				};
			}

			const result = await ctx.ui.custom<InterviewDetails>((tui, theme, _kb, done) => {
				let currentIndex = 0;
				let optionIndex = 0;
				let editMode = false;
				let cachedLines: string[] | undefined;
				const answers = new Map<string, InterviewAnswer>();

				const editorTheme: EditorTheme = {
					borderColor: (s) => theme.fg("accent", s),
					selectList: {
						selectedPrefix: (t) => theme.fg("accent", t),
						selectedText: (t) => theme.fg("accent", t),
						description: (t) => theme.fg("muted", t),
						scrollInfo: (t) => theme.fg("dim", t),
						noMatch: (t) => theme.fg("warning", t),
					},
				};
				const editor = new Editor(tui, editorTheme);

				const refresh = () => {
					cachedLines = undefined;
					tui.requestRender();
				};

				const submit = (cancelled: boolean) => {
					done({
						title,
						preface: params.preface,
						questions: normalizedQuestions,
						answers: Array.from(answers.values()),
						cancelled,
						timestamp: Date.now(),
					});
				};

				const loadEditorForCurrentQuestion = () => {
					const question = normalizedQuestions[currentIndex];
					const existing = answers.get(question.id);
					editor.setText(existing?.source === "typed" ? existing.value : "");
				};

				const setAnswer = (question: InterviewQuestion, value: string, display: string, source: AnswerSource) => {
					answers.set(question.id, {
						id: question.id,
						label: question.label,
						prompt: question.prompt,
						type: question.type,
						value,
						display,
						source,
					});
				};

				const advance = () => {
					if (currentIndex < normalizedQuestions.length - 1) {
						currentIndex += 1;
						optionIndex = 0;
						editMode = normalizedQuestions[currentIndex].type === "text";
						loadEditorForCurrentQuestion();
						refresh();
						return;
					}
					submit(false);
				};

				const changeQuestion = (nextIndex: number) => {
					currentIndex = Math.max(0, Math.min(normalizedQuestions.length - 1, nextIndex));
					optionIndex = 0;
					editMode = normalizedQuestions[currentIndex].type === "text";
					loadEditorForCurrentQuestion();
					refresh();
				};

				loadEditorForCurrentQuestion();
				editMode = normalizedQuestions[0].type === "text";

				editor.onSubmit = (value) => {
					const question = normalizedQuestions[currentIndex];
					const trimmed = value.trim();
					if (!trimmed && question.required) return;
					setAnswer(question, trimmed, trimmed || "(blank)", "typed");
					advance();
				};

				const handleInput = (data: string) => {
					const question = normalizedQuestions[currentIndex];
					const choiceOptions = question.type === "single_select" || question.type === "yes_no"
						? [
							...question.options,
							...(question.allowCustom ? [{ value: "__custom__", label: "Type a custom answer…" }] : []),
						]
						: [];

					if (matchesKey(data, Key.escape)) {
						if (editMode && question.type !== "text") {
							editMode = false;
							editor.setText("");
							refresh();
							return;
						}
						submit(true);
						return;
					}

					if (matchesKey(data, Key.tab) || matchesKey(data, Key.right)) {
						changeQuestion(currentIndex + 1);
						return;
					}
					if (matchesKey(data, Key.shift("tab")) || matchesKey(data, Key.left)) {
						changeQuestion(currentIndex - 1);
						return;
					}

					if (question.type === "text" || editMode) {
						editor.handleInput(data);
						refresh();
						return;
					}

					if (matchesKey(data, Key.up)) {
						optionIndex = Math.max(0, optionIndex - 1);
						refresh();
						return;
					}
					if (matchesKey(data, Key.down)) {
						optionIndex = Math.min(choiceOptions.length - 1, optionIndex + 1);
						refresh();
						return;
					}

					if (matchesKey(data, Key.enter)) {
						const selected = choiceOptions[optionIndex];
						if (!selected) return;
						if (selected.value === "__custom__") {
							editMode = true;
							editor.setText("");
							refresh();
							return;
						}
						setAnswer(question, selected.value, selected.label, "selected");
						advance();
					}
				};

				return {
					handleInput,
					invalidate: () => {
						cachedLines = undefined;
					},
					render(width: number) {
						if (cachedLines) return cachedLines;
						const lines: string[] = [];
						const question = normalizedQuestions[currentIndex];
						const choiceOptions = question.type === "single_select" || question.type === "yes_no"
							? [
								...question.options,
								...(question.allowCustom ? [{ value: "__custom__", label: "Type a custom answer…" }] : []),
							]
							: [];

						const add = (line = "") => lines.push(truncateToWidth(line, width));

						add(theme.fg("accent", "─".repeat(width)));
						add(theme.fg("accent", theme.bold(` ${title}`)));
						if (params.preface) add(theme.fg("muted", ` ${params.preface}`));
						add("");

						const tabParts = normalizedQuestions.map((q, index) => {
							const answered = answers.has(q.id) ? "■" : "□";
							const text = ` ${answered} ${q.label} `;
							if (index === currentIndex) {
								return theme.bg("selectedBg", theme.fg("text", text));
							}
							return theme.fg(answers.has(q.id) ? "success" : "muted", text);
						});
						add(` ${tabParts.join(" ")}`);
						add("");
						add(theme.fg("text", ` ${currentIndex + 1}/${normalizedQuestions.length}. ${question.prompt}`));
						add("");

						if (question.type === "text" || editMode) {
							if (question.placeholder && editor.getText().trim().length === 0) {
								add(theme.fg("dim", ` ${question.placeholder}`));
								add("");
							}
							for (const line of editor.render(Math.max(10, width - 2))) {
								add(` ${line}`);
							}
						} else {
							for (let i = 0; i < choiceOptions.length; i++) {
								const option = choiceOptions[i];
								const selected = i === optionIndex;
								const prefix = selected ? theme.fg("accent", "> ") : "  ";
								const line = `${i + 1}. ${option.label}`;
								add(prefix + (selected ? theme.fg("accent", line) : theme.fg("text", line)));
								if (option.description) add(`     ${theme.fg("muted", option.description)}`);
							}
						}

						add("");
						const existing = answers.get(question.id);
						if (existing) add(theme.fg("success", ` Current answer: ${existing.display}`));
						add(theme.fg("dim", " Tab/←→ next/prev • Enter save/select • Esc cancel"));
						add(theme.fg("accent", "─".repeat(width)));

						cachedLines = lines;
						return lines;
					},
				};
			});

			latestInterview = result.cancelled ? latestInterview : result;
			clearWidget(ctx);

			if (result.cancelled) {
				return {
					content: [{ type: "text", text: "User cancelled the interview." }],
					details: result,
				};
			}

			return {
				content: [{ type: "text", text: formatInterviewSummary(result) }],
				details: result,
			};
		},

		renderCall(args, theme) {
			const count = Array.isArray(args.questions) ? args.questions.length : 0;
			const title = typeof args.title === "string" && args.title.trim().length > 0 ? args.title : "Structured intake";
			return new Text(
				theme.fg("toolTitle", theme.bold("interview_user ")) + theme.fg("muted", `${title} · ${count} question${count === 1 ? "" : "s"}`),
				0,
				0,
			);
		},

		renderResult(result, _options, theme) {
			const details = result.details as InterviewDetails | undefined;
			if (!details) {
				const first = result.content[0];
				return new Text(first?.type === "text" ? first.text : "", 0, 0);
			}
			if (details.cancelled) return new Text(theme.fg("warning", "Cancelled"), 0, 0);
			const lines = details.answers.map((answer) => `${theme.fg("success", "✓ ")}${theme.fg("accent", answer.label)}: ${answer.display}`);
			return new Text(lines.join("\n"), 0, 0);
		},
	});
}
