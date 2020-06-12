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
  return  [ '<button id="check_res"  type="button" class="btn" >私信任务</button> ', ].join('');
 
}
var btn_events = {
  "click #check_res" : function(a,b,value){
     var vv = JSON.stringify(value) ;

      parent.mainPlatform.show_child_iframe('apps/tasklist/selfMsg_his.html',value.name+'的任务详情','taskDetail_'+value.id,false,false,value)
  },

}

function goback(){
    parent.mainPlatform.show_child_iframe('apps/tasklist/collect_his.html',window.taskDetailInfo.name+'的任务详情','taskDetail_'+window.taskDetailInfo.id,false,false,window.taskDetailInfo,)
}
function search_init(){

      $('.smd_page_header').html(window.taskDetailInfo.name+'的关注任务历史')

      var tableColumns = [

        {width:150,field: 'name', title: '任务名称',align : 'center',valign : 'middle',},
        {width:150,field: 'acquisition_count', title: '采集数量',align : 'center',valign : 'middle',},
        {width:150,field: 'class_name', title: '标签', align : 'center',valign : 'middle',
        editable: {
                    type: 'text',
                    title: '修改标签名',
                    validate: function (v) {
                        var data = $('#tableMy').bootstrapTable('getData');
                        var idx = $(this).parent().parent().data('index');
                        var d_id = data[idx].id;
                        var dats = {token :parent.DmConf.userinfo.token,session_id:parent.DmConf.userinfo.id,mobile_label:v,id :d_id,};
                        var ret = parent.getByRsync(parent.DmConf.api.new.Group_mobile, dats);
                        $('#tableMy').bootstrapTable('refresh')
                    }
                },},
        {width:150,field: 'is_fan_count', title: '关注数量',align : 'center',valign : 'middle',},

       {width:150,field: 'reg_date_name1', title: '关注时间',align : 'center',valign : 'middle', },
       {width:150,field: 'reg_date_name', title: '私信时间',align : 'center',valign : 'middle', },
           {width:150,field: 'Button', title: '查看', events: btn_events,align:'center',formatter:AddEventBtn},
      ];
      function responseHandler(info) {
        if(!parent.checkCode1002(info)){
          return 
        }
        if(info.data.info){
          var task_status_name = ['未运行','正在运行','已结束'];
          $.each(info.data.info.list,function(i,v){
            v.reg_date_name = v.last_message_time == 0 ? "" : parent.UnixToDateTime(v.last_message_time)
            v.reg_date_name1 = v.last_fan_time == 0 ? "" : parent.UnixToDateTime(v.last_fan_time)
          
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
          "task_status" : $('#task_status_sel').val(),
          "page" :(params.offset/params.limit)+1, 
        }
        
        return data
      }
      var detail = {
            "columns" :  tableColumns,
            "api" :   parent.DmConf.api.new.Task_fan_list,
            "responseHandler" :  responseHandler,
            "queryParams" :   queryParams
      }
      new parent.get_search_list($('#tableMy'),detail,$('#refresh_btn'));
      
}

