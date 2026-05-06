<pre>
dotfiles
========

source of truth
---------------

~/Workspace/dotfiles

Everything here is managed with GNU Stow. Live files in ~ and ~/.config
should point back into this repo.

Install / relink everything:

  stow -t ~ nvim ghostty zsh zellij opencode codex pi agents git bin

Dotfiles command:

  dstow             relink default packages
  dstow nvim        relink one package
  dstow unlink nvim unlink one package
  dstow status      show tracked links and where they point


layout
------

zsh/
  ~/.zshenv
    First zsh file loaded for every zsh invocation.
    Keep this small.
    Sets XDG paths, EDITOR, ZDOTDIR, history/cache paths, and early PATH.

  ~/.config/zsh/.zshrc
    Main interactive shell config.
    Loads aliases, theme, plugins, path config, vim config, completions,
    and interactive tool setup.

  ~/.zshrc
    Compatibility entrypoint for tools that expect a home-level zshrc.
    Normal zsh uses ~/.config/zsh/.zshrc because ~/.zshenv sets ZDOTDIR.

  ~/.config/zsh/.zprofile
    Login-shell config.

nvim/
  ~/.config/nvim
    Neovim config. Entry point is init.lua.

ghostty/
  ~/.config/ghostty
    Ghostty terminal config.

zellij/
  ~/.config/zellij
    Zellij config, layouts, and local wasm plugins.

opencode/
  ~/.config/opencode
    Opencode config, instructions, agents, TUI config, and package metadata.

  ~/.config/opencode/skills -> ~/.agents/skills
    Opencode skills live in the shared agent skills directory.

codex/
  ~/.codex/config.toml
    Codex config. Secrets, auth, logs, sessions, and generated state stay local.

pi/
  ~/.pi/agent/settings.json
    Global pi settings: provider, model, thinking level, theme, packages.

  ~/.pi/agent/extensions
    Global pi TypeScript extensions.

  ~/.pi/agent/skills
    Pi-native skills.

agents/
  ~/.agents
    Shared Agent Skills directory used by pi, opencode, and other agents.

git/
  ~/.gitconfig
    Global git config: ssh signing, rerere, rebase defaults, pruning,
    difftastic/nvim tools, and aliases.


zsh load order
--------------

1. ~/.zshenv
   Always loaded. Use for minimal environment only.

2. $ZDOTDIR/.zprofile
   Loaded for login shells.

3. $ZDOTDIR/.zshrc
   Loaded for interactive shells.

Rule of thumb:

  .zshenv    minimal env for every zsh process
  .zprofile  login-only setup
  .zshrc     interactive shell behavior


expected links
--------------

~/.zshenv                  -> ~/Workspace/dotfiles/zsh/.zshenv
~/.zshrc                   -> ~/Workspace/dotfiles/zsh/.config/zsh/.zshrc
~/.config/zsh              -> ~/Workspace/dotfiles/zsh/.config/zsh
~/.config/nvim             -> ~/Workspace/dotfiles/nvim/.config/nvim
~/.config/ghostty          -> ~/Workspace/dotfiles/ghostty/.config/ghostty
~/.config/zellij           -> ~/Workspace/dotfiles/zellij/.config/zellij
~/.config/opencode/*       -> ~/Workspace/dotfiles/opencode/.config/opencode/*
~/.config/opencode/skills  -> ~/.agents/skills
~/.codex/config.toml       -> ~/Workspace/dotfiles/codex/.codex/config.toml
~/.pi/agent/settings.json  -> ~/Workspace/dotfiles/pi/.pi/agent/settings.json
~/.pi/agent/extensions     -> ~/Workspace/dotfiles/pi/.pi/agent/extensions
~/.pi/agent/skills         -> ~/Workspace/dotfiles/pi/.pi/agent/skills
~/.agents                  -> ~/Workspace/dotfiles/agents/.agents
~/.gitconfig               -> ~/Workspace/dotfiles/git/.gitconfig


not tracked
-----------

Shell state, caches, secrets, sessions, and local archives are ignored:

  **/.zsh_history
  **/.zsh_sessions/
  **/.zcompdump*
  _imported/
  pi/.pi/agent/auth.json
  pi/.pi/agent/sessions/
  pi/.pi/agent/fff/
  pi/.pi/agent/git/
  **/.DS_Store
</pre>
