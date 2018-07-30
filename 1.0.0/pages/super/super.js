var util = require('../../utils/util.js'); //AJAX
var app = getApp()
Page({
	data: {
		
		indicatorDots: false,
		autoplay: false,
		interval: 5000,
		duration: 1000,
		//接受分类列表
		classifyList:[],
		//热门展示
		pradaTopic:true,
		//热门数据
		topicHot:[],
	},
    //分类数据  除首页外 classifyAjax传值为空
	onLoad:function () { 
		var that=this;
		util.classifyAjax("",function (res) { 
			var arr=res.data;
			that.setData({
				classifyList:arr.data
			})
		 })
		 //热卖排行数据接口
		 //https://go.cnmo.com/index.php?g=api&m=index&a=hotpaihang
		 wx.request({
            url: 'https://go.cnmo.com/index.php?g=api&m=index&a=hotpaihang',
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 公共写着个头，否则数据调用不出来
			},
			success:function (res) { 
				console.log(res)
				if(res.data.code==400){
					that.setData({
						pradaTopic:false
					})
				}else{
					var arr=res.data.data
					that.setData({
						topicHot:arr.info
					})
				}
			 },
            complete: function (res) {
                fn(res)
            }
        })
	 },

	changeIndicatorDots: function (e) {
		this.setData({
			indicatorDots: !this.data.indicatorDots
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
	}
})