//页面公共方法
var fun_md5 = require('md5.js');//md5加密
//封装ajax方法
var API_URL = "https://dapi.cnmo.com/index.php";
module.exports = {
    AJAX : function( data = '', fn, method = "get", header = {}){
        var timeData = parseInt(new Date().getTime()/1000);
        //md5加密
        var appid = "7001";
        var appkey= "cc25c2d4d140f4678bcbc4328003c64a";
        var token = fun_md5.hex_md5(fun_md5.hex_md5(appid+appkey).substr(0,8)+timeData);
//      console.log(token)
        wx.request({
            url: API_URL+"?c=Index&appid="+appid+"&token="+token+"&timestamp="+timeData,
            method : method ? method : 'get',
            data: data,
            header: header ? header : {"Content-Type":"application/json"},
            complete: function( res ) {
                fn( res );
            }
        });
    }
//   AJAX : function( data = '', fn, method = "get", header = {}){
//      wx.request({
//          url: API_URL,
//          method : method ? method : 'get',
//          data: data,
//          header: header ? header : {"Content-Type":"application/json"},
//          success: function( res ) {
//              fn( res );
//          }
//      });
//  }
}
