var util = require('../../utils/util.js'); //AJAX
Page({
	data: {
		hidden: true,
		inputValue: "",
		listhidden: false, //未搜索到
		searhhidden: false, //页面显示
		//		loadinghidden:true//加载中
		failhidden: true,
		
		//搜索完毕展示
		hiddenCon: true,
		/* 页面配置*/
		winWidth: 0,
		winHeight: 0,
        
		currentTab: 0, // tab切换
		listorder: 0, //价格正序倒序
		page: 1, //当前页面
		//当前搜索关键词
		value:"",
        hothidden:true, //显示加载更多 loding
		//综合
		dataSyn: [],
		dataSynLength: 0, //请求过来的条数
		dataSynPage: 1, //当前页面
		synhidden: true, // 显示加载更多 loading
		hidden: true, // loading
		wifihidden: false, //网络不可用
		refresh: false
	},
	/*页面初始化*/
	onLoad: function () {
		var that = this;
		/**获取系统信息*/
		wx.getSystemInfo({
			success: function (res) {
				that.setData({
					winWidth: res.windowWidth,
					winHeight: res.windowHeight - 180
				});
			}
		});
	},
	//开始输入内容
	bindKeyInput: function (e) {
		var that = this;
		var value = e.detail.value.replace(/(^\s*)|(\s*$)/g, "");
		if (value == "") return;
		//that.dataAjax(value, 1)
	},

	//点击完成按钮
	bindconfirm: function (e) {
		var that = this;
		var value = e.detail.value.replace(/(^\s*)|(\s*$)/g, "");
		that.data.value=value;
		if (value == "") return;
		that.setData({
			failhidden: true,
			hidden: true,
			hiddenCon: false,
			dataSyn:[], //清空数据
			
		})
		wx.showToast({
			title: '加载中',
			icon: 'loading',
			duration: 10000
		})
        
		that.dataAjax(value, that.data.page, function (res) {
			//如果失败再次发送请求
			that.dataAjax(value, that.data.page, function () {
				wx.hideToast()
				that.setData({
					failhidden: false,
					searhhidden: true
				})
			})
		})
	},
	//点击取消按钮
	navigateBack: function () {
		wx.navigateBack()
	},
	//点击删除搜索按钮
	searchClose: function () {
		this.setData({
			hidden: true,
			//datalistInput: [],
			//searhhidden: true,
			//datalist: []
		})
		wx.hideToast()
	},
	
	/**
	 * 事件处理
	 * scrollUpper 自动加载更多
	 */
	scrollUpper: function (e) {
		var that = this;
		//console.log(that.data.dataSynPage)
		that.setData({
			synhidden: true,
			wifihidden: false
		})

		// 如果加载数据超过10条
		if (this.data.dataSynLength < 10) {
			that.setData({
				synhidden: false
			})
		} else {
			//console.log(that.data.dataSynPage+"综合页码数",that.data.page)
			/**发送请求数据*/
			that.dataAjax(that.data.value, that.data.page, function (res) {
				that.setData({
					synhidden: true,
				})
			})
		}
	},

	/**点击tab切换**/
	swichNav: function (e) {
		var that = this;
		var cur = e.currentTarget.dataset.index //1 2 3 5  规定索引
		var current = e.currentTarget.dataset.current
		that.setData({
			currentTab: current,
		})
		//第一个综合数据请求
		if (that.data.currentTab == "0") {
			that.setData({
				dataSyn: [],
				dataSynLength: 0,
				dataSynPage: 1,
				wifihidden: false,
				page: 1
			});
			that.dataAjax(that.data.value, cur, function () {
				// //如果加载失败--再次加载,再次失败--提示
				that.dataAjax(that.data.value, that.data.page, function () {
					that.setData({
						wifihidden: true
					});
				})
			})
		}
		//第二个销量请求
		else if (that.data.currentTab == "1") {
			that.setData({
				dataSyn: [],
				dataSynLength: 0,
				dataSynPage: 1,
				wifihidden: false,
				page: 2
			});
			that.dataAjax(that.data.value, cur, function () {
				// //如果加载失败--再次加载,再次失败--提示
				that.dataAjax(that.data.value, that.data.page, function () {
					that.setData({
						wifihidden: true
					});
				})
			})
		}
		// 最后一个， 优惠券 数据请求
		else if (that.data.currentTab == "3") {
			that.setData({
				dataSyn: [],
				dataSynLength: 0,
				dataSynPage: 1,
				wifihidden: false,
				page: 5
			});
			that.dataAjax(that.data.value, cur, function () {
				// //如果加载失败--再次加载,再次失败--提示
				that.dataAjax(that.data.value, that.data.page, function () {
					that.setData({
						wifihidden: true
					});
				})
			})
		}

		//如果是第三个价钱点击切换单独处理
		if (that.data.currentTab == "2") {
			//重置数据

			that.setData({
				dataSyn: [],
				dataSynLength: 0,
				dataSynPage: 1,
				wifihidden: false
			});
			//如果点击价格
			if (that.data.listorder == 0) {
				//console.log(that.data.page+"---------- page4")
				var num = 1;
				var cur = 4;
				that.setData({
					page: 4
				})

				that.dataAjax(that.data.value, cur, function () {
					// //如果加载失败--再次加载,再次失败--提示
					that.dataAjax(that.data.value, that.data.page, function () {
						that.setData({
							wifihidden: true
						});
					})
				})
			} else {
				
				var num = 0;
				var cur = 3;
				that.setData({
					page: 3
				})
				that.dataAjax(that.data.value, cur, function () {
					// //如果加载失败--再次加载,再次失败--提示
					that.dataAjax(that.data.value, that.data.page, function () {
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
		// if (this.data.currentTab ==cur) {
		// 	//如果是第三个价钱点击切换单独处理
		// 	if (this.data.currentTab == "2") {
		// 		//重置数据
		// 		that.setData({
		// 			dataMoney: [],
		// 			dataMoneyLength: 0,
		// 			dataMoneyPage: 1,
		// 			wifihidden: false
		// 		});
		// 		//如果点击价格
		// 		if (that.data.listorder == 0) {
		// 			var num = 1;
		// 			that.setData({
		// 				currentTab: cur,
		// 				page: 4
		// 			})
		// 			that.dataAjax(that.data.value,that.data.page, function () {
		// 				//如果加载失败--再次加载,再次失败--提示
		// 				that.dataAjax(that.data.value,that.data.page, function () {
		// 					that.setData({
		// 						wifihidden: true
		// 					});
		// 				})
		// 			})
		// 		} else {
		// 			var num = 0;
		// 			that.setData({
		// 				currentTab: cur,
		// 				page: 3
		// 			})
		// 			that.dataAjax(that.data.value,that.data.page, function () {
		// 				//如果加载失败--再次加载,再次失败--提示
		// 				that.dataAjax(that.data.value,that.data.page, function () {
		// 					that.setData({
		// 						wifihidden: true
		// 					});
		// 				})
		// 			})
		// 		}
		// 		that.setData({
		// 			listorder: num
		// 		})
		// 	}
		// 	return false;
		// } 
	},
	/**数据请求封装**/
	dataAjax: function (val, nav,page_size, failFn) {
		/*num如果是1的话说明是点击完成的搜索，如果是0的话，是在输入中的搜索*/
		// 
		var that = this;
		// switch (nav) {
		// 	case 1:
		// 		var page = that.data.dataSynPage; //综合数据
		// 		break;
		// 	case 2:
		// 		var page = that.data.dataSalePage; //销量数据
		// 		break;
		// 	case 3:
		// 		var page = that.data.dataMoneyPage; //价格数据
		// 		break;
		// 	case 4:
		// 		var page = that.data.dataMoneyPage; //价格数据
		// 		break;
		// 	case 5:
		// 		var page = that.data.dataRollPage; // 优惠券数据
		// 		break;

		// }
		var page = that.data.dataSynPage; //综合数据
		var ajaxData = {
			keyword: val, //关键字
			sort: nav, //排序 不填就是默认综合default 1|销量 hot2|价格 3price_asc=价格正序;4price_desc=价格倒叙|5优惠券 low
			page: page, // 页码数
			page_size: "" //不填默认为十条
		}
		util.seekAjax(ajaxData, function (res) {
			if (res.errMsg.indexOf('fail') > -1) {
				//				that.setData({failhidden:false})
				if (failFn) failFn();
				return;
			}
			var arr = res.data.data;
			console.log(res.data.code)
			wx.hideToast();
			var arr = res.data.data;
			if (res.data.code == 200) {
				var list = that.data.dataSyn;
				// 然后重新写入数据
				that.setData({
					dataSyn: list.concat(arr.info), // 存储数据
					dataSynLength: arr.info.length, //请求过来的条数
					dataSynPage: that.data.dataSynPage + 1 // 统计加载次数
				});
			} else if (res.data.code == 400) {
				that.setData({
					synhidden:false,
				})
				
			}
			// switch (nav) {
			// 	case 1: //综合
			// 		// 获取当前数据进行保存
			// 		var list = that.data.dataSyn;
			// 		// 然后重新写入数据
			// 		that.setData({
			// 			dataSyn: list.concat(arr.info), // 存储数据
			// 			dataSynLength: arr.info.length, //请求过来的条数
			// 			dataSynPage: that.data.dataSynPage + 1 // 统计加载次数
			// 		});
			// 		break;
			// 	case 2: //销量
			// 		var list = that.data.saleList;
			// 		that.setData({
			// 			saleList: list.concat(arr.info),
			// 			dataSaleLength: arr.info.length,
			// 			dataSalePage: that.data.dataSalePage + 1
			// 		});
			// 		break;
			// 	case 3: //价格高到低						
			// 		var list = that.data.dataMoney;
			// 		that.setData({
			// 			dataMoney: list.concat(arr.info),
			// 			dataMoneyLength: arr.info.length,
			// 			dataMoneyPage: that.data.dataMoneyPage + 1
			// 		});
			// 		break;
			// 	case 4: //价格低到高
			// 		var list = that.data.dataMoney;
			// 		that.setData({
			// 			dataMoney: list.concat(arr.info),
			// 			dataMoneyLength: arr.info.length,
			// 			dataMoneyPage: that.data.dataMoneyPage + 1
			// 		});
			// 		break;
			// 	case 5: //优惠券
			// 		var list = that.data.dataRoll;
			// 		that.setData({
			// 			dataRoll: list.concat(arr.info),
			// 			dataRollLength: arr.info.length,
			// 			dataRollPage: that.data.dataRollPage + 1
			// 		});
			// 		break;
			// }

		});
	},

	
})