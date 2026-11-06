// Run before committing a change to styles.css or script.js: `node stamp-assets.js`
// Browsers keep these files for 10 minutes on GitHub Pages, so a new page could otherwise load with
// an old stylesheet. Each page links them with a hash of their content, which changes the address.
const fs = require('fs');
const crypto = require('crypto');

const hash = (file) => crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex').slice(0, 8);
const versions = { 'styles.css': hash('styles.css'), 'script.js': hash('script.js') };

for (const page of ['index.html', 'privacy.html', '404.html']) {
  let html = fs.readFileSync(page, 'utf8');
  for (const [file, v] of Object.entries(versions)) {
    const name = file.replace('.', '\\.');
    html = html.replace(new RegExp(`((?:href|src)=")${name}(?:\\?v=[0-9a-f]+)?(")`, 'g'), `$1${file}?v=${v}$2`);
  }
  fs.writeFileSync(page, html);
}
console.log(versions);
