# better ls.
alias ls='ls -G'
alias l='ls -l' 

# dirstack
alias d='dirs -v'
for index ({1..9}) alias "$index"="cd +${index}"; unset index

# do stuff with interactive prompt and verbose output
# keeps me from being stupid
alias cp='cp -iv'
alias mv='mv -iv'
alias rm='rm -iv'

# what you thought grep did
alias grep="grep -i --color=auto"

alias pg='ping 8.8.8.8'
alias fonts='fc-cache -f -v'

# git stuff
alias gs='git status'
alias gc='git commit'
alias ga='git add'
alias gp='git push'
alias gd='git diff'
alias gb='git branch '
alias gl='git log --pretty=oneline'
alias dif="git diff --no-index"
alias gco='git checkout '
alias gpof='git push origin --force-with-lease' # gpf but prevents you from clobbering new work
alias grb='git branch -r' # list branches
alias gplo='git pull origin' # Pull changes from the origin remote
alias glol='git log --graph --abbrev-commit --oneline --decorate'
alias gblog="git for-each-ref --sort=committerdate refs/heads/ --format='%(HEAD) %(color:red)%(refname:short)%(color:reset) - %(color:yellow)%(objectname:short)%(color:reset) - %(contents:subject) - %(authorname) (%(color:blue)%(committerdate:relative)%(color:reset))'"
alias gsub="git submodule update --remote"

alias work="$HOME/workspace"
alias doc="$HOME/Documents"
alias dow="$HOME/Downloads"
alias dot="$HOME/dotfiles/"
alias cdx="codex --search --model=gpt-5-codex -c model_reasoning_effort="high" --sandbox workspace-write -c sandbox_workspace_write.network_access=true"

# ────────────────────────────────────────────
# Useful functions (adapted from elithrar/dotfiles)
# ────────────────────────────────────────────

# macOS DNS cache flush
if [[ "$(uname -s)" = "Darwin" ]]; then
  flush-dns() {
    sudo dscacheutil -flushcache
    sudo killall -HUP mDNSResponder
    echo "DNS cache flushed"
  }
fi

# Timestamp helpers
mins-ago()  { echo $(($(date +%s) - 60 * $1)); }
hours-ago() { echo $(($(date +%s) - 3600 * $1)); }
yesterday() { echo $(($(date +%s) - 86400)); }
time-at()   { date -r "$1"; }

# Remove duplicate PATH entries while preserving order
trim_path() {
  PATH=$(awk -F: '{for(i=1;i<=NF;i++){if(!($i in a)){a[$i];printf s$i;s=":"}}}'<<<"$PATH")
  export PATH
}

# Reload shell config
env-update() { source ~/.config/zsh/.zshrc; }

# ────────────────────────────────────────────
# fzf - fuzzy finder with fd/bat integration
# ────────────────────────────────────────────
if command -v fzf &>/dev/null; then
  export FZF_DEFAULT_COMMAND='fd --type f --hidden --follow --exclude .git'
  export FZF_DEFAULT_OPTS='--height 40% --reverse --border --preview "bat --style=numbers --color=always --line-range :500 {} 2>/dev/null || ls -la {}"'
  export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"
  export FZF_ALT_C_COMMAND='fd --type d --hidden --follow --exclude .git'
  export FZF_ALT_C_OPTS='--preview "ls -la {}"'
  source <(fzf --zsh 2>/dev/null) || { [[ -f ~/.fzf.zsh ]] && source ~/.fzf.zsh; }
fi

# ripgrep
export RIPGREP_CONFIG_PATH=$HOME/.ripgreprc
