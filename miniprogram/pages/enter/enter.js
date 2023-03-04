
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomid: '',
    isVFocus: true,
    phoneNum: '',//手机号码
  },
  showVCode: function(e){
    const that = this;
    that.setData({
      roomid: e.detail.value,
    });
  },
  tapFn(e){
    const that = this;
    that.setData({
      isVFocus: true,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  goToPage1: function () {
    console.log(this.data.roomid)
    if(`${this.data.roomid}`.length != 8) {
        wx.showToast({
          title: '请输入8位房间号',
          icon:'none'
        })
    }else {
        wx.navigateTo({
            url: '/pages/map/map?roomid='+this.data.roomid,
          })
    }
  },
  onLoad: function (options) {
    
  },
  
})