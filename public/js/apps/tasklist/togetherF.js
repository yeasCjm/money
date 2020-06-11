require.config({
   baseUrl: "../../public/js",
   urlArgs: "v=" +  parseInt(parseInt((new Date()).getTime()/1000)/100).toString(),  // 每分钟更新，方便开发,生产环境去掉
　　　paths: {
        "public" :"lib/public"
　　　}
});
var csData ;
require( ["public"], function (){
 web_init()
});

function AddEventBtn(a,value,c){
  var arr = []
  if(value.user_name){
    arr = ['<button id="caiji"  type="button" class="btn" >采集</button> ', '<button id="fir_detail"  type="button" class="btn" >好友详情</button> ', '<button id="qq_detail"  type="button" class="btn" >群聊详情</button> ']
  }
  return arr.join('');
 
}
var btn_events = {
  "click #caiji" : function(a,b,value){
    parent.togetherCaiji.show(value)
  },
  "click #fir_detail": function (a, b, value) {
    csData['scrollTop'] = $('.fixed-table-body')[0].scrollTop
    csData['showId'] = value.id
    parent.mainPlatform.show_child_iframe('apps/tasklist/togetherFri.html', value.name + '的好友详情', 'togetherFri_' + value.id, false, false, value, 'togetherF', csData)
  },
  "click #qq_detail": function (a, b, value) {
    csData['scrollTop'] = $('.fixed-table-body')[0].scrollTop
    csData['showId'] = value.id
    parent.mainPlatform.show_child_iframe('apps/tasklist/togetherQQ.html', value.name + '的群聊详情', 'togetherQQ_' + value.id, false, false, value, 'togetherF', csData)
  },
  

}


function search_init(){

      $('#tableMy').bootstrapTable('destroy');


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
          }
        }, 
        { width: 100, field: 'user_name', title: '我的抖音号', align: 'center', valign: 'middle', },
        
        { width: 100, field: 'nick_name', title: '昵称',align : 'center',valign : 'middle', },
    /*     {width:100, field: 'mobile_info', title: '手机管理员',align : 'center',valign : 'middle',}, */
        { width: 100, field: 'mobile_label', title: '手机编号',align : 'center',valign : 'middle', },
     
        { width: 150, field: 'keyword', title: '业务关键词',align : 'center',valign : 'middle', },
        { width: 100, field: 'hg_count', title: '互关好友数量', align: 'center', valign: 'middle', },
        { width: 140, field: 'reg_date_name', title: '采集时间', align: 'center', valign: 'middle', },
        {width:170, field: 'Button', title: '操作', events: btn_events,align:'center',formatter:AddEventBtn},
      ];
      function responseHandler(info) {
        if(!parent.checkCode1002(info)){
          return 
        }
        if(info.data.info){

          $.each(info.data.info.list,function(i,v){

            v.reg_date_name = parent.UnixToDateTime(v.reg_date) ;

          
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
          "keyword": node.find('input[name=keyword_sma]').val(),
          type : 1 ,
          "page" :(params.offset/params.limit)+1, 
        }
        csData = data;
        if (window.taskDetailInfo) {
          data = window.taskDetailInfo.showIframe_data;

        }
  
        
        return data
      }
      var detail = {
            "columns" :  tableColumns,
            "api": parent.DmConf.api.new.Applicationaccount_list,
            "responseHandler" :  responseHandler,
            "queryParams" :   queryParams,
            'page':window.taskDetailInfo ? parseInt(window.taskDetailInfo.showIframe_data.page) : 0,
            'pageSize':window.taskDetailInfo ? parseInt(window.taskDetailInfo.showIframe_data.page_count) : 50,
      }
    
      new parent.get_search_list($('#tableMy'),detail,$('#refresh_btn'),returnBack);

 /*  if (window.taskDetailInfo) {
    setTimeout(function () {
    $('.fixed-table-body')[0].scrollTop = window.taskDetailInfo.showIframe_data.scrollTop;
      window.taskDetailInfo = '' ;

    }, 1000)
  } */
}

function shareRoom(){
  parent.shareRoom.show($('#tableMy').bootstrapTable('getSelections'), TBrefresh)
}
