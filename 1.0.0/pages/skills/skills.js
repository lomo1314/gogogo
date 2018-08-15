//var  util = require( '../../utils/util.js' );//AJAX
var QR = require("../../utils/qrcode.js");
var app = getApp()
Page({
	data: {
		//		方法一
		qrcStr: '',
		qrcPhld: '维康云u=1001',
		maskHidden: true,
		imagePath: '',
		//	          方法二
		canvasHidden: true, //设置画板的显示与隐藏，画板不隐藏会影响页面正常显示
		avatarUrl: '', //用户头像
		nickName: '', //用户昵称
		wxappName: app.globalData.wxappName, //小程序名称
		shareImgPath: '',
		screenWidth: '', //设备屏幕宽度
		description: app.globalData.description, //奖品描述
		FilePath: '', //路径

		proTit: '菊花茶菊花茶菊花茶菊花茶'
	},
	canvasId: "qrcCanvas",
	/*页面初始化*/
	//	onLoad:function(){
	//	},

	//方法一
	//	onReady: function() {  
	//	    this.size = this.setCanvasSize();//动态设置画布大小  
	//	    this.createQrCode(this.data.qrcPhld, this.canvasId, this.size.w, this.size.h);  
	//	},
	//	//适配不同屏幕大小的canvas  
	//	setCanvasSize:function(){  
	//	    var size={};  
	//	    try {  
	//	        var res = wx.getSystemInfoSync();  
	//	        var scale = 750/686;//不同屏幕下canvas的适配比例；设计稿是750宽  
	//	        var width = res.windowWidth/scale;  
	//	        var height = width;//canvas画布为正方形  
	//	        size.w = width;  
	//	        size.h = height;  
	//	      } catch (e) {  
	//	        // Do something when catch error  
	//	        console.log("获取设备信息失败"+e);  
	//	      }   
	//	    return size;  
	//	},  
	//	createQrCode:function(str,canvasId,cavW,cavH){  
	//  	//调用插件中的draw方法，绘制二维码图片  
	//	    QR.qrApi.draw(str,canvasId,cavW,cavH);  
	//	  
	//	},
	//	onGenQrc: function(e) {  
	//	    this.createQrCode(this.data.qrcStr, this.canvasId, this.size.w, this.size.h);  
	//	},
	//	onQrcStrBlur: function(e) {  
	//	    this.setData({qrcStr: e.detail.value});  
	//	},
	//	
	//	
	//	


	//方法二
	onLoad: function (options) {
		var that = this
		var userInfo, nickName, avatarUrl
		//获取用户信息，头像，昵称之类的数据
		wx.getUserInfo({
			success: function (res) {
				console.log(res);
				userInfo = res.userInfo
				//            nickName = userInfo.nickName
				avatarUrl = userInfo.avatarUrl
				that.setData({
					avatarUrl: res.userInfo.avatarUrl,
					//                nickName: res.userInfo.nickName,
				})
				wx.downloadFile({
					url: res.userInfo.avatarUrl
				})
			}
		})
		//获取用户设备信息，屏幕宽度
		wx.getSystemInfo({
			success: res => {
				that.setData({
					screenWidth: res.screenWidth
				})
				console.log(that.data.screenWidth)
			}
		})
	},




	//定义的保存图片方法
	saveImageToPhotosAlbum: function () {

		var that = this;
		//设置画板显示，才能开始绘图
		that.setData({
			canvasHidden: false
		})
		var unit = that.data.screenWidth / 375;
		var path1 = "/image/ma_bg3.png"
		var avatarUrl = that.data.avatarUrl
		console.log(avatarUrl + "头像")
		var path2 = "/image/ma_award.png"

		//		      var path2 = "/image/ma_award.png"
		//		      var path3 = "/image/ma_qrcode.png"
		//		      var path4 = "/image/ma_headborder.png"
		//		      var path5 = "/image/ma_border.png"
		//		      var unlight = "/image/ma_unlight.png"
		var proTit = that.data.proTit;
		//		      console.log(nickName + "昵称")
		var context = wx.createCanvasContext('share')
		var description = that.data.description
		//		      var wxappName = "来「 " + that.data.wxappName + " 」试试运气";
		//		      context.drawImage(path1, 0, 0, unit * 375, unit * 462.5)
		//		      //   context.drawImage(path4, unit * 164, unit * 40, unit * 50, unit * 50)
		//		      context.drawImage(path2, unit * 48, unit * 120, unit * 280, unit * 178)
		//		      context.drawImage(path5, unit * 48, unit * 120, unit * 280, unit * 178)
		//		      context.drawImage(unlight, unit * 82, unit * 145, unit * 22, unit * 32)
		//		      context.drawImage(unlight, unit * 178 , unit * 145, unit * 22, unit * 32)
		//		      context.drawImage(unlight, unit * 274, unit * 145, unit * 22, unit * 32)
		//		      context.drawImage(unlight, unit * 82, unit * 240, unit * 22, unit * 32)
		//		      context.drawImage(unlight, unit * 178, unit * 240, unit * 22, unit * 32)
		//		      context.drawImage(unlight, unit * 274, unit * 240, unit * 22, unit * 32)
		//		      context.drawImage(path3, unit * 20, unit * 385, unit * 55, unit * 55)
		//   context.drawImage(path4, 48, 200, 280, 128)
		context.fillStyle = "#FFF";
		context.fillRect(0, 0, unit * 263, unit * 450)
		context.drawImage(path1, 0, 0, unit * 263, unit * 263)
		/**标题**/
		context.setFontSize(14)
		context.setFillStyle("#000")
		context.fillText(proTit, 5, unit * 280)
		/**价格**/
		context.setFontSize(12)
		context.setFillStyle("#FF0000")
		context.fillText('券后价', 5, unit * 300)
		context.setFontSize(16)
		context.fillText('￥200', 5, unit * 320)
		/**价格线条**/
		context.strokeStyle = "#c3c3c3";
		context.moveTo(unit * 70, unit * 320);
		context.lineTo(unit * 90, unit * 290);
		context.stroke();
		context.closePath();
		context.setFontSize(12)
		context.setFillStyle("#8c8c8c")
		context.fillText('在售价', 100, unit * 300)
		context.setFontSize(16)
		context.fillText('￥200', 100, unit * 320)
		/**长按识别图中二维码**/
		context.fillStyle = "#FF0000";
		context.fillRect(unit * 8, unit * 420, 122, 20)
		context.setFontSize(12);
		context.setFillStyle("#fff")
		context.fillText("长按识别图中二维码", unit * 12, unit * 435)
		/**二维码**/
		context.drawImage(path2, unit * 170, unit * 355, 90, 90)

		//把画板内容绘制成图片，并回调 画板图片路径
		context.draw(false, function () {
			wx.canvasToTempFilePath({
				x: 0,
				y: 0,
				width: unit * 375,
				height: unit * 640,
				destWidth: unit * 375,
				destHeight: unit * 640,
				canvasId: 'share',
				success: function (res) {
					that.setData({
						shareImgPath: res.tempFilePath
					})
					if (!res.tempFilePath) {
						wx.showModal({
							title: '提示',
							content: '图片绘制中，请稍后重试',
							showCancel: false
						})
					}
					console.log(that.data.shareImgPath)
					that.setData({
						FilePath: res.tempFilePath
					})
					//画板路径保存成功后，调用方法吧图片保存到用户相册
					//		                  wx.saveImageToPhotosAlbum({
					//		                      filePath: res.tempFilePath,
					//		                      //保存成功失败之后，都要隐藏画板，否则影响界面显示。
					//		                      success: (res) => {
					//		                          console.log(res)
					//		                          wx.hideLoading()
					//		                          that.setData({
					////		                              canvasHidden: true
					//		                          })
					//		                      },
					//		                      fail: (err) => {
					//		                          console.log(err)
					//		                          wx.hideLoading()
					//		                          that.setData({
					////		                              canvasHidden: true
					//		                          })
					//		                      }
					//		                  })
				}
			})
		});
	},

	saveImageToPhotos: function () {
		wx.showLoading({
			title: '保存中...',
		})
		var that = this;
		var FilePath1 = that.data.FilePath
		wx.saveImageToPhotosAlbum({
			filePath: FilePath1,
			//保存成功失败之后，都要隐藏画板，否则影响界面显示。
			success: (res) => {
				console.log(res)
				wx.hideLoading()
				that.setData({
					canvasHidden: true
				})
			},
			fail: (err) => {
				console.log(err)
				wx.hideLoading()
				that.setData({
					canvasHidden: true
				})
			}
		})
	}

})