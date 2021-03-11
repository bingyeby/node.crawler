const axios = require('axios')

/**
 * 基础
 * @param optList
 * @returns {Promise<void>}
 */
let funcUtil = (optList) => {
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

/**
 * 清空一个表格的数据
 * @param collectionName
 */
let removeData = (collectionName) => {
  return funcUtil([
    { optKey: 'collection', optValue: collectionName },
    { optKey: 'remove', optValue: null },
  ])
}

let addData = (collectionName, list) => {
  return funcUtil([
    { optKey: 'collection', optValue: collectionName },
    { optKey: 'add', optValue: list },
  ])
}

function main() {
  // removeData('juzi-collect') // 'juzi-collect' 我的收藏
  // addData('juzi-collect', [{ id: 11, value: '11111111111111111' }])
}

main()
