import Taro, { Component } from '@tarojs/taro'
import { View, Swiper,SwiperItem,Image,Button, Text} from '@tarojs/components'
const db =wx.cloud.database()
// var _ = require('lodash')




import './index.scss'

import { AtCard } from 'taro-ui'


class Index extends Component {

  config = {
    navigationBarTitleText: '共享图书馆'//页面标题
    // enablePullDownRefresh: true

  }
  state={
    books:[],
    page:0,
    tops:[[],[],[]]
  }

  onPullDownRefresh(){
    this.getTop()
    this.getList(true)
    // console.log('顶部刷新')
  }
  onReachBottom(){//页面触底函数
    this.setState({
      page:this.state.page+1
    },()=>{//确认page修改完毕后回调
      this.getList()
    })
    // console.log('底部刷新')


  }


  componentWillMount () {
    this.getList(true)
    this.getTop()
  }

  getTop(){//获取轮播图
    db.collection('doubanbooks').orderBy('count','desc')
    .limit(9).get().then(res=>{
      this.setState({//分组函数，使用lodash的chunk函数更佳
        tops:[res.data.slice(0,3),res.data.slice(3,6),res.data.slice(6)]
        // tops:_.chunk(res.data,3)
      })

    })
    // console.log(this.state.tops)

  }
  getList(init){//获取列表
    Taro.showLoading()//显示正在加载
    if (init){
      this.setState({
        page:0
      })
    }
    const PAGE=5
    const offset =init?0:this.state.page*PAGE
    let ret =db.collection('doubanbooks')
    .orderBy('create_time','desc')//获取数据根据其字段的creat_time降序排列
    if(this.state.page>0){
      //不是第一页
      ret=ret.skip(offset)
      //指定查询返回结果时从指定序列后的结果开始返回，常用于分页
    }
    ret =ret.limit(PAGE).get().then(res=>{
      //制定查询结果集数量上限
      if(init){
        this.setState({
          books:res.data
        })
      }else{//加载下一页，包括之前内容
        this.setState({
          books:[...this.state.books, ...res.data]
        })
      }
      Taro.hideLoading()
    })
  }
  toDetail=(id)=>{
    Taro.navigateTo({
      url:'/pages/detail/detail?id='+id
    })
  }

  // componentWillReact () {
  //   console.log('componentWillReact')
  // }

  // componentDidMount () { }

  // componentWillUnmount () { }

  // componentDidShow () { }

  // componentDidHide () { }

  render () {
    return (
      //轮播图效果
      <View className='index'>
       <Swiper 
       indicatorColor='#999' 
       indicatorActiveColor='#333'
       circular
       indicatorDots
       autoplay
       >
        {
          this.state.tops.map((item)=>{
            return <SwiperItem>
              {
                item.map((img)=>{
                  return <Image 
                    className='slide-image' 
                    mode='aspectFit'
                    src={img.image}

                  />
                })
              }
            </SwiperItem>
            
          })
        }
       </Swiper>
          {
            this.state.books.map(book=>{
              let rate =Math.round(book.rate/2)
              let rateVal='★★★★★☆☆☆☆☆'.slice(5-rate,10-rate)
              return<View class='book-item'>
                <AtCard 
                  onClick={() => this.toDetail(book._id)}
                  extra={rateVal}
                  title={book.title}
                  thumb={book.userInfo.avatarUrl}
                  >
                  
                  <View>

                    <View className='at-row'>
                      <View className='at-col at-col-3'>
                        <Image mode='aspectFit' class="book-img" src={book.image}></Image>
                      </View>
                      <View className='at-col at-col-8'>
                        <View>
                          {book.author}
                        </View>
                        <View>
                          {book.publisher}
                        </View>
                        <View>
                          {book.price}
                        </View>
                        <View>
                          浏览量：{book.count}
                        </View>
                        <View>
                          持有者：{book.userInfo.nickName}
                        </View>
                      </View>
                    </View>

                  </View>
                </AtCard>
              </View>
            })
          }
          
      </View>
    )
  }
}

export default Index 
