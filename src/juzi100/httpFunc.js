const axios = require('axios')

module.exports = class serverlessFunction {
  constructor(url){
    this.url = url
  }

  funcUtil(optList){
    return axios({
      method: 'post',
      url: this.url,
      data: {
        optList: optList,
      },
    }).then((res) => {
      console.log(JSON.stringify(res.data))
    })
  }

  removeData(collectionName){
    return this.funcUtil([
      { optKey: 'collection', optValue: collectionName },
      { optKey: 'remove', optValue: null },
    ])
  }

  addData(collectionName, list){
    return funcUtil([
      { optKey: 'collection', optValue: collectionName },
      { optKey: 'add', optValue: list },
    ])
  }
}

/**
 * 基础
 * @param url 'https://1f1f5537-df24-4928-80f4-3a52a2899757.bspapp.com/http/func-util'
 * @returns {Promise<void>}
 */
exports.funcUtil = (url) => {
  return (optList) => {
    return axios({
      method: 'post',
      url: 'https://1f1f5537-df24-4928-80f4-3a52a2899757.bspapp.com/http/func-util',
      data: {
        optList: optList,
      },
    }).then((res) => {
      console.log(JSON.stringify(res.data))
    })
  }
}

/**
 * 清空一个表格的数据
 * @param collectionName
 */
exports.removeData = (collectionName) => {
  return funcUtil([
    { optKey: 'collection', optValue: collectionName },
    { optKey: 'remove', optValue: null },
  ])
}
/**
 * 向一个表格中添加数据
 * @param collectionName
 * @param list
 * @returns {Promise<void>}
 */
exports.addData = (collectionName, list) => {
  return funcUtil([
    { optKey: 'collection', optValue: collectionName },
    { optKey: 'add', optValue: list },
  ])
}

// removeData('juzi-collect') // 'juzi-collect' 我的收藏
// addData('juzi-collect', [{ id: 11, value: '11111111111111111' }])
