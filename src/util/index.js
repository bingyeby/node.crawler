const _ = require('lodash')
const fss = require('fs-extra')

const superagent = require('superagent')
const charset = require('superagent-charset')
charset(superagent) //设置字符

/*
* 异步map
* */
exports.asyncMap = async function (array, callback){
  let arr = []
  for (let index = 0; index < array.length; index++) {
    arr.push(await callback(array[index], index, array))
  }
  return arr
}

/*
* 异步each
* */
exports.asyncEach = async function (array, callback){
  for (let index = 0; index < array.length; index++) {
    let res = await callback(array[index], index, array)
    if (res === false) {
      break
    }
  }
}

/*
* 将[{id:'1'},{id:'2'}]结构list输出到json文件
* 一行为一个对象字符串,无逗号
* config
*   {flag:'w'} 覆盖
*   {flag:'a+'}  追加
* */
exports.writeArrayToJsonFile = async function (path, array, config){
  let str = _.map(array, (n, i) => {
    return JSON.stringify(n)
  }).join('\n')
  try {
    await fss.writeFile(path, `${str}\n`, config)
  } catch (err) {
    console.error(err)
  }
}

/**
 * 延迟
 * @param time 延迟时间,单位ms
 * @returns {Promise<*>}
 */
exports.delay = async function (time = 1000){
  return new Promise((resolve, reject) => {
    console.log('|-延迟开始:', new Date())
    console.log(`延迟时长:`, time, 'ms')
    setTimeout(() => {
      console.log('|-延迟结束:', new Date())
      resolve()
    }, time)
  })
}

/**
 * 根据URL获取文档信息
 * @param url
 * @returns {Promise<any>}
 */
exports.urlResponse = (url, option = {}) => {
  return new Promise((resolve, reject) => {
    superagent.get(url).charset(option.charset || 'gbk').set('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.62 Safari/537.36').then((res) => {
      resolve(res.text)
    }).catch((e) => {
      reject(e)
    })
  })
}

/**
 * 注入js文件
 * @param page
 * @param jsFilePath 文件路径 './jquery.js'
 * @returns {Promise<void>}
 */
exports.addScriptFile = async function (page, jsFilePath){
  if (_.isNil(jsFilePath)) {
    return
  }
  let jqueryJs = (await fss.readFile(jsFilePath)).toString()
  await page.evaluate((jqueryJs) => {
    eval(jqueryJs)
  }, jqueryJs)
}

exports.test = async (res) => {
  return 111
}

/**
 * 导出方式2
 */
// module.exports = {
//   asyncMap,
//   asyncEach,
//   writeArrayToJsonFile,
//   delay,
//   urlResponse,
//   addScriptFile,
// }
