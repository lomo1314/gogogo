var util = require('../../utils/util.js'); //AJAX
var app = getApp()
Page({
	data: {
		curr_id: '',
		indicatorDots: false,
		autoplay: false,
		interval: 5000,
		duration: 1000,
		/* 页面配置*/
		winWidth: 0,
		winHeight: 0,
		//省技巧数据。
		saveList: [],
		dataSaveLength: 0,
		dataSavePage: 1, //当前页面
		saveHidden: true, // 显示加载更多 loading
	},
	onReady: function () {
		this.videoContext = wx.createVideoContext('myVideo');
		this.videoContext.seek(0);
		// 加载后再播放 this.videoContext.play()
	},
	videoPlay(e) {
		this.setData({
			curr_id: e.currentTarget.dataset.id,
		})
		this.videoContext.play();
	},
	
	onLoad: function () {
		var that=this
		/**获取系统信息*/
		wx.getSystemInfo({
			success: function (res) {
				that.setData({
					winWidth: res.windowWidth,
					winHeight: res.windowHeight - 145
				});
			}
		});
		var dataTp={
			p:that.data.dataSavePage
		}
		util.saveAjax(dataTp, function (res) {
			var arr = res.data
			//console.log(arr)
			// 获取当前数据进行保存
			var list = that.data.saveList;
		
			that.setData({
				//todayList: arr.data.info,
				// 然后重新写入数据
				saveList: list.concat(arr.data.info), // 存储数据
				dataSaveLength: arr.data.info.length, //请求过来的条数
				dataSavePage: that.data.dataTodayPage + 1 // 统计加载次数
			})
		})
	},
	/**
	 * 事件处理
	 * scrolltolower 自动加载更多
	 */
	scrolltolower: function (e) {
		var that = this;
		
		//console.log(that.data.dataTodayLength)
		/* ------------------------- */
        //if(!canUseReachBottom) return;//如果触底函数不可用，则不调用网络请求数据
      /* ------------------------- */
		// 加载更多 loading
		that.setData({
		    todayhidden: true,
			wifihidden: false
		})
		if(that.data.dataTodayPage==1){
			//canUseReachBottom = false;
			
			that.ajaxDay(that.data.page,function (res) { 
				that.setData({
					todayhidden: true,
					wifihidden: false
				})
			 })
		}else {
			//canUseReachBottom = false;
			that.ajaxDay(that.data.dataTodayPage,function (res) { 
				that.setData({
					todayhidden: true,
					wifihidden: false
				})
			 })
		}
		
	},
	//省技巧，接口数据
	ajaxSave: function (param, fn) {
		var that = this
		//var todayPage=that.data.dataTodayPage
		//console.log(param)
		var ajaxData={
            p: param
		}
		util.saveAjax(ajaxData, function (res) {
			//canUseReachBottom = true;//
			var arr = res.data
			//console.log(arr)
			// 获取当前数据进行保存
			var list = that.data.saveList;
			
			that.setData({
				//todayList: arr.data.info,
				// 然后重新写入数据
				saveList: list.concat(arr.data.info), // 存储数据
				dataSaveLength: arr.data.info.length, //请求过来的条数
				dataSavePage: that.data.dataTodayPage + 1 // 统计加载次数
			})
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