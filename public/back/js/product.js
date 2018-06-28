/**
 * Created by Administrator on 2018/6/26.
 */
$(function(){

  var currentPage = 1;
  var pageSize = 5;
  //存放上传图片的信息
  var picArr = [];
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
        //console.log(info);
        var htmlstr = template('protmp',info);
        $('tbody').html(htmlstr);
        //console.log(htmlstr);
        //  分页
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page,//当前页
          totalPages: Math.ceil(info.total / info.size),//总页数

         //配置分页按钮的显示文字
          itemTexts:function(type,page, current){
            //console.log(arguments);
            switch (type){
              case 'first':
                return '首页';
              case 'next' :
                return '下一页';
              case 'last':
                return '尾页';
              case 'prev':
                return '上一页';
              case 'page':
                return page;
            }
          },
          tooltipTitles: function(type,page, current){
            switch (type){
              case 'first':
                return '首页';
              case 'next' :
                return '下一页';
              case 'last':
                return '尾页';
              case 'prev':
                return '上一页';
              case 'page':
                return page;
            }
          },
          useBootstrapTooltip : true,
          onPageClicked: function (event, originalEvent, type, page) {
            //为按钮绑定点击事件 page:当前点击的按钮值
            //  修改当前页
            currentPage = page;
            //  重新渲染数据
            render();
          }
        })
      }

    })
  }


//  点击显示商品添加模态框
  $('.addpro').click(function () {
    //显示模态框
      $('#proModal').modal('show');
    //绑定二级分类
    $.ajax({
      type:'get',
      url:'/category/querySecondCategoryPaging',
      data:{
        page:1,
        pageSize:100
      },
      dataType:'json',
      success:function (info) {
         var htmlStr = template('sectmp',info);
        //dropdown-menu
        $('.dropdown-menu').html(htmlStr);
      }
    })
  })

  //选择二级分类，并获取选中的那个二级分类id 存在隐藏域
  $('.dropdown-menu').on('click','a',function () {
      var id = $(this).data('id');
      $('[name="brandId"]').val(id);
    //替换文本
    $('#catename').text($(this).text());
  //  重置表单状态
    $('#form').data('bootstrapValidator').updateStatus('brandId','VALID');
  })

  //上传图片
  $('#fileupload').fileupload({
    dataType:'json',
    done:function (e,data) {
      //console.log(data.result);
      //每次上传一个图片就把该图片的地址存到数组中
      picArr.unshift(data.result);
    // 动态创建img
      $('.file_pic').prepend(" <img src="+ data.result.picAddr +" width='100px'>");
      if(picArr.length > 3){
        //多于3张时，删除最后一张
        $('.file_pic img:last-of-type').remove();
        //数组要删除最先添加的那个，因为数据是从前面添加的，所以最先添加的在最后
        picArr.pop();
      }
      if(picArr.length === 3){
        $('#form').data('bootstrapValidator').updateStatus('picStatus','VALID'); if ( picArr.length === 3 ) {
        }
      }
    }
  })

//  表单验证
  $('#form').bootstrapValidator({
    // 需要对隐藏域进行校验, 所以配置一下
    excluded: [],
    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',   // 校验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },
    fields:{
      //二级分类
      brandId :{
        validators:{
          notEmpty:{
            message:'请选择二级分类'
          }
        }
      },
      proName:{//商品名称
        validators:{
          notEmpty:{
            message:'请输入商品名称'
          }
        }
      },
      proDesc:{//商品描述
        validators:{
          notEmpty:{
            message:'请输入商品描述'
          }
        }
      },
      num:{//商品库存
        validators:{
          notEmpty:{
            message:'请输入商品库存'
          },
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '商品库存必须是非零开头的数字'
          }
        }
      },
      size:{//商品尺码
        validators:{
          notEmpty:{
            message:'请输入商品尺码'
          },
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '商品尺码必须是xx-xx格式,例如:32-40'
          }
        }
      },
      oldPrice:{//商品原价
        validators:{
          notEmpty:{
            message:'请输入商品原价'
          }
        }
      },
      price:{//商品现价
        validators:{
          notEmpty:{
            message:'请输入商品现价'
          }
        }
      },
      picStatus:{//商品现价
        validators:{
          notEmpty:{
            message:'请选择三张图片'
          }
        }
      }

    }
  })

//  阻止表单默认提交事件，并向后台提交数据
  $('#form').on('success.form.bv',function (e) {
    e.preventDefault();
    var formserialize = $('#form').serialize();
    //console.log(formserialize);
    formserialize += "&picAddr" + picArr[0].picAddr + "&picName" + picArr[0].picName;
    formserialize += "&picAddr" + picArr[1].picAddr + "&picName" + picArr[1].picName;
    formserialize += "&picAddr" + picArr[2].picAddr + "&picName" + picArr[2].picName;
    $.ajax({
      type:'post',
      url:'/product/addProduct',
      data:formserialize,
      dataType:'json',
      success:function(info){
        //console.log(info);
        if(info.success){
          //关闭模态框
          $('#proModal').modal('hide');
          //重置当前页
          currentPage = 1;
          //重新渲染数据
          render();
        //  重置表单
          $('#form').data('bootstrapValidator').resetForm(true);
          //重置二级分类文本
          $('#catename').text('请选择二级分类');
          //删除动态生成的图片
          $('.file_pic img').remove();
        }
      }
    })
  })
})