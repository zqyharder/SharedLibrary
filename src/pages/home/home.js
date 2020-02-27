import Taro, { Component } from '@tarojs/taro'
import { View, Button,Image, Text ,Navigator, Switch} from '@tarojs/components'
import {AtSwitch} from 'taro-ui'
let db = wx.cloud.database()

import './home.scss'

class Index extends Component {

  config = {
    navigationBarTitleText: '个人图书馆'
  }
  state={
    books:[],
    userInfo:Taro.getStorageSync('userInfo')||{},
    // swiValue:[]

  }
  componentWillMount () {
    this.getAll(true)
  }

  componentWillReact () {
    console.log('componentWillReact')
  }
  
  componentDidMount () { 
   
  }
  getAll(init){//获取列表
    Taro.showLoading()//显示正在加载
    let id = this.$router.params.id
    let allBook =db.collection('doubanbooks').where({
        _openid:id
    }).get().then(res=>{
        // console.log(res)
      //制定查询结果集数量上限
        this.setState({
          books:res.data
        })

    })
    Taro.hideLoading()
  }
  switchChange=(id,swiVal)=>{
    // console.log(this.state.swiValue)
    // this.setState({
    //   swiValue:! this.state.swiValue
    // },()=>{
    //   console.log(this.state.swiValue)

    // })
    console.log('换了')
    db.collection('doubanbooks').doc(id).update({
      data:{
        switchVal: ! swiVal
      }
    })
  }
  
//   componentWillUnmount () { }

//   componentDidShow () { }

//   componentDidHide () { }

  render () {
   
    return<View>
        <View className='at-row'>
            <View className='at-col at-col-3'>
            <image class="avatar"src={this.state.books[0].userInfo.avatarUrl} />
            </View>
            <View className='at-col at-col-8' class='title-item'>
            <View>{this.state.books[0].userInfo.nickName+'的主页'}</View>
            <View>{'联系电话：'+this.state.books[0].userInfo.phone}</View>
            </View>
            

        </View>
        <View className='at-row at-row--wrap'>
        {
            this.state.books.map((book)=>{ 
                return<View className='at-col at-col-4'>
                    <Navigator open-type='navigate' url={'/pages/detail/detail?id='+book._id} >
                        <Image class='item-image' src={book.image} />
                        <View class='item-title' >{book.title}</View>
                    </Navigator>
                    {this.state.userInfo.openid==this.state.books[0]._openid ?
                      <AtSwitch class='at-switch' title='可借阅' checked={book.switchVal} onChange={()=>this.switchChange(book._id,book.switchVal)}/>
                       : 
                       <View class='switch-item'>{book.switchVal==true? <View>可借阅</View>:<View>已借出</View>}</View>}
                        
                </View>
                
            })
        }
        </View>
        
    </View>
    

    
  }
}

export default Index 
