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
		// 销量数据
		saleList: [],
		dataSaleLength: 0, //数据条数 hottop
		dataSalePage: 1, //当前页面
		salehidden: true, // 显示加载更多 loading

		// 价格数据
		dataMoney: [],
		dataMoneyLength: 0, //请求过来的条数
		dataMoneyPage: 1, //当前页面
		moneyhidden: true, // 显示加载更多 loading
		// 优惠券数据
		dataRoll: [],
		dataRollLength: 0, //请求过来的条数
		dataRollPage: 1, //当前页面
		rollhidden: true, // 显示加载更多 loading

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
			
		})
		wx.showToast({
			title: '加载中',
			icon: 'loading',
			duration: 10000
		})

		that.dataAjax(value, 1, function (res) {
			//如果失败再次发送请求
			that.dataAjax(value, 1, function () {
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
		if (that.data.page == 1) {
			// 加载更多 loading
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
				that.dataAjax(that.data.value,that.data.page, function (res) {
					that.setData({
						wifihidden: true
					});
				})
			}
		} else if (that.data.page == 2) {
			//销量
			that.setData({
				salehidden: true,
				wifihidden: false
			})
			if (this.data.dataSaleLength < 10) {
				that.setData({
					salehidden: false
				})
			} else {
				that.dataAjax(that.data.value,that.data.page, function (res) {
					that.setData({
						wifihidden: true
					});
				})
			}
		} else if(that.data.page == 5) {
			//优惠券
			that.setData({
				rollhidden: true,
				wifihidden: false
			})
			if (this.data.dataRollLength < 10) {
				that.setData({
					rollhidden: false
				})
			} else {
				that.dataAjax(that.data.value,that.data.page, function (res) {
					that.setData({
						wifihidden: true
					});
				})
			}
		}else{
			that.setData({
				//价格变量
				moneyhidden: true,
				wifihidden: false
			})
			if (this.data.dataMoneyLength < 10) {
				that.setData({
					moneyhidden: false
				})
			} else {
				that.dataAjax(that.data.value,that.data.page, function (res) {
					that.setData({
						wifihidden: true
					});
				})
			}
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
			//console.log(that.data.page + "wwwwwwwww")
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
				
				that.dataAjax(that.data.value,that.data.page, function () {
					//如果加载失败--再次加载,再次失败--提示
					that.dataAjax(that.data.value,that.data.page, function () {
						that.setData({
							wifihidden: true
						});
					})
				})
			}
		} else if(e.detail.current == 1) {
			//console.log(that.data.page + "第二板块销量")
			//如果点击的是销量并且是第一次点击，发送请求
			that.setData({
				page: e.detail.current + 1
			});
			if (e.detail.current == 1 && that.data.saleList.length == 0) {
				
				that.dataAjax(that.data.value,that.data.page, function () {
					//如果加载失败--再次加载,再次失败--提示

					that.dataAjax(that.data.value,that.data.page, function () {
						that.setData({
							wifihidden: true
						});
					})
				})
			} 
		}
		else if (e.detail.current == 0 && that.data.dataSyn.length == 0) {
			//console.log("综合")
			that.dataAjax(that.data.value,that.data.page, function () {
				//如果加载失败--再次加载,再次失败--提示
				that.dataAjax(that.data.value,that.data.page, function () {
					that.setData({
						wifihidden: true
					});
				})
			})
		}else if(e.detail.current == 3&& that.data.dataRoll.length == 0){
			//优惠券
			that.setData({
				page: 5
			});
			//console.log("优惠券"+that.data.page)
			that.dataAjax(that.data.value,that.data.page, function () {
				//如果加载失败--再次加载,再次失败--提示
				that.dataAjax(that.data.value,that.data.page, function () {
					that.setData({
						wifihidden: true
					});
				})
			})
		}
	},
	/**点击tab切换**/
	swichNav: function (e) {
		var that = this;
		//console.log(this.data.currentTab)
		var cur= e.currentTarget.dataset.current
		if (this.data.currentTab ==cur) {
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
						currentTab: cur,
						page: 4
					})
					that.dataAjax(that.data.value,that.data.page, function () {
						//如果加载失败--再次加载,再次失败--提示
						that.dataAjax(that.data.value,that.data.page, function () {
							that.setData({
								wifihidden: true
							});
						})
					})
				} else {
					var num = 0;
					that.setData({
						currentTab: cur,
						page: 3
					})
					that.dataAjax(that.data.value,that.data.page, function () {
						//如果加载失败--再次加载,再次失败--提示
						that.dataAjax(that.data.value,that.data.page, function () {
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
				currentTab: cur,
			})
		}
	},
	/**数据请求封装**/
	dataAjax: function (val, nav,page_size, failFn) {
		/*num如果是1的话说明是点击完成的搜索，如果是0的话，是在输入中的搜索*/
		// 
		var that = this;
		switch (nav) {
			case 1:
				var page = that.data.dataSynPage; //综合数据
				break;
			case 2:
				var page = that.data.dataSalePage; //销量数据
				break;
			case 3:
				var page = that.data.dataMoneyPage; //价格数据
				break;
			case 4:
				var page = that.data.dataMoneyPage; //价格数据
				break;
			case 5:
				var page = that.data.dataRollPage; // 优惠券数据
				break;
		}
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
			switch (nav) {
				case 1: //综合
					// 获取当前数据进行保存
					var list = that.data.dataSyn;
					// 然后重新写入数据
					that.setData({
						dataSyn: list.concat(arr.info), // 存储数据
						dataSynLength: arr.info.length, //请求过来的条数
						dataSynPage: that.data.dataSynPage + 1 // 统计加载次数
					});
					break;
				case 2: //销量
					var list = that.data.saleList;
					that.setData({
						saleList: list.concat(arr.info),
						dataSaleLength: arr.info.length,
						dataSalePage: that.data.dataSalePage + 1
					});
					break;
				case 3: //价格高到低						
					var list = that.data.dataMoney;
					that.setData({
						dataMoney: list.concat(arr.info),
						dataMoneyLength: arr.info.length,
						dataMoneyPage: that.data.dataMoneyPage + 1
					});
					break;
				case 4: //价格低到高
					var list = that.data.dataMoney;
					that.setData({
						dataMoney: list.concat(arr.info),
						dataMoneyLength: arr.info.length,
						dataMoneyPage: that.data.dataMoneyPage + 1
					});
					break;
				case 5: //优惠券
					var list = that.data.dataRoll;
					that.setData({
						dataRoll: list.concat(arr.info),
						dataRollLength: arr.info.length,
						dataRollPage: that.data.dataRollPage + 1
					});
					break;
			}

		});
	}
})