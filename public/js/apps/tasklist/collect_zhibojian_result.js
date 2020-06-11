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
var btn_events = {
  "click #trend": function (a, b, value) {
    
    parent.mainPlatform.show_child_iframe('apps/tasklist/collect_haowu_result_trend.html', value.name + '的趋势详情', 'trend_' + value.id, false, false, value)
  },
}
function gotoFir(t) {
  var data = $("#tableMy").bootstrapTable('getSelections');
  if (data.length == 0) {
    return parent.plus_alert('请选择记录');
  };
  if (t == 1) {
    parent.mainPlatform.show_child_iframe('/apps/tasklist/new_collectComment_chat.html', 'new_collectComment_chat', 'new_collectComment_chat123123', false, false, data);
  } else if (t == 2) {

  } else {
    parent.mainPlatform.show_child_iframe('/apps/tasklist/new_collectComment_concern.html', 'new_collectComment_concern', 'new_collectComment_concern123123', false, false, data);
  };
}
function search_init(){
 

      $('#tableMy').bootstrapTable('destroy')
  
      var tableColumns = [
        { field: 'task_name', title: '直播间', align: 'center', valign: 'middle',},
        { field: 'sort', title: '抖音号', align: 'center', valign: 'middle', },
        { field: 'product', title: '昵称', align: 'center', valign: 'middle', },
        { field: 'order_count', title: '关键词', align: 'center', valign: 'middle', },
        { field: 'price_name', title: '性别', align: 'center', valign: 'middle', },

        { field: 'uid', title: '提问内容',align : 'center',valign : 'middle',  },
        { field: 'nickname', title: '是否关注',align : 'center',valign : 'middle',  },

        { field: 'addtime_time', title: '采集时间', align: 'center', valign: 'middle', },

   
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
         
          "page" :(params.offset/params.limit)+1, 
        }
       
        return data
      }
      var detail = {
            "columns" :  tableColumns,
        "api": parent.DmConf.api.new.Task_haowu_result,
            "responseHandler" :  responseHandler,
            "queryParams" :   queryParams
      }
      new parent.get_search_list($('#tableMy'),detail,$('#refresh_btn'));
   /*   var data = [{  'sort' : 1 ,  'product' :  '[胖佳佳大码定制]胖m穿衣显瘦' ,  'order_count' : '9万'  ,  'price' : 156 ,  'like_count' :  '26.2w' ,  'comment_count' :'10w'  ,  'uid' : 2175062366  ,  'nickname' : '大码胖佳佳'  ,  'authentication' : '官方认证'  ,  'fan_count' :  '132万' ,  'addtime' : '2019-10-21 14:15:00' },
       { 'sort': 2, 'product': '双面拼色短款棉服女生最爱', 'order_count': '8.5万', 'price': 126, 'like_count': '27.1w', 'comment_count': '9.8w', 'uid': 2554747, 'nickname': '小谷粒', 'authentication': '官方认证', 'fan_count': '132万', 'addtime': '2019-10-21 14:15:00' },
       { 'sort': 3, 'product': '韩国部队火锅芝士年糕', 'order_count': '7.6万', 'price': '29.5', 'like_count': '18w', 'comment_count': '25.6w', 'uid': 456475436, 'nickname': '可爱达人', 'authentication': '官方认证', 'fan_count': '132万', 'addtime': '2019-10-21 14:15:00' },
       { 'sort': 4 , 'product': '诺邓火腿云南' , 'order_count': '7.4万' , 'price': 198 , 'like_count': '16.6w' , 'comment_count': '5.7w' , 'uid': 247586754 , 'nickname': '牛力' , 'authentication': '官方认证' , 'fan_count': '132万' , 'addtime': '2019-10-21 14:15:00' },
       { 'sort': 5 , 'product': '官方直营将军擂鼓咚咚牛肉酱' , 'order_count': '6.9万' , 'price': 56 , 'like_count': '30w' , 'comment_count': '8.58w' , 'uid': 237413274 , 'nickname': '吃货小萌萌' , 'authentication': '官方认证' , 'fan_count': '132万' , 'addtime': '2019-10-21 14:15:00' },
       
       { 'sort': 6 , 'product': '秋冬新款韩版慵懒风长衣' , 'order_count': '5万' , 'price': 100 , 'like_count': '22w' , 'comment_count': '6.6w' , 'uid': 1762464457 , 'nickname': '美美哒✿' , 'authentication': '官方认证' , 'fan_count': '132万' , 'addtime': '2019-10-21 14:15:00' },
       { 'sort': 7 , 'product': 'MG小象贸易套装裙两件' , 'order_count': '3.8万' , 'price': 100 , 'like_count': '15.5w' , 'comment_count': '34.5w' , 'uid': 189636754 , 'nickname': '小象精品' , 'authentication': '官方认证' , 'fan_count': '132万' , '防潮调料盒玻璃家用': '2019-10-21 14:15:00' },
       { 'sort': 8 , 'product': '[PTREE]' , 'order_count': '3.1万' , 'price': 39 , 'like_count': '10w' , 'comment_count': '12.6w' , 'uid': 15544347854 , 'nickname': '悦来悦美丽' , 'authentication': '官方认证' , 'fan_count': '132万' , 'addtime': '2019-10-21 14:15:00' },
       { 'sort': 9 , 'product': '网红日式小圆饼海盐味道' , 'order_count': '2.7万' , 'price': 39 , 'like_count': '40w' , 'comment_count': '9.9w' , 'uid': 187786456 , 'nickname': '快乐小99' , 'authentication': '官方认证' , 'fan_count': '132万' , 'addtime': '2019-10-21 14:15:00' },
       { 'sort': 10 , 'product': '多美然砂锅炖锅家用明火煮食' , 'order_count': '2.5万' , 'price': 188 , 'like_count': '26.5w' , 'comment_count': '2.8w' , 'uid': 225467899 , 'nickname': '厨房达人秀' , 'authentication': '官方认证' , 'fan_count': '132万' , 'addtime': '2019-10-21 14:15:00' },
       { 'sort': 11, 'product': '丹棱果冻橙', 'order_count': '2.3万', 'price': 78, 'like_count': '9.7w', 'comment_count': '5.5w', 'uid': 2137464, 'nickname': '果冻橙专卖店', 'authentication': '官方认证', 'fan_count': '132万', 'addtime': '2019-10-21 14:15:00' },
       { 'sort': 12, 'product': '定制拼图手动diy礼物', 'order_count': '1.9万', 'price': 78, 'like_count': '6.2w', 'comment_count': '3.1w', 'uid': 123748754654, 'nickname': '开心的玩具屋', 'authentication': '官方认证', 'fan_count': '132万', 'addtime': '2019-10-21 14:15:00' },
     ];
  parent.localData(data,detail,$("#tableMy")) */
      
}

