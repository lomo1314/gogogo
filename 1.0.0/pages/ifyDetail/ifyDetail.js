var util = require('../../utils/util.js'); //AJAX
Page({
	data: {
		winHeight: 0,
		failhidden: true,
		currentTab: 0, // tab切换
		listorder: 0, //价格正序倒序
		page: 1, //当前页面
		hothidden: true, //显示加载更多 loding
		//综合
		dataSyn: [],
		dataSynLength: 0, //请求过来的条数
		dataSynPage: 1, //当前页面
		synhidden: false, // 显示加载更多 loading
		hidden: true, // loading
		wifihidden: false, //网络不可用
		refresh: false,

		ifyName: "", //分类具体
		tagNames: "", //具体选项列表内容
		scrollLeft: "", //横向滚动距离
		screenWidth: '', //设备屏幕宽度
		listhidden: false, // 无数据时
		catalogSelect: 0, //判断是否选中

	},
	onLoad: function (options) {
		var that = this
		/**获取系统信息*/
		wx.getSystemInfo({
			success: function (res) {
				that.setData({
					winHeight: res.windowHeight,
					screenWidth: res.screenWidth
				});
			}
		});
		//console.log(options.id)
		var unit = that.data.screenWidth / 375;
		var cid = options.id
		var indexFrom = options.index
		that.setData({
			ifyName: options.id,
			tagNames: options.name,
			//判断选中 index
			catalogSelect: indexFrom,
		})

		//调用分类数据内容
		util.classifyAjax("", function (res) {
			var arr = res.data;
			that.setData({
				classifyList: arr.data,
				scrollLeft: unit * 75 * (indexFrom), //横向滚动距离
			})
		})
		//进入页面调取数据
		var ajaxData = {
			cid: cid,
			sort: 1, //排序 不填就是默认综合default 1|销量 hot2|价格 3price_asc=价格正序;4price_desc=价格倒叙|5优惠券 low

		}

		that.dataAjax(cid, 1, function () {
			// //如果加载失败--再次加载,再次失败--提示
			that.dataAjax(that.data.ifyName, that.data.page, function () {
				that.setData({
					wifihidden: true
				});
			})
		})
	},
	// 获取滚动条当前位置
	scrolltoupper: function (e) {
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
	goTop: function (e) { // 一键回到顶部
		var that = this
		this.setData({
			topNum: this.data.topNum = 0
		});
	},
	// 点击切换分类数据
	changeTag: function (e) {
		var that = this
		//scrollLeft
		var index = e.currentTarget.dataset.index
		//屏幕宽度计算 移动距离
		var unit = that.data.screenWidth / 375;
		var name = e.currentTarget.dataset.name
		that.setData({
			//判断选中 index
			catalogSelect: index,
			scrollLeft: unit * 75 * (index), //横屏滚动距离
			ifyName: e.currentTarget.dataset.id, // 分类id
			tagNames: name, // 分类名字
			//重选分类，清空已加载数据
			dataSyn: [],
		})

		var ajaxData = {
			cid: e.currentTarget.dataset.id,
			sort: that.data.page,
		}
		//console.log(ajaxData)
		util.ifyList(ajaxData, function (res) {
			var arr = res.data.data
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
					dataSyn: [],
					synhidden: false,
					tagNames: e.currentTarget.dataset.name,
				})
			}
		})

	},
	/**点击tab切换**/
	swichNav: function (e) {
		var that = this;
		//console.log(that.data.ifyName)
		var cur = e.currentTarget.dataset.index //1 2 3 5  规定索引
		var current = e.currentTarget.dataset.current
		//console.log(that.data.currentTab, current)
		//更改样式active
		that.setData({
			currentTab: current,
		})
		//if (that.data.currentTab == current) {
		//第一个综合数据请求
		if (that.data.currentTab == "0") {
			that.setData({
				dataSyn: [],
				dataSynLength: 0,
				dataSynPage: 1,
				wifihidden: false,
				page: 1
			});
			that.dataAjax(that.data.ifyName, cur, function () {
				// //如果加载失败--再次加载,再次失败--提示
				that.dataAjax(that.data.ifyName, that.data.page, function () {
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
			that.dataAjax(that.data.ifyName, cur, function () {
				// //如果加载失败--再次加载,再次失败--提示
				that.dataAjax(that.data.ifyName, that.data.page, function () {
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
			that.dataAjax(that.data.ifyName, cur, function () {
				// //如果加载失败--再次加载,再次失败--提示
				that.dataAjax(that.data.ifyName, that.data.page, function () {
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

				that.dataAjax(that.data.ifyName, cur, function () {
					// //如果加载失败--再次加载,再次失败--提示
					that.dataAjax(that.data.ifyName, that.data.page, function () {
						that.setData({
							wifihidden: true
						});
					})
				})
			} else {
				//console.log(that.data.page+"---------- page3")
				var num = 0;
				var cur = 3;
				that.setData({
					page: 3
				})
				that.dataAjax(that.data.ifyName, cur, function () {
					// //如果加载失败--再次加载,再次失败--提示
					that.dataAjax(that.data.ifyName, that.data.page, function () {
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
		//}
		//else {

		//}
	},
	/**数据请求封装**/
	dataAjax: function (cid, nav, failFn) {
		/*num如果是1的话说明是点击完成的搜索，如果是0的话，是在输入中的搜索*/
		var that = this;
		var page = that.data.dataSynPage; //综合数据
		var ajaxData = {
			cid: cid,
			sort: nav, //排序 不填就是默认综合default 1|销量 hot2|价格 3price_asc=价格正序;4price_desc=价格倒叙|5优惠券 low
			p: page, // 页码数	
		}
		//console.log(cid)
		util.ifyList(ajaxData, function (res) {
			if (res.errMsg.indexOf('fail') > -1) {
				//				that.setData({failhidden:false})
				if (failFn) failFn();
				return;
			}
			var arr = res.data.data;
			//console.log(res)
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
					synhidden: false,
				})

			}
		});
	},

	//产品关联点击更多按钮点击
	offerMore: function () {
		this.setData({
			hidden: true,
			series1: this.data.series
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
			that.dataAjax(that.data.ifyName, that.data.page, function (res) {
				that.setData({
					synhidden: true,
				})
			})
		}

	},


	//图片
	changeIndicatorDots: function (e) {
		this.setData({
			indicatorDots: !this.data.indicatorDots
		})
	},


})