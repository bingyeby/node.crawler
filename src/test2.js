var images = require('images')
var fs = require('fs')

var tempImg = 'input.jpg'
var saveImg = 'out2.jpg'
var obj = images(tempImg).size()
images(tempImg).size(200, 200).save(saveImg, {
  // quality: 50, //保存图片到文件,图片质量为50
})


// var staSync = fs.statSync(saveImg).size// 压缩后的图片大小
// if ((staSync + '').length > 6) {// 存储后的图片超过1MB，再重新压缩（上传我限制图片大小10MB）
//   images(tempImg).size(obj.width / 3, obj.height / 3).save(saveImg, {
//     quality: 50,
//   })
// }


// fs.exists(tempImg, function (exist){
//   if (exist) {
//     fs.unlink(tempImg, function (err){
//       if (err) {
//         console.log('删除临时文件异常')
//       }
//       console.log('删除临时文件')
//     })
//   } else {
//     console.log('不存在')
//   }
// })
