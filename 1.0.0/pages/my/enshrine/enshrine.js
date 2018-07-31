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
			console.log(index,touchMoveX,touchMoveY)
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
		this.data.dataCols.splice(e.currentTarget.dataset.index, 1)
		this.setData({
			dataCols: this.data.dataCols
		})
	},
	//获取收藏列表
	// //手指刚放到屏幕触发
	// touchS:function(e){
	// 	console.log(e);
	//    //判断是否只有一个触摸点
	// 	if(e.touches.length==1){
	// 	  this.setData({
	// 		//记录触摸起始位置的X坐标
	// 		startX:e.touches[0].clientX
	// 	  });
	// 	}
	//   },
	//  //触摸时触发，手指在屏幕上每移动一次，触发一次
	//   touchM:function(e){
	// 	  console.log(e);
	// 	var that = this
	// 	if(e.touches.length==1){
	// 	 //记录触摸点位置的X坐标
	// 	  var moveX = e.touches[0].clientX;
	// 	  //计算手指起始点的X坐标与当前触摸点的X坐标的差值
	// 	  var disX = that.data.startX - moveX;
	// 	 //delBtnWidth 为右侧按钮区域的宽度
	// 	  var delBtnWidth = that.data.delBtnWidth;
	// 	  var txtStyle = "";
	// 	  if(disX == 0 || disX < 0){//如果移动距离小于等于0，文本层位置不变
	// 		txtStyle = "left:0px";
	// 	  }else if(disX > 0 ){//移动距离大于0，文本层left值等于手指移动距离
	// 		txtStyle = "left:-"+disX+"px";
	// 		if(disX>=delBtnWidth){
	// 		  //控制手指移动距离最大值为删除按钮的宽度
	// 		  txtStyle = "left:-"+delBtnWidth+"px";
	// 		}
	// 	  }
	// 	  //获取手指触摸的是哪一个item
	// 	  var index = e.currentTarget.dataset.index;
	// 	  var list = that.data.addressList;
	// 	  //将拼接好的样式设置到当前item中
	// 	  list[index].txtStyle = txtStyle; 
	// 	  //更新列表的状态
	// 	  this.setData({
	// 	   addressList:list
	// 	  });
	// 	}
	//   },
	//   touchE:function(e){
	// 	  console.log(e);
	// 	var that = this
	// 	if(e.changedTouches.length==1){
	// 	  //手指移动结束后触摸点位置的X坐标
	// 	  var endX = e.changedTouches[0].clientX;
	// 	  //触摸开始与结束，手指移动的距离
	// 	  var disX = that.data.startX - endX;
	// 	  var delBtnWidth = that.data.delBtnWidth;
	// 	  //如果距离小于删除按钮的1/2，不显示删除按钮
	// 	  var txtStyle = disX > delBtnWidth/2 ? "left:-"+delBtnWidth+"px":"left:0px";
	// 	  //获取手指触摸的是哪一项
	// 	  var index = e.currentTarget.dataset.index;
	// 	  var list = that.data.addressList;
	// 	  list[index].txtStyle = txtStyle; 
	// 	  //更新列表的状态
	// 	  that.setData({
	// 	   addressList:list
	// 	  });
	// 	}
	//   }


})