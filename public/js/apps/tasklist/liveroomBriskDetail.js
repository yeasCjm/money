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


function _reload(){$('#tableMy').bootstrapTable('refresh')}


function search_init(){
 

  
  var tableColumns = [
      
    {width:150, field: 'begin_time_time', title: '执行时间', align: 'center', valign: 'middle', },
    { width: 150,  field: 'end_time_time', title: '结束时间', align: 'center', valign: 'middle', },
    { width: 100, field: 'branch_no', title: '分身', align: 'center', valign: 'middle', },
    { width: 100,  field: 'mobile_label', title: '手机标签', align: 'center', valign: 'middle', },
  
    {width:100,field : 'status_name',title : '任务状态',align : 'center',valign : 'middle',},
      
  
       
      ];
     
  function responseHandler(info) {
      
    var status_name = parent.DmConf.task_status ;
        if(!parent.checkCode1002(info)){
          return 
        }

        for(var i=0;i<info.data.info.list.list.length;i++){
          
          info.data.info.list.list[i].status_name = status_name[info.data.info.list.list[i].status]
          info.data.info.list.list[i].begin_time_time = info.data.info.list.list[i].begin_time == 0 ? "" : parent.UnixToDateTime(info.data.info.list.list[i].begin_time)
          info.data.info.list.list[i].end_time_time = info.data.info.list.list[i].end_time == 0 ? "" : parent.UnixToDateTime(info.data.info.list.list[i].end_time)
         

        }
       
       
        return  { 
                  "total" : info.data.info.list.page.total ,
                  "rows"  :info.data.info.list.list
                }

        };
  function queryParams(params){
        var node = $('#tb');
        return { //每页多少条数据
          "session_id": parent.DmConf.userinfo.id,
          'token' : parent.DmConf.userinfo.token,
          "task_id":window.taskDetailInfo.id,
          "page_count" :params.limit,
          "page" :(params.offset/params.limit)+1, 
        } 
  };

   var detail = {
        "columns" :  tableColumns,
        "api" :   parent.DmConf.api.new.Task_result,
        "responseHandler" :  responseHandler,
        "queryParams" :   queryParams,
        "clickToSelect" : false,
      }
   new parent.get_search_list($('#tableMy'),detail,$('#refresh_btn'))
   
          
  }





var saveUser = {
  type : 0 ,
  api : '' ,
  func : '' ,
  user_id : 0 ,
  node : function(){return $('#addUser')},
  go : function(type,api,rows,func){
      var node = this.node();
      node.find('input').val('');
      node.find('textarea').val('');
      $('#user_status').val('1') ;
       $('#user_status').selectpicker()
      //$('#user_status').selectpicker('refresh').css({border:"1px solid #aeaeae",padding:"15px"});
      this.type = type ; 
      this.api = api ;
      this.func = func ;
      $('#AddUsers').text('添加登录账户')
      $('.hide_user_psd').show()
      if(type == 1){
       
        this.user_id = rows.id ;
        //$('.hide_user_psd').hide()
        $('#AddUsers').text('修改账号')
        node.find('input[name=user_name]').val(rows.user_name);
        node.find('input[name=user_tel]').val(rows.telephone);
        
        node.find('textarea[name=note]').val(rows.notes);
       
        $('#user_status').selectpicker('val',rows.status);
        $('#type').selectpicker('val',rows.type);
      }
      node.modal()
  },
  del : function(){

  },
  save : function(){
    var node = this.node();
    var dats = {
          "user_name": node.find('input[name=user_name]').val(),
          "type": $('#type').val(),
          "password": node.find('input[name=psd]').val(),
          "telephone": node.find('input[name=user_tel]').val(),
          "notes": node.find('textarea[name=note]').val(),
          "status":$('#user_status').val(),
          "customer_id":parent.DmConf.userinfo.customer_id,
          "id" : this.user_id
    }
    //this.type == 0 ? dats.password =  node.find('input[name=psd]').val()  : dats.id = this.user_id
    var ret = parent.getByRsync(this.api,dats);
    if(!ret.data.code){
      if(this.func){
        this.func()
      }
      node.modal('hide')
    }else{
      parent.plus_alertShow.show(ret.data.msg)
    }
  }
}