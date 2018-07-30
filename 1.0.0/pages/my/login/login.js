var util = require( '../../../utils/util.js' );//AJAX
var app = getApp()
Page( {
    data: {
        /* 页面配置*/
        promptInfo:'',//点击登录提示
        promptHid:true,//点击登录提示显示状态
        loginBtn:false,//登录是否可点击
        userHave:false,//用户名是否有内容
        passwordHave:false//密码是否有内容
    },
//	//分享
//	onShareAppMessage: function () {
//	    return {
//	      title: '手机中国',
//	      desc: '自定义分享描述',
//	      path: '/pages/index/index'
//	    }
//	},
    /** 
     * 页面初始化
     * options 为页面跳转所带来的参数
     */
    onLoad: function( options ) {
	    console.log('onLoad')
	    var that = this
	    //调用应用实例的方法获取全局数据
	    app.getUserInfo(function(userInfo){
	      //更新数据
	      that.setData({
	        userInfo:userInfo
	      })
	    })
    },
    onReady: function() {
    	  // 页面渲染完成
//      var that = this;
//      // 数据加载完成后 延迟隐藏loading
//      setTimeout( function() {
//          that.setData( {
//              hidden: true
//          })
//      }, 500);
    },
    //form表单提交事件
    formSubmit: function(e) {
    	var that = this;
    	//设置登录按钮不可点防止重复点击
    	that.setData({
        	loginBtn:true
    	})
//	    console.log('form发生了submit事件，携带数据为：', e.detail.value)
		//发起ajax请求
		var ajaxData = e.detail.value;
		//后台提供的密码部分接口需要修改的参数
		ajaxData.apic = 'Weicode';
		util.AJAX( ajaxData, function( res ) {
			
			//失败
			if(res.errMsg.indexOf('fail')>-1){
				that.setData({
//              	promptInfo: '登录失败',
                	promptHid:false
            	})
				//提示错误
				wx.showToast({
				  title: '登录失败',
				  icon: 'none',
				  duration: 2000
				})
				return;
			}
			//登录错误---显示内容后台提供
			if(res.data==""){
				
				that.setData({
//              	promptInfo: '用户名或密码错误',
                	promptHid:false
            	});
            	//提示错误
            	wx.showToast({
				  title: '用户名或密码错误',
				  icon: 'none',
				  duration: 2000
				})
			}else{
				//成功
				
			}
		})
	},
	//键盘输入时
    bindKeyInput:function(e){
    	console.log(e)
    	var that=this;
    	var id=e.target.id
    	var value = e.detail.value;
    	//判断输入的是什么，分别计算value是否为空，
    	if(id=='user'){
			that.setData({
	            userHave:value!=''?true:false
	        })
    	}
    	if(id=='password'){
    		that.setData({
	            passwordHave:value!=''?true:false
	        })
    	}
    },
    /**页面显示*/
    onShow: function() {
    	
    }
})


	

