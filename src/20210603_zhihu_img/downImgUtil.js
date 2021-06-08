let fs = require('fs')       //引入文件读取模块
let request = require('request')
const url = require('url')
const fss = require('fs-extra')

let util = require('../util/index')

/**
 * 下载一个图片到本地
 * @param imageUrl  图片地址
 * @param dir 本地文件目录
 * @param pre 文件前缀
 * @returns {Promise<unknown>}
 */
function downImage(imageUrl, dir = '', pre = '') {
  return new Promise(async (resolve, reject) => {
    const filename = url.parse(imageUrl).pathname.split('/').pop()
    let readStream = request(imageUrl)
    let writeStream = fs.createWriteStream(dir ? `./${dir}/${pre}${filename}` : `./${pre}${filename}`)
    readStream.pipe(writeStream)
    readStream.on('end', function () {
      console.log('文件下载成功:', imageUrl)
    })
    readStream.on('error', function (err) {
      console.log('错误信息:', err)
    })
    writeStream.on('finish', function () {
      console.log('文件写入成功')
      writeStream.end()
      resolve()
    })
  })
}

/**
 * 批量下载图片
 * @param imgUrlList 图片列表
 * @param dir 存放文件的目录 ./dir/
 * @returns {Promise<void>}
 */
async function downImageList(imgUrlList = [], dir = 'dir') {
  await fss.ensureDir(`./${dir}`)
  await util.asyncEach(imgUrlList, async (imgUrl, imgIndex) => {
    try {
      console.log(`imgIndex`, imgIndex)
      await downImage(imgUrl, dir)
    } catch (e) {
      console.log(`下载失败:`, imgUrl)
      console.log(`e`, e)
    }
  })
}

module.exports = { downImage, downImageList }

// downImage('https://pic4.zhimg.com/v2-9fdbc15f305357fb2fa941450e59ea2d_r.jpg?source=1940ef5c')
// downImageList(['https://pic4.zhimg.com/v2-9fdbc15f305357fb2fa941450e59ea2d_r.jpg?source=1940ef5c'])


