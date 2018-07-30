var util = require('../../utils/util.js'); //AJAX
var WxParse = require('../../wxParse/wxParse.js') // 识别html标签插件
var QR = require("../../utils/qrcode.js");
var app = getApp()
Page({
    data: {
        /* 页面配置*/
        winWidth: 0,
        winHeight: 0,
        //商品详情数据
        commodityLis:[],
        
        conImg:"",//canvas 所需图片地址
        
        api_erwmpic:"",//canvas 二维码地址
        
        stateColl:0,//记录收藏状态码

        ensType:"收藏", //收藏状态
        ensColl:true, // 收藏图标
        commId:"", //商品id

    },


    //方法二
    onLoad: function (options) {
        var that = this
        var pageurl=getCurrentPageUrlWithArgs()
        var id = options.id
        var num_iid = options.num_iid
        that.setData({
            commId:options.num_iid
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
        //商品详情页面

        /*获取当前页带参数的url*/
        function getCurrentPageUrlWithArgs() {
            var pages = getCurrentPages() //获取加载的页面
            var currentPage = pages[pages.length - 1] //获取当前页面的对象
            var url = currentPage.route //当前页面url
            var options = currentPage.options //如果要获取url中所带的参数可以查看options

            //拼接url的参数
            var urlWithArgs = url + '?'
            for (var key in options) {
                var value = options[key]
                urlWithArgs += key + '=' + value + '&'
            }
            urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

            return urlWithArgs
        }
        //获取信息接口
        var ajaxDeta={
            id:id,
            num_iid:num_iid,
            pageurl:pageurl
        }
        //console.log(ajaxDeta)
        // 商品类型数据信息
        util.commDetails(ajaxDeta,function (res) { 
            var arr = res.data
            //console.log(arr.data.desc);
            var article=arr.data.desc
            WxParse.wxParse('article', 'html', article, that,0); 
            //console.log(arr.data.is_like);
            var flas=arr.data.is_like;
            if(flas==0){
                that.setData({
                    stateColl:0 ,//判断状态
                    ensType:"收藏",
                    ensColl:true, //收藏表示
                })
                
            }else{
                that.setData({
                    stateColl:1 ,//判断状态
                    ensType:"已收藏",
                    ensColl:false, //收藏表示
                })
               
            }
			that.setData({
                commodityLis: arr.data, //总数据
                conImg:arr.data.pic_url,//图片地址
			})
         })

        //本页面转发隐藏
        wx.hideShareMenu()
    },

    //返回首页
    goHome: function () {
        var that = this
        wx.reLaunch({
            url: '../index/index?id=1'
        })
    },
    //点击收藏
    collBind:function () { 
        var that=this
        var flag=that.data.stateColl
        
        if(flag==0){
            //console.log(1111)
            that.setData({
                stateColl:1 ,//判断状态
                ensType:"已收藏",
                ensColl:false, //收藏表示
            })
            //提示框，
            wx.showToast({ 
                title: '收藏成功',
                image: '/image/c_correct.png',
                duration: 1000,
                mask:true
            })
            var ajaxDeta01={
                type:1, //添加状态
                num_iid:that.data.commId //删除状态
            }
            util.collectAjax(ajaxDeta01,function (res) { 
                //console.log(res)
             })
        }else{
            that.setData({
                stateColl:0 ,//判断状态
                ensType:"收藏",
                ensColl:true, //收藏表示
            })
            //提示框，
            wx.showToast({
                title: '取消收藏',
                image: '/image/c_remove.png',
                duration: 1000,
                mask:true
            })
            var ajaxDeta02={
                type:2, //添加状态
                num_iid:that.data.commId //删除状态
            }
            util.collectAjax(ajaxDeta02,function (res) { 
                //console.log(res)
             })
        }
        //if()
    }
})