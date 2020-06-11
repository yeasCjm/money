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
  if(data.length == 0 )  return parent.plus_alert('请选择记录')
  if(type == 2){
    parent.mainPlatform.show_child_iframe('/apps/tasklist/new_collectComment_like.html', 'new_collectComment_like', 'new_collectComment_like123123', false, false, data);
  }else{
    parent.mainPlatform.show_child_iframe('/apps/tasklist/new_collectComment.html', 'new_collectComment', 'new_collectComment', false, false, data);
  }
  
}

function search_init(){
 


  
      var tableColumns = [
        { field: "checked", checkbox: true, },
        { field: 'task_name', title: '任务名', align: 'center', valign: 'middle', }, 
        { field: 'url', title: '视频链接', align: 'center', valign: 'right', width:"200px" },
        { field: 'talk', title: '视频话题', align: 'center', valign: 'middle', },
        { field: 'video_desc', title: '视频内容', align: 'center', valign: 'middle', },
        { field: 'keyword', title: '搜索词', align: 'center', valign: 'middle', },
        { field: 'nickname', title: '昵称', align: 'center', valign: 'middle', },
       /* { field: 'fan_count', title: '粉丝量', align: 'center', valign: 'middle', },
         { field: 'is_v_name', title: '是否带蓝V', align: 'center', valign: 'middle', },
        { field: 'is_window_name', title: '是否带橱窗',align : 'center',valign : 'middle',  }, */
        
        { field: 'comment_count', title: '视频评论数量',align : 'center',valign : 'middle',  },
        { field: 'like_count', title: '视频点赞数',align : 'center',valign : 'middle',  },

        { field: 'addtime_time', title: '采集时间',align : 'center',valign : 'middle',  },
   
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
          "comment_count": node.find('input[name=comment_count]').val(),
          "like_count": node.find('input[name=like_count]').val(),
          "task_name": node.find('input[name=task_name]').val(),
          "keyword": node.find('input[name=keyword]').val(),

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

