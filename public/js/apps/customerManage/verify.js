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

  return [ '<button id="mobile_info123"  type="button" class="btn" >通过</button> ',  '<button id="unGo"  type="button" class="btn" >不通过</button> ',].join('') ;
}
function _reload(){$('#tableMy').bootstrapTable('refresh')}
var btn_events = {

  "click #mobile_info123" : function(a,b,value){
    parent.config_delInfo.show('确定让该公司审核通过吗？',{
      status:1,
      id:value.id
    },parent.DmConf.api.new.Status_customer,function(){$('#tableMy').bootstrapTable('refresh')})

  },
  "click #unGo" : function(a,b,value){
    parent.verifyManage.show(1,value,function(){$('#tableMy').bootstrapTable('refresh')})

  },
 
}


function search_init(){
/*  create_datePicker($('.begin_time'));
  create_datePicker($('.end_time'));

 $(".begin_time").datetimepicker("setDate", new Date());
 $(".end_time").datetimepicker("setDate", new Date());*/


  var tableColumns = [
    { width: 50,field : "checked" , checkbox:true, align : 'center',valign : 'middle'},
        {width:150,field : 'company_name',title : '申请公司',align : 'center',valign : 'middle',},
        {width:150,field : 'company_name',title : '申请人',align : 'center',valign : 'middle',},
        {width:150,field : 'company_phone',title : '申请人公司号码',align : 'center',valign : 'middle',},
        {width:150,field: 'telephone', title: '申请人个人电话', align : 'center',valign : 'middle',},
        {width:150,field: 'reg_date_t', title: '申请时间', align : 'center',valign : 'middle',},
        {width:150,field: 'parent_name', title: '归属人', align : 'center',valign : 'middle',},
        {width:150,field: 'phone_count', title: '申请台数', align : 'center',valign : 'middle',},
        {width:150,field: 'type_name', title: '申请身份', align : 'center',valign : 'middle',},
        {width:150,field: 'notes', title: '备注', align : 'center',valign : 'middle',},
        {width:150,field: 'error_notes', title: '不通过原因', align : 'center',valign : 'middle',},
       /* {width:150,field: 'Button', title: '操作', events: btn_events,align:'center',formatter:AddEventBtn,width:150},*/
      ];
     
  function responseHandler(info) {
        
        var status = ["<span style='color:red'>失效</span>","<span style='color:green'>有效</span>"];
        var _type = ['普通用户','代理商'];
        if(!parent.checkCode1002(info)){
          return 
        }
        for(var i=0;i<info.data.info.list.length;i++){
          info.data.info.list[i].status_name = status[info.data.info.list[i].status] ;
          info.data.info.list[i].reg_date_t = parent.UnixToDateTime(info.data.info.list[i].reg_date) ;
          info.data.info.list[i].due_date_t = parent.UnixToDateTime(info.data.info.list[i].due_date) ;
          info.data.info.list[i].type_name = _type[info.data.info.list[i].type] ;
        }
        return  { 
                  "total" : info.data.info.page.total ,
                  "rows"  :info.data.info.list
                } 

        };
  function queryParams(params){
        var node = $('#tb');
        return { //每页多少条数据
          "session_id": parent.DmConf.userinfo.id,
          'token' : parent.DmConf.userinfo.token,
          "page_count" :params.limit,
          "page" :(params.offset/params.limit)+1,
          "status":$('#status').val(), 
        } 
  };

   var detail = {
        "columns" :  tableColumns,
        "api" :   parent.DmConf.api.new.customer_list,
        "responseHandler" :  responseHandler,
        "queryParams" :   queryParams,
        "clickToSelect" : false,
      }
   new parent.get_search_list($('#tableMy'),detail,$('#refresh_btn'))
   
             
  }






