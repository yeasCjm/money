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

    $('input[name=immediately]').click(function(){
       
        if($(this).val() == 1){
            $('.time_task').show()
        }else{
            $('.time_task').hide()
        }
    });
    $('input[name=dyORvideo]').click(function(){
    if($(this).val() == 0){
      $('.dyORvideo_0').show();
      $('.dyORvideo_1').hide();
      $('.dyORvideo_2').show();
      $('.dyORvideo_3').show();
      $('.dyORvideo_4').hide();
      $('.dyORvideo_5').hide();


    }else if($(this).val() == 1){
      $('.dyORvideo_0').hide();
      $('.dyORvideo_2').hide();
      $('.dyORvideo_1').show();
      $('.dyORvideo_3').hide();
      $('.dyORvideo_4').show();
      $('.dyORvideo_5').show();

    }else{
      $('.dyORvideo_0').hide();
      $('.dyORvideo_2').show();
      $('.dyORvideo_1').hide();
      $('.dyORvideo_3').hide();
      $('.dyORvideo_4').show();
      $('.dyORvideo_5').show();
    }
  });

    $('#message_type').change(function(){
      if($(this).val() == 3){
        $('.hiide_3').hide()
      }else{
         $('.hiide_3').show()
      }
    })
}

function saveTask(){
  var task_name = ['评论区随机点赞','评论区随机私信','视频路径私信']
  var node = $('.step3');
  var addCont = $('.addContent').find('input[name=content]').map(function(){return this.value;}).get().join("_#_") ;
  var addMsg = $('.addMsg').find('input[name=addMsg]').map(function(){return this.value;}).get().join("_#_") ;
  var data = {
    application_account_id: $('#addTaskAccount1').val(),

    play_url: node.find('input[name=play_url]').val(),
    target_comment_like_count: node.find('input[name=target_comment_like_count]').val(),
    message_type : $('#message_type').val(),
    resource_id: node.find('input[name=resource_id]').val(),
    task_type :  Number(node.find('input[name=dyORvideo]:checked').val() )+1 ,

    target_play_count: node.find('input[name=target_play_count]').val(),

    target_video_fan_count: node.find('input[name=target_video_fan_count]').val(),
    target_video_message_count: node.find('input[name=target_video_message_count]').val(),
    fan_time: node.find('input[name=fan_time]').val(),
    
    like_pbb: $('#like_pbb').prop('checked') ? 1 : 0,
    fan_pbb: $('#fan_pbb').prop('checked') ? 1 : 0,
    notes: node.find('textarea[name=notes]').val(),
    time_type: node.find('input[name=time_type]:checked').val(),
    time_tick: $('#time_tick').val(),
    time_week:  $('#time_week').val() == null ? 0 : $('#time_week').val().toString(),
    session_id: parent.DmConf.userinfo.id,
    token: parent.DmConf.userinfo.token,
    comment_text:addCont,
    message_text:addMsg,
    name:"私信点赞管理-精准点赞私信-"+task_name[node.find('input[name=dyORvideo]:checked').val()],
  }
  if($('#addTaskAccount1').val().length == 0 ){
     return parent.plus_alertShow.show('请选择账号')
  }
  var ret = parent.getByRsync(parent.DmConf.api.new.Add_task_7,data);
  if(!ret.data.code){
    parent.plus_alertShow.show('任务设置成功')
  }else{
    parent.plus_alertShow.show(ret.data.info.msg)
  }
}