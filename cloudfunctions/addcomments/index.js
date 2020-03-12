// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

async function addComments(id,author,content){
  
    let myDate=new Date()
    return db.collection('doubanbooks').doc(id).update({
      data:{
        comments:db.command.push({
          author:author,
          content:content,
          date:myDate.toLocaleDateString()
        })
      }
    })
    
  
}

// 云函数入口函数
exports.main = async (event, context) => {
  const { id,author,content} = event
  return await addComments(id,author,content)
}