var util = require('../../../utils/util.js'); //AJAX
// var QR = require("../../utils/qrcode.js");
var app = getApp()
Page({
	data: {
		winHeight: 0,
		classHidden: true, //全部分类列表
		stateHidden: true, //全部状态
		dataCols: [],
		startX: 0, //开始坐标
		startY: 0
	},

	onLoad: function (options) {

		var that = this;

		/**获取系统信息*/
		wx.getSystemInfo({
			success: function (res) {
				that.setData({
					winWidth: res.windowWidth,
					winHeight: res.windowHeight - 38
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
			console.log(arr)
			that.setData({
				dataCols: arr.data.info
			})
		})

	},
	//手指触摸动作开始 记录起点X坐标
	touchstart: function (e) {
		var that=this
		//console.log(e.changedTouches[0].clientX,e.changedTouches[0].clientY)
		//开始触摸时 重置所有删除
		that.data.dataCols.forEach(function (v, i) {
			if (v.isTouchMove) //只操作为true的
				v.isTouchMove = false;
		})
		that.setData({
			startX: e.changedTouches[0].clientX,
			startY: e.changedTouches[0].clientY,
			//dataCols: this.data.dataCols
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
		var that=this
		
		// console.log(e.target.dataset.numid)
		var num_iid=e.target.dataset.numid;
		var ajaxDeta={
			num_iid:num_iid, //商品id
			type:2, //删除状态
		}
		util.collectAjax(ajaxDeta,function (res) { 
			//console.log(res)
		 })
		//获取列表中要删除项的下标
		var index = e.target.dataset.index;
		//console.log(index)
		var dataCols = this.data.dataCols;
		//移除列表中下标为index的项
		dataCols.splice(index,1);
		console.log(dataCols)
		that.setData({
			dataCols: that.data.dataCols
		})
	
	},
	//获取收藏列表
	
})