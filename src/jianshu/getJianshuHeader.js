/**
 * 获取简书的二级标题列表
 */
let cheerio = require('cheerio')
let request = require('superagent')

request
    .get('https://www.jianshu.com/p/1432e0f29abd')
    .set('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.62 Safari/537.36')
    .then(res => {
        let $ = cheerio.load(res.text)

        $('h1').each(function (i, ele) {
            console.log('', $(ele).text());
        })
        $('h2').each(function (i, ele) {
            console.log('', $(ele).text());
        })
    })
    .catch((e) => {
        console.log('e', e);
    })

