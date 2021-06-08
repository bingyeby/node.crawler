const puppeteer = require('puppeteer')
const _ = require('lodash')
const util = require('../../util')
const fss = require('fs-extra')
const dayjs = require('dayjs')

/*
* 执行滚动到页面底部一次,页面则会增加新的数据
* 获取到新的数据,返回(list.slice(刷新前的list数目,刷新后的list数据))
*
* */
async function getNewScrollList(page, pageListItemDomSize) {
  let listItemScrollAddList = await page.evaluate((pageListItemDomSize) => {
    let listItemSizeHis = pageListItemDomSize === 0 ? 0 : document.querySelectorAll('div.List-item').length
    window.scroll(0, window.document.body.scrollHeight)
    return new Promise((resolve, reject) => {
      let timeNum = 0
      let res = []
      let timeId = setInterval(async (n, i) => {
        let listItemSizeCur = document.querySelectorAll('div.List-item').length
        let last = document.querySelectorAll('div.List-item')[document.querySelectorAll('div.List-item').length - 1]
        if ((listItemSizeCur > listItemSizeHis) && last.querySelector('[itemprop="upvoteCount"]')) {
          res = [...document.querySelectorAll('div.List-item')].slice(listItemSizeHis - listItemSizeCur).map((item, i) => {
            let upvoteCount = item.querySelector('[itemprop="upvoteCount"]').getAttribute('content')
            let dateCreated = item.querySelector('[itemprop="dateCreated"]').getAttribute('content')
            let answerCommentCount = item.querySelector('[itemprop="commentCount"]').getAttribute('content')

            let answerInfoStr = item.querySelector('.ContentItem.AnswerItem').getAttribute('data-zop') || '{}'
            let answerInfo = JSON.parse(answerInfoStr)// {itemId,authorName}

            let answerAuthorUrl = item.querySelector('.AnswerItem-authorInfo [itemprop="url"]').getAttribute('content')
            let answerAuthorName = item.querySelector('.AnswerItem-authorInfo [itemprop="name"]').getAttribute('content')

            let answerItemUrl = item.querySelector('.ContentItem-time a').getAttribute('href')

            let answerHtml = item.querySelector('.RichContent-inner').innerHTML

            console.log(`answerHtml`, answerHtml)

            return {
              answerItemId: answerInfo.itemId, // id 549811428 => https://www.zhihu.com/question/266574241/answer/549811428
              answerItemUrl,// url 可以单独打开

              answerAuthorName,// 回答者昵称
              answerDate: dateCreated,// 回答时间
              answerAuthorUrl,// 回答者头像

              answerUpNumber: upvoteCount,// 点赞数
              answerCommentCount,// 评论数量

              answerHtml,// 回答内容HTML
            }
          })
          clearInterval(timeId)
          resolve(res)
        }
        if (timeNum > 5) {
          clearInterval(timeId)
          resolve(res)
        }
        timeNum++
      }, 3000)
    })
  }, pageListItemDomSize)
  return listItemScrollAddList
}

async function getNewScrollList2(page, itemNumber) {
  return await page.evaluate(async (itemNumber) => {
    await util.waitFor(() => $('div.List-item').length > 0)
    let itemList = $('div.List-item')
    let itemListData = []
    itemList.each((i, n) => {
      let item = $(n)
      let answerInfoStr = item.find('.ContentItem.AnswerItem').attr('data-zop') || '{}'
      let answerInfo = JSON.parse(answerInfoStr)// {itemId,authorName}
      itemListData.push({
          questionId: window.location.href.match(/question\/(\d+)/)[1],

          answerId: `${answerInfo.itemId}`, // answerId 549811428 => https://www.zhihu.com/question/266574241/answer/549811428
          answerUpCount: Number(item.find('[itemprop="upvoteCount"]').attr('content')),// 点赞数
          answerCommentCount: Number(item.find('[itemprop="commentCount"]').attr('content')),// 评论数量
          answerDate: item.find('[itemprop="dateCreated"]').attr('content'),// 回答时间
          answerUrl: item.find('.ContentItem-time a').attr('href'),// url 可以单独打开
          answerAuthorName: item.find('.AnswerItem-authorInfo [itemprop="name"]').attr('content'),// 回答者昵称
          answerHtml: item.find('.RichContent-inner').html(),// 回答内容HTML
        },
      )
    })
    console.log(`itemListData`, itemListData)
    window.scroll(0, window.document.body.scrollHeight)
    await util.delay(5000) // 延迟等待页面滚动后数据加载
    itemList.remove()
    // $('.Pc-word').remove() // 清除广告
    return itemListData
  }, itemNumber)
}

async function main(url) {
  // 启动浏览器
  const browser = await puppeteer.launch({
    headless: false,      //  关闭无头模式，方便我们看到这个无头浏览器执行的过程
    timeout: 15000,       //  设置超时时间
    devtools: true,    //  是否打开控制台  当此值为true时, headless总为false
    // executablePath: '',    // 若是手动下载的chromium需要指定chromium地址, 默认引用地址为 /项目目录/node_modules/puppeteer/.local-chromium/
    // ignoreHTTPSErrors: true,    //如果是访问https页面 此属性会忽略https错误
  })

  const page = await browser.newPage()  // 打开空白页面
  await page.setViewport({ width: 1200, height: 800 })// 控制视图大小
  await page.goto(url)// 打开页面

  // 控制表单 对input框填充数据
  // await page.type('#kw', 'puppeteer')

  // 往页面注入js,执行失败,安全策略问题
  // await page.addScriptTag({ path: '\\jquery.js' })
  // await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.4.1.min.js' })
  await util.addScriptFile(page, '../../../js/jquery.js')
  await util.addScriptFile(page, '../../../js/lodash.min.js')
  await util.addScriptFile(page, '../../../js/util.js')

  // 等待一个元素出现后点击该元素(登录提醒框)
  page.waitForSelector('.Modal-closeButton').then(async () => {
    page.tap('.Modal-closeButton')// 操作dom元素
  })

  console.log(`123`, 123)

  // 在浏览器页面中执行如下代码,并将执行后结果返回到node.js
  // 操作dom元素2: 在页面上下文中执行 获取打开的网页中的宿主环境 // 打印语句在浏览器控制台看见
  let questionInfo = await page.evaluate((config) => { // config => 接受普通对象|字符串,不接受函数
    let questionInfoStr = $('div[data-zop-question]').attr('data-zop-question')
    let questionInfo = JSON.parse(questionInfoStr)
    return Promise.resolve({
      questionId: questionInfo.id, // 394252086 => https://www.zhihu.com/question/394252086
      questionTitle: questionInfo.title,
      answerCount: Number($('[itemprop="answerCount"]').attr('content')),// 回答数量
    })
  }, {})

  console.log(`pageInfo`, questionInfo)

  // 1. 滚动查询
  // 滚动条滚动到底部3次,获取每次滚动条滚动到底部后新增的数据
  // await util.asyncEach(_.times(3), async (n, i) => {
  //   let newScrollList = await getNewScrollList(page, n)
  //   console.log(`newScrollList`, newScrollList)
  //   await util.writeArrayToJsonFile(`./1.json`, newScrollList, { flag: 'a' })
  // })

  // 1. 滚动查询,并删除已经查询到的
  let jsonFile = `./answerJson/${questionInfo.questionId}.json`
  await fss.remove(jsonFile)
  await util.asyncEach(_.times(Math.ceil(questionInfo.answerCount / 5)), async (n, i) => {
    let newScrollList = await getNewScrollList2(page, n)
    newScrollList = _.filter(newScrollList, (n, i) => n.answerUpCount > Math.sqrt(questionInfo.answerCount))
    if (_.size(newScrollList) === 0) {
      console.log(`结束`)
      return false
    }
    await util.writeArrayToJsonFile(jsonFile, newScrollList, { flag: 'a' })
    console.log(`写入数据${_.size(newScrollList)}条`)
  })

  await browser.close()// 关闭浏览器
}

main('https://www.zhihu.com/question/326308904')
