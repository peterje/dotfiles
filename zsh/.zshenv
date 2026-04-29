export XDG_CONFIG_HOME="$HOME/.config"
export XDG_CACHE_HOME="$HOME/.cache"
export XDG_DATA_HOME="$HOME/.local/share"

export EDITOR="nvim"
export VISUAL="nvim"
export MANPAGER="nvim -R -"

export ZDOTDIR="$XDG_CONFIG_HOME/zsh"
export COMPDUMP="$XDG_CACHE_HOME/zsh/compdump"
export HISTFILE="$XDG_CACHE_HOME/zsh/zhistory"


# opencode
export PATH=/Users/peteredm/.opencode/bin:$PATH

# local
export PATH=$HOME/.local/bin:$PATH
. "$HOME/.cargo/env"
