var util = require('../../utils/util.js'); //AJAX
var app = getApp()
var canUseReachBottom = true;
Page({
	data: {
		/* 页面配置*/
		winWidth: 0,
		winHeight: 0,

		currentTab: 0, // tab切换
		listorder: 0, //价格正序倒序
		page: 1, //当前页面
		/*数据*/
		//新闻
		hidden: true, // loading
		wifihidden: false, //网络不可用
		refresh: false,
		// 分类数据
		classifyList: [], //分类数据
		hotList: [], //热门数据
		//今日上新
		todayList: [],
		dataTodayLength: 0,
		dataTodayPage: 1, //当前页面
		todayhidden: true, // 显示加载更多 loading
		//触底函数判断
		canUseajaxDay: true,
		//广告专辑位置数据
		advertising:[],
		advTotal:"",
	
		nonet: true,
	},
	//	//分享
		onShareAppMessage: function () {
		    return {
		      title: '够好啊',
		    //   desc: '自定义分享描述',
		      path: '/pages/index/index'
		    }
		},
	/** 
	 * 页面初始化
	 * options 为页面跳转所带来的参数
	 */
	onLoad: function (options) {
		var that = this;
		/**获取系统信息*/
		//console.log("5555555------666666")
		//获取手机联网状态
		wx.onNetworkStatusChange(function(res){
			//console.log(res)
			if(res.networkType == "none"){
			  that.setData({nonet: false})
			}else{
			  that.setData({nonet: true})
			}
		  })
	  
		wx.getSystemInfo({
			success: function (res) {
				console.log(res.windowHeight)
				that.setData({
					winWidth: res.windowWidth,
					winHeight: res.windowHeight - 106
				});
			}
		});
		
	  
		//      wx.hideTabBar()
		/**显示loading*/
		that.setData({
			hidden: false
		});
		//调用分类数据内容
		util.classifyAjax("shouye", function (res) {
			var arr = res.data;
			that.setData({
				classifyList: arr.data
			})
		})
		//广告接口数据
		util.advertising(function (res) {
			var arr = res.data
			if(arr.code==200){
				that.setData({
					advertising:arr.data.info,
					advTotal:arr.data.total
				})
			}else if(arr.code==400){
				that.setData({
					advertising:""
				})
			}
			
		})
		//最热商品 接口 
		var horData = {
			sort: "hot",
			p: 1
		}
		//商品接口
		util.hotAjax(horData, function (res) {
			var arr = res.data
			that.setData({
				hotList: arr.data.info,

			})
			if(!arr){
				that.setData({
					failWline:false,
				})
			}

		})
		

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
	
	//今日上新数据
	ajaxDay: function (param, fn) {
		var that = this
		//var todayPage=that.data.dataTodayPage
		//console.log(param)
		var ajaxData = {
			sort: "news",
			p: param
		}
		util.hotAjax(ajaxData, function (res) {
			canUseReachBottom = true; //
			var arr = res.data
			// 获取当前数据进行保存
			var list = that.data.todayList;
			var cont = arr.data.info
			that.setData({
				//todayList: arr.data.info,
				// 然后重新写入数据
				todayList: list.concat(arr.data.info), // 存储数据
				dataTodayLength: arr.data.info.length, //请求过来的条数
				dataTodayPage: that.data.dataTodayPage + 1 // 统计加载次数
			})
		})

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


	/**
	 * 事件处理
	 * scrolltolower 自动加载更多
	 */
	scrolltolower: function (e) {
		var that = this;

		//console.log(that.data.dataTodayLength)
		/* ------------------------- */
		if (!canUseReachBottom) return; //如果触底函数不可用，则不调用网络请求数据
		/* ------------------------- */
		// 加载更多 loading
		that.setData({
			todayhidden: true,
			wifihidden: false
		})
		if (that.data.dataTodayPage == 1) {
			canUseReachBottom = false;
			//console.log(that.data.page + "jjjjjjjj")
			that.ajaxDay(that.data.page, function (res) {
				that.setData({
					todayhidden: true,
					wifihidden: false
				})
			})
		} else {
			canUseReachBottom = false;
			//console.log(that.data.dataTodayPage + "pagessss")
			that.ajaxDay(that.data.dataTodayPage, function (res) {
				that.setData({
					todayhidden: true,
					wifihidden: false
				})
			})
		}

	},
	/**
	 * 滑动切换tab
	 */
	bindChange: function (e) {
		var that = this;
		that.setData({
			currentTab: e.detail.current,
			wifihidden: false
		});
		//如果点击的是价格并且是第一次点击，发送请求
		if (e.detail.current == 2) {
			if (that.data.listorder == 0) {
				that.setData({
					page: 3
				});
			} else {
				that.setData({
					page: 4
				});
			}
			if (that.data.dataMoney.length == 0) {
				that.dataAjax(that.data.page, function () {
					//如果加载失败--再次加载,再次失败--提示
					that.dataAjax(that.data.page, function () {
						that.setData({
							wifihidden: true
						});
					})
				})
			}
		} else {
			//如果点击的是新品并且是第一次点击，发送请求
			that.setData({
				page: e.detail.current + 1
			});
			if (e.detail.current == 1 && that.data.dataNew.length == 0) {
				that.dataAjax(that.data.page, function () {
					//如果加载失败--再次加载,再次失败--提示

					that.dataAjax(that.data.page, function () {
						that.setData({
							wifihidden: true
						});
					})
				})
			} else if (e.detail.current == 0 && that.data.dataHote.length == 0) {
				that.dataAjax(that.data.page, function () {
					//如果加载失败--再次加载,再次失败--提示
					that.dataAjax(that.data.page, function () {
						that.setData({
							wifihidden: true
						});
					})
				})
			}
		}
	},
	/**点击tab切换**/
	swichNav: function (e) {
		var that = this;
		if (this.data.currentTab == e.target.dataset.current) {
			//如果是第三个价钱点击切换单独处理
			if (this.data.currentTab == "2") {
				//重置数据
				that.setData({
					dataMoney: [],
					dataMoneyLength: 0,
					dataMoneyPage: 1,
					wifihidden: false
				});
				//如果点击价格
				if (that.data.listorder == 0) {
					var num = 1;
					that.setData({
						currentTab: e.target.dataset.current,
						page: 4
					})
					that.dataAjax(that.data.page, function () {
						//如果加载失败--再次加载,再次失败--提示
						that.dataAjax(that.data.page, function () {
							that.setData({
								wifihidden: true
							});
						})
					})
				} else {
					var num = 0;
					that.setData({
						currentTab: e.target.dataset.current,
						page: 3
					})
					that.dataAjax(that.data.page, function () {
						//如果加载失败--再次加载,再次失败--提示
						that.dataAjax(that.data.page, function () {
							that.setData({
								wifihidden: true
							});
						})
					})
				}
				that.setData({
					listorder: num
				})
			}
			return false;
		} else {
			that.setData({
				currentTab: e.target.dataset.current,
			})
		}
	},
	/**点击进入搜索页面**/
	searchOpen: function () {
		wx.navigateTo({
			url: '../search/search'
		})
	},
	 // 获取滚动条当前位置
	 scrolltoupper:function(e){
		//console.log(e)
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
	  goTop: function (e) {  // 一键回到顶部
		var that=this
		this.setData({
		  topNum: this.data.topNum = 0
		});
	  },
})