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

function AddEventBtn(a, value, c) {
  return ['<button id="trend"  type="button" class="btn" >趋势</button> ', ].join('');

}

var csData;


var btn_events = {
  "click #trend": function (a, b, value) {
    csData['scrollTop'] = $('.fixed-table-body')[0].scrollTop;
    csData['showId'] = value.id;
    parent.mainPlatform.show_child_iframe('apps/tasklist/collect_haowu_result_trend.html', value.name + '的趋势详情', 'trend_' + value.id, false, false, value,'collect_msgHaowu_result',csData)
  },
}
function search_init(){
 

      $('#tableMy').bootstrapTable('destroy')
  
      var tableColumns = [
        {width:150, field: 'task_name', title: '任务名', align: 'center', valign: 'middle', sortable: false},
        {width:100, field: 'sort', title: '排名', align: 'center', valign: 'middle', },
        {width:150, field: 'product', title: '产品名称', align: 'center', valign: 'middle', },
        {width:75, field: 'order_count', title: '人气值', align: 'center', valign: 'middle', sortable: false },
        {width:50, field: 'price_name', title: '价格', align: 'center', valign: 'middle', sortable: false },
      /*   {width:100, field: 'like_count', title: '视频点赞数', align: 'center', valign: 'middle', },
        {width:100, field: 'comment_count', title: '视频评论数',align : 'center',valign : 'middle',  }, */
        {width:100, field: 'uid', title: '账号',align : 'center',valign : 'middle',  },
        {width:100, field: 'nickname', title: '昵称',align : 'center',valign : 'middle',  },
      /*    {width:100, field: 'authentication', title: '认证名称',align : 'center',valign : 'middle',  }, 
        {width:100, field: 'fan_count', title: '粉丝量',align : 'center',valign : 'middle',  }, */
        {width:150, field: 'addtime_time', title: '采集时间', align: 'center', valign: 'middle',},
        {width:80, field: 'Button', title: '操作', events: btn_events,align:'center', formatter: AddEventBtn }, 
   
      ];
      function responseHandler(info) {
        if(!parent.checkCode1002(info)){
          return 
        }
        if(info.data.info){
        
          $.each(info.data.info.list,function(i,v){
            v.addtime_time = v.addtime == 0 ? "" : parent.UnixToDateTime(v.addtime);
            v.price_name = v.price >0 ? v.price/100 : 0;
        
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
          'order_field': params.sort,      //排序列名  
          'order_type': params.order,//排位命令（desc，asc）  
          "page" :(params.offset/params.limit)+1, 
          "task_name": node.find('input[name=task_name]').val(),
          "product": node.find('input[name=product]').val(),
        }
        csData = data;
        if (window.taskDetailInfo) {
          data = window.taskDetailInfo.showIframe_data;

        }
        return data
      }
      var detail = {
            "columns" :  tableColumns,
        "api": parent.DmConf.api.new.Task_haowu_result,
            "responseHandler" :  responseHandler,
        'page': window.window.taskDetailInfo ? parseInt(window.window.taskDetailInfo.showIframe_data.page) : 0,
        'pageSize': window.window.taskDetailInfo ? parseInt(window.window.taskDetailInfo.showIframe_data.page_count) : 50,
            "queryParams" :   queryParams
      }
  new parent.get_search_list($('#tableMy'), detail, $('#refresh_btn'), returnBack);
 
      
}

function delAll() {
  var data = $("#tableMy").bootstrapTable('getSelections');
  if (data.length == 0) return parent.plus_alert('请选择记录');
  var str = data.length == 1 ? '<p>确定删除昵称' + data[0].nickname + '?</p>' : '<p>确定删除昵称' + data[0].nickname + '等'+data.length+'条记录?</p>';
  var i_id = $.map(data, function (v) {  return v.id }).join(',')
  parent.config_delInfo.show(str, {
    acquisition_type: 3,
    id: i_id,
    token: parent.DmConf.userinfo.token,
    session_id: parent.DmConf.userinfo.id,
  }, parent.DmConf.api.new.Task_Del_acquisition_result, TBrefresh);

}