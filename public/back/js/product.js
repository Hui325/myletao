/**
 * Created by Administrator on 2018/6/26.
 */
$(function(){

  var currentPage = 1;
  var pageSize = 5;
  render();
  function render(){
    //请求后台商品数据进行渲染
    $.ajax({
      type:'get',
      url:'/product/queryProductDetailList',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:'json',
      success:function (info) {
        console.log(info);
        var htmlstr = template('protmp',info);
        $('tbody').html(htmlstr);
      }

    })
  }
})