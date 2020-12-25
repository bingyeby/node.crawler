if (process.stdout.getWindowSize) {
  var height = process.stdout.getWindowSize()[1]
  console.log('\n'.repeat(height))
}
let path = require('path')
let cheerio = require('cheerio')
// let util = require('../util/index.js')
let _ = require('lodash')
const superagent = require('superagent')
const fss = require('fs-extra')

/*
*
*   name  adcode level
*   北京市 110000_full  province                         "西城区" 110118  district
*   "湖北省" "420000" "province"  "南通市" 320700  city  "如皋市" 320682  district
* */

// 全国 https://geo.datav.aliyun.com/areas_v2/bound/100000_full.json
let allJson = {
  type: 'FeatureCollection',
  name: '全国_origin',
  features: [
    {
      type: 'Feature',
      properties: {
        'adcode': '110000',
        'name': '北京市',
        'center': [116.405285, 39.904989],
        'centroid': [116.419889, 40.189911],
        'childrenNum': 16,
        'level': 'province',
        'parent': { 'adcode': 100000 },
        'subFeatureIndex': 0,
        'acroutes': [100000],
        'adchar': null,
      },
      geometry: {
        'type': 'MultiPolygon',
        'coordinates': [],
      },
    },
    {},
    {},
  ],
}
// 北京 https://geo.datav.aliyun.com/areas_v2/bound/110000_full.json
let beijingJson = {}

let getMapDataJson = (code) => {
  let regionCode = /00$/.test(code) ? `${code}_full` : code
  return new Promise((resolve, reject) => {
    superagent('get', `https://geo.datav.aliyun.com/areas_v2/bound/${regionCode}.json`).then(async (res) => {
      console.log(`${regionCode} success`)
      // await fss.writeJson(`./json/${code}.json`, res.body) // 输出json到文件
      resolve(res.body)
    }).catch((e) => {
      console.log(`${regionCode} get map data error:`, e)
      resolve({})
    })
  })
}

/*
* 异步each
* */
async function asyncEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

function mapMapData(data) {
  return _.map(data, (n, i) => {
    return {
      label: n.properties.name,
      value: n.properties.adcode,
      level: n.properties.level,
    }
  })
}

/*
* 710000 台湾 (子集只有一个)
* 441900 东莞 子集只有一个
* */
async function main(props, route) {
  let { adcode, level, parent } = props
  let mapData = await getMapDataJson(adcode)

  _.each(jsonAll, (n, i) => {
    if (n.value === _.last(route)) {
      n.child = mapMapData(mapData.features)
    } else {
      _.each(n.child, (m, j) => {
        if (m.value === _.last(route)) {
          m.child = mapMapData(mapData.features)
        } else {
          _.each(m.child, (o, k) => {
            if (o.value === _.last(route)) {
              o.child = mapMapData(mapData.features)
            }
          })
        }
      })
    }
  })

  if (_.size(mapData.features) > 1) {
    await asyncEach(mapData.features, async (n, i) => {
      if (n.properties.level === 'province' || n.properties.level === 'city') {
        console.log(`循环体:`, n.properties.name, n.properties.adcode)
        await main(n.properties, [...route, n.properties.adcode])
      }
    })
  }

}

// superagent('get', 'https://geo.datav.aliyun.com/areas_v2/bound/100000_full.json').then((res) => {
//   console.log(`res`, res.body)
//   console.log(`1233`)
// })

let jsonAll = [
  {
    value: '100000',
    label: '中国',
    level: 'country',// 国家
  },
];

(async () => {
  await main({
    adcode: '100000',
    level: 'country',// 国家
  }, ['100000'])

  console.log(`111111111111111`, 111111111111111)

  fss.writeJson('./all.json', jsonAll)
})()


