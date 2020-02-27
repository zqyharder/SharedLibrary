import Taro, { Component } from '@tarojs/taro'
import { View, Button} from '@tarojs/components'
import {AtButton,AtInput} from 'taro-ui'
import './me.scss'
const db =wx.cloud.database()

class Me extends Component{
    config={
        navigationBarTitleText: '个人中心'
    }
    state={
        value:'',
        userInfo:Taro.getStorageSync('userInfo')||{}
    }
    onGetUserInfo=(e)=>{
        let userInfo=e.detail.userInfo
        // console.log(userInfo)
        //需要调用云函数，获取用户的openid
        wx.cloud.callFunction({
            name:'zqylogin',
            complete: res=>{
                // console.log(res)
                userInfo.openid=res.result.openid
                userInfo.phone=this.state.value
                this.setState({
                    userInfo
                })
                //写入本地缓存
                Taro.setStorageSync('userInfo', userInfo)
        }
        })
        // console.log(userInfo)

        // console.log(userInfo.phone.toLocaleTimeString())
    }
    addBook(isbn){
        wx.cloud.callFunction({
            name:'getdoubanbook',
            data:{isbn},
            success:({result})=>{
              //存入数据库doubanbooks
              result.userInfo=this.state.userInfo
              db.collection('doubanbooks').add({
                data:result
              }).then(res=>{
                if(res._id){
                  wx.showModal({
                    title:'添加成功',
                    content:`《${result.title}》添加成功`
                  })
                }
              })
              console.log(result)
            }
        })
    }
    
    scanBook=()=>{
        Taro.scanCode({//自带扫码接口
            success: res=>{
              // 扫码获得的res.result是图书的isbn号，去豆瓣获取详情
              this.addBook(res.result)
              // console.log(res.result)
            }
            
          })
    }
    showAll=(id)=>{
      console.log('点开了')
      Taro.navigateTo({
        url:'/pages/home/home?id='+id
      })
    }

    handleChange=(e)=>{
      // console.log(e.target.value)
      this.setState({
        value:e.target.value
        
      })
      // console.log(this.state.value)
    }
    // phone=()=>{
    //   console.log('点击成功')
    //   this.setState({
    //     phone:this.state.value
    //   })        
    //   console.log(this.state.phone) 
    // }
    render(){
        return <View className='user-container' >
            {
                this.state.userInfo.openid ? <View>
                <image class="avatar"src={this.state.userInfo.avatarUrl} />
                <view >{this.state.userInfo.nickName}</view>
                <AtButton type='primary' onClick={this.scanBook}>添加图书</AtButton>
                <AtButton type='default' onClick={()=>this.showAll(this.state.userInfo.openid)}>我的图书馆</AtButton>                
                <button type="warn" open-type="contact">客服</button>

                
                </View> :<View>
                    <Image className='avatar' src='http://image.shengxinjing.cn/rate/unlogin.png'></Image>
                    <View>
                    <Input
                      placeholder='请输入您的联系方式'
                      value={this.state.value}
                      onChange= {this.handleChange}
                    >
                    </Input>
                    <AtButton type='primary' size='small'
                    onGetUserInfo={this.onGetUserInfo}
                   
                    openType='getUserInfo'
                    >
                    登陆
                    </AtButton>
                    </View>
                </View>
            }
        </View>
    }
}
export default Me