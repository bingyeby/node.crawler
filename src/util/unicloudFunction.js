const axios = require('axios')

/**
 * 使用案例
 let uf = new UCFunction('https://460b4fab-ff7d-4d1b-a005-a173e85769c6.bspapp.com/func-util/')
 uf.removeData('fund ', [{ name: '111' }])
 *
 *
 * @type {module.UCFunction}
 */
module.exports = class UCFunction {
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
    return this.funcUtil([
      { optKey: 'collection', optValue: collectionName },
      { optKey: 'add', optValue: list },
    ])
  }
}
