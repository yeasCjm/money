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
    $("#message_type").selectpicker('refresh');
     $('input[name=dyORvideo]').click(function(){
        if($(this).val() == 0){
          $('.dyORvideo_0').show();
          $('.dyORvideo_1').hide();

        }else{
          $('.dyORvideo_0').hide();
          $('.dyORvideo_1').show();

        }
      })
    reloadCity()
    $("#message_type").parent().css({'z-index':6})
    
    $('#message_type').change(function(){
      if($(this).val() == 3){
        $('.hiide_3').hide()
      }else{
         $('.hiide_3').show()
      }
    })
}

function saveTask(){
  var node = $('.step3')
  var type = node.find('input[name=dyORvideo]:checked').val() ;
  var api_url = type == 0 ? parent.DmConf.api.new.Add_task_5 : parent.DmConf.api.new.Add_task_6
  var addCont = $('.addContent').find('input[name=content]').map(function(){return this.value;}).get().join("_#_") ;
  var message_text = $('.addMsg').find('input[name=addMsg]').map(function(){return this.value;}).get().join("_#_") ;
  var data = {
    application_account_id: $('#addTaskAccount1').val(),
    like_pbb: $('#like_pbb').prop('checked') ? 1 : 0,
    fan_pbb: $('#fan_pbb').prop('checked') ? 1 : 0,
    notes: node.find('textarea[name=notes]').val(),
    time_type: node.find('input[name=time_type]:checked').val(),
    time_tick: $('#time_tick').val(),
    time_week: $('#time_week').val() == null ? 0 : $('#time_week').val().toString(),
    session_id: parent.DmConf.userinfo.id,
    token: parent.DmConf.userinfo.token,
    comment_text:addCont,
    message_text:message_text,
    city : $('#city').val(),
  }
  let error_obj = [

    { at: "application_account_id", er_msg: "请选择账号" },
    { at: "target_play_count", er_msg: "请填写浏览视频数" },
 
  ]
    if(type == 0 ){
      data['target_play_count']  = node.find('input[name=target_play_count]').val() ;
      data['target_comment_count']  = node.find('input[name=target_comment_count]').val() ;
      data['target_comment_like_count']  = node.find('input[name=target_comment_like_count]').val() ;
      data['target_video_comment_count']  = node.find('input[name=target_video_comment_count]').val() ;
      data['name'] = "私信点赞管理-同城";
      var ee = [{ at: 'target_comment_count', er_msg: "评论视频数" }, { at: 'target_comment_like_count', er_msg: "每评论区随机点赞数" }, { at: 'target_video_comment_count', er_msg: "每视频评论数" }]
      error_obj = error_obj.concat(ee)
    }else{
      data['target_play_count']  = node.find('input[name=target_play_count_1]').val() ;
      data['fan_time']  = node.find('input[name=fan_time]').val() ;
      data['target_video_fan_count']  = node.find('input[name=target_video_fan_count]').val() ;
      data['target_video_message_count']  = node.find('input[name=target_video_message_count]').val() ;
      data['message_type']  = $('#message_type').val() ;
      //data['name'] = "私信点赞管理-同城点赞私信-评论区随机私信";
      data['name'] = "私信点赞管理-同城";
      var ee = [{ at: 'target_comment_count', er_msg: "关注间隔" }, { at: 'target_video_fan_count', er_msg: "关注数" }, { at: 'target_video_message_count', er_msg: "私信数" }]
      error_obj = error_obj.concat(ee)
    }
  

  

  var err_msg = check_emptyInput(data, error_obj);
  if (err_msg != 0) {
    return parent.plus_alertShow.show(err_msg)
  }
 

  var ret = parent.getByRsync(api_url,data);
  if(!ret.data.code){
    parent.plus_alertShow.show('任务设置成功')
  }else{
    parent.plus_alertShow.show(ret.data.info.msg)
  }
}