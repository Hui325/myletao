/**
 * Created by Administrator on 2018/6/25.
 */
/***
 *
 * 表单校验
 *
 */
$(function () {

  //表单校验功能
   $('#form').bootstrapValidator({
     //配置图标
     feedbackIcons: {
       valid: 'glyphicon glyphicon-ok', //校验成功
       invalid: 'glyphicon glyphicon-remove',//校验失败
       validating: 'glyphicon glyphicon-refresh'
     },

     fields:{
       username:{
         //校验规则
         validators:{
           //不能为空
           notEmpty:{
             //提示信息
             message:"用户名不能为空"
           },
           //校验长度
           stringLength:{
             min:2,//最小长度
             max:6,//最大程度
             message:"用户名长度必须在2-6位"
           },
           callback:{
             message:"用户名不存在"
           }
         }
       },
       password:{
         validators:{
           //不能为空
           notEmpty:{
             message:"密码不能为空"
           },
           //校验长度
           stringLength:{
             min:6,
             max:12,
             message:"密码长度必须在6-12位"
           },
           callback:{
             message:"密码错误"
           }
         }
       }
     }
   });

  //需要注册表单校验成功事件，在成功事件里面，阻止默认的表单提交
  $('#form').on("success.form.bv",function (e) {
      //阻止默认的表单提交
    e.preventDefault();
    //通过ajax进行提交
    $.ajax({
      type:'post',
      url:'/employee/employeeLogin',
      data:$('#form').serialize(),
      dataType : 'json',
      success : function(info){
        console.log(info);
        if(info.success){
          location.href="index.html";
        }
        if(info.error === 1001){
          //把password的校验状态，改为用户名不存在
          //alert("密码错误");
          //updateStatus 参数
          //1-字段名
          //2-重置状态
          //3-配置提示信息，自定义校验规则 callback
          $('#form').data("bootstrapValidator").updateStatus("password","INVALID","callback");
        }
        if(info.error === 1000){
          //把username的校验状态，改为用户名不存在
          //alert("用户名不存在");
          $('#form').data("bootstrapValidator").updateStatus("username","INVALID","callback");
        }
      }
    });
  })

  //修复表单重置的bug,重置表单的同时也要重置表单校验状态
  $('[type="reset"]').click(function(){
    //用插件提供的方法，进行表单重置校验状态
    //resetForm 如果不传true，就只重置表单校验状态，不会重置表单，我们这里重置按钮用的reset，所以不用传true
    $('#form').data("bootstrapValidator").resetForm();
  })
});
