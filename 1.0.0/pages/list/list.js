var util = require('../../utils/util.js'); //AJAX
// var QR = require("../../utils/qrcode.js");
var canUseReachBottom = true;
var app = getApp()
Page({
	data: {
		winHeight: 0,
		currentTab: 0, // tab切换
		page: 1,
		hidden: true, // loading
		wifihidden: false, //网络不可用
		refresh: false,
		//人气top100
		hotList: [],
		dataHotLength: 0, //数据条数  hitss
		dataHotPage: 1, //当前页面
		hothidden: true, // 显示加载更多 loading
		//销量top100
		saleList: [],
		dataSaleLength: 0, //数据条数 hottop
		dataSalePage: 1, //当前页面
		salehidden: true, // 显示加载更多 loading
	},
	// readArticle: function (e) {
	// 	var $data = e.currentTarget.dataset; //打印可以看到，此处已获取到了包含id、title、和content的对象
	// 	wx.navigateTo({
	// 		url: '../news/news?id' + $data.id + "&title=" + $data.title + "&content=" + $data.content //传参跳转即可
	// 	})
	// }
	onLoad: function (options) {

		var that = this;

		/**获取系统信息*/
		wx.getSystemInfo({
			success: function (res) {
				that.setData({
					winWidth: res.windowWidth,
					winHeight: res.windowHeight - 135
				});
			}
		});
		//热门展示数据
		var dataTOP = {
			sort: "hitss",
			p: that.data.dataHotPage
		}
		util.hotAjax(dataTOP, function (res) {
			var arr = res.data
			// 获取当前数据进行保存
			var list = that.data.hotList;
			var cont = arr.data.info
			that.setData({
				//todayList: arr.data.info,
				// 然后重新写入数据
				hotList: list.concat(arr.data.info), // 存储数据
				dataHotLength: arr.data.info.length, //请求过来的条数
				dataHotPage: that.data.dataHotPage + 1 // 统计加载次数
			})
		})
	},

	/**
	 * 滑动切换tab
	 */
	bindChange: function (e) {
		var that = this;
		//console.log(e.detail.current)
		that.setData({
			currentTab: e.detail.current,
			wifihidden: false
		});

		//如果点击的是销量hottop并且是第一次点击，发送请求
		if (e.detail.current == 1) {
			that.setData({
				page:2
			});
			//console.log(that.data.page)
			//console.log(that.data.saleList.length)
			if (that.data.saleList.length == 0) {
				that.ajaxList(2, "hottop", function (res) {
					//console.log(saleList)
					//如果加载失败--再次加载,再次失败--提示
					that.ajaxList(2,"hottop", function (res) {
						that.setData({
							wifihidden: true
						});
					})
				})
			}
		}else if(e.detail.current==0){
			that.setData({
				page:1
			});
			console.log(that.data.page)
			that.ajaxList(1,"hitss",function(){
				//如果加载失败--再次加载,再次失败--提示
				that.ajaxList(1,"hitss",function(){
					that.setData({wifihidden:true});
				})
			})
		}
	},
	/**点击tab切换**/
	swichNav: function (e) {
		var that = this;
		var cur = e.currentTarget.dataset.current
		//console.log(this.data.currentTab,cur)
		//console.log(cur);
		if (this.data.currentTab === cur) {
			return false;
		} else {
			that.setData({
				currentTab: cur
			})
		}
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
		    hothidden: true,
			wifihidden: false
		})
		if(that.data.page==1){
			canUseReachBottom = false;
			// 加载更多 loading
			//人气
        	that.setData({
        		hothidden: true,
        		wifihidden: false
			})
        	 // 如果加载数据超过20条
        	if(this.data.dataHotLength < 20){
        		that.setData({hothidden: false})
        	}else{
        		 /**发送请求数据*/
        		that.ajaxList(1,"hitss",function(res){
        			that.setData({wifihidden:true});
        		})
        	}
		}else {
			canUseReachBottom = false;
			that.setData({
        		salehidden: true,
        		wifihidden: false
			})
        	if(this.data.dataSaleLength < 20){
        		that.setData({newhidden: false})
        	}else{
        		that.ajaxList(2,"hottop",function(res){
        			that.setData({wifihidden:true});
        		})
        	}
		}
		
	},
	//人气，销量

	ajaxList: function (nav, sign, fn) {
		var that = this
		switch (nav) {
			case 1:
				var page = that.data.dataHotPage; //热门页数
				break;
			case 2:
				var page = that.data.dataSalePage; //销量页数
				break;
		}
		var ajaxData = {
			sort: sign, //状态值
			p: page // 页码数
		}
       
		util.hotAjax(ajaxData, function (res) {
			//canUseReachBottom = true;//
			// if (res.errMsg.indexOf('fail') > -1) {
			// 	if (failFn) failFn();
			// 	return;
			// }
			var arr = res.data.data

			switch (nav) {
				case 1: //人气100top
					// 获取当前数据进行保存
					var list = that.data.hotList;
					// 然后重新写入数据
					console.log(page)
					if(page==6){
						that.setData({
							hothidden:false
						})
						return false;
					}
					that.setData({
						hotList: list.concat(arr.info), // 存储数据
						dataHotLength: arr.info.length, //请求过来的条数
						dataHotPage: that.data.dataHotPage + 1 // 统计加载次数
					});
					
					break;
				case 2: //销量100top
					var list = that.data.saleList;
					console.log(page)
					if(page==6){
						that.setData({
							salehidden:false
						})
						return false;
					}
					that.setData({
						saleList: list.concat(arr.info),
						dataSaleLength: arr.info.length,
						dataSalePage: that.data.dataSalePage + 1
					});
					break;

			}

		})
	},

})