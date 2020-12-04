const fs = require('fs');
const path = require('path');
module.exports = (...parts) => fs.readFileSync(path.join(...parts), 'utf-8');
