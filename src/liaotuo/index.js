if (process.stdout.getWindowSize) {
  var height = process.stdout.getWindowSize()[1];
  console.log('\n'.repeat(height))
}

let path = require('path')
let cheerio = require('cheerio')
let superagent = require('superagent')
let util = require('../util/index.js')
let _ = require('lodash')
let charset = require("superagent-charset");


charset(superagent); //设置字符

/*
* 根据URL获取text
* */
let getUrlResText = (url) => {
  return new Promise((resolve, reject) => {
    superagent
      .get(url)
      .charset('gbk')
      .set('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.62 Safari/537.36')
      .then((res) => {
        resolve(res.text)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

function sleep() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 300)
  })
}


/*
* 获取一级目录
******
*   [
*     {
*       name:'心经',
*       type:'禅宗七经',
*       url:'http://www.liaotuo.org/fojing/xinjing/'
*     }
*   ]
******
* */
async function getL1UrlInfo() {
  let text = await getUrlResText('http://www.liaotuo.org/fojing/')
  let $ = cheerio.load(text)

  let fojingList = []
  $('.B11 ul li').slice(0, 3).each((index, ele) => {
    let type = $(ele).find('strong').text()
    $(ele).find('p a').each((index, ele) => {
      fojingList.push({
        name: $(ele).text(),// 名称
        type: type,// 类别
        url: $(ele).attr('href'),// url
      })
    })
  })
  return fojingList
}

/*
* 根据1级url获取二级urlList
*   [
*     {
*       name:'心经',
*       type:'禅宗七经',
*       url:'http://www.liaotuo.org/fojing/xinjing/',
*****
*       catalog2Info:[
*         {type:'原文',url:'http://www.liaotuo.org/fojing/xinjing/yuanwen.html'},
*         {type:'译文',url:'http://www.liaotuo.org/fojing/xinjing/yiwen.html'}
*       ]
******
*     }
*   ]
* */
let getL2UrlInfo = async (l1Url) => {
  let text = await getUrlResText(l1Url)
  let $ = cheerio.load(text)
  let l2UrlInfo = []
  $('.F3 a').each((i, ele) => {
    l2UrlInfo.push({name: $(ele).text(), url: $(ele).attr('href')})
  })
  return l2UrlInfo
}

/*
* 根据列表的url,获取列表中子层级'章节'的url,以组装至父层的children
* */
let getZhangJieWithLieBiaoUrl = async (lieBiaoUrl) => {

  let text = await getUrlResText(lieBiaoUrl)
  let $ = cheerio.load(text)
  let zhangJieList = []
  $('.B3_list li').each((index, ele) => {
    let pageLiInfo = {
      type: $(ele).find('font').text().replace(/\[|\]/gi, ''),
      name: $(ele).find('a').text(),
      url: $(ele).find('a').attr('href'),
      author: $(ele).find('.B3_zz').text()
    }
    zhangJieList.push(pageLiInfo)
  })
  if (_.size(zhangJieList) === 0) {
    console.error(`getZhangJieWithLieBiaoUrl 列表获取的章节数目有误,需校对`);
  }
  return zhangJieList
}

/*
* 根据原文页面的url获取原文内容的url
*   直接显示内容 (http://www.liaotuo.org/fojing/yuanjuejing/yuanwen.html)
*   章节(整体出现,自动补充列表) (http://www.liaotuo.org/fojing/chengweishilun/yuanwen.html)
*
*   文章 (http://www.liaotuo.org/fojing/wuliangshoujing/yuanwen.html)
*   列表 - 章节
*
*
* @return
* [
*   {name: '', type: '文章', url: ''},
*   {name: '', type: '列表', url: ''},
* ]
* */
let getYuanWen = async (yuanWenUrl) => {
  let text = await getUrlResText(yuanWenUrl)
  let $ = cheerio.load(text)

  let yuanWenList = []
  if ($('.B3_list').length > 0) {// 列表形式展开
    let pageList = []
    $('.B3_list li').each((index, ele) => {
      pageList.push({
        type: $(ele).find('font').text().replace(/\[|\]/gi, ''),
        name: $(ele).find('a').text(),
        url: $(ele).find('a').attr('href'),
        author: $(ele).find('.B3_zz').text()
      })
    })

    await util.asyncEach(pageList, async (n) => {
      if (n.type === '列表') {// 列表继续获取子章节
        n.children = await  getZhangJieWithLieBiaoUrl(n.url)
      }
    })

    let isAllZhangJie = _.every(pageList, (n) => {
      return n.type === '章节'
    })

    if (isAllZhangJie) {// 列表皆为章节
      yuanWenList = [
        {type: '列表', name: $('.B3_tit b').text(), children: pageList}
      ]
    } else {// 有文章或列表
      yuanWenList = pageList
    }
  } else if ($('.B1_text').length > 0) {// 直接显示文本
    yuanWenList = [
      {type: '文章', name: $('.B1_tit').text(), url: yuanWenUrl, author: $('.B1_dh span').eq(1).text().replace('作者：', '')}
    ]
  }
  return yuanWenList
}

/*
* 获取一个文章
*   1. 文章内容内部无分页,则执行一次
*   2. 文章内部有分页,则依据文章中是否存在下一页进行遍历叠加获取分页的内容,并组装到数组data中
* */
async function getArticleAll(data, url) {
  let text = await getUrlResText(url)
  let $ = cheerio.load(text)
  let B1Text = $('.B1_text').text()

  let B1NextPageUrl
  $('.pages a').each((i, ele) => {
    if ($(ele).text() === '下一页') {
      B1NextPageUrl = $(ele).attr('href')
    }
  })
  data.push(B1Text)
  if (B1NextPageUrl && (url !== B1NextPageUrl)) {// 存在下一页,且下一页的地址和当前页面相同
    await sleep()
    await getArticleAll(data, B1NextPageUrl)
  } else {
    return data
  }
}


async function main() {
  try {
    /*
    * 获取数据流程
    *   0. 进入佛经
    *       [http://www.liaotuo.org/fojing/]
    *   1. 进入一个体系
    *       [http://www.liaotuo.org/fojing/jingangjing/]
    *   2. 获取原文列表
    *       [http://www.liaotuo.org/fojing/jingangjing/yuanwen.html]
    *       [http://www.liaotuo.org/fozhou/lengyanzhou/quanwen.html]
    *
    *
    * */


    // 获取佛经列表
    let fojingL1UrlList = await  getL1UrlInfo()
    console.log(`main catalogue1list`, fojingL1UrlList.length);

    await util.asyncEach(fojingL1UrlList.slice(0, 2), async (n) => {
      let l2UrlInfo = await getL2UrlInfo(n.url)
      let yuanwenUrl = _.find(l2UrlInfo, {name: '原文'}).url
      let yuanwenUrlInfo = await getYuanWen(yuanwenUrl)

      console.log(`-------\n`, n.name, yuanwenUrl);
      console.log(`yuanwenUrlInfo`, JSON.stringify(yuanwenUrlInfo, null, '\t'));
    })

    // let data = []
    // await getArticleAll(data, 'http://www.liaotuo.org/fojing/jingangjing/39210.html')

  } catch (e) {
    console.log(`D:\\project.01\\node.crawler\\src\\liaotuo\\index.js 42`, e);
  }
}

main()
