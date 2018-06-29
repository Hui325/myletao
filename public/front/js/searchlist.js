/**
 * Created by Administrator on 2018/6/29.
 */
$(function(){
  //进入页面，获取地址栏参数
  var key = getSearch ("key");
  //把参数给输入框
  $('.search_input').val(key);

  //根据输入框值去后台获取数据渲染到页面
  render();
  function render() {

    $('.lt_product').html('<div class="loading"></div>');

    //根据接口文档可知，有多个参数，三个必须项 ，两个可选项
    var param = {};
    //三个必要参数
    param.proName = $('.search_input').val();
    param.page = 1;
    param.pageSize = 100;

    //两个不必要参数
    //需要判断，
    // 1-根据有没有current类判断
    // 2-按价格还是库存排序？ 根据data-type判断
    // 3-是升序还是降序？根据i的类
    var $current = $('.sort a.current');
    if($current.length > 0){
      //被点击,获取按什么排序
      var sortName = $current.data('type');
      //说明按价格排序
      var sortValue =  $current.find('i').hasClass('fa-angle-down') ? 2 : 1;
      param[sortName] = sortValue;
    }

    //console.log(param);
    //请求后台,渲染数据
    $.ajax({
      type:'get',
      url:'/product/queryProduct',
      data:param,
      dataType:'json',
      success:function (info) {
        //console.log(info);
        var htmlStr = template('protmp' ,info);
        $('.lt_product0').html(htmlStr);
      }
    });

  }

  //点击搜索进行搜索
  $('.search_btn').click(function(){
    //获取搜索框的值
    var key =  $('.search_input').val();
    //如果搜索值为空，就显示提示信息
    if(key==""){
      mui.toast('搜索值不能为空');
      return;
    }
    //渲染数据
    render();



    //把搜索记录更新
    //先获取本地存储数据
    var search = localStorage.getItem('search_list');
    //转成json对象
    search = JSON.parse(search);
    //判断是否重复，重复把旧的删除，新的添加
    if(search.indexOf(key) > -1 ){
      var index = search.indexOf(key);
      search.splice(index,1);
    }
    //如果长度大于10，就删除最后一个
    if(search.length >= 10 ){
      search.pop();
    }
    //把记录添加到数组，再转为json字符串，存到本地存储中
    search.unshift(key);
    localStorage.setItem('search_list',JSON.stringify(search));
    //清空搜索框
    $('.search_input').val('');
  })

  //给排序添加点击事件
  $('.sort a[data-type]').click(function(){
    console.log(1);
    if($(this).hasClass('current')){
      //有current类，切换i小箭头
      //$(this).toggleClass('current');
      $(this).find('i').toggleClass('fa-angle-down').toggleClass('fa-angle-up');
    }else{
      //没有current类就添加，并且去掉其他的
      $(this).addClass('current').siblings().removeClass('current');
    }
    //重新渲染数据
    render();
  })
})

//封装一个函数用来解析地址栏传递的参数
function getSearch (name){
  var search = location.search;
  //防止中文乱码，需要解析
  search = decodeURI(search);
  //去掉问号
  search = search.slice(1);
  //根据&分割
  search = search.split('&');
  //遍历数组，把每一项根据=分割，放到对象中
  var obj = {};
  search.forEach(function (v,i) {
      var key = v.split('=')[0];
      var value = v.split('=')[1];
      obj[key] = value;
  })
  return obj[name];
}