
var  util = require( '../../utils/util.js' );//AJAX
Page({
    data: {
    	winHeight: 0,
    },
    onLoad:function (options) {  
        console.log(options.id)
        
        
        var that=this
        /**获取系统信息*/
		wx.getSystemInfo({
			success: function (res) {
				that.setData({
					winHeight: res.windowHeight - 38
				});
			}
        });
        //调用分类数据内容
		util.classifyAjax("",function (res) { 
			var arr=res.data;
			that.setData({
				classifyList:arr.data
			})
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
    //产品关联点击更多按钮点击
    offerMore:function(){
    	this.setData({
            hidden: true,
            series1: this.data.series
        })
    },
    //分享
//	onShareAppMessage: function () {
//	    return {
//	      title: '手机中国',
//	      desc: '自定义分享描述',
//	      path: '/pages/index/index'
//	    }
//	}
})