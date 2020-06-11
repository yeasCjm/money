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
function gotoColMsg(type){
  var data = $('#tableMy').bootstrapTable('getSelections');
  if (data.length == 0) return parent.plus_alertShow.show('请选择记录')
  if(type == 2){
    parent.secMsgDiscuss.show(data)
    //parent.mainPlatform.show_child_iframe('/apps/tasklist/new_collectComment_like.html', 'new_collectComment_like', 'new_collectComment_like123123', false, false, data);
  }else{
   // parent.mainPlatform.show_child_iframe('/apps/tasklist/new_collectComment.html', 'new_collectComment', 'new_collectComment', false, false, data);
    parent.msgCollect.show(data)
  }
  
}
function delAll(){
  var data = $("#tableMy").bootstrapTable('getSelections');
  if (data.length == 0) return parent.plus_alert('请选择记录');
  var str = '<p>确认是否删除选择的'+data.length+'条视频?</p>';
  var i_id = $.map(data, function (v) {  return v.id }).join(',')
  parent.config_delInfo.show(str, {
    acquisition_type: 1,
    id:i_id,
    token: parent.DmConf.userinfo.token,
    session_id: parent.DmConf.userinfo.id,
  }, parent.DmConf.api.new.Task_Del_acquisition_result, TBrefresh);

}
function search_init(){
 
  $('#tableMy').bootstrapTable('destroy')

  
      var tableColumns = [
        { width: 50, field : "checked", checkbox: true, },
        {width:150, field : 'task_name', title: '任务名', align: 'center', valign: 'middle', }, 
        {width:100, field : 'url', title: '视频链接', align: 'center', valign: 'middle',  },
        {width:100, field : 'talk', title: '视频话题', align: 'center', valign: 'middle', sortable: false },
        {width:100, field : 'video_desc', title: '视频内容', align: 'center', valign: 'middle', },
        { width: 150, field: 'keyword', title: '关键词', align: 'center', valign: 'middle', },
        { width: 100, field: 'city', title: '同城', align: 'center', valign: 'middle', },
        {width:100, field : 'big_dy', title: '大号', align: 'center', valign: 'middle', },
        {width:100, field : 'nickname', title: '昵称', align: 'center', valign: 'middle', },
        {width:100, field : 'comment_count', title: '视频评论数', align: 'center', valign: 'middle', sortable: true},
        {width:100, field : 'like_count', title: '视频点赞数', align: 'center', valign: 'middle', sortable: true },
        {width:150, field : 'addtime_time', title: '采集时间',align : 'center',valign : 'middle',  },
   
      ];
      function responseHandler(info) {
        if(!parent.checkCode1002(info)){
          return 
        }
        if(info.data.info){
          var task_status_name = ['否','是',];
          
          $.each(info.data.info.list,function(i,v){

            v.addtime_time = v.addtime ? parent.UnixToDateTime(v.addtime) :"";
            v.is_v_name = task_status_name[v.is_v] ;
            v.is_window_name = task_status_name[v.is_window] ;
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
          "begin_date": $("#begin_date").val(),
          "end_date": $("#end_date").val(),
          "comment_count": node.find('input[name=comment_like_count_begin]').val() + '_' + node.find('input[name=comment_like_count_end]').val(),
          "like_count": node.find('input[name=like_count]').val(),
          "keyword": node.find('input[name=keyword1]').val(),
          "city": node.find('input[name=city]').val(),
          "big_dy": node.find('input[name=big_dy]').val(),
          "talk": node.find('input[name=keyword]').val(),
          'order_field': params.sort,      //排序列名  
          'order_type': params.order,//排位命令（desc，asc）  
          "page" :(params.offset/params.limit)+1, 
        }
       
        return data
      }
      var detail = {
            "columns" :  tableColumns,
           "api": parent.DmConf.api.new.Task_video_result,
            "responseHandler" :  responseHandler,
            "queryParams" :   queryParams
      }
      new parent.get_search_list($('#tableMy'),detail,$('#refresh_btn'));
  
}

