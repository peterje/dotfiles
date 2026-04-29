local files = require 'mini.files'

files.setup()

vim.keymap.set('n', '<leader>e', function()
  files.open(vim.api.nvim_buf_get_name(0), true)
end, { desc = 'Open file [E]xplorer' })
