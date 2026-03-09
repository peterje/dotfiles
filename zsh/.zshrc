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

dotfiles_packages=(nvim ghostty zsh)

unalias dstow 2>/dev/null
unalias dunstow 2>/dev/null

dstow() {
  local packages=("$@")

  (( ${#packages[@]} )) || packages=("${dotfiles_packages[@]}")

  command stow -R -d "$DOTFILES" -t "$HOME" "${packages[@]}"
}

dunstow() {
  local packages=("$@")

  (( ${#packages[@]} )) || packages=("${dotfiles_packages[@]}")

  command stow -D -d "$DOTFILES" -t "$HOME" "${packages[@]}"
}

[[ -f "$HOME/.zshrc.local" ]] && source "$HOME/.zshrc.local"
