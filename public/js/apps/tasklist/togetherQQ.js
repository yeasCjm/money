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
  return ['<button id="caiji"  type="button" class="btn" >发起群聊</button> ', ].join('');
 
}
var btn_events = {
  "click #caiji" : function(a,b,value){
    parent.gotoCheat.show(value,window.taskDetailInfo)
  },
 
  

}
function search_init(){




      var tableColumns = [
      
        { width: 100, field: 'douyin_uid', title: '抖音号',align : 'center',valign : 'middle',  },
        
       /*  {width:100,field: 'time_tick_name', title: '群组账号',align : 'center',valign : 'middle', }, */
        { width: 100, field: 'group_name', title: '群聊名称',align : 'center',valign : 'middle', },
        { width: 100, field: 'user_count', title: '人数',align : 'center',valign : 'middle', },
     
        { width: 150, field: 'first_talk_time_time', title: '第一次群聊时间',align : 'center',valign : 'middle', },
        { width: 150, field: 'last_talk_time_time', title: '最新群聊时间', align: 'center', valign: 'middle', },
        {width:150,field: 'Button', title: '操作', events: btn_events,align:'center',formatter:AddEventBtn},
      ];
      function responseHandler(info) {
        if(!parent.checkCode1002(info)){
          return 
        }
        if(info.data.info){

          $.each(info.data.info.list,function(i,v){

            v.first_talk_time_time = v.first_talk_time == 0 ? "" : parent.UnixToDateTime(v.first_talk_time);
            v.last_talk_time_time = v.last_talk_time == 0 ? "" : parent.UnixToDateTime(v.last_talk_time) ;

          
          })
        }

        return  { 
                   "total" : info.data.info.page.total ,
                  "rows"  :info.data.info.list
                }

      }

      function queryParams(params){
        var node = $('#tb');

        var data = { //每页多少条数据
          "session_id":parent.DmConf.userinfo.id,
          "token":parent.DmConf.userinfo.token,
          "page_count" :params.limit,
          "application_account_id": window.taskDetailInfo.id,
          "group_name": node.find('input[name=group_name]').val(),
          "end_date": $("#end_date").val(),
          "begin_date" : $('#begin_date').val(),
          "page" :(params.offset/params.limit)+1, 
        }
    
        
        
        return data
      }
      var detail = {
            "columns" :  tableColumns,
        "api": parent.DmConf.api.new.Task_Group_list,
            "responseHandler" :  responseHandler,
            "queryParams" :   queryParams
      }
      new parent.get_search_list($('#tableMy'),detail,$('#refresh_btn'));
      
}

