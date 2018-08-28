var util = require('../../../utils/util.js'); //AJAX
// var QR = require("../../utils/qrcode.js");
var app = getApp()
Page({
	data: {
		winHeight: 0,
		classHidden: true, //全部分类列表
		stateHidden: true, //全部状态
		dataCols: [], //收藏商品
		cateMore: [], //收藏商品分类
		startX: 0, //开始坐标
		startY: 0,
		enlisbg: "",
		enlisbg01: "",
		allIfy: "全部类目",
		allstat: "全部状态",
		hiddenTips: true, //如果没有数据展示判断
		nonet: true,
	},

	onLoad: function (options) {
		var token = wx.getStorageSync('token') || [];
		var that = this;
		//获取手机联网状态
		if (token == "") {
			console.log(123)
			that.setData({
				nonet: false,
			})
			return false;
		}
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
					winHeight: res.windowHeight - 108
				});
			}
		});
		var ajaxDeta = {
			page: "", //页码数
			cate_id: "", //分类id
			status: 1, // 1为在售 2失效
		};
		//获取收藏列表
		util.collList(ajaxDeta, function (res) {
			var arr = res.data
			//arr.data.info
			console.log(arr.data.cate)
			that.setData({
				dataCols: arr.data.info, //产品数据
				cateMore: arr.data.cate // 产品分类
			})
		})

	},
	//手指触摸动作开始 记录起点X坐标
	touchstart: function (e) {
		var that = this
		//console.log(e.changedTouches[0].clientX,e.changedTouches[0].clientY)
		//开始触摸时 重置所有删除
		that.data.dataCols.forEach(function (v, i) {
			if (v.isTouchMove) //只操作为true的
				v.isTouchMove = false;
		})
		that.setData({
			startX: e.changedTouches[0].clientX,
			startY: e.changedTouches[0].clientY,
			dataCols: this.data.dataCols
		})
	},
	//滑动事件处理
	touchmove: function (e) {
		var that = this,
			index = e.currentTarget.dataset.index, //当前索引
			startX = that.data.startX, //开始X坐标
			startY = that.data.startY, //开始Y坐标
			touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
			touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标

			//获取滑动角度
			angle = that.angle({
				X: startX,
				Y: startY
			}, {
				X: touchMoveX,
				Y: touchMoveY
			});

		that.data.dataCols.forEach(function (v, i) {
			v.isTouchMove = false
			//滑动超过30度角 return
			if (Math.abs(angle) > 30) return;
			if (i == index) {
				if (touchMoveX > startX) //右滑
					v.isTouchMove = false
				else //左滑
					v.isTouchMove = true
			}
		})
		//更新数据
		that.setData({
			dataCols: that.data.dataCols
		})
	},
	/**
	 * 计算滑动角度
	 * @param {Object} start 起点坐标
	 * @param {Object} end 终点坐标
	 */
	angle: function (start, end) {
		var _X = end.X - start.X,
			_Y = end.Y - start.Y
		//返回角度 /Math.atan()返回数字的反正切值
		return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
	},
	//删除事件
	del: function (e) {
		var that = this

		// console.log(e.target.dataset.numid)
		var num_iid = e.target.dataset.numid;
		var ajaxDeta = {
			num_iid: num_iid, //商品id
			type: 2, //删除状态
		}
		util.collectAjax(ajaxDeta, function (res) {
			//console.log(res)
		})
		//获取列表中要删除项的下标
		var index = e.target.dataset.index;
		//console.log(index)
		var dataCols = this.data.dataCols;
		//移除列表中下标为index的项
		dataCols.splice(index, 1);
		that.setData({
			dataCols: that.data.dataCols
		})

	},
	//分享时间
	//转发分享按钮
	onShareAppMessage: function (res) {
		var that = this
		//console.log(res)
		var id, num_iid, imageUrl, title
		if (res.from === 'button') {
			// 来自页面内转发按钮
			//console.log(res.target)
			title = res.target.dataset.title
			id = res.target.dataset.id
			num_iid = res.target.dataset.num_iid
			imageUrl = res.target.dataset.url
		}
		return {
			title: title,
			path: '/pages/matter/matter?id=' + id + '&&num_iid=' + num_iid,
			imageUrl: imageUrl
		}
		//更新数据
		// that.setData({
		// 	dataCols: that.data.dataCols
		// })
	},

	//   返回上一页
	navigateBack: function () {
		var self = this;
		var pages = getCurrentPages();
		wx.navigateBack({
			changed: true
		}); //返回上一页
	},
	//点击出下拉菜单
	showTips: function () {
		var that = this
		that.setData({
			enlisbg01: "", //第er个下拉框收起
			stateHidden: true,
		})
		if (that.data.enlisbg == "") {
			that.setData({
				classHidden: false,
				enlisbg: "enlisbg"
			})
		} else {
			that.setData({
				classHidden: true,
				enlisbg: ""
			})
		}

	},
	//点击下来菜单 全部分类
	showTips02: function () {
		var that = this
		that.setData({
			enlisbg: "", //第一个下拉框收起
			classHidden: true,
		})
		if (that.data.enlisbg01 == "") {
			that.setData({
				stateHidden: false,
				enlisbg01: "enlisbg",

			})
		} else {
			that.setData({
				stateHidden: true,
				enlisbg01: ""
			})
		}

	},

	//点击筛选收藏产品种类
	filtrate: function (e) {
		var that = this
		//console.log(e.target);
		var cate_id = e.target.dataset.id
		that.setData({
			allIfy: e.target.dataset.name //选中商品种类
		})
		var ajaxDeta = {
			page: "", //页码数
			cate_id: cate_id, //分类id
			status: 1, // 1为在售 2失效
		};
		//获取收藏列表
		util.collList(ajaxDeta, function (res) {
			var arr = res.data
			that.setData({
				dataCols: arr.data.info, //产品数据
				cateMore: arr.data.cate, // 产品分类
				enlisbg: "",
				classHidden: true,
			})
		})
	},
	//点击筛选状态
	status: function (e) {
		var that = this

		var statIng = e.target.dataset.stat
		var statuName = e.target.dataset.name

		that.setData({
			allstat: statuName //选中商品种类
		})
		var ajaxDeta = {
			page: "", //页码数
			status: statIng, // 1为在售 2失效
		};
		//获取收藏列表
		util.collList(ajaxDeta, function (res) {
			var arr = res.data
			console.log(arr)
			if (arr.code == 400) {
				that.setData({
					enlisbg01: "",
					stateHidden: true,
					hiddenTips: false
				})
			} else if (arr.code == 200) {
				that.setData({
					hiddenTips: true,
					dataCols: arr.data.info, //产品数据
					cateMore: arr.data.cate, // 产品分类
					enlisbg01: "",
					stateHidden: true,
				})
			}

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