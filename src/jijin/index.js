let superagent = require('superagent')
const charset = require('superagent-charset')
charset(superagent) //设置字符

/*
* 根据URL获取text
* */
let getUrlResText = (url) => {
  return new Promise((resolve, reject) => {
    superagent.get(url).charset('utf-8').set('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.62 Safari/537.36').then((res) => {
      resolve(res.text)
    }).catch((e) => {
      reject(e)
    })
  })
}

getUrlResText('http://fund.eastmoney.com/pingzhongdata/002190.js?v=20211105150850').then((res) => {
  eval(res)
  console.log(`Data_netWorthTrend `, Data_netWorthTrend)
})
