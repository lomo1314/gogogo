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
		nonet: true,
		showIndex: "",
	},
	onLoad: function (options) {

		var that = this;
		//获取手机联网状态
		wx.onNetworkStatusChange(function (res) {
			console.log(res)
			if (res.networkType == "none") {
				that.setData({
					nonet: false
				})
			} else {
				that.setData({
					nonet: true
				})
			}
		})
		/**获取系统信息*/
		wx.getSystemInfo({
			success: function (res) {
				that.setData({
					winWidth: res.windowWidth,
					winHeight: res.windowHeight - 135
				});
			}
		});
		that.setData({
			showIndex: "hitss"
		})
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

	/**点击tab切换**/
	swichNav: function (e) {
		var that = this;
		var cur = e.currentTarget.dataset.current
		that.setData({
			currentTab: cur,
		})

		if (cur == 0) {
			that.setData({
				hotList: [],
				dataHotLength: 0,
				dataHotPage: 1,
				wifihidden: false,
				showIndex: "hitss"
			})

			that.ajaxList("hitss", function () {
				// //如果加载失败--再次加载,再次失败--提示
				that.ajaxList(dataTOP, function () {
					that.setData({
						wifihidden: true
					});
				})
			})
		} else if (cur == 1) {
			that.setData({
				hotList: [],
				dataHotLength: 0,
				dataHotPage: 1,
				wifihidden: false,
				showIndex: "hottop"
			})

			that.ajaxList("hottop", function () {
				// //如果加载失败--再次加载,再次失败--提示
				that.ajaxList(dataTOP, function () {
					that.setData({
						wifihidden: true
					});
				})
			})
		}

	},
	/**
	 * 事件处理
	 * scrolltolower 自动加载更多
	 */
	scrolltolower: function (e) {
		var that = this;
		if (!canUseReachBottom) return; //如果触底函数不可用，则不调用网络请求数据
		//console.log(that.data.dataSynPage)
		that.setData({
			synhidden: true,
			wifihidden: false
		})

		// 如果加载数据超过10条
		if (this.data.dataHotLength < 10) {
			canUseReachBottom = false;
			that.setData({
				hothidden: false
			})
		} else {
			//console.log(that.data.dataSynPage+"综合页码数",that.data.page)
			/**发送请求数据*/
			canUseReachBottom = false;
			that.ajaxList(that.data.showIndex, function (res) {
				that.setData({
					hothidden: true,
				})
			})
		}

	},
	//人气，销量
	ajaxList: function (sign, fn) {
		var that = this
		var page = that.data.dataHotPage;
		var ajaxData = {
			sort: sign, //状态值
			p: page // 页码数
		}

		util.hotAjax(ajaxData, function (res) {
			canUseReachBottom = true;
			// if (res.errMsg.indexOf('fail') > -1) {
			// 	if (failFn) failFn();
			// 	return;
			// }
			var arr = res.data.data
			console.log(res)
			// 获取当前数据进行保存
			var list = that.data.hotList;
			// 然后重新写入数据
			console.log(page)
			if (page == 6) {
				that.setData({
					hothidden: false
				})
				return false;
			}
			that.setData({
				hotList: list.concat(arr.info), // 存储数据
				dataHotLength: arr.info.length, //请求过来的条数
				dataHotPage: that.data.dataHotPage + 1 // 统计加载次数
			});

		})
	},
	// 获取滚动条当前位置
	scrolltoupper: function (e) {
		//console.log(e.detail.scrollTop)
		if (e.detail.scrollTop > 100) {
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
	goTop: function (e) { // 一键回到顶部
		var that = this
		that.setData({
			topNum: that.data.topNum = 0
		});
	},
})