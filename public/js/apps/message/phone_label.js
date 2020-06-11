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


function AddEventBtn(){
  return [
            '<button id="changeEdit"  type="button" class="btn" >修改</button> '
      ].join('')
}
var btn_events = {
  "click #changeEdit" : function(e,val,rows){
      parent.create_label.change('应用账号标签',1,parent.DmConf.api.new.add_resourcetype,rows,function(){ $('#tableMy').bootstrapTable('refresh')})
  }
}
function search_init(){

      var tableColumns = [
        {width:150,field : "checked" , checkbox:true,align : 'center',valign : 'middle',},
         {width:150,field: 'name', title: '标签名', align : 'center',valign : 'middle',editable: {
                    type: 'text',
                    title: '修改标签名',

                    validate: function (v) {
                        var data = $('#tableMy').bootstrapTable('getData');
                        var idx = $(this).parent().parent().data('index');
                        var d_id = data[idx].id;
                        var dats = {name :v,id :d_id};
                        data.splice(idx,1,dats);
                        var ret = parent.getByRsync(parent.DmConf.api.new.add_resourcetype, dats);
                      
                    }
                },},
       /* {width:150,field: 'Button', title: '操作', events: btn_events,align:'center',formatter:AddEventBtn},*/
      ];

      function responseHandler(info) {
        if(!parent.checkCode1002(info)){
          return 
        }
        return  { 
                   "total" : info.data.info.page.total ,
                  "rows"  :info.data.info.list
                }

      }
      function queryParams(params){
        var node = $('#tb')
        return{ //每页多少条数据
          "name" : node.find('input[name=label_name]').val(),
          "session_id": parent.DmConf.userinfo.id,
          'token' : parent.DmConf.userinfo.token,
          "customer_id" : parent.DmConf.userinfo.customer_id,
         
          "page_count" :params.limit,
          "page" :(params.offset/params.limit)+1, } 
        }
        var api = parent.DmConf.api.new.Applicationaccounttype_resourcetype_list
          

        var detail = {
            "columns" :  tableColumns,
            "api" :   api,
            "responseHandler" :  responseHandler,
            "queryParams" :   queryParams
          }
       new parent.get_search_list($('#tableMy'),detail,$('#refresh_btn'))
      }