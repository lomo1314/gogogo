var util = require( '../../../utils/util.js' );//AJAX
var app = getApp()
Page( {
    data: {
        /* 页面配置*/
        storageSize:'',//本地缓存大小
        checkedIndex:false,//首页刷新按钮开关
        index:0,
        array: ['手机蓝', '简约白'],
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
	    var that = this
	    //调用应用实例的方法获取全局数据
	    app.getUserInfo(function(userInfo){
	      //更新数据
	      that.setData({
	        userInfo:userInfo
	      })
	    });
	    
	    //修改模式选项
        var num = wx.getStorageSync('model')||0;
	    this.setData({
	      index:num
	    })
	    //修改导航颜色
        var color = app.globalVar.barClolor
	    wx.setNavigationBarColor({
		    frontColor: color[0],
		    backgroundColor: color[1],
		})
    },
    onReady: function() {
    	// 页面渲染完成
        var that = this;
//      // 数据加载完成后 延迟隐藏loading
//      setTimeout( function() {
//          that.setData( {
//              hidden: true
//          })
//      }, 500);
		//获取本地缓存信息
		wx.getStorageInfo({
		  success: function(res) {
		    that.setData( {
                storageSize: res.currentSize
            })
		  }
		})
		
		//获取本地缓存，设置默认数据
		var refresh = wx.getStorageSync('refresh') || false;
		that.setData( {
            checkedIndex: refresh
        })
    },
    //清理缓存
    clearStorage:function(){
    	var that=this;
    	//提示
    	wx.showToast({
		  title: '清理完成',
		  icon: 'success',
		  duration: 2000,
		  success:function(){
		  	wx.clearStorage();
		  	that.setData( {
	            storageSize: '0'
	        })
		  }
		})
    },
    //改变按钮
    switchChange: function(e) {
    	var that = this;
    	
	},
	/**首页刷新按钮*/
    changeIndex:function(e){
    	wx.setStorageSync('refresh', e.detail.value)
    },
    /**主题模式*/
	bindPickerModel: function(e) {
	    var num = e.detail.value;
	    var color,bgColor;
	    this.setData({
	      index: e.detail.value
	    })
	    if(num==0){
	    	//蓝色
	    	color='#ffffff';
	    	bgColor="#1472e0"
	    }else{
	    	//白色
	    	color='#000000';
	    	bgColor="#fff"
	    };
	    //设置本地缓存
	    wx.setStorageSync('model', e.detail.value);
	    //修改导航颜色
	    app.globalVar.barClolor[0]=color;
	    app.globalVar.barClolor[1]=bgColor;
	    wx.setNavigationBarColor({
		    frontColor: color,
		    backgroundColor: bgColor,
		})
	},
	/**页面显示*/
    onShow: function() {
        //修改模式选项
        var num = wx.getStorageSync('model')||0;
	    this.setData({
	      index:num
	    })
	    //修改导航颜色
        var color = app.globalVar.barClolor
	    wx.setNavigationBarColor({
		    frontColor: color[0],
		    backgroundColor: color[1],
		})
    }
})


	

