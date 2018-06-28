/**
 * Created by Administrator on 2018/6/27.
 */
$(function () {
  var currentPage = 1;
  var pageSize = 5;
  render();
  //渲染数据 分页实现
  function render() {

    $.ajax({
      type:'get',
      url:'/category/queryTopCategoryPaging',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:'json',
      success:function (info) {
        console.log(info);
        var htmlStr = template('firsttmp',info);
        $('tbody').html(htmlStr);

        //分页paginator
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion : 3,
          currentPage:info.page,
          totalPages:Math.ceil(info.total/info.size),
          onPageClicked : function(a,b,c,page){
            //点击页码 修改当前页码，并重新渲染数据
            currentPage = page;
            render();
          }

        })



      }

    })
  }

  //点击添加分类按钮显示模态框
  $('.add-btn').click(function(){
    $('#firstModal').modal('show');
  })

  //表单验证
  $('#form').bootstrapValidator({
    // 将默认的排除项, 重置掉 (默认会对 :hidden, :disabled等进行排除)
    excluded: [],

    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      categoryName:{
        validators:{
          notEmpty:{
            message:'一级分类名称不能为空'
          }
        }
      }
    }
  })

//  添加分类时先阻止submit的默认提交事件
  $('#form').on('success.form.bv',function(e){
    e.preventDefault();
    //发送ajax请求后台添加分类
    $.ajax({
      type:'post',
      url:'/category/addTopCategory',
      data:$('#form').serialize(),
      dataType:'json',
      success:function (info) {
          if(info.success){
            //关闭模态框
            $('#firstModal').modal('hide');
            currentPage = 1;
            render();
          }
      }
    })
  })
})