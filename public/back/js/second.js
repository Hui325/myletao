/**
 * Created by Administrator on 2018/6/26.
 */

$(function(){
  //ajax请求后台数据渲染
  var currentPage = 1;
  var pageSize = 2;
  render();
  function render(){
    $.ajax({
      type:'get',
      url:'/category/querySecondCategoryPaging',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:'json',
      success:function (info) {
          console.log(info);
        var htmlStr = template('secondTmp',info);
        $('tbody').html(htmlStr);

      //  分页
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion : 3,
          currentPage : info.page,
          totalPages : Math.ceil(info.total/info.size),
          onPageClicked : function(a,b,c,page){
            currentPage = page;
            render();
          }
        })
      }
    })
  }


  //点击分类 弹出模态框
  $('.add-btn').click(function () {
    //1 显示模态框
      $('#secondModal').modal('show');

    //2 请求后台获取一级分类，渲染到下拉菜单
    $.ajax({
      type:'get',
      url:'/category/queryTopCategoryPaging',
      data:{
        page:1,
        pageSize:100//因为不需要分页，要把所有的一级分类显示出来，所有每页的数量传大一点，可以实现想要的功能
      },
      dataType:'json',
      success:function(info){
        //console.log(info);
        var htmlStr = template('drowdownTmp',info);
        $('.dropdown-menu').html(htmlStr);
      }
    })
  });

  // 3 给下拉菜单添加事件 用事件委托
  $('.dropdown-menu').on('click','a',function(){
    //把选择的一级分类名称赋给点击的drowndown
    $('#catename').html($(this).text());
    //把id保存下来，方便后面进行表单提交
    $('[name="categoryId"]').val($(this).data('id'));

    //重置表单
    $('#form').data('bootstrapValidator').updateStatus("categoryId","VALID");

  });

  // 4 上传图片
  $("#fileupload").fileupload({
    dataType:"json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done:function (e, data) {
      console.log(data.result.picAddr);
      var picUrl = data.result.picAddr;
      //把上传图片地址保存下来
      $('[name="brandLogo"]').val(picUrl);
      //把地址给img，让图片显示
      $('#img').attr('src',picUrl);
      //重置表单
      $('#form').data('bootstrapValidator').updateStatus("brandLogo","VALID");
    }
  });

  //5 表单校验
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
      brandName : {
        validators :{
          notEmpty:{
            message:'请输入二级分类名称'
          }
        }
      },
      categoryId : {
        validators :{
          notEmpty:{
            message:'请选择一级分类名称'
          }
        }
      },
      brandLogo : {
        validators : {
          notEmpty:{
            message:'请上传图片'
          }
        }
      }

    }
  })

  //点击添加 提交数据到后台,由于是submit，所以先阻止submit的默认提交
  $('#form').on('success.form.bv',function(e){
    e.preventDefault();
    console.log(1);
    $.ajax({
      type:'post',
      url:'/category/addSecondCategory',
      data:$('#form').serialize(),
      success:function(info){
        if(info.success){
          //关闭模态框
          $('#secondModal').modal('hide');
          currentPage = 1;
          //重新渲染数据
          render();
          //表单重置
          $('#form').data('bootstrapValidator').resetForm(true);
          //把下拉菜单按钮文字重置
          $('#catename').text('请选择一级分类');
          //图片显示重置
          $('#img').attr('src','./images/none.png');
        }
      }
    })
  })

})