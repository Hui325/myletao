/**
 * Created by Administrator on 2018/6/29.
 */
$(function () {
  //我们把历史记录存到本地存储localstorage里面
  //获取到本地存储的数据
  function getHistory() {
    var arr = localStorage.getItem('search_list') || '[]';
    arr = JSON.parse(arr);
    return arr;
  }

  render();
  function render() {
    //获取到本地存储的数据
    var arr = getHistory();
    var obj = { arr: arr };
    //渲染数据
    var htmlStr = template('hisTmp',obj);
    $('.history').html(htmlStr);
  }


  //点击清空历史记录，就是清空localstorage
  $('.history').on('click','.his_delete',function(){
    mui.confirm("确定要清空历史记录吗？","温馨提示",function(e){
     if(e.index == 1){//点击确定删除
       localStorage.removeItem('search_list');
       render();
     }
    })

  });

//  点击删除一条数据
  $('.history').on('click','.icon_delete',function(){
    //获取点击的数据索引
    var index = $(this).data('index');
    var arr = getHistory();
    arr.splice(index,1);
    //把数据重新放到localStorage
    localStorage.setItem("search_list",JSON.stringify(arr));
    //重新渲染
    render();
  })


//  添加历史记录到本地存储的localStorage中
  $('.search_btn').click(function () {
    var key = $('.search_input').val();

    //输入框为空时不存
    if(!key){
      mui.toast("搜索关键字不能为空！");
      return;
    }
    //有重复的就把旧的删除，把新的填进去
    var arr = getHistory();
    if(arr.indexOf(key) > -1){
      var index = arr.indexOf(key);
      arr.splice(index,1);
      //arr.unshift(key);
    }
    //如果数组长度超过10个就删除数组中的最后一个再进行添加
    if(arr.length >= 10){
      arr.pop();
    }
    //把关键字放数组的最前面
    arr.unshift(key);
    //把数组再转成json字符串存到本地存储中
    localStorage.setItem('search_list',JSON.stringify(arr));
    //重新渲染历史记录
    render();
    //清空输入框
    $('.search_input').val('');
    //跳转到商品列表页
    location.href = 'searchlist.html?key=' + key;
    //console.log(arr);
  })
})