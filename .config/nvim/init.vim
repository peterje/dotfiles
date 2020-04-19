let g:comfortable_motion_friction = 80.0
let g:comfortable_motion_air_drag = 2.0

call plug#begin()
    Plug 'scrooloose/nerdcommenter'
	Plug 'yuttie/comfortable-motion.vim'	
    Plug 'vim-airline/vim-airline'
	Plug 'scrooloose/nerdTree'
	Plug 'neoclide/coc.nvim', {'branch': 'release'}
	Plug 'google/vim-maktaba'
	Plug 'google/vim-codefmt'
	Plug 'google/vim-glaive'
    Plug 'jiangmiao/auto-pairs'
call plug#end()
call glaive#install()
	glaive codefmt clang_format_style='webkit'
augroup autoformat_settings
  autocmd filetype bzl autoformatbuffer buildifier
  autocmd FileType c,cpp,proto,javascript AutoFormatBuffer clang-format
  autocmd FileType dart AutoFormatBuffer dartfmt
  autocmd FileType go AutoFormatBuffer gofmt
  autocmd FileType gn AutoFormatBuffer gn
  autocmd FileType html,css,sass,scss,less,json AutoFormatBuffer js-beautify
  autocmd FileType java AutoFormatBuffer google-java-format
  autocmd FileType python AutoFormatBuffer yapf
  autocmd FileType rust AutoFormatBuffer rustfmt
  autocmd FileType vue AutoFormatBuffer prettier
augroup END
set tabstop     =4
set softtabstop =4
set shiftwidth  =4
set expandtab
inoremap <silent><expr> <TAB>
      \ pumvisible() ? "\<C-n>" :
      \ <SID>check_back_space() ? "\<TAB>" :
      \ coc#refresh()
inoremap <expr><S-TAB> pumvisible() ? "\<C-p>" : "\<C-h>"
set number
set relativenumber
let g:gruvbox_italic=1
colorscheme gruvbox
" Use <cr> to confirm completion, `<C-g>u` means break undo chain at current
" position. Coc only does snippet and additional edit on confirm.
if has('patch8.1.1068')
  " Use `complete_info` if your (Neo)Vim version supports it.
  inoremap <expr> <cr> complete_info()["selected"] != "-1" ? "\<C-y>" : "\<C-g>u\<CR>"
else
  imap <expr> <cr> pumvisible() ? "\<C-y>" : "\<C-g>u\<CR>"
endif

function! s:check_back_space() abort
  let col = col('.') - 1
  return !col || getline('.')[col - 1]  =~# '\s'
endfunction

" Use D to show documentation in preview window.
nnoremap <Leader>d :call <SID>show_documentation()<CR>

function! s:show_documentation()
  if (index(['vim','help'], &filetype) >= 0)
    execute 'h '.expand('<cword>')
  else
    call CocAction('doHover')
  endif
endfunction

nmap <C-n> :NERDTreeToggle<CR>
" Use <c-space> to trigger completion.
inoremap <silent><expr> <C-Space> coc#refresh()
let mapleader = "\<Space>"
nmap <silent> <Leader>e <Plug>(coc-diagnostic-next-error)
nmap <Leader>j {)
nmap <Leader>k }(
nmap <Leader>y ggVG"+y''
nmap <Leader>r :make %< <CR> :term ./%< <CR>
:autocmd BufNewFile *.cpp 0r ~/.config/nvim/templates/skeleton.cpp
