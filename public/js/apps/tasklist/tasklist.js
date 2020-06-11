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
var csData ;
function AddEventBtn(a, value, c) {// 0未运行,1运行中，2结束，3错误，4中断，5手动结束
  var arr = ['<button id="delMission"  type="button" class="btn" >删除</button> ', '<button id="check_res"  type="button" class="btn" >详情</button> ' ];
  if (value.over_count > 0) arr.push('<button id="reloadMission"  type="button" class="btn" >重发</button> ');
  if (value.running_count > 0) arr.push('<button id="stopMission"  type="button" class="btn" >手动结束</button> ');
  return  arr.join('');
 
}

var btn_events = {
  "click #check_res" : function(a,b,value){
    if(value.level == 121){
      parent.mainPlatform.show_iframe('apps/tasklist/liveroomBriskDetail.html', value.name + '的任务详情', 'briskDetail', value, 'tasklist')
    }else{
      csData['scrollTop'] = $('.fixed-table-body')[0].scrollTop;
      csData['showId'] = value.id;
      csData['timeSel'] = $("#timeSel").val();

      parent.mainPlatform.show_child_iframe('apps/tasklist/taskDetail.html', value.name + '的任务详情', 'taskDetail_' + value.id, false, false, value, 'tasklist', csData)
    }
    
  },
  "click #reloadMission" : function(a,b,value){
    parent.pause_taskList.show(value, parent.DmConf.api.new.Start_task, TBrefresh,2)
    /*  parent.config_delInfo.show('开始任务:'+value.name,{
      task_id:value.id,
      token:parent.DmConf.userinfo.token,
      session_id:parent.DmConf.userinfo.id,
    },parent.DmConf.api.new.Start_task,TBrefresh);
 */
   
  },
  "click #delMission" : function(a,b,value){
     parent.config_delInfo.show('删除任务:'+value.name,{
      task_id:value.id,
      token:parent.DmConf.userinfo.token,
      session_id:parent.DmConf.userinfo.id,
    },parent.DmConf.api.new.Del_task,TBrefresh);

   
  },
  "click #stopMission" : function(a,b,value){
    parent.pause_taskList.show(value,parent.DmConf.api.new.Stop_task, TBrefresh,1)
    /*  parent.config_delInfo.show('暂停:'+value.name,{
      task_id:value.id,
      token:parent.DmConf.userinfo.token,
      session_id:parent.DmConf.userinfo.id,
    },parent.DmConf.api.new.Stop_task,TBrefresh); */

  
  },
  
}

function delAll(){
  var data = $("#tableMy").bootstrapTable('getSelections');
  if(data.length == 0) return parent.plus_alert('请选择记录');
  var str = data.length == 1 ? '<p>确定删除' + data[0].name + '?</p>' : '<p>确定删除' + data[0].name + '等' + data.length + '条记录?</p>'; 
  var i_id = $.map(data,function(v){  return v.id}).join(',')
  parent.config_delInfo.show(str, {
    task_id: i_id,
    token: parent.DmConf.userinfo.token,
    session_id: parent.DmConf.userinfo.id,
  }, parent.DmConf.api.new.Del_task, TBrefresh);


}

function search_init(){

    $("#tableMy").bootstrapTable('refresh')

      var tableColumns = [
        {
          width: 50, field: "checked", checkbox: true, formatter: function (r, i, v) {
            if (window.taskDetailInfo) {
              if (i.id == window.taskDetailInfo.showIframe_data.showId) {
                return {
                  checked: true
                }
              }
            }
          } },
/*         { width:150,field: 'id', title: '任务id', align: 'center', valign: 'middle', }, */
        { width:150,field: 'name', title: '任务名称', align: 'center', valign: 'middle',   },
         /*{width:100,field: 'get_fan_count', title: '关注数', align : 'center',valign : 'middle',},
        {width:100,field: 'like_count', title: '点赞数', align : 'center',valign : 'middle',},
        {width:100,field: 'message_count', title: '私信数', align : 'center',valign : 'middle',},
        {width:100,field: 'comment_count', title: '评论数', align : 'center',valign : 'middle',},
        {width:100,field: 'comment_fan_count', title: '评论区关注数', align : 'center',valign : 'middle',},*/
        { width:150,field: 'time_tick_name', title: '执行时间', align: 'center', valign: 'middle', },
        {width:100,field: 'mobile_info', title: '手机列表',align : 'center',valign : 'middle', },
        { width:150,field: 'reg_date_name', title: '发布时间', align: 'center', valign: 'middle',},
       /* {width:100,width:100,field: 'resource_status_name', title: '操作人',align : 'center',valign : 'middle', },*/
        { width:170,field: 'more_status_name', title: '状态', align: 'center', valign: 'middle',},
        { width:100,field: 'time_type_name', title: '任务类型', align: 'center', valign: 'middle',  },
        { width:100,field: 'task_type_name', title: '是否循环', align: 'center', valign: 'middle',},
       /*  { width:100,field: 'notes', title: '备注', align: 'center', valign: 'middle',}, */
        { width:150,field: 'Button', title: '操作',events: btn_events,align:'center',formatter:AddEventBtn},
      ];
      function responseHandler(info) {
        if(!parent.checkCode1002(info)){
          return 
        }
      /*  @return info[0][pause_count] 手动停止设备数量
   * @return info[0][not_running_count] 未运行设备数量
   * @return info[0][running_count] 运行设备数量
   * @return info[0][over_count] 结束设备数量
   * @return info[0][error_count] 报错设备数量 */
        if(info.data.info){
          var task_status_name = parent.DmConf.task_status;
          var time_name = ['立即执行任务','定时任务']
          $.each(info.data.info.list,function(i,v){
            v.time_tick_name = v.begin_time == 0  ? ""  :  parent.UnixToDateTime(v.begin_time);
            v.reg_date_name = parent.UnixToDateTime(v.reg_date) ;
            v.resource_status_name = task_status_name[v.task_status];
            v.more_status_name = v.not_running_count > 0 ? '<p>未运行设备数量:' + v.not_running_count + '</p>' : '' ;
            v.more_status_name +=v.over_count > 0 ? '<p>结束设备数量:' + v.over_count + '</p>' : '' ;
            v.more_status_name += v.running_count > 0 ? '<p>运行中设备数量:' + v.running_count + '</p>' : '' ;
            v.more_status_name += v.pause_count > 0 ? '<p>手动结束设备数量:' + v.pause_count + '</p>' : '' ;
            v.more_status_name += v.error_count > 0 ? '<p>报错设备数量:' + v.error_count + '</p>' : ''   ;
            
            v.task_type_name = v.time_type == 0 ?  "不循环" : ( v.time_week == 0 || v.time_week == null )  ? '不循环' : "周"+v.time_week ;
            v.time_type_name = time_name[v.time_type] ;
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
          "time_type" : $('#task_type_sel').val(),
          "page" :(params.offset/params.limit)+1, 
        }
        if($("#timeSel").val() == 0){
          data["begin_date"] = new Date($("#begin_date").val()).valueOf()/1000
          data["end_date"] = new Date($("#end_date").val()).valueOf()/1000
        
        }else{
            data["begin_reg_date"] = new Date($("#begin_date").val()).valueOf()/1000
          data["end_reg_date"] = new Date($("#end_date").val()).valueOf()/1000
        }
        if(self.frameElement.getAttribute('id') == 'equipment1'){//普通用户
           data["agent_type"] = 4
        }

        csData = data;
        if (window.taskDetailInfo) {
          data = window.taskDetailInfo.showIframe_data;

        }
        return data
      }
      var detail = {
            "columns" :  tableColumns,
            "api" :   parent.DmConf.api.new.Task_list,
            "responseHandler" :  responseHandler,
        'page': window.window.taskDetailInfo ? parseInt(window.window.taskDetailInfo.showIframe_data.page) : 0,
        'pageSize': window.window.taskDetailInfo ? parseInt(window.window.taskDetailInfo.showIframe_data.page_count) : 50,
            "queryParams" :   queryParams
      }
      new parent.get_search_list($('#tableMy'),detail,$('#refresh_btn'),returnBack);
      
}

function task_resInfo(msg){
  var ret = parent.getByRsync(parent.DmConf.api.new.Task_result,{
    task_id : msg.id,
    session_id:parent.DmConf.userinfo.id,
    token : parent.DmConf.userinfo.token
  })
   if(!ret.data.code){
        var vv =  '<p>增长粉丝数:'+ret.data.info.result[0].fan_count
            +'</p><p>增长点赞数:'+ret.data.info.result[0].like_count
            +'</p><p>增长评论数:'+ret.data.info.result[0].comment_count
            +'</p><p>增长播放数:'+ret.data.info.result[0].play_count
            +'</p><p>评论用户关注数量:'+ret.data.info.result[0].comment_fan_count
            +'</p><p>私信数量:'+ret.data.info.result[0].message_count+'</p>';
        $('.task_resInfo').html('')
        $('.task_resInfo').html(vv)
        $('#task_res').modal()
     }else{
      parent.plus_alert(ret.data.msg)
     }
  
}