const fs = require('fs');
const url = require('url');

const browserSync = require('browser-sync');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');

function postCssMiddleware (req, res, next) {
  const parsed = url.parse(req.url);
  if (parsed.pathname.match(/\.css/)) {
    return compile(parsed.pathname).then(result => {
      res.setHeader('Content-Type', 'text/css');
      res.end(result.css);
    });
  }
  next();
}

function compile(file) {
  return postcss([autoprefixer]).process(fs.readFileSync('example' + file).toString());
}

browserSync({
  files: '**/*',
  server: 'example',
  injectFileTypes: ['css'],
  middleware: postCssMiddleware,
  open: false
});