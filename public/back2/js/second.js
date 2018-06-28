/**
 * Created by Administrator on 2018/6/26.
 */
$(function () {
  var currentPage = 1;
  var pageSizxe = 5;
  render();
  function render() {
    $.ajax({
      type:'get',
      url:'/category/querySecondCategoryPaging',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:'json',
      successs:function (info) {
        console.log(info);
        //模板引擎数据组合
        var htmlStr = template('secTmp',info);
        $('tbody').html(htmlStr);

        //分页
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion : 3,
          currentPage:info.page,
          totalPages : Math.ceil(info.total/info.size),
          onPageClicked:function (a,b,c,page) {//点击分页事件
              currentPage = page;
            //重新渲染数据
            render();
          }
        })
      }
    })
  }


  //点击添加分类显示模态框
  $('#addbtn').click(function(){
    //1 显示模态框
    $('#secModal').modal('show');

    //2 向后台请求一级分类数据，绑定下拉框
    $.ajax({
      type:'get',
      url:'/category/queryTopCategoryPaging',
      data:{
        page:1,
        pageSize:100
      },
      dataType:'json',
      success:function(info){
        console.log(info);
        var htmlStr = template('firstTmp',info);
        $('.dropdown-menu').html(htmlStr);
      }
    })
  })

  //3 给下拉框里面的a添加事件
  $('.dropdown-menu').on('click','a',function () {
      $('#catename').text($(this).text());
      $('[name="categoryId"]').val($(this).data('id'));
    //重置
    $('#form').data('bootstrapValidator').updateStatus('categoryId','VALID');
  })



  //4 上传图片事件
  $("#fileupload").fileupload({
    dataType:"json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done:function (e, data) {
      console.log(data.result.picAddr);
      var picUrl = data.result.picAddr;
      $('#img').attr('src',picUrl);
      //把图片地址保存
      $('[name="brandLogo"]').val(picUrl);
      $('#form').data('bootstrapValidator').updateStatus('brandLogo','VALID');
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
      brandName:{
        validators:{
          notEmpty:{
            messagae:'请输入二级分类名称'
          }
        }
      },
      categoryId:{
        validators:{
          notEmpsty:{
            message:'请选择一级分类名称'
          }
        }
      },
      brandLogo:{
        validators:{
          notEmpty:{
            message:'请上传图片'
          }
        }
      }
    }
  })

//  5 表单提交前阻止submit的默认提交
  $('#form').on('success.form.bv',function(e){
    e.prevesntDefault();
    //通过ajax提交
    $.ajax({
      type:'post',
      url:'/category/addSecondCategory',
      data:$('#form').serialize(),
      dataType:'json',
      success:function(info){
        if(info.success){
          //关闭模态框
          $('#secModal').modal('hide');
          //渲染第一页
          currentPage = 1;
          render();
          //重置表单
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