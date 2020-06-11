require.config({
   baseUrl: "../../public/js",
   urlArgs: "v=" +  parseInt(parseInt((new Date()).getTime()/1000)/100).toString(),  // 每分钟更新，方便开发,生产环境去掉
　　　paths: {
        "public" :"lib/public"
　　　}
});

require( ["public"], function (){
 web_init()
});


function search_init(){
    $('.time_tick').datetimepicker({
        format: 'yyyy-mm-dd hh:ii:ss',//显示格式
        todayHighlight: 1,//今天高亮
        minView: "0",//设置只显示到月份
        startView:2,
        forceParse: 0,
        showMeridian: 1,
        todayBtn: true,
        autoclose: 1//选择后自动关闭
      });
  $(".time_tick").datetimepicker("setDate", new Date());
 

    $('input[name=time_type]').click(function(){
       
        if($(this).val() == 1){
            $('.time_task').show()
        }else{
            $('.time_task').hide()
        }
    })

    $("#time_week").selectpicker('refresh');

  $('input[name=dyORvideo]').click(function(){
    if($(this).val() == 0){
      $('.dyORvideo_0').show();
      $('.dyORvideo_1').hide();

    }else{
      $('.dyORvideo_0').hide();
      $('.dyORvideo_1').show();

    }
  })
}

function saveTask(){
  var node = $('.step3');
  
  var addCont = $('.addMsg').find('input[name=addMsg]').map(function(){return this.value;}).get().join("_#_") ;;
  var data = {
    application_account_id: $('#addTaskAccount1').val(),
  
    fan_time : node.find('input[name=fan_time]').val(),
    target_fan_count : node.find('input[name=target_fan_count]').val(),

    notes: node.find('textarea[name=notes]').val(),
    time_type: node.find('input[name=time_type]:checked').val(),
    time_tick: $('#time_tick').val(),
    time_week: $('#time_week').val() == null ? 0 : $('#time_week').val().toString(),
    session_id: parent.DmConf.userinfo.id,
    token: parent.DmConf.userinfo.token,
    message_text:addCont,
    'send_model': node.find('input[name=sendmodelRecommend]:checked').attr('valueAttr'),
    name:"私信点赞管理-推荐点赞私信",
  }
 if($('#addTaskAccount1').val().length == 0 ){
     return parent.plus_alertShow.show('请选择账号')
  }
  var ret = parent.getByRsync(parent.DmConf.api.new.Add_task_4,data);
  if(!ret.data.code){
    parent.plus_alertShow.show('任务设置成功')
  }else{
    parent.plus_alertShow.show(ret.data.info.msg)
  }
}

function addContent(type){
  if(type){
    
  }
  $('.addContent').append('<p class="input-group">\
                <input type="text" class="form-control" name="content" placeholder=" "     aria-describedby="basic-addon1"><button  onclick="del_msg(this)" type="button" class=" btn_style btn btn-primary" >删除</button>\
              </p>') 
}



function del_msg(t){

  $(t).parent().remove()
}