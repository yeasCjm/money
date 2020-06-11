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

  return ['<button id="show"  type="button" class="btn">播放</button> ', '<button id="del_info"  type="button" class="btn">删除</button> '].join('') 
}
var btn_events = {

    "click #show" : function(a,b,value){
    window.open(value.share_url,'_blank') 
    },
  "click #del_info": function (a, b, value) {
    parent.config_delInfo.show('确定删除该视频吗？', {
    
      token: parent.DmConf.userinfo.token,
      session_id: parent.DmConf.userinfo.id,
      id: value.id,
    }, parent.DmConf.api.new.Openuser_Del_video, TBrefresh);

  },

}


function search_init(){



  var tableColumns = [
        {width:150,field : "checked" , checkbox:true,},
       
       
    { width: 150, field: 'talk', title: '视频话题', align : 'center',valign : 'middle',width:150,},
    { width: 150, field: 'title', title: '视频内容', align: 'center', valign: 'middle', },
    { width: 150, field: 'is_status', title: '视频状态', align : 'center',valign : 'middle',},
    
    { width: 150, field: 'digg_count', title: '点赞数', align : 'center',valign : 'middle',},
    { width: 150, field: 'comment_count', title: '评论数', align : 'center',valign : 'middle',},
    { width: 150, field: 'play_count', title: '播放数', align: 'center', valign: 'middle', },
    { width: 150, field: 'at_name', title: '@好友', align : 'center',valign : 'middle',},
    { width: 150, field: 'reg_date_name', title: '发布时间', align : 'center',valign : 'middle',},
        {width:150,field: 'Button', title: '操作', events: btn_events,align:'center',formatter:AddEventBtn},
      ];

  function responseHandler(info) {
        var is_online_name = ['<span style="color:red">离线</span>','<span style="color:green">在线</span>']
        var is_busy_name = ['<span style="color:green">空闲</span>','<span style="color:red">忙碌</span>'];
       var status = ['审核中', '审核结束']
         if(!parent.checkCode1002(info)){
          return 
        }
         $.each(info.data.info.list,function(i,v){
           
           v.reg_date_name = parent.UnixToDateTime(v.create_time)
           v.is_status = v.is_reviewed ? "审核结束" : "审核中" 
          })
        return  { 
                   "total" : info.data.info.page.total ,
                  "rows"  :info.data.info.list
                }

        };
  function queryParams(params){
        var node = $('#tb');

        return { //每页多少条数据
          "customer_id" : parent.DmConf.userinfo.customer_id,
          "page_count" :params.limit,
           user_id : window.taskDetailInfo.id ,
          "begin_date": $("#begin_date").val(),
          "end_date": $("#end_date").val(),
          "keyword": $("#keyword").val(),
          "page" :(params.offset/params.limit)+1, 
          "session_id": parent.DmConf.userinfo.id,
          'token' : parent.DmConf.userinfo.token,
         
        } 
  };

   var detail = {
        "columns" :  tableColumns,
     "api": parent.DmConf.api.new.Openuser_Video_list,
        "responseHandler" :  responseHandler,
        "queryParams" :   queryParams,
        "clickToSelect" : false,
      }
   new parent.get_search_list($('#tableMy'),detail,$('#refresh_btn'))

          
  }

function delAll() {
  var data = $("#tableMy").bootstrapTable('getSelections');
  if (data.length == 0) return parent.plus_alert('请选择记录');
  var str =  '<p>确定删除'+ data.length + '条记录?</p>';
  var i_id = $.map(data, function (v) { return v.id }).join(',')
  parent.config_delInfo.show(str, {
    task_id: i_id,
    token: parent.DmConf.userinfo.token,
    session_id: parent.DmConf.userinfo.id,
  }, parent.DmConf.api.new.Del_task, TBrefresh);


}
