// pages/map/map.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 存放当前位置经纬度
        latitude: 0,
        longitude: 0,
        roomid: 0,
        roomIndexId: '',
        userAvatar: '',
        nickName: '',
        // curId: 0,
        markers: [],
        isFirstTime:true

    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // console.log(options)
        const userinfo = wx.getStorageSync('userInfo')
        this.setData({
            userAvatar: userinfo.avatarUrl,
            // 'markers[0].iconPath': userinfo.avatarUrl,
            roomid: options.roomid,
            nickName: userinfo.nickName,
            isFirstTime:true
        })
        // console.log(this.data.roomid)

        // wx.getLocation({
        //         type: 'gcj02',
        //         isHighAccuracy:true,
        //         highAccuracyExpireTime:3000,
        //     }).then(res => {
        //         console.log(res);
        //         this.setData({
        //             latitude: res.latitude,
        //             longitude: res.longitude,
        //         })

                const mpCtx = wx.createMapContext("map");
                mpCtx.moveToLocation();

                this.insertOrUpdate()

            // })
            // .catch(err => {
            //     wx.showModal({
            //         title: "提示",
            //         content: "获取定位信息失败",
            //         showCancel: false
            //     })
            // })


    },

    locationChangeFunc(res) {
        const newLatitude = res.latitude
        const newLongitude = res.longitude
        wx.cloud.database().collection('room').where({
            roomid: this.data.roomid,
        }).get().then((r) => {
            console.log(r)
            let data = r.data[0]
            for(let i=0;i<data.participant.length;i++) {
                if(data.participant[i].nickName == this.data.nickName) {
                    data.participant[i].latitude = newLatitude;
                    data.participant[i].longitude = newLongitude;
                    break;
                }
            }
            wx.cloud.database().collection('room').doc(r.data[0]._id).update({
                data: {
                    roomid: data.roomid,
                    participant: [...data.participant]
                }
            }).then((res) => {
                console.log(res.stats)
                this.queryAndUpdate();
            }).catch(err => {
                console.log(err)
            })
        })
    },

    updateLocation() {
        wx.startLocationUpdate();
        const throttleFunc = this.throttle(this.locationChangeFunc,2000)
        wx.onLocationChange(throttleFunc)
    },

    insertOrUpdate() {
        wx.cloud.database().collection('room').where({
            roomid: this.data.roomid,
        }).get().then((res) => {
            const data = res.data[0]
            console.log(data)
            if (res.data.length == 0) {
                console.log("length0")
                wx.cloud.database().collection('room').add({
                    data: {
                        roomid: this.data.roomid,
                        participant: [{
                            latitude: this.data.latitude,
                            longitude: this.data.longitude,
                            nickName: this.data.nickName,
                            userAvatar: this.data.userAvatar
                        }]
                    }
                }).then((ress) => {
                    console.log(ress)
                    this.setData({
                        roomIndexId:ress._id
                    }) //返回的res里面有_id的值，这个_id是系统自动生成的。
                    // this.queryAndUpdate()
                    this.updateLocation()
                }).catch(err => {
                    console.log(err)
                })
            } else {
                console.log("length1+"+JSON.stringify(res))
                this.setData({
                    roomIndexId:data._id
                }) 
                console.log("[update]" + "_id:" + this.data.roomIndexId);
                let userHaveJoinedTheMap = false;
                const curParticipants = res.data[0].participant
                curParticipants.forEach((ele) => {
                    if (ele.nickName == this.data.nickName) userHaveJoinedTheMap = true;
                })
                console.log("userHaveJoinedTheMap"+userHaveJoinedTheMap)
                if (!userHaveJoinedTheMap) {
                    wx.cloud.database().collection('room').where({
                        roomid: this.data.roomid,
                    }).get().then((r) => {
                        console.log(r)
                        const rdata = r.data[0]
                        wx.cloud.database().collection('room').doc(this.data.roomIndexId).update({
                            data: {
                                roomid: rdata.roomid,
                                participant: [{
                                    latitude: this.data.latitude,
                                    longitude: this.data.longitude,
                                    nickName: this.data.nickName,
                                    userAvatar: this.data.userAvatar
                                }, ...rdata.participant]
                            }
                        }).then((res) => {
                            console.log(res.stats)
                            // this.queryAndUpdate();
                            this.updateLocation()
                        }).catch(err => {
                            console.log(err)
                        })
                    })
                } else {
                    // this.queryAndUpdate();
                    this.updateLocation()
                }
            }
        })
    },

    queryAndUpdate() {
        // if(this.data.isFirstTime) {
        //     this.updateLocation()
        //     this.setData({
        //         isFirstTime:false
        //     })
        //     // setInterval(() => {
        //     //     this.queryAndUpdate()
        //     // }, 5000)
        // }
        
        wx.cloud.database().collection('room').where({
            roomid: this.data.roomid
        }).get().then(res => {
            console.log(res)
            // this.setData({
            //     roomIndexId: res.data[0]._id
            // })
            // console.log("roomIndexIdSet:" + this.data.roomIndexId)
            const participant = res.data[0].participant
            const newMarkers = []
            for (let i = 0; i < participant.length; i++) {
                // const avatarKey = `markers[${i}].iconPath`
                // const longitudeKey = `markers[${i}].longitude`
                // const latitudeKey = `markers[${i}].latitude`
                // // const idKey = `markers[${i}].id`
                // const heightKey = `markers[${i}].height`
                // const widthKey = `markers[${i}].width`
                // const nickNameKey = `markers[${i}].nickName`
                // const nickNameTitleKey = `markers[${i}].title`

                // if (nickName == this.data.nickName) {
                //     this.setData({
                //         curId: i
                //     })
                // }
                // this.setData({
                //     [avatarKey]: participant[i].userAvatar,
                //     [longitudeKey]: participant[i].longitude,
                //     [latitudeKey]: participant[i].latitude,
                //     [idKey]: i,
                //     [heightKey]: 30,
                //     [widthKey]: 30,
                //     [nickNameKey]: participant[i].nickName,
                //     [nickNameTitleKey]: participant[i].nickName,
                // })

                newMarkers.push({
                    iconPath: participant[i].userAvatar,
                    longitude: participant[i].longitude,
                    latitude: participant[i].latitude,
                    id: i,
                    height: 30,
                    width: 30,
                    nickName: participant[i].nickName,
                    title: participant[i].nickName,
                })
            }
            this.setData({
                markers:newMarkers
            })
            console.log('[marker]' + JSON.stringify(this.data.markers))
        })
    },

    throttle(fn, delay) {
        let timer = null
        
        return function() {
            if (timer) {
                return
            }
            timer = setTimeout(() => {
                fn.apply(this, arguments)
                timer = null
            },delay)
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },
    changeAvatar: function () {
        // const path = `markers[${this.data.curId}].iconPath`
        // this.setData({
        //     [path]:'https://kevinbeanblog.oss-cn-shanghai.aliyuncs.com/uPic/12885442.png'
        //     // [path]: '../../images/default.png'
        // })

        wx.cloud.database().collection('room').where({
            roomid: this.data.roomid,
        }).get().then((r) => {
            console.log(r)
            let data = r.data[0]
            for(let i=0;i<data.participant.length;i++) {
                if(data.participant[i].nickName == this.data.nickName){
                    data.participant[i].userAvatar = 'https://kevinbeanblog.oss-cn-shanghai.aliyuncs.com/uPic/12885442.png';
                }
            }
            console.log('[data.participant]' + JSON.stringify(data.participant))
            wx.cloud.database().collection('room').doc(r.data[0]._id).update({
                data: {
                    roomid: data.roomid,
                    participant: [...data.participant]
                }
            }).then((res) => {
                console.log(res.stats)
                this.queryAndUpdate();
            }).catch(err => {
                console.log(err)
            })
        })

    },
    currentPos: function () {
        const mpCtx = wx.createMapContext("map");
        mpCtx.moveToLocation();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        wx.offLocationChange()
        wx.cloud.database().collection('room').where({
            roomid: this.data.roomid,
        }).get().then((r) => {
            // console.log(r)
            let data = r.data[0]
            for(let i=0;i<data.participant.length;i++) {
                if(data.participant[i].nickName == this.data.nickName){
                    data.participant.splice(i,1)
                }
            }
            console.log('[data.participant]' + JSON.stringify(data.participant))
            wx.cloud.database().collection('room').doc(r.data[0]._id).update({
                data: {
                    roomid: data.roomid,
                    participant: [...data.participant]
                }
            })
        })

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})