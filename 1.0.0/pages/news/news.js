var WxParse = require('../../wxParse/wxParse.js') // 识别html标签插件
var util = require('../../utils/util.js'); //AJAX
var app = getApp()
Page({
    data: {
        /* 页面配置*/
        newsText: [],
        cate_id: "", //详情id
        newsTitle: "", //专辑大标题
        markHidden: true, //蒙层开关
    },
    // //	//分享
    // 	onShareAppMessage: function () {
    // 	    return {
    // 	      title: '手机中国',
    // 	      desc: '自定义分享描述',
    // 	      path: '/pages/index/index'
    // 	    }
    // 	},
    /** 
     * 页面初始化
     * options 为页面跳转所带来的参数
     */
    onLoad: function (options) {
        //重新设置标题
        // wx.setNavigationBarTitle({
        //   title: '新闻详情'
        // })
        var that = this
        var cate_id = options.cate_id
        var name = options.name
        that.setData({
            newsTitle: name
        })

        wx.request({
            url: 'https://go.cnmo.com/index.php?g=api&m=article&a=articleList',
            data: {
                cate_id: cate_id
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 公共写着个头，否则数据调用不出来
            },
            success: function (res) {
                var arr = res.data
                //console.log(arr)
                if (arr.code == 200) {
                    that.setData({
                        newsText: arr.data.data, //专辑内容
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
    },
    //图片点击事件
    imgYu: function (event) {
        var src = event.currentTarget.dataset.src; //获取data-src
        var imgList = event.currentTarget.dataset.list; //获取data-list
        //图片预览
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: imgList // 需要预览的图片http链接列表
        })
    },
    //   返回上一页
    navigateBack: function () {
        var self = this;
        var pages = getCurrentPages();
        wx.navigateBack({
            changed: true
        }); //返回上一页
    },
    // 点击复制吱口令
    copyText: function (e) {
        var that = this
        wx.setClipboardData({
            data: e.currentTarget.dataset.text,
            success: function (res) {
                wx.getClipboardData({
                    success: function (res) {
                        that.setData({
                            markHidden: false
                        })
                    }
                })
            }
        })
    },
        //关闭蒙层
        closeMark: function () {
            var that = this
            that.setData({
                markHidden: true
            })
        },
    onReady: function () {

    },
    /**页面显示*/
    onShow: function () {

    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    },

})