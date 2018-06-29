/**
 * Created by HP on 2018/6/28.
 */
$(function(){
  //去后台获取数据，渲染数据到前台
  //渲染侧边分类
  $.ajax({
    type:'get',
    url:'/category/queryTopCategory',
    dataType:'json',
    success:function(info){
      //console.log(info);
      var htmlStr = template('catetmp',info);
      $('.lt_category_left ul').html(htmlStr);
    }
  });

  //给左侧添加点击事件，根据点击的分类，获取点击的id，然后通过id去后台查询
  $('#firstcate').on('click','a',function(){
    var id = $(this).data('id');
    //给当前的a添加current类，其他的删除
    $(this).parent().addClass('current').siblings().removeClass('current');
    //渲染右侧商品
    $.ajax({
      type:'get',
      url:'/category/querySecondCategory',
      data:{
        id : id
      },
      dataType:'json',
      success:function(info){
        console.log(info);
        var htmlStr = template('sectmp',info);
        $('.lt_category_main ul').html(htmlStr);
      }
    });
  })

})
