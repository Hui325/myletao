/**
 * Created by Administrator on 2018/6/26.
 */
$(function(){

  var currentPage = 1;
  var pageSize = 5;
  var currentId;
  var isDelete;

  //请求后台，获取数据渲染模板引擎到页面
  //分页完成
  render();
  function render() {
    $.ajax({
      type:'get',
      url:'/user/queryUser',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:'json',
      success:function (info) {
        var htmlStr = template('tmp',info);
        $('tbody').html(htmlStr);
        //console.log(info);

        //分页功能
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion : 3,
          currentPage:info.page,//当前页
          totalPages:Math.ceil(info.total / info.size),//总页数
          onPageClicked:function(event, originalEvent, type,page){
            //为按钮绑定点击事件 page:当前点击的按钮值
            //修改当前页码
            currentPage = page;
            //重新渲染数据
            render();
          }
        })

      }
    })
  }

  //禁用启用功能 用事件委托完成
  $('tbody').on('click','.btn',function(){
    //显示模态框
    $('#usermodal').modal('show');
    currentId = $(this).parent().data('id');
    isDelete = $(this).hasClass('btn-danger') ? 0 : 1;
  })

  //确定执行，向后台发送数据
  $('#okBtn').click(function(){
    $.ajax({
      type : 'post',
      url : '/user/updateUser',
      data : {
        id:currentId,
        isDelete:isDelete
      },
      dataType : 'json',
      success : function (info) {
          if(info.success){
            $('#usermodal').modal('hide');
            render();
          }
      }
    })
  })

});