/**
 * Created by HP on 2018/6/28.
 */
$(function(){
  //去后台获取数据，渲染数据到前台
  $.ajax({
    type:'get',
    url:'/category/queryTopCategory',
    dataType:'json',
    success:function(info){
      console.log(info);
      var htmlStr = template('catetmp',info);
      $('.lt_category_left ul').html(htmlStr);
    }
  })
})
