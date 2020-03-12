import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import {AtTag, AtNoticebar,AtCard,AtTextarea,AtButton} from 'taro-ui'
import dayjs from 'dayjs'
import './detail.scss'
let db = wx.cloud.database()

class Index extends Component {

  config = {
    navigationBarTitleText: '详情页'
  }
  state={
    userInfo:Taro.getStorageSync('userInfo') || {},

    book:{},
    value:''
  }
  componentWillMount () { }

  componentWillReact () {
    console.log('componentWillReact')
  }
  init(){
    let id = this.$router.params.id
    Taro.showLoading()
    db.collection('doubanbooks').doc(id).get().then(res=>{
      this.setState({
        book:res.data
      })
      Taro.setNavigationBarTitle({
        title:res.data.title
      })
      Taro.hideLoading()
    })

  }
  componentDidMount () { 
    // 图书的唯一标识
    let id = this.$router.params.id

    // 1. 图书的count +1 
    this.changeCount(id)
    // db.collection('doubanbooks').doc(id).update({
    //   data:{
    //     count: db.command.inc(1)
    //   }
    // })
    this.init()
    // console.log(id)

  }
  changeCount(id){
    wx.cloud.callFunction({
      name:'changecount',
      data:{id},
      success: function() {
        console.log('调用成功')
      },
      fail:console.error
  })
  }
//   componentWillUnmount () { }

//   componentDidShow () { }

//   componentDidHide () { }

  handleChange=(e)=>{
    this.setState({
      value:e.target.value
    })
  }
  comment = ()=>{
    // console.log(this.state.value)
    let id = this.$router.params.id
    let author=this.state.userInfo.nickName
    let content=this.state.value
    wx.cloud.callFunction({
      name:'addcomments',
      data:{id,author,content},
      success: res=> {
        // console.log(res)
        this.setState({
          value:''
        })
        this.init()
      }
     
    })
    
    
  }
  toHome=(id)=>{
    console.log('去首页了')
    Taro.navigateTo({
      url:'/pages/home/home?id='+id
    })
  }
  render () {
    // console.log(this.state.book)
    // let rate = Math.round(this.state.book.rate / 2)
    // let rateVal = "★★★★★☆☆☆☆☆".slice(5 - rate, 10 - rate);
    // let {userInfo} = this.state.book
    let {book}=this.state
    return (
      <View className='container'>

        <View className='thumb'>
          <Image className='back' src={book.image} mode='aspectFill'></Image>
          <Image className='img' src={book.image} mode="aspectFit"></Image>
        </View>
        <View>
          {
            book.tags&&book.tags.map((t)=>{
              return <AtTag active circle> {t.tilte}</AtTag>
            })
          }
        </View>
        <AtButton onClick={()=>this.toHome(book._openid)}>去持有者首页</AtButton>                

        <View>
          {
            book.comments&&book.comments.map((c)=>{
              let image = c.image ? c.image : 'http://image.shengxinjing.cn/rate/unlogin.png'
              return <AtCard
                title={c.author}
                extra={c.data}
                thumb={image}
              >

              {c.content}
              </AtCard>
            })
          }
        </View>

        {
          this.state.userInfo.openid && <View>

            <AtTextarea
              value={this.state.value}
              onChange = {this.handleChange}
            >
            </AtTextarea>
            <AtButton type='primary' onClick={this.comment}>提交</AtButton>
            {/* <View onClick={this.comment}>测试</View> */}
          </View>
        }
      </View>
    )
  }
}

export default Index 
