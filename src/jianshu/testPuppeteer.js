const puppeteer = require('puppeteer');

async function main() {
  const browser = await puppeteer.launch({
    headless: false,// 关闭无头模式，方便我们看到这个无头浏览器执行的过程
    timeout: 15000,    //设置超时时间
    // devtools: true,    // 是否打开控制台
  });  // 启动浏览器

  const page = await browser.newPage();  // 打开空白页面
  await page.setViewport({width: 1200, height: 500});// 控制视图大小
  await page.goto('https://www.baidu.com');// 打开页面

  await  page.type('#kw', 'puppeteer')// 控制表单

  await page.tap("#su");// 操作dom元素

  await page.evaluate(() => {
    document.querySelector('#su').click()
  }) // 操作dom元素2:在页面上下文中执行 获取打开的网页中的宿主环境

  // 等待页面存在此元素
  page.waitForSelector('#content_left .result').then(async () => {
    const resultEle = await page.$('#content_left .result:nth-child(2) h3 a');
    resultEle.click()// 打开一个页面1


    let linkHtml = await page.$eval('#content_left .result:nth-child(2) h3 a', (n) => n.innerHTML)// 获取文本
    console.log(` linkHtml`, linkHtml);

    // await page.tap('#content_left .result:nth-child(2) h3 a');// 打开一个页面2
  })


  await page.screenshot({path: './test.png'})// 截屏保存

  const content = await page.content();// 获取页面内容
  // await browser.close();// 关闭浏览器
}

main()
