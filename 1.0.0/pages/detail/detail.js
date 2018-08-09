
var  util = require( '../../utils/util.js' );//AJAX
var WxParse = require('../../wxParse/wxParse.js') // 识别html标签插件
Page({
    data: {
        //关联产品点击更多按钮显示消失
        wifihidden:false,
        hidden: false,
        //文章详情
        essayCont:[],
        
    },
    onLoad:function(options){
        var that=this
    	//重新设置标题
    	wx.setNavigationBarTitle({
		  title: '手机详情'
        })
        //调取数据
        var txtId=options.id
        console.log(txtId)
        wx.request({
            url: 'https://go.cnmo.com/index.php?g=api&m=skill&a=detail',
            data: {
                id:txtId
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 公共写着个头，否则数据调用不出来
            },
            success: function(res){
                // success
                var arr=res.data
                var article =res.data.data.info
                WxParse.wxParse('article', 'html', article, that,5); 
                console.log(arr)
                //写入数据组中
                that.setData({
                    essayCont:arr.data
                })
                

            },
            fail: function() {
                // fail
            },
            complete: function() {
                // complete
            }
        })
    	
    },
    //图片
    changeIndicatorDots: function (e) {
        this.setData({
            indicatorDots: !this.data.indicatorDots
        })
    },
    changeVertical: function (e) {
        this.setData({
            vertical: !this.data.vertical
        })
    },
    changeAutoplay: function (e) {
        this.setData({
            autoplay: !this.data.autoplay
        })
    },
    intervalChange: function (e) {
        this.setData({
            interval: e.detail.value
        })
    },
    durationChange: function (e) {
        this.setData({
            duration: e.detail.value
        })
    },
    //   返回上一页
	navigateBack: function () {
        var self = this;
		var pages = getCurrentPages();
        wx.navigateBack({ changed: true });//返回上一页
    },
    //产品关联点击更多按钮点击
    offerMore:function(){
    	this.setData({
            hidden: true,
            series1: this.data.series
        })
    },
    //分享

})