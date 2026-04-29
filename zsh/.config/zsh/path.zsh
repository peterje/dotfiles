# bun
export PATH="$HOME/.bun/bin:$PATH"
export PATH="$HOME/.cache/.bun/bin:$PATH"

# brew
export PATH="/opt/homebrew/bin:$PATH"

# fnm
FNM_PATH="/Users/peteredm/.local/share/fnm"
if [ -d "$FNM_PATH" ]; then
  export PATH="/Users/peteredm/.local/share/fnm:$PATH"
  eval "`fnm env`"
fi
