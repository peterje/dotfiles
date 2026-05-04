# Add deno completions to search path
if [[ ":$FPATH:" != *":$HOME/.config/zsh/completions:"* ]]; then
  export FPATH="$HOME/.config/zsh/completions:$FPATH"
fi

setopt AUTO_PUSHD           # Push the current directory visited on the stack.
setopt PUSHD_IGNORE_DUPS    # Do not store duplicates in the stack.
setopt PUSHD_SILENT         # Do not print the directory stack after pushd or popd.
setopt APPEND_HISTORY
setopt EXTENDED_HISTORY
setopt HIST_IGNORE_ALL_DUPS
setopt HIST_IGNORE_SPACE
setopt SHARE_HISTORY        # Share history between all sessions.

export HISTFILE="$XDG_CACHE_HOME/zsh/zhistory"
export HISTSIZE=10000
export SAVEHIST=10000

export DOTFILES="${DOTFILES:-$HOME/Workspace/dotfiles}"
ZSH_CONFIG_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/zsh"

alias dunstow='dstow unlink'
alias orca='bun run /Users/peteredm/Workspace/orca/dist/orca'

source "$ZSH_CONFIG_DIR/theme.zsh"
source "$ZSH_CONFIG_DIR/vim.zsh"
source "$ZSH_CONFIG_DIR/aliases.zsh"
source "$ZSH_CONFIG_DIR/plugins.zsh"
source "$ZSH_CONFIG_DIR/path.zsh"

command -v fnm >/dev/null 2>&1 && eval "$(fnm env)"

# bun completions
[ -s "$HOME/.bun/_bun" ] && source "$HOME/.bun/_bun"

[ -f "$HOME/.local/share/../bin/env" ] && . "$HOME/.local/share/../bin/env"
[ -f "$HOME/.cargo/env" ] && . "$HOME/.cargo/env"

command -v mise >/dev/null 2>&1 && eval "$(mise activate zsh)"

# Vite+ bin (https://viteplus.dev)
[ -f "$HOME/.vite-plus/env" ] && . "$HOME/.vite-plus/env"
[ -f "$HOME/.deno/env" ] && . "$HOME/.deno/env"

[[ -f "$HOME/.zshrc.local" ]] && source "$HOME/.zshrc.local"
