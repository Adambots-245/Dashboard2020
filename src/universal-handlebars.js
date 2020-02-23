//Cannicide's actually working version of electron-handlebars
//Fixes problem where images are not able to be loaded

const { parse } = require('url');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const mime = require('mime');

const escape = require('lodash/escape');
const { app, protocol } = require('electron');
const pify = require('any-pify');

const getPath = (url) => {
  const parsed = parse(url);
  const decoded = decodeURIComponent(parsed.pathname);
  // Fix windows paths (e.g., file:///c:/...)
  if (process.platform === 'win32' && !parsed.host.trim()) {
    return decoded.substr(1);
  }
  return decoded;
};

const interceptErrorHandler = (err) => {
  if (err) {
    /* eslint-disable no-console */
    console.error('Handlebars interception error.');
    console.error(err);
    /* eslint-enable no-console */
  }
};

const mimeType = mime.lookup('html');

/**
 * Main export. Accepts local variable bindings and handles handlebars templates
 * loaded in a main process in an electron app.
 */
module.exports = (locals = {}) => {
  app.on('ready', () => protocol.interceptBufferProtocol('file', (req, done) => {
    const file = getPath(req.url);
    
    pify(fs.readFile)(file).then((source) => {
      const ext = path.extname(file);
      if (['.hbs', '.handlebars'].includes(ext)) {
        const template = handlebars.compile(source.toString());
        const data = new Buffer(template(locals));
        done({ data, mimeType });
      } else {
        data =  new Buffer(source);
        data = Buffer.from(source);
        done({ data, mimeType: mime.lookup(ext)});
        // done({ data, mimeType: mime.lookup(ext) });
      }
    }).catch((err) => {
      const str = `<pre>${escape(err.toString())}</pre>`;
      done({ data: new Buffer(str), mimeType });
    });
  }), interceptErrorHandler);
};
