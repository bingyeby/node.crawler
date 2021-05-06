const fss = require('fs-extra')
const util = require('../../../util')
const _ = require('lodash')

async function main() {
  let log = (await fss.readFile('./question.txt')).toString()
  let list2 = log.split(/\r\n\r\n/gi).map((n, i) => {
    let [questionTitle, answerNum, questionUrl] = n.split('\r\n')
    let questionId = questionUrl.match(/\d+/)[0]
    return {
      questionTitle,
      answerNum: Number(answerNum),
      questionId,
    }
  })
  list2 = _.reverse(_.sortBy(list2, 'answerNum')) // 排序
  console.log(`list2`, list2)

  // await fss.remove('./question.json')
  await util.writeArrayToJsonFile('./question.json', list2, { flag: 'w' })
}

main()
