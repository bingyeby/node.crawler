const axios = require('axios')

function main() {
// 发送 POST 请求
  axios({
    method: 'post',
    url: 'https://1f1f5537-df24-4928-80f4-3a52a2899757.bspapp.com/http/common-opt',
    data: {
      collection: 'juzi-dict',
      optList: [{ optKey: 'get', optValue: null }],
    },
  }).then((res) => {
    console.log(`res`, res)
    console.log(``, JSON.stringify(res.data))
  })
}

main()
