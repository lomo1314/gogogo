//页面公共方法
var fun_md5 = require('md5.js'); //md5加密
//封装ajax方法
var API_URL = "https://dapi.cnmo.com/index.php";
module.exports = {
    AJAX: function (data = '', fn, method = "get", header = {}) {
        var timeData = parseInt(new Date().getTime() / 1000);
        //md5加密
        var appid = "7001";
        var appkey = "cc25c2d4d140f4678bcbc4328003c64a";
        var token = fun_md5.hex_md5(fun_md5.hex_md5(appid + appkey).substr(0, 8) + timeData);
        //      console.log(token)
        wx.request({
            url: API_URL + "?c=Index&appid=" + appid + "&token=" + token + "&timestamp=" + timeData,
            method: method ? method : 'get',
            data: data,
            header: header ? header : {
                "Content-Type": "application/json"
            },
            complete: function (res) {
                fn(res);
            }
        });
    },
    //分类数据接口
    classifyAjax: function (pagename, fn) {
        //console.log(pagename);
        wx.request({
            url: 'http://go.cnmo.com/index.php?g=api&m=index&a=cateTotal',
            data: {
                pagename: pagename
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 公共写着个头，否则数据调用不出来
            },
            complete: function (res) {
                fn(res)
            }
        })
    },
    //广告接口
    advertising: function (fn) {
        wx.request({
            url: 'https://go.cnmo.com/index.php?g=api&m=ad&a=index',
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 公共写着个头，否则数据调用不出来
            },
            complete: function (res) {
                fn(res)
            }
        })
    },
    //最热接口+今日上新 +& 排行榜销量TOP100 & 排行榜人气TOP100 参数： sort=? p=？
    hotAjax: function (dataList, fn) {
        wx.request({
            url: 'https://go.cnmo.com/index.php?g=api&m=index&a=index',
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            data: dataList,
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 公共写着个头，否则数据调用不出来
            },
            complete: function (res) {
                fn(res)
            }
        })
    },
    //省技巧 接口，需回传 p 页码数 
    //https://go.cnmo.com/index.php?g=api&m=skill&a=index
    saveAjax: function (tadayP, fn) {
        //console.log(tadayP+"kkkkk")
        wx.request({
            url: 'https://go.cnmo.com/index.php?g=api&m=skill&a=index',
            data: tadayP,
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 公共写着个头，否则数据调用不出来
            },
            complete: function (res) {
                fn(res)
            }
        })
    },
    //商品详情
    //需要回传3个必填参数 ： 商品id  商品num_iid  当前页网址pageurl
    commDetails: function (ajaxDeta, fn) {
        //console.log(ajaxDeta)
        var token = wx.getStorageSync('token') || [];
        //console.log(token)
        wx.request({
            url: 'https://go.cnmo.com/index.php?g=api&m=detail&a=index',
            data: ajaxDeta,
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/x-www-form-urlencoded', // 公共写着个头，否则数据调用不出来
                'API-Authorization': token
            },
            complete: function (res) {
                fn(res)
            }
        })
    },
    //搜索接口
    seekAjax: function (ajaxDeta, fn) {
        wx.request({
            url: 'https://go.cnmo.com/index.php?g=api&m=search&a=index',
            data: ajaxDeta,
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 公共写着个头，否则数据调用不出来
            },
            complete: function (res) {
                fn(res)
            }
        })
    },
    //签到状态
    dayTim: function (fn) {
        wx.request({
            url: 'https://go.cnmo.com/index.php?g=api&m=user&a=date_time',
            //   data: {},
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 公共写着个头，否则数据调用不出来
            },
            success: function (res) {
                // success
            },
            fail: function () {
                // fail
            },
            complete: function (res) {
                fn(res)
            }
        })
    },
    //收藏商品 状态
    collectAjax: function (ajaxDeta, fn) {
        var token = wx.getStorageSync('token') || [];
        wx.request({
            url: 'https://go.cnmo.com/index.php?g=api&m=user&a=add_collection',
            data: ajaxDeta,
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/x-www-form-urlencoded', // 公共写着个头，否则数据调用不出来
                'API-Authorization': token
            },
            complete: function (res) {
                fn(res)
            }
        })
    },
    //收藏列表项
    collList: function (ajaxDeta, fn) {
        var token = wx.getStorageSync('token') || [];
        wx.request({
            url: 'https://go.cnmo.com/index.php?g=api&m=user&a=collection_list',
            data: ajaxDeta,
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/x-www-form-urlencoded', // 公共写着个头，否则数据调用不出来
                'API-Authorization': token
            },
            complete: function (res) {
                fn(res)
            }
        })
    },

    // 分类下的列表
    ifyList: function (ajaxDeta, fn) {
        // https://go.cnmo.com/index.php?g=api&m=cate&a=index
        wx.request({
            url: 'https://go.cnmo.com/index.php?g=api&m=cate&a=index',
            data: ajaxDeta,
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/x-www-form-urlencoded', // 公共写着个头，否则数据调用不出来
            },
            complete: function (res) {
                fn(res)
            }
        })
    },

}