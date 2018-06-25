/**
 *
 * Created by Administrator on 2018/6/25.
 */

// 5. 如果当前用户没有登录, 需要拦截到登陆页面
//在进入页面时，判断是否是登录页面，是登录页面就不用进行拦截
//通过判断地址栏中有没有login.html，没有就返回的-1
  if(location.href.indexOf("login.html") == -1){
    $.ajax({
      type:'get',
      url:'/employee/checkRootLogin',
      dataType:'json',
      success:function(info){
        //console.log(info);
        if(info.error === 400){
          location.href='login.html';
        }
      }
    })
  }


//实现进度条功能，给ajax请求加，注意：需要给所有的ajax都加
//思路：发送ajax开启进度条，ajax结束，关闭进度条
//NProgress.start();开启进度条
//NProgress.done();关闭进度条

$(document).ajaxStart(function(){
  NProgress.start();
})

$(document).ajaxStop(function(){
  //模拟网络延迟
  setTimeout(function(){
    NProgress.done();
  },500);

})

//公共功能
$(function(){
// 1. 左侧二级菜单切换显示
  //点击分类管理显示下面子菜单
  $('.lt_aside .categray').click(function(){
    $('.lt_aside .child').stop().slideToggle();
  })

// 2. 左侧整个侧边栏显示隐藏功能
  $('.lt_topbar .icon-hide').click(function(){
      $('.lt_aside').toggleClass('hidemenu');
      $('.lt_main').toggleClass('hidemenu');
      $('.lt_main .lt_topbar').toggleClass('hidemenu');
  })
// 3. 点击头部退出按钮, 显示退出模态框
  $('.logOut').click(function(){
    $('#logoutModal').modal('show');
  })
// 4. 点击模态框中的退出按钮, 需要进行退出操作(ajax)
  $('.logoutBtn').click(function(){
    $.ajax({
      type:'get',
      url:'/employee/employeeLogout',
      dataType:'json',
      success:function (info) {
          if(info.success){
            location.href='login.html';
          }
      }
    })
  })

});
