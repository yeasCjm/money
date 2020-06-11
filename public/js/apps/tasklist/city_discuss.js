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
    reloadCity()
}

function saveTask(){
  var node = $('.step3');
  var addCont = $('.addContent').find('input[name=content]').map(function(){return this.value;}).get().join("_#_") ;
  var data = {
    application_account_id: $('#addTaskAccount1').val(),
    fan_pbb: $('#target_fan_count').prop('checked') ? 1 : 0,
    like_pbb: $('#target_like_count').prop('checked') ? 1 : 0,
    target_comment_count: node.find('input[name=target_comment_count]').val(),
    target_play_count: node.find('input[name=target_play_count]').val(),
    notes: node.find('textarea[name=notes]').val(),
    time_type: node.find('input[name=time_type]:checked').val(),
    time_tick: $('#time_tick').val(),
    time_week: $('#time_week').val() == null ? 0 : $('#time_week').val().toString(),
    session_id: parent.DmConf.userinfo.id,
    token: parent.DmConf.userinfo.token,
    comment_text:addCont,
    city : $('#city').val(),
    name:"截流管理-同城评论",
  }

  let error_obj = [

    { at: "application_account_id", er_msg: "请选择账号" },
    { at: "target_play_count", er_msg: "请选择浏览视频个数" },
    { at: "target_comment_count", er_msg: "请选择评论视频概率" },

  ]
  

  var err_msg = check_emptyInput(data, error_obj);
  if (err_msg != 0) {
    return parent.plus_alertShow.show(err_msg)
  }
  var ret = parent.getByRsync(parent.DmConf.api.new.Add_task_2,data);
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