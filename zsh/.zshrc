# Add deno completions to search path
if [[ ":$FPATH:" != *":/Users/peteredm/.config/zsh/completions:"* ]]; then export FPATH="/Users/peteredm/.config/zsh/completions:$FPATH"; fi
export DOTFILES="${DOTFILES:-$HOME/Workspace/dotfiles}"

typeset -U path PATH
path=(
  "$HOME/.opencode/bin"
  "$HOME/go/bin"
  $path
)
export PATH

HISTFILE="$HOME/.zsh_history"
HISTSIZE=10000
SAVEHIST=10000

setopt APPEND_HISTORY
setopt EXTENDED_HISTORY
setopt HIST_IGNORE_ALL_DUPS
setopt HIST_IGNORE_SPACE
setopt SHARE_HISTORY

alias dunstow='dstow unlink'
alias orca='bun run /Users/peteredm/Workspace/orca/dist/orca'

[[ -f "$HOME/.zshrc.local" ]] && source "$HOME/.zshrc.local"
. "/Users/peteredm/.deno/env"
