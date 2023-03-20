const app = getApp()

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
    data: {
        avatarUrl: defaultAvatarUrl,
        theme: wx.getSystemInfoSync().theme,
        nickName:'',
        fileID:''
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

        wx.cloud.uploadFile({
            //这里拼接的字符串也可以使用模板字面量
            //cloudPath: `img/${fileName}.png`, 
                cloudPath: 'img/'+this.data.nickName+(new Date()).getTime()+'.png', // 上传至云端的路径
                filePath: this.data.avatarUrl, // 小程序临时文件路径
                success: res => {
                  // 返回文件 ID
                  console.log(res.fileID)
    
                  this.setData({
                      fileID:res.fileID
                  })
                },
                fail: console.error
              })
      },

      getInputValue(e){
        //   console.log(e)
        this.setData({
            nickName:e.detail.value
        })
      },

      uploadimg(){
        //声明this，这里面嵌套的太多，里面拿不到this
        let _that=this

        wx.chooseImage({
            count: 1,
            success (res) {
              // tempFilePath可以作为img标签的src属性显示图片
              const tempFilePaths = res.tempFilePaths
              //获取到每张图片的名字
              const fileName=res.tempFilePaths[0].slice(11)
           // console.log(res.tempFilePaths[0])
            //console.log(res.tempFilePaths[0].slice(11))
              
        wx.cloud.uploadFile({
        //这里拼接的字符串也可以使用模板字面量
        //cloudPath: `img/${fileName}.png`, 
            cloudPath: 'img/'+fileName+'.png', // 上传至云端的路径
            filePath: tempFilePaths[0], // 小程序临时文件路径
            success: res => {
              // 返回文件 ID
              console.log(res.fileID)

              _that.setData({
                  selctedimg:res.fileID
              })
            },
            fail: console.error
          })
            }
          })
        },
      
  //微信授权登录
  loadByWechat(){
      const res = {
          userInfo:{
              nickName:this.data.nickName,
              avatarUrl:this.data.fileID
          }
      }
      console.log(JSON.stringify(res))
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









   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   