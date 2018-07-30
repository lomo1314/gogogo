//var  util = require( '../../utils/util.js' );//AJAX
// var QR = require("../../utils/qrcode.js");
var app = getApp()
Page({
	data: {
		winHeight: 0,
		dataNews: [
			{
				id: "01",
				show_pic: "0",
				content: "第一个内容"
			},
			{
				id: "02",
				show_pic: "1",
				content: "第二个内容"
			},
			{
				id: "03",
				show_pic: "0",
				content: "第三个内容"
			},
			{
				id: "04",
				show_pic: "0",
				content: "第一个内容"
			},
			{
				id: "05",
				show_pic: "1",
				content: "第二个内容"
			},
			{
				id: "06",
				show_pic: "0",
				content: "第三个内容"
			}
		]
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
	}
})