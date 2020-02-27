// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

async function plusCount(id){
  try{
    return db.collection('doubanbooks').doc(id).update({
      data:{
        count: db.command.inc(1)
      }
    })
  }catch(e){
    console.log(e)
  }
  
}

// 云函数入口函数
exports.main = async (event, context) => {
  const { id } = event
  return await plusCount(id)
}