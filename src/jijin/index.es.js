import * as util from '../util/index.js'

util.urlResponse('http://fund.eastmoney.com/pingzhongdata/002190.js?v=20211105150850', {
  charset: 'utf-8',
}).then((res) => {
  let a = eval(`${res}; global.Data_fundSharesPositions  = Data_fundSharesPositions `)
//   无法在Node.js ES6中使用eval创建变量(Fail to create variable using eval in Node.js ES6)

  console.log(`global.Data_fundSharesPositions`, global.Data_fundSharesPositions)
})

