require.config({
   baseUrl: "../../public/js",
   urlArgs: "v=" +  parseInt(parseInt((new Date()).getTime()/1000)/100).toString(),  // 每分钟更新，方便开发,生产环境去掉
　　　paths: {
        "public" :"lib/public",
        
　　　}
});

require( ["public",], function (){
 web_init()
});


function search_init(){
   $('input[name=dyORvideo]').change(function(){
     if($(this).val() == 1){
         $('.hidden_sp').show();
         $('.hidden_file').hide()
     }else{
         $('.hidden_sp').hide();
         $('.hidden_file').show()
     }
   })
    

}

function saveTask(){
  var node = $('.step3');
  var data = {
    application_account_id: $('#addTaskAccount1').val(),
    video_title : $('.addContent').find('input[name=content]').val(),
    notes: node.find('textarea[name=notes]').val(),
    session_id: parent.DmConf.userinfo.id,
    token: parent.DmConf.userinfo.token,
    name:"视频管理-发视频",
  }

  if(1 == node.find('input[name=dyORvideo]:checked').val()){
    data['file_name'] =  $('input[name=video_fileName]').attr('file_name');
    data['play_url'] =  $('input[name=video_fileName]').attr('play_url');

  }else{
    data['file_name'] = $('input[name=video_fileName]').val();
    data['play_url'] = $('input[name=video_fileName]').attr('msg');

  }
  
 if($('#addTaskAccount1').val().length == 0 ){
     return parent.plus_alertShow.show('请选择账号')
  }
  if( !data['play_url'] ){
      return parent.plus_alertShow.show('请选择视频')
  }
  var ret = parent.getByRsync(parent.DmConf.api.new.Add_task_video,data);
  if(ret.data.code == 0){
    parent.plus_alertShow.show('任务设置成功');
    if(node.find('input[name=dyORvideo]:checked').val() == 1){
      var res = parent.getByRsync(parent.DmConf.api.new.Add_libvideo,{
                           token:parent.DmConf.userinfo.token,
                           session_id:parent.DmConf.userinfo.id, 
                           url: data['play_url'],
                           file_name:data['file_name']
                        })
      if(res.data.code != 0){
        return parent.plus_alertShow.show('素材导入库不成功，请自行导入');
      }
    }
  }else{
    parent.plus_alertShow.show(ret.data.info.msg)
  }
}