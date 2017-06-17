const version = require('../package.json').version;
const fs = require('fs')

const targetFilePath = 'src/package.json'

const target = fs.readFileSync(targetFilePath).toString()

fs.writeFileSync(targetFilePath, target.replace(/"version": "(.+?)"/, `"version": "${version}"`))

console.log('src version bumped')
