# peteredm/stow

i track my dotfiles here. i only track configuration for things i can't live without.


## dependencies
1. [wezterm](https://github.com/wez/wezterm) for a terminal emulator
2. [neovim](https://github.com/neovim/neovim) for editing files
3. [zellij](https://github.com/zellij-org/zellij) for multiplexing
4. [zsh](https://www.zsh.org/) for a shell

install those and you should be good to go.

## installation
if you do not want to build from source, you can install everything with homebrew on macos.
```sh
brew install stow
brew install zellij
brew install neovim
brew install --cask wezterm
```
## usage
i track my dotfiles with [stow](https://www.gnu.org/software/stow/). clone this repository with submodules and run `stow neovim` (or whatever) to symlink.
