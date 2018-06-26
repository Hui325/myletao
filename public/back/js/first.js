/**
 * Created by Administrator on 2018/6/26.
 */
$(function () {

  var currentpage = 1;
  var pageSize = 3;

  render();
  //请求后台一级分类数据
  function render() {
    $.ajax({
      type: 'get',
      url: '/category/queryTopCategoryPaging',
      data: {
        page: currentpage,
        pageSize: pageSize
      },
      dataType: 'json',
      success: function (info) {
        console.log(info);
        //组装
        var htmlstr = template('firstTmp', info);
        $('tbody').html(htmlstr);

        //  分页功能
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page,//当前页
          totalPages: Math.ceil(info.total / info.size),//总页数
          onPageClicked: function (event, originalEvent, type, page) {
            //为按钮绑定点击事件 page:当前点击的按钮值
            //  修改当前页
            currentpage = page;
            //  重新渲染数据
            render();
          }
        })
      }
    })
  }
  
  //显示添加分类模态框
  $('.add-btn').click(function () {
    $('#addmodal').modal('show');
  })

  //表单验证
  $('#form').bootstrapValidator({
    //配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok', //校验成功
      invalid: 'glyphicon glyphicon-remove',//校验失败
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      categoryName: {
        validators: {
          notEmpty: {
            message: "一级分类名称不能为空"
          }
        }
      }
    }
  });

  //注册表单事件，先阻止默认的表单提交事件
  $('#form').on("success.form.bv", function (e) {
    e.preventDefault();
    //通过ajax进行数据提交
    $.ajax({
      type: 'post',
      url: '/category/addTopCategory',
      data:$('#form').serialize(),
      dataType:'json',
      success:function (info) {
        if(info.success){
          $('#addmodal').modal('hide');
          currentpage = 1;
          render();
        }

      }
    })
  })
})