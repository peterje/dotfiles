# dotfiles

single source of truth for my machine config.

## source of truth

this repo lives at:

```text
~/Workspace/dotfiles
```

active config in `$HOME` and `~/.config` should symlink back into this repo. older locations like `~/stow` and `~/dotfiles` are not authoritative.

## quick map

| path in repo | loaded as | what it does |
| --- | --- | --- |
| `zsh/.zshenv` | `~/.zshenv` | first zsh file read for every zsh invocation. sets XDG paths, `EDITOR`, `ZDOTDIR=$HOME/.config/zsh`, history/cache locations, and early `PATH` entries. keep this small and safe for non-interactive shells. |
| `zsh/.config/zsh/.zshrc` | `~/.config/zsh/.zshrc` | main interactive shell config. sets shell options, sources theme/aliases/plugins/path/vim config, and initializes tools like `fnm`, `mise`, bun, cargo, deno, and vite-plus. |
| `zsh/.zshrc` | `~/.zshrc` | compatibility entrypoint for tools that look for a home-level zshrc. because `~/.zshenv` sets `ZDOTDIR`, normal interactive zsh uses `~/.config/zsh/.zshrc`. |
| `zsh/.config/zsh/.zprofile` | `~/.config/zsh/.zprofile` | login-shell config, if zsh starts as a login shell. |
| `zsh/.config/zsh/aliases.zsh` | sourced by zshrc | aliases and shell helpers. |
| `zsh/.config/zsh/path.zsh` | sourced by zshrc | path construction and path-related exports. |
| `zsh/.config/zsh/plugins.zsh` | sourced by zshrc | zsh plugin loading. |
| `zsh/.config/zsh/theme.zsh` | sourced by zshrc | prompt/theme setup. |
| `zsh/.config/zsh/vim.zsh` | sourced by zshrc | vim/editor-related shell config. |
| `zsh/.config/zsh/completions/` | added to `FPATH` | local shell completions, e.g. deno. |
| `nvim/.config/nvim/` | `~/.config/nvim` | neovim config. entrypoint is `init.lua`. |
| `ghostty/.config/ghostty/config` | `~/.config/ghostty/config` | ghostty terminal config. |
| `zellij/.config/zellij/config.kdl` | `~/.config/zellij/config.kdl` | zellij config. |
| `zellij/.config/zellij/layouts/` | `~/.config/zellij/layouts/` | zellij layouts. |
| `zellij/.config/zellij/plugins/` | `~/.config/zellij/plugins/` | local zellij wasm plugins. |
| `opencode/.config/opencode/` | `~/.config/opencode/*` | opencode config, instructions, agents, tui config, and package metadata. `~/.config/opencode/skills` points to `~/.agents/skills` so skills live in one shared place. |
| `pi/.pi/agent/settings.json` | `~/.pi/agent/settings.json` | global pi settings: default provider/model, thinking level, theme, installed pi packages. |
| `pi/.pi/agent/extensions/` | `~/.pi/agent/extensions/` | global pi TypeScript extensions, including the `interview_user` tool / research interview UI. |
| `pi/.pi/agent/skills/` | `~/.pi/agent/skills/` | global pi-native skills. local state like auth, sessions, fff cache, and package checkouts are intentionally not tracked. |
| `agents/.agents/` | `~/.agents` | global Agent Skills directory shared by pi, opencode, and other agents. contains reusable skills such as browser, create-a-pr, design, TDD, PRD/workflow helpers, React/Next/Vercel, Remotion, and Effect guidance. |

## zsh load order

important zsh distinction:

1. `~/.zshenv`
   - always read by zsh, including scripts and non-interactive shells.
   - this repo uses it to set `ZDOTDIR=$HOME/.config/zsh`.
2. `$ZDOTDIR/.zprofile`
   - read for login shells.
3. `$ZDOTDIR/.zshrc`
   - read for interactive shells.
   - this is where aliases, prompt, plugins, completions, and interactive tool init belong.
4. `$ZDOTDIR/.zlogin`
   - read after `.zshrc` for login shells, if present.

rule of thumb:

- put environment needed by every zsh process in `.zshenv`, but keep it minimal.
- put interactive shell behavior in `.zshrc`.
- put login-only setup in `.zprofile`.

## install / relink

from this repo:

```bash
stow -t ~ nvim ghostty zsh zellij opencode pi agents
```

from zsh, helper functions are available:

```bash
dstow              # relink default packages
dstow nvim         # relink one package
dunstow nvim       # unlink one package
```

## current active symlinks

expected shape:

```text
~/.zshenv         -> ~/Workspace/dotfiles/zsh/.zshenv
~/.zshrc          -> ~/Workspace/dotfiles/zsh/.config/zsh/.zshrc
~/.config/zsh     -> ~/Workspace/dotfiles/zsh/.config/zsh
~/.config/nvim    -> ~/Workspace/dotfiles/nvim/.config/nvim
~/.config/ghostty -> ~/Workspace/dotfiles/ghostty/.config/ghostty
~/.config/zellij  -> ~/Workspace/dotfiles/zellij/.config/zellij
~/.config/opencode/* -> ~/Workspace/dotfiles/opencode/.config/opencode/*
~/.config/opencode/skills -> ~/.agents/skills
~/.pi/agent/settings.json -> ~/Workspace/dotfiles/pi/.pi/agent/settings.json
~/.pi/agent/extensions -> ~/Workspace/dotfiles/pi/.pi/agent/extensions
~/.pi/agent/skills -> ~/Workspace/dotfiles/pi/.pi/agent/skills
~/.agents -> ~/Workspace/dotfiles/agents/.agents
```

## not tracked

local shell state and cleanup archives are intentionally ignored:

```text
**/.zsh_history
**/.zsh_sessions/
**/.zcompdump*
_imported/
pi/.pi/agent/auth.json
pi/.pi/agent/sessions/
pi/.pi/agent/fff/
pi/.pi/agent/git/
**/.DS_Store
```
