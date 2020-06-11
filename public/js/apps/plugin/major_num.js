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

  return [ '<button id="mobile_info"  type="button" class="btn" >修改</button> ', '<button id="del_info"  type="button" class="btn">删除</button> '].join('') 
}
var btn_events = {

    "click #del_info" : function(a,b,value){
      var msg = '大号昵称名:'+value.user_name ;
      parent.config_delInfo.show(msg,{id:value.id,token:parent.DmConf.userinfo.token,session_id:parent.DmConf.userinfo.id},parent.DmConf.api.new.Del_applicationaccount,TBrefresh);
    },
    "click #mobile_info" : function(a,b,value){
        parent.addAccount.show(2,value)
    }
}


function search_init(){



  var tableColumns = [
    { width: 50,field : "checked" , checkbox:true,},
        {width:150,field: 'user_name', title: '大号账号', align : 'center',valign : 'middle',},
        {width:150,field: 'nick_name', title: '抖音昵称', align : 'center',valign : 'middle',},
        {width:150,field: 'like_count', title: '点赞数', align : 'center',valign : 'middle',},
        {width:150,field: 'get_like_count', title: '获赞数', align : 'center',valign : 'middle',},
        {width:150,field: 'get_fan_count', title: '关注数', align : 'center',valign : 'middle',},
        {width:150,field: 'fan_count', title: '粉丝数', align : 'center',valign : 'middle',},
        {width:150,field: 'play_count', title: '播放', align : 'center',valign : 'middle',},
        {width:150,field: 'Button', title: '操作', events: btn_events,align:'center',formatter:AddEventBtn},
      ];

  function responseHandler(info) {
      
         if(!parent.checkCode1002(info)){
          return 
        }
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
          "user_name" :node.find('input[name=user_name]').val(),
          "page" :(params.offset/params.limit)+1, 
          "session_id": parent.DmConf.userinfo.id,
          'token' : parent.DmConf.userinfo.token,
          "type": 2,
        } 
  };

   var detail = {
        "columns" :  tableColumns,
        "api" :   parent.DmConf.api.new.Applicationaccount_list,
        "responseHandler" :  responseHandler,
        "queryParams" :   queryParams,
        "clickToSelect" : false,
      }
   new parent.get_search_list($('#tableMy'),detail,$('#refresh_btn'))

          
  }

 
