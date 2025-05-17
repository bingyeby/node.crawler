let util = require('../util/index.js')
let UCFunction = require('../util/unicloudFunction')
let uf = new UCFunction('https://460b4fab-ff7d-4d1b-a005-a173e85769c6.bspapp.com/func-util/')
// uf.removeData('fund ', [{ name: '111' }])

util.urlResponse('http://fund.eastmoney.com/pingzhongdata/002190.js?v=20211105150850', {
  charset: 'utf-8',
}).then((res) => {
  eval(res)
  // 无法在Node.js ES6中使用eval创建变量(Fail to create variable using eval in Node.js ES6)
  console.log(`Data_grandTotal`, Data_grandTotal)
  console.log(`fS_name`, fS_name)
  console.log(`fS_code`, fS_code)

  let info = {
    name: fS_name,
    code: fS_code,
    grandTotal: Data_grandTotal,
  }
  uf.addData('fund', [info])
})



