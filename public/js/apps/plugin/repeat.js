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

function AddEventBtn(a,value,c){
  var eventBtn = [];
  if(value.status == 0){
    eventBtn = [ '<button id="mobile_info"  type="button" class="btn" >解决</button> ', ]
  }
  return eventBtn.join('') 
}
var btn_events = {

    "click #mobile_info" : function(a,b,value){

        var ret = parent.getByRsync(parent.DmConf.api.new.Status_mobile_fault,{token:parent.DmConf.userinfo.token,session_id:parent.DmConf.userinfo.id,status:1,id:value.id});
        if(!parent.checkCode1002(ret)){
          return 
        }
        $('#tableMy').bootstrapTable('refresh')
        return parent.plus_alert('修改成功')
        
    }
}


function search_init(){

  $("#status").selectpicker('val',0)

  var tableColumns = [
    { width: 50,field : "checked" , checkbox:true,},
    { width:150,field: 'add_time', title: '上报时间', align: 'center', valign: 'middle', },
        {width:150,field: 'mobile_label', title: '设备', align : 'center',valign : 'middle',},
        {width:150,field: 'content', title: '内容', align : 'center',valign : 'middle',},
        {width:150,field: 'status_name', title: '状态', align : 'center',valign : 'middle',},
        {width:150,field: 'Button', title: '操作', events: btn_events,align:'center',formatter:AddEventBtn},
      ];

  function responseHandler(info) {
        var is_status_name = ['<span style="color:red">未解决</span>','<span style="color:green">已解决</span>']

         if(!parent.checkCode1002(info)){
          return 
        }

        $.each(info.data.info.info.list,function(i,v){
            v.status_name = is_status_name[v.status];
          v.add_time = v.addtime == 0 ? "" : parent.UnixToDateTime(v.addtime);
        })
        return  { 
                   "total" : info.data.info.info.page.total ,
                  "rows"  :info.data.info.info.list
                }

        };
  function queryParams(params){
        var node = $('#tb');

        return { //每页多少条数据
          "customer_id" : parent.DmConf.userinfo.customer_id,
          "page_count" :params.limit,
          "content" : node.find('input[name=user_name]').val(),
          "status" : $('#status').val(),
          "begin_date": $("#begin_date").val(),
          "end_date": $("#end_date").val(),
          "page" :(params.offset/params.limit)+1, 
          "session_id": parent.DmConf.userinfo.id,
          'token' : parent.DmConf.userinfo.token,
      
        } 
  };

   var detail = {
        "columns" :  tableColumns,
        "api" :   parent.DmConf.api.new.Mobile_fault,
        "responseHandler" :  responseHandler,
        "queryParams" :   queryParams,
        "clickToSelect" : false,
      }
   new parent.get_search_list($('#tableMy'),detail,$('#refresh_btn'))

          
  }

 
function clearW(){
  var data = $("#tableMy").bootstrapTable('getSelections') ;
  if(data.length == 0 ) return parent.plus_alertShow.show('请选择记录')
  var id_list = data.map(function(i){return i.id}).toString();
  var str = '确定选择的'+data.length+'条记录已解决?'
  parent.config_delInfo.show(str, {token: parent.DmConf.userinfo.token, session_id: parent.DmConf.userinfo.id, status: 1, id: id_list }, parent.DmConf.api.new.Status_mobile_fault, TBrefresh);
 
}


function clear1() {
  var data = $("#tableMy").bootstrapTable('getSelections');
  if (data.length == 0) return parent.plus_alertShow.show('请选择记录')
  var id_list = data.map(function (i) { return i.id }).toString();
  var str = '确定删除选择的' + data.length + '条记录?'
  parent.config_delInfo.show(str, { token: parent.DmConf.userinfo.token, session_id: parent.DmConf.userinfo.id, status: 1, id: id_list }, parent.DmConf.api.new.Mobile_Del_mobile_fault, TBrefresh);
}
