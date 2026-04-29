-- tailwind-tools.lua
return {
  'luckasRanarison/tailwind-tools.nvim',
  name = 'tailwind-tools',
  build = ':UpdateRemotePlugins',
  dependencies = {
    'nvim-treesitter/nvim-treesitter',
    'nvim-telescope/telescope.nvim', -- optional
    'neovim/nvim-lspconfig', -- optional
  },
  opts = {
    server = {
      -- The main Neovim config already sets up `tailwindcss` with `vim.lsp.config`.
      -- Disable tailwind-tools' internal lspconfig-based setup to avoid the deprecation path.
      override = false,
    },
  },
}
