//app.js
App({
  //页面公共变量
  globalVar: {
    ver: '', //小程序版本
    //		refreshIndex:false//首页刷新按钮
    barClolor: ['#ffffff', '#1472e0'], //顶部导航颜色
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var home = wx.getStorageSync('home') || []
    //console.log(home+"home")
    home.unshift(Date.now())
    wx.setStorageSync('home', home)
    //本地缓存中，调取是否登录状态值
    var token = wx.getStorageSync('token') || [];
    console.log(token);

    //调用API从本地缓存中获取数据
    var refresh = wx.getStorageSync('refresh') || false;
    wx.setStorageSync('refresh', refresh)
    //修改导航颜色
    var num = wx.getStorageSync('model') || 0;
    var color, bgColor;
    if (num == 0) {
      //蓝色
      color = '#ffffff';
      bgColor = "#1472e0"
    } else {
      //白色
      color = '#000000';
      bgColor = "#fff"
    };
    this.globalVar.barClolor[0] = color;
    this.globalVar.barClolor[1] = bgColor;
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)

    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },

  globalData: {
    userInfo: null
  },
   
       // 获取滚动条当前位置
       onPageScroll: function (e) {
        //console.log(e)
        if (e.scrollTop > 100) {
          this.setData({
            floorstatus: true
          });
        } else {
          this.setData({
            floorstatus: false
          });
        }
      },
      //回到顶部
      goTop: function (e) {  // 一键回到顶部
        if (wx.pageScrollTo) {
          wx.pageScrollTo({
            scrollTop: 0
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
          })
        }
      },

})