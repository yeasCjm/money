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
  var ret = parent.getByRsync(parent.DmConf.api.new.mobile_list,{
    session_id : parent.DmConf.userinfo.id,
    token : parent.DmConf.userinfo.token,
    page_count: 99999,
    page: 1,
    type:2
  })
  if(ret.data.code ){
    return parent.plus_alertShow.show(ret.data.msg)
  }else{
    var data = ret.data.info.list;
    var res = []
    let dataInfo = {};

    data.forEach((item, index) => {
      item['name'] = item.group_name;
      let { name } = item;
      
      if (!dataInfo[name]) {
        dataInfo[name] = {
          id: index,
          name,
          son: []
        }
      }
      item['nodeId'] = item.imei;
      item['name'] = item.mobile_label;
      item['parentName'] = item['group_name']
      dataInfo[name].son.push(item);
    });
    let list = Object.values(dataInfo);
    $('#phoneList').selectNilaoweiAbc({
      treeData: list,
      data: [],
      isDevelopMode: true,
      isMultiple: false
    });
  }
  
}

function saveTask(){

  var data = {
  /*  "resource_id" : $("#addTaskResource1").val() ,
    "name" : $('input[name=massion_name]').val(),
    "task_type" : $('input[name=task_type]').data('value') ,
    "application_account_id" :$('#addTaskAccount1').val() ,
    "level" : $('#level').val(),
    "task_content" : $('input[name=task_content]').val(),*/
    "imei_list": $('#phoneList').val(),
    "action_type" : $('input[name=type_1]:checked').val(),
    "session_id" : parent.DmConf.userinfo.id,
    "token" : parent.DmConf.userinfo.token,
    "customer_id" : parent.DmConf.userinfo.customer_id,
    "id" : 0,
  }
  
  if ($('#phoneList').val().length == 0 ){
     return parent.plus_alertShow.show('请选择账号')
  }
  if (!data['action_type']) return parent.plus_alertShow.show('请选择任务')
  var ret = parent.getByRsync(parent.DmConf.api.new.Clear_memory_task,data);
  if(ret.data.code == 0){
    parent.plus_alertShow.show('任务设置成功')
  }else{
    parent.plus_alertShow.show(ret.data.info.msg)
  }
}