autoload -Uz compinit
if [[ -n ${ZDOTDIR}/.zcompdump(#qN.mh+24) ]]; then
  compinit
else
  compinit -C
fi
autoload -U colors && colors

function git_branch() {
  local branch
  if [[ -d .git ]] || git rev-parse --git-dir > /dev/null 2>&1; then
    branch=$(git branch --show-current 2>/dev/null)
    [[ -n $branch ]] && echo "($branch)"
  fi
}

# Enable colors and change prompt:
function precmd() {
  setopt PROMPT_SUBST
  PS1='%B%{$fg[red]%}[%{$fg[yellow]%}%n%{$fg[green]%}@%{$fg[blue]%}%m %{$fg[magenta]%}%~%{$fg[red]%}]%{$reset_color%}$(git_branch)$%b '
}

zstyle ':completion:*' menu select
zstyle '%p(D):globbed-files *(D-/):directories' '*(D):all-files'
