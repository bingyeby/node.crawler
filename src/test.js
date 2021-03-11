const axios = require('axios')

axios({
  method: 'post',
  url: 'http://mquestion.market.alicloudapi.com/ocrservice/mathQuestion',
  headers: {
    'Authorization': 'APPCODE ' + '3567f62cb5cd4ef5b5927fd294658ff1',
  },
  data: {
    //图像数据：base64编码，要求base64编码后大小不超过4M，最短边至少15px，最长边最大4096px，支持jpg/png/bmp格式，和url参数只能同时存在一个
    // "img": "",
    //图像url地址：图片完整URL，URL长度不超过1024字节，URL对应的图片base64编码后大小不超过4M，最短边至少15px，最长边最大4096px，支持jpg/png/bmp格式，和img参数只能同时存在一个
    'url': 'https://static-1f1f5537-df24-4928-80f4-3a52a2899757.bspapp.com/1.png',
    //是否需要识别结果中每一行的置信度，默认不需要。 true：需要 false：不需要
    'prob': false,
    //是否需要自动旋转功能，默认不需要。 true：需要 false：不需要
    'rotate': false,
  },
}).then((res) => {
  console.log(`res.data`, res.data)
})
