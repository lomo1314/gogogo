var util = require('../../utils/util.js'); //AJAX
var app = getApp()
Page({
    data: {
        /* 页面配置*/
        userEdit: '点击登录',
        avatar: "", //用户头像
        nickName: "", //用户昵称
        gender: "", //用户性别
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        userInfo: [],
        userShow: true, //用户信息展示？
        userImg: true,
        signNum: true, //签到次数
        loginStatus: "", //本地缓存记录
        sign_count: "", //签到次数
        signStat: "", //今日用户是否签到

    },
    /**分享*/
    onShareAppMessage: function (res) {
        //		if (res.from === 'button') {
        //	      // 来自页面内转发按钮
        //	      console.log(res.target)
        //	    }
        return {
            title: '手机中国',
            desc: '自定义分享描述',
            path: '/pages/index/index',
            imageUrl: '/image/share.png'
        }
    },
    /** 
     * 页面初始化
     * options 为页面跳转所带来的参数
     */
    onLoad: function (options) {
        var that = this
        //本地缓存中，调取是否登录状态值
        // var loginStatus = wx.getStorageSync('LoginSessionKey') || [];
        var token = wx.getStorageSync('token') || []
        wx.request({
            url: 'https://go.cnmo.com/index.php?g=api&m=user&a=get_user_info',
            data: {},
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/x-www-form-urlencoded', // 公共写着个头，否则数据调用不出来
                'API-Authorization': token
            },
            success: function (res) {
                var arr=res.data
                console.log(arr)
                if (res.data.code == 200) {
                    //当天签到状态
                    if(arr.data.sign_status==1){
                        that.setData({
                            signNum:false, //签过到，显示签到次数
                            sign_count:that.data.sign_count, //签到次数 
                        })
                    }
                    that.setData({
                        userInfo: arr.data,
                        avatar: arr.data.avatar,
                        nickName: arr.data.username,
                        sign_count: arr.data.sign_count,
                        userShow: false, //显示用户名称
                        userImg: false, //显示用户头像
                    })
                }else if(res.data.code==203){
                    that.setData({
                        userShow: true, //显示用户名称
                        userImg: true, //显示用户头像
                    })
                }
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })
        //存储签到状态
        util.dayTim(function (res) {
            var arr = res.data
            //console.log(arr)
            if (arr.code == 200) {
                that.setData({
                    signNum: true
                })
            } else {
                console.log(arr.msg)
            }
        })
    },
    // 用户点击登录
    bindgetuserinfo: function (e) {
        var that = this;
        //if (wx.getStorageSync('LoginSessionKey')) return false;
        if (e.detail.userInfo) { //授权成功
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.login({
                success: res => {

                    var rawData = e.detail.rawData
                    var infoData = JSON.parse(rawData);
                    wx.request({
                        //后台接口地址
                        url: 'https://go.cnmo.com/index.php?g=api&m=user&a=auth',
                        data: {
                            code: res.code,
                            username: infoData.nickName,
                            avatar: infoData.avatarUrl,
                            gender: infoData.gender
                        },
                        method: 'POST',
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        success: function (res) {
                            var arr = res.data;
                           
                            var token = arr.data.token
                            wx.setStorageSync('token', token)
                            //如果当天已经签到
                            if(arr.data.info.sign_status==1){
                                that.setData({
                                    signNum:false, //签过到，显示签到次数
                                    //sign_count:that.data.sign_count, //签到次数 
                                })
                            }
                            that.setData({
                                userInfo: arr.data.info,
                                avatar: arr.data.info.avatar,
                                nickName: arr.data.info.username,
                                sign_count: arr.data.info.sign_count,
                                userShow: false, //显示用户名称
                                userImg: false, //显示用户头像
                            })
                        }
                    })
                }
            })
        } else {
            console.log(333, '执行到这里，说明拒绝了授权')
            wx.showToast({
                title: "为了您更好的体验,请先同意授权",
                icon: 'none',
                duration: 2000
            });
        }
    },
    // 用户点击签到
    signIn: function (e) {
        var that = this
        var token = wx.getStorageSync('token') || [];
        if (token) {
            wx.request({
                url: 'https://go.cnmo.com/index.php?g=api&m=user&a=user_sign',

                method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                    'content-type': 'application/x-www-form-urlencoded', // 公共写着个头，否则数据调用不出来
                    "API-Authorization": token
                },
                success: function (res) {
                    var arr = res.data;
                    console.log(arr)
                    if (arr.code == 200) {
                        that.setData({
                            sign_count: arr.data,
                            signNum: false // 显示签到次数
                        })
                    } else if (arr.code == 201) {
                        //console.log(arr)
                        wx.showToast({
                            title: arr.msg,
                            duration: 1000,
                            mask: true
                        })
                    }

                }
            })
        } else {
            wx.showToast({
                title: "请先登录",
                duration: 1000,
                mask: true
            })
        }
    },
    onReady: function () {
        // 页面渲染完成
        var that = this;
        // 数据加载完成后 延迟隐藏loading
        setTimeout(function () {
            that.setData({
                hidden: true
            })
        }, 500);


    },
    /**页面显示*/
    onShow: function () {},
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    }

})