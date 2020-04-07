const fs = require('fs')
fs.writeFileSync('./.env', `CONURL=${process.env.CONURL}\n`)