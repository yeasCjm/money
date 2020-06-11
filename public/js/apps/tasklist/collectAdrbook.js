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
  var arr = ['<button id="del"  type="button" class="btn btn_pink" >删除</button> ', ]
 
  return arr.join('');
 
}
var btn_events = {
  "click #del" : function(a,b,value){
    delAll([value])
  },


}
function delAll(data) {
  
  if (data.length == 0) return parent.plus_alert("请选择记录");
  var str = data.length == 1 ? '<p>确定删除:' + data[0]['name'] + "?</p>" : '<p>确定删除:' + data[0]['name'] + "等" + data.length + "条记录吗?</p>";

  let dyId = $.map(data, function (v) {
   
    return v.id
  }).join(',');

  parent.config_delInfo.show(str, { 
    id: dyId,
    token: parent.DmConf.userinfo.token,
    session_id: parent.DmConf.userinfo.id,
  }, parent.DmConf.api.new.Mail_Del_obj,TBrefresh);

}

function search_init(){

      $('#tableMy').bootstrapTable('destroy');


      var tableColumns = [
         {
          width: 50, field: "checked", checkbox: true,
        }, 
        {
          editable: {
            type: 'text',
            title: '修改分组',

            validate: function (v) {
              var data = $('#tableMy').bootstrapTable('getData');
              var idx = $(this).parent().parent().data('index');
              var d_id = data[idx].id;
              var dats = { token: parent.DmConf.userinfo.token, session_id: parent.DmConf.userinfo.id, class: v,  id: d_id,  };

              var ret = parent.getByRsync(parent.DmConf.api.new.Mail_Update_obj, dats);

              if ($.trim(ret.data.code) != 0) {
                return ret.data.msg;
              }
              $('#tableMy').bootstrapTable('updateRow', {
                index: idx,
                row: {
                  class: dats['class']
                }
              })
            }
          }, width: 200, field: 'class', title: '分组', align: 'center', valign: 'middle', },
        { width: 100, field: 'name', title: '姓名', align: 'center', valign: 'middle', },
        
        { width: 100, field: 'phone', title: '号码',align : 'center',valign : 'middle', },

        { width: 100, field: 'mobile_label', title: '手机编号',align : 'center',valign : 'middle', },
        { width: 70, field: 'Button', title: '操作', events: btn_events, align: 'center', formatter: AddEventBtn },

      ];
      function responseHandler(info) {
        if(!parent.checkCode1002(info)){
          return 
        }
        if(info.data.info){

          $.each(info.data.info.list,function(i,v){

          

          
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
          status: $("#status").val(),
          class: node.find('input[name=class]').val(),
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
        "api": parent.DmConf.api.new.Mail_Obj_list,
            "responseHandler" :  responseHandler,
            "queryParams" :   queryParams,
            'page':window.taskDetailInfo ? parseInt(window.taskDetailInfo.showIframe_data.page) : 0,
            'pageSize':window.taskDetailInfo ? parseInt(window.taskDetailInfo.showIframe_data.page_count) : 50,
      }
    
      new parent.get_search_list($('#tableMy'),detail,$('#refresh_btn'),returnBack);

 
}

