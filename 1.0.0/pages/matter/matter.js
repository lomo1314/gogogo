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
        commodityLis: [],
        stateColl: 0, //记录收藏状态码

        ensType: "收藏", //收藏状态
        ensColl: true, // 收藏图标
        screenWidth: '', //设备屏幕宽度
        commId: "", //商品id
        matterId:"",//路径id
        markHidden: true, //蒙层开关
        FilePath: '', //路径
        canvasHidden: true, //设置画板的显示与隐藏，画板不隐藏会影响页面正常显示
        shareImgPath: '', //分享图片
        canvasMark: true, // 制图阴影背景 
        // 暂存本地 二维码
        thisErwm:"",
        //暂存本地 图片地址
        thisPic:"",

    },
    //canvasId: "qrcCanvas",

    //方法二
    onLoad: function (options) {
        var that = this
        var pageurl = getCurrentPageUrlWithArgs()
        var id = options.id
        var num_iid = options.num_iid
        that.setData({
            commId: options.num_iid,
            matterId:id
        })
        //获取用户设备信息，屏幕宽度
        wx.getSystemInfo({
            success: res => {
                that.setData({
                    screenWidth: res.screenWidth
                })
                //console.log(that.data.screenWidth)
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
        var ajaxDeta = {
            id: id,
            num_iid: num_iid,
            pageurl: pageurl
        }
        //console.log(pageurl)
        //console.log(ajaxDeta)
        // 商品类型数据信息
        util.commDetails(ajaxDeta, function (res) {
            var arr = res.data
            //console.log(arr.data.desc);
            var article = arr.data.desc
            WxParse.wxParse('article', 'html', article, that, 0);
            //console.log(arr.data.is_like);
            var flas = arr.data.is_like;
            if (flas == 0) {
                that.setData({
                    stateColl: 0, //判断状态
                    ensType: "收藏",
                    ensColl: true, //收藏表示
                })

            } else {
                that.setData({
                    stateColl: 1, //判断状态
                    ensType: "已收藏",
                    ensColl: false, //收藏表示
                })

            }
            that.setData({
                commodityLis: arr.data, //总数据
            })
        })

        //本页面转发隐藏
        wx.hideShareMenu()
        

    },
    //转发分享按钮
    onShareAppMessage: function (res) {
        var that=this
        if (res.from === 'button') {
          // 来自页面内转发按钮
          console.log(res.target)
        }
        return {
          title: that.data.commodityLis.title,
          path: '/pages/matter/matter?id='+that.data.matterId+'&&num_iid='+that.data.commId,
          imageUrl:that.data.commodityLis.pic_url
        }
      },
    //返回首页
    goHome: function () {
        var that = this
        wx.reLaunch({
            url: '../index/index?id=1'
        })
    },
    //点击收藏
    collBind: function () {
        var that = this
        var flag = that.data.stateColl

        if (flag == 0) {
            //console.log(1111)
            that.setData({
                stateColl: 1, //判断状态
                ensType: "已收藏",
                ensColl: false, //收藏表示
            })
            //提示框，
            wx.showToast({
                title: '收藏成功',
                image: '/image/c_correct.png',
                duration: 1000,
                mask: true
            })
            var ajaxDeta01 = {
                type: 1, //添加状态
                num_iid: that.data.commId //删除状态
            }
            util.collectAjax(ajaxDeta01, function (res) {
                //console.log(res)
            })
        } else {
            that.setData({
                stateColl: 0, //判断状态
                ensType: "收藏",
                ensColl: true, //收藏表示
            })
            //提示框，
            wx.showToast({
                title: '取消收藏',
                image: '/image/c_remove.png',
                duration: 1000,
                mask: true
            })
            var ajaxDeta02 = {
                type: 2, //删除状态
                num_iid: that.data.commId //删除状态
            }
            util.collectAjax(ajaxDeta02, function (res) {
                //console.log(res)
            })
        }
        //if()
    },

    // 点击复制吱口令
    copyText: function (e) {
        var that = this
        wx.setClipboardData({
            data: e.currentTarget.dataset.text,
            success: function (res) {
                wx.getClipboardData({
                    success: function (res) {
                        that.setData({
                            markHidden: false
                        })
                    }
                })
            }
        })
    },
    //关闭蒙层
    closeMark: function () {
        var that = this
        that.setData({
            markHidden: true
        })
    },
    //定义的保存图片方法
    saveImageToPhotosAlbum: function () {

        var that = this;
        //手机端延迟
        wx.showLoading({
            title: '正在生成图片...',
            mask: true,
            duration: 1000,
        });
        //设置画板显示，才能开始绘图
        that.setData({
            canvasHidden: false, //canvas 制图展示
            canvasMark: false, //蒙层展示
        })
        var context = wx.createCanvasContext('share')
        var path1 = that.data.commodityLis.api_headimg //分享图片地址
        var path2 = that.data.commodityLis.api_erwmpic // 分享图片二维码
        var erwema=""
        wx.downloadFile({ //当图片为网络图片时，需要先下载到本地，再进行操作，
            url: path2, //否则canvas会加载不到图片，本地的无需这步骤
            success: function (res) {
                //console.log(res)
                path2 = res.tempFilePath
                context.drawImage(path2, unit * 15, unit * 374, unit * 90, unit * 90);
                context.draw(true, that.getTempFilePath);
            }
        })
        wx.downloadFile({ //当图片为网络图片时，需要先下载到本地，再进行操作，
            url: path1, //否则canvas会加载不到图片，本地的无需这步骤
            success: function (res) {
                //console.log(res)
                path1 = res.tempFilePath
                context.drawImage(path1, 0, 0, unit * 289, unit * 289)
                context.draw(true, that.getTempFilePath);
            }
        })
        
        
        var unit = that.data.screenWidth / 375;
        //console.log(that.data.screenWidth)
        //var avatarUrl = that.data.avatarUrl

        var proTit = that.data.commodityLis.title; //分享图片 标题
        
        context.fillStyle = "#FFF";
        context.fillRect(0, 0, unit * 289, unit * 500)
        // context.drawImage(path1, 0, 0, unit * 289, unit * 289)
        /**标题**/
        context.setFontSize(14)
        context.setFillStyle("#000")
        // context.fillText(proTit, 5, unit * 312)
        //画图文字换行，内容、画布、初始x、初始y、行高、画布宽
        that.changLine(true, proTit, context, unit * 15, unit * 312, 16, 265)
        //价格图片背景
        var prceBg = "/image/erwm_jian.png"
        context.fillStyle = "#FFF";
        context.drawImage(prceBg, unit * 15, unit * 340, unit * 256, unit * 25)
        /**价格**/
        //卷后价：
        var juan = that.data.commodityLis.coupon_price
        // 在售价：
        var perMon = that.data.commodityLis.price
        //销量
        var sal = that.data.commodityLis.volume
        context.setFontSize(11)
        context.setFillStyle("#fff")
        context.fillText('券后价:￥', unit * 23, unit * 356)
        context.fillText(juan, unit * 69, unit * 356)
        context.fillText('在售价:￥', unit * 120, unit * 356)
        context.fillText(perMon, unit * 167, unit * 356)
        context.fillText('销量:', unit * 203, unit * 356)
        context.fillText(sal, unit * 230, unit * 356)
        /**价格end**/

        /**长按上方图片即可发送图片或保存图片**/
        context.fillStyle = "#f9f9d3";
        context.fillRect(0, unit * 470, unit * 289, unit * 32)
        context.setFontSize(11);
        context.setFillStyle("#1f1f1f")
        context.fillText("说明：", unit * 15, unit * 490)
        context.setFillStyle("#b9b985")
        context.fillText("长按上方图片即可发送图片或保存图片。", unit * 50, unit * 490)
        /**二维码**/
        //console.log(path2)
        //context.drawImage(path2, unit * 15, unit * 374, unit * 90, unit * 90);
        /** 长按二维码识别查看商品 */
        context.setFontSize(11);
        context.setFillStyle("#bcbcbc")
        //     context.fillText("长按二维码识别查看商品", unit * 147, unit * 455)
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
                    //console.log(res)
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
                    //console.log(that.data.shareImgPath)
                    that.setData({
                        FilePath: res.tempFilePath
                    })
                    //console.log(that.data.FilePath)
                }
            })
        });
    },
    //保存图片
    saveImageToPhotos: function () {
        wx.showLoading({
            title: '保存中...',
        })
        var that = this;
        var FilePath1 = that.data.FilePath
        console.log(that.data.FilePath+"222")
        wx.saveImageToPhotosAlbum({
            filePath: FilePath1,
            //保存成功失败之后，都要隐藏画板，否则影响界面显示。
            success: (res) => {
                console.log(res)
                wx.hideLoading()
                that.setData({
                    canvasHidden: true,
                    canvasMark: true,
                })
                //提示框
                wx.showToast({
                    title: '保存成功',
                    success: '',
                    duration: 1000,
                    mask: true
                })
            },
            fail: (err) => {
                console.log(err)
                wx.hideLoading()
                that.setData({
                    canvasHidden: true,
                    canvasMark: true,
                })
                

            }
        })
    },
    //关闭 canvas 
    occlude:function () { 
        var that=this
        that.setData({
            canvasHidden: true,
            canvasMark: true,
        })
     },
    //画图文字换行，内容、画布、初始x、初始y、行高、画布宽
    changLine: function (isTitle, str, ctx, initX, initY, lineHeight, canvasWidth) {

        // 字符分隔为数组
        var arrText = str.split('');
        var line = '';
        var lineCount = 0;
        var isThreeLine = false;
        var lingth = arrText.slice(0, 54)
        //console.log(arrText,lingth)
        for (var n = 0; n < lingth.length; n++) {
            var testLine = line + arrText[n];
            var testWidth = ctx.measureText(testLine).width;
            if (testWidth > canvasWidth) {
                if (lineCount == 2) {
                    isThreeLine = true
                    var length = line.length - 2;
                    line = line.substring(0, length) + '...';
                    ctx.fillText(line, initX, initY);
                    return false;
                }
                lineCount++;

                ctx.fillText(line, initX, initY);
                line = arrText[n];
                initY += lineHeight;

            } else {
                line = testLine;
            }

        }
        if (!isThreeLine) {
            ctx.fillText(line, initX, initY);
        }
        //记录标题的高度
        if (isTitle) {
            this.setData({
                titleY: initY + lineHeight + 8
            })
        }
    },


})