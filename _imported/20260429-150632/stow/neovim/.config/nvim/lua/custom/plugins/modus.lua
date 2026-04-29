return {
  'miikanissi/modus-themes.nvim',
  priority = 1000,
  init = function()
    vim.cmd.colorscheme 'modus_operandi'
    vim.cmd.hi 'Comment gui=none'
  end,
}
