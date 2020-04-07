const _ = require('lodash')
const fss = require("fs-extra");

const superagent = require('superagent')
const charset = require("superagent-charset");
charset(superagent); //设置字符

/*
* 异步map
* */
async function asyncMap(array, callback) {
  let arr = []
  for (let index = 0; index < array.length; index++) {
    arr.push(await callback(array[index], index, array))
  }
  return arr
}


/*
* 异步each
* */
async function asyncEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

/*
* 将[{id:'1'},{id:'2'}]结构list输出到json文件
* */
async function writeArrayToJsonFile(path, array) {
  let str = _.map(array, (n, i) => {
    return JSON.stringify(n)
  }).join('\n')
  try {
    await fss.writeFile(path, `${str}\n`, {flag: 'w'})
    console.log('success!')
  } catch (err) {
    console.error(err)
  }
}

/*
* 延迟
* */
async function delay(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(new Date());
      resolve()
    }, time)
  })
}


/**
 * 根据URL获取文档信息
 * @param url
 * @returns {Promise<any>}
 */
let urlResponse = (url, option = {}) => {
  return new Promise((resolve, reject) => {
    superagent
        .get(url)
        .charset(option.charset || 'gbk')
        .set('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.62 Safari/537.36')
        .then((res) => {
          resolve(res.text)
        })
        .catch((e) => {
          reject(e)
        })
  })
}


module.exports = {
  asyncMap, asyncEach,
  writeArrayToJsonFile,
  delay, urlResponse,
}
