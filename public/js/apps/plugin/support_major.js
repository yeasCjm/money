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
    })

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

function removePlayurl(t){
  $(t).parent().remove()
}

function addPlayurl(){
  $('.moreUrlist').append(' <div class="input-group margin10 dyORvideo_1" >\
    <span class= "input-group-addon width90" id = "basic-addon1" > 视频</span >\
    <input type="text" class="form-control" name="play_url" placeholder="请输入链接" aria-describedby="basic-addon1">\
    <span onclick="addPlayurl()" class=" left10pxSp iconfont icon-jia"></span><span onclick="removePlayurl(this)" class=" left10pxSp iconfont icon-jian"></span>\
    </div>')
}

function saveTask(){
  var node = $('.step3');
  var addCont = $('.addContent').find('input[name=content]').map(function(){return this.value;}).get().join("_#_") ;
  var urlist = $('.moreUrlist').find('input[name=play_url]').map(function (v) { return this.value; }).get().filter(item => item) ;
  
  var data = {
    application_account_id: $('#addTaskAccount1').val(),
 

    url_list: JSON.stringify(urlist),
    target_play_count: node.find('input[name=target_play_count]').val(),
    share_count: node.find('input[name=share_count]').val(),
    comment_pbb: node.find('input[name=comment_pbb]').val(),
    like_pbb: node.find('input[name=like_pbb]').val(),
    play_time: node.find('input[name=play_time_0]').val()+'_'+node.find('input[name=play_time_1]').val(),
    task_type:Number(node.find('input[name=dyORvideo]:checked').val())+1,
    time_type: node.find('input[name=time_type]:checked').val(),
    time_tick: $('#time_tick').val(),
    time_week: $('#time_week').val(),
    notes: node.find('textarea[name=notes]').val(),
    session_id: parent.DmConf.userinfo.id,
    token: parent.DmConf.userinfo.token,
    comment_text:addCont,
    'send_model': node.find('input[name=sendmodeladdtask]:checked').attr('valueAttr'),
    name:"蹭热门",
  }


  let error_obj = [
    { at: "name", er_msg: "请填写任务名" },
    { at: "application_account_id", er_msg: "请选择应用账号" },
    { at: "target_play_count", er_msg: "请填写播放量" },
  
    { at: "like_pbb", er_msg: "请填写点赞率" },
    { at: "comment_pbb", er_msg: "请填写评论率" },
    { at: "url_list", er_msg: "请填写视频链接", detail: { "len": 2 } },
    { at: "play_time", er_msg: "请填写播放时长", detail: { "len": 2 } },
    { at: "share_count", er_msg: "请填写z转发视频数" },
  ]

  var err_msg = check_emptyInput(data, error_obj);
  if (err_msg != 0) {
    return parent.plus_alertShow.show(err_msg)
  }

 
   var ret = parent.getByRsync(parent.DmConf.api.new.Add_task_1,data);
  if(!ret.data.code){
    parent.plus_alertShow.show('任务设置成功')
  }else{
    parent.plus_alertShow.show(ret.data.info.msg)
  } 
}