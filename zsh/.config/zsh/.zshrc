# Add deno completions to search path
if [[ ":$FPATH:" != *":/Users/peteredm/.config/zsh/completions:"* ]]; then export FPATH="/Users/peteredm/.config/zsh/completions:$FPATH"; fi
setopt AUTO_PUSHD           # Push the current directory visited on the stack.
setopt PUSHD_IGNORE_DUPS    # Do not store duplicates in the stack.
setopt PUSHD_SILENT         # Do not print the directory stack after pushd or popd.
setopt HIST_IGNORE_DUPS     # Do not record duplicate commands in history.
setopt SHARE_HISTORY        # Share history between all sessions.

export HISTSIZE=10000
export SAVEHIST=10000

export DOTFILES="${DOTFILES:-$HOME/Workspace/dotfiles}"
alias dunstow='dstow unlink'

source $ZDOTDIR/theme.zsh
source $ZDOTDIR/vim.zsh
source $ZDOTDIR/aliases.zsh
source $ZDOTDIR/plugins.zsh
source $ZDOTDIR/path.zsh

eval "$(fnm env)"

# bun completions
[ -s "/Users/peteredm/.bun/_bun" ] && source "/Users/peteredm/.bun/_bun"

. "$HOME/.local/share/../bin/env"


. "$HOME/.cargo/env"

eval "$(/Users/peteredm/.local/bin/mise activate zsh)" # added by https://mise.run/zsh

# Vite+ bin (https://viteplus.dev)
. "$HOME/.vite-plus/env"
. "/Users/peteredm/.deno/env"
