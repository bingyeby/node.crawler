const fss = require('fs-extra')

const lineByLine = require('n-readlines')
const liner = new lineByLine('./1.txt')

let line
let lineNumber = 0

while (line = liner.next()) {
  console.log('Line ' + lineNumber + ': ' + line)
  lineNumber++
}

console.log('end of line reached')
