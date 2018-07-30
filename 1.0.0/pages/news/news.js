
var  util = require( '../../utils/util.js' );//AJAX
var app = getApp()
Page( {
    data: {
        /* 页面配置*/
       newsText:[]
    },
//	//分享
	onShareAppMessage: function () {
	    return {
	      title: '手机中国',
	      desc: '自定义分享描述',
	      path: '/pages/index/index'
	    }
	},
    /** 
     * 页面初始化
     * options 为页面跳转所带来的参数
     */
    onLoad:function(options){
    	//重新设置标题
    	wx.setNavigationBarTitle({
		  title: '新闻详情'
		})
    	
    	//数据请求
    	var that = this;
        var id = options.id;
        var ajaxData = {      
        	'apic' :'Weicode_ProDetail',
        	'pid':id
        }
        
        //加载数据
        ajaxFn(ajaxData,function(){
			//如果失败，再次请求，，再次失败---提示检查网络	
			ajaxFn(ajaxData,function(){	
//				console.log(1)
				that.setData({failhidden:false})				
        	})		
        })	
		function ajaxFn(ajaxData,failFn){
			util.AJAX( ajaxData, function( res ) {
				if(res.errMsg.indexOf('fail')>-1){					
//					that.setData({failhidden:false})
					if(failFn) failFn();					
					return;
				}
//				console.log(2)
	            var arr = res.data.data;
	//          // 重新写入数据
	            that.setData({
	            });           
	        });
		}
    },
    onReady: function() {
    	  // 页面渲染完成
        var that = this;
        // 数据加载完成后 延迟隐藏loading
        setTimeout( function() {
            that.setData( {
                hidden: true
            })
        }, 500 );
    },
    /**页面显示*/
    onShow: function() {
       
    },
    onHide: function() {
        // 页面隐藏
    },
    onUnload: function() {
        // 页面关闭
    },
    /**点击输入评论**/
    commentsInput:function(){ 
    	var that=this;
    	that.setData({
            commentsOpen: false
        })
    	
    } ,
    //自定义 返回，需返回页面都需要增加 此js ，后期更改为公共
    navigateBack: function () {
        var self = this;
        var pages = getCurrentPages();
        if (pages.length == 1) {
          if (self.data.circleId && self.data.circleId >0) {
            wx.redirectTo({
              url: '../../circle/index/index?circleId=' + self.data.circleId
              + '&circleName=' + (self.data.circleName || '')
            });
          } else {
            wx.switchTab({
              url: "../../home/grouplist/grouplist"
            });
          }
        } else {
            wx.navigateBack({ changed: true });//返回上一页
        }
      }
   
})


	

