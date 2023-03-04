const app = getApp()

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
    data: {
        avatarUrl: defaultAvatarUrl,
        theme: wx.getSystemInfoSync().theme,
        nickName:''
      },
      onLoad() {
        wx.onThemeChange((result) => {
          this.setData({
            theme: result.theme
          })
        })
      },
      onChooseAvatar(e) {
        const { avatarUrl } = e.detail 
        this.setData({
          avatarUrl,
        })
      },

      getInputValue(e){
        //   console.log(e)
        this.setData({
            nickName:e.detail.value
        })
      },
      
  //微信授权登录
  loadByWechat(){
      const res = {
          userInfo:{
              nickName:this.data.nickName,
              avatarUrl:this.data.avatarUrl
          }
      }
      if(this.data.nickName.length == 0) {
          wx.showToast({
            title: '请输入昵称',
            icon:'none'
          })
      }else {
        wx.reLaunch({
            //将微信头像和微信名称传递给【我的】页面
            url: '/pages/enter/enter?nickName='+res.userInfo.nickName+'&avatarUrl='+res.userInfo.avatarUrl,
          })
          //保存用户登录信息到缓存
          wx.setStorageSync('userInfo', res.userInfo)
      }
    }
   })









   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   