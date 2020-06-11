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
  "click #changeEdit" : function(){

  }
}
function search_init(){
     
   /* create_option.create_resource_all($('#has_mission'))*/
/*     var resource = parent.DmConf.data.resource_type;
    for(var attr in resource){
       $('#has_mission').append('<option value='+resource[attr].id+'>'+resource[attr].name+'</option>')
    }

    $('#has_mission').selectpicker('refresh');*/

      $('.begin_time').datetimepicker({
        format: 'yyyy-mm-dd',//显示格式
        todayHighlight: 1,//今天高亮
        minView: "month",//设置只显示到月份
        startView:2,
        forceParse: 0,
        showMeridian: 1,
        todayBtn: true,
        autoclose: 1//选择后自动关闭
      });
      $(".begin_time").datetimepicker("setDate", new Date());
      $('.end_time').datetimepicker({
        format: 'yyyy-mm-dd',//显示格式
        todayHighlight: 1,//今天高亮
        minView: "month",//设置只显示到月份
        startView:2,
        forceParse: 0,
        showMeridian: 1,
        todayBtn: true,
        autoclose: 1//选择后自动关闭
      });
      $(".end_time").datetimepicker("setDate", new Date());

      var tableColumns = [
       /* {width:150,field : "checked" , checkbox:true,align : 'center',valign : 'middle',},*/
        {width:150,field: 'reg_date', title: '创建时间', align : 'center',valign : 'middle',},
        {width:150,field: 'id', title: '资源ID', align : 'center',valign : 'middle',},
        {width:150,field: 'number', title: '资源', align : 'center',valign : 'middle',},
        {width:150,field: 'type', title: '资源标识', align : 'center',valign : 'middle',},
       
/*        {width:150,field: 'Button', title: '操作', events: btn_events,align:'center',formatter:AddEventBtn},*/
      ];


      function responseHandler(info) {
  
/*        var resource_type = parent.DmConf.data.resource_type;
        var account = parent.DmConf.data.account ;*/
          if(!parent.checkCode1002(info)){
            return 
          }
          $.each(info.data.info.list,function(i,v){

            v.reg_date = parent.UnixToDateTime(v.reg_date)
   
   
          })
         
        
      
        return  { 
                  "total" : info.data.info.page.total ,
                  "rows"  :info.data.info.list
                }

      }
      function queryParams(params){
        var node = $('#tb')
  
        return{ //每页多少条数据
          "number" : node.find('input[name=number]').val().toString(),
          "resource_type" : $('#has_mission').val()==null ? '' : $('#has_mission').val().toString(),
          "begin_date" : $('#begin_date').val().substr(0,10),
          "end_date" : $('#end_date').val().substr(0,10),
          "page_size" :params.limit,
          "page_num" :(params.offset/params.limit), 
          "session_id": parent.DmConf.userinfo.id,
          'token' : parent.DmConf.userinfo.token,
         } 
        }
        var api = parent.DmConf.api.new.resource_list;

        var detail = {
            "columns" :  tableColumns,
            "api" :   api,
            "responseHandler" :  responseHandler,
            "queryParams" :   queryParams
          }
       new parent.get_search_list($('#tableMy'),detail,$('#refresh_btn'))
      
      }
