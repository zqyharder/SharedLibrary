// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')//网络请求
const doubanbook = require('doubanbook')//豆瓣加密信息的解密
const cheerio = require('cheerio')//解析网络文档
cloud.init()

async function searchDouban(isbn) {
  const url = 'https://search.douban.com/book/subject_search?search_text=' + isbn
  let searchInfo = await axios.get(url)
  // console.log(searchInfo.data)
  //searchInfo.data就是获取页面的源代码
  // 获取window.__DATA__ = 后面的数据 解密 需要的就是括号里的数据
  let reg = /window\.__DATA__ = "(.*)"/
  if (reg.test(searchInfo.data)) {
    // 数据解密
    let searchData = doubanbook(RegExp.$1)[0]
    return searchData
    // searchData为解密后的数据，里面包括url
  }
}
async function getDouban(isbn) {
  // 第一个爬虫，根据isbn查询豆瓣url
  let detailInfo = await searchDouban(isbn)
  console.log(detailInfo.title, detailInfo.rating.value)
  let detailPage = await axios.get(detailInfo.url)
  //第二个爬虫
  // cheerio在node里使用jquery的语法解析文档
  const $ = cheerio.load(detailPage.data)
  let publisher,price
  const info = $('#info').text().split('\n').map(v => v.trim()).filter(v => v)//info获取的是页面的书籍信息
  
  info.forEach(v=>{
    const temp =v.split(':')
    if (temp[0]=='出版社'){
      publisher=temp[1]
    }
    if(temp[0]=='定价'){
      price =temp[1]
    }
  })
  let author = info[1]
  let tags = []
  //获取标签，标签都在id为db-tag下的a标签class为tag
  $('#db-tags-section a.tag').each((i, v) => {
    tags.push({
      tilte: $(v).text()
    })
  })
  let comments=[]
  $('#comments .comment').each((i,v)=>{
    comments.push({
      author:$(v).find('.comment-info a').text(),
      content:$(v).find('.comment-content').text(),
      date:$(v).find('.comment-info span').eq(1).text()

    })
  })
  console.log(comments)

  const ret = {
    create_time: new Date().getTime(),
    title: detailInfo.title,
    rate: detailInfo.rating.value,//评级
    image: detailInfo.cover_url,//封面图片
    url: detailInfo.url,
    summary: $('#link-report .intro').text(),//简介id为link-report下的class为intro
    //页面浏览量
    count:1,
    switchVal:true,
    tags,
    author,
    publisher,
    price,
    comments
  }
  console.log(ret)
  return ret
}
//本地调试入口
// console.log(getDouban('9787519012724'))
// 云函数其实就是一个node项目（函数
exports.main = async (event, context) => {
  // 云函数逻辑
  const { isbn } = event
  return await getDouban(isbn)
}