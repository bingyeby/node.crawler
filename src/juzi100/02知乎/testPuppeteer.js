const puppeteer = require('puppeteer')
const _ = require('lodash')

async function main() {
  // 启动浏览器
  const browser = await puppeteer.launch({
    headless: false,      //  关闭无头模式，方便我们看到这个无头浏览器执行的过程
    timeout: 15000,       //  设置超时时间
    devtools: true,    //  是否打开控制台  当此值为true时, headless总为false
    // executablePath: '',    // 若是手动下载的chromium需要指定chromium地址, 默认引用地址为 /项目目录/node_modules/puppeteer/.local-chromium/
    // ignoreHTTPSErrors: true,    //如果是访问https页面 此属性会忽略https错误

  })

  const page = await browser.newPage()  // 打开空白页面
  await page.setViewport({ width: 1000, height: 800 })// 控制视图大小
  await page.goto('https://www.zhihu.com/question/266574241')// 打开页面

  // await page.type('#kw', 'puppeteer')// 控制表单 对input框填充数据

  // await page.addScriptTag({ path: '\\jquery.js' }) // 执行失败,原因未知

  page.waitForSelector('.Modal-closeButton').then(async () => {
    page.tap('.Modal-closeButton')// 操作dom元素
  })



  let pageStr = await page.evaluate(() => {

    return new Promise((resolve, reject) => {
      // document.querySelector('#su').click()
      let time = 0
      setInterval(async (n, i) => {
        if (time < 10) {
          console.log(`time`, time)
          window.scroll(0, window.document.body.scrollHeight)
          time++
        } else {
          let data = [...document.querySelectorAll('.List-item')].map((n, i) => {
            return n.innerHTML
          })
          resolve(data)
        }
      }, 3000)
    })
  }) // 操作dom元素2: 在页面上下文中执行 获取打开的网页中的宿主环境 // 打印语句在浏览器控制台看见

  console.log(`pageStr`, pageStr)

  // setTimeout(async (n, i) => {
  //   let linkHtml = await page.$eval('.List-item', (ele) => ele.innerHTML)// 获取文本
  //   console.log(`linkHtml`, linkHtml)
  // }, 3000 * 10)

  // 等待页面存在此元素
  // page.waitForSelector('#content_left .result').then(async () => {
  //   const resultEle = await page.$('#content_left .result:nth-child(2) h3 a')
  //   resultEle.click()// 打开一个页面1
  //
  //   let linkHtml = await page.$eval('#content_left .result:nth-child(2) h3 a', (ele) => ele.innerHTML)// 获取文本
  //   console.log(` linkHtml`, linkHtml)
  //
  //   // await page.tap('#content_left .result:nth-child(1) h3 a');// 打开一个页面2
  // })

  // await page.screenshot({path: './test.png'})// 截屏保存

  // const content = await page.content();// 获取页面内容
  // console.log(`main content`, content);
  // await browser.close();// 关闭浏览器
}

main()
