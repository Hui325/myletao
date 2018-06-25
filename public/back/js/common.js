/**
 *
 * Created by Administrator on 2018/6/25.
 */

//实现进度条功能，给ajax请求加，注意：需要给所有的ajax都加
//思路：发送ajax开启进度条，ajax结束，关闭进度条
//NProgress.start();开启进度条
//NProgress.done();关闭进度条

$(document).ajaxStart(function(){
  NProgress.start();
})

$(document).ajaxStop(function(){
  NProgress.done();
})