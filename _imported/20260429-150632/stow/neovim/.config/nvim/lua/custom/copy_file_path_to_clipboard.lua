vim.api.nvim_create_user_command('CopyFilePathToClipboard', function()
  local file_path = vim.api.nvim_buf_get_name(0)
  if file_path == '' then return end

  local cwd_parent = vim.fs.dirname(vim.fn.getcwd())
  local relative_path = vim.fs.relpath(cwd_parent, file_path) or file_path

  vim.fn.setreg('+', relative_path)
end, {})

vim.api.nvim_create_user_command('CFP', function()
  vim.cmd ':CopyFilePathToClipboard'
end, {})
