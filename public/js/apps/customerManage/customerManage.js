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
  var btn_arr =  [  '<button id="del_info"  type="button" class="btn">删除</button> ', '<button id="statu123"  type="button" class="btn">状态</button> ', '<button id="check_detail"  type="button" class="btn">详情</button> ',]
  if(value.status != 0 ){
    btn_arr.unshift('<button id="mobile_info"  type="button" class="btn" >修改</button> ')
  }
  return btn_arr.join('') ;
}
function _reload(){$('#tableMy').bootstrapTable('refresh')}
var btn_events = {

  "click #mobile_info" : function(a,b,value){
    parent.saveUser1.go(1,parent.DmConf.api.new.add_customer,value,_reload)

  },
  "click #check_detail" : function(a,b,value){
      
      var vv = JSON.stringify(value) ;
    
      parent.mainPlatform.show_child_iframe('apps/userInfo/userDetail1.html',value.name+'的详情','userDetail_'+value.id,false,false,value)

  },
  "click #del_info" : function(a,b,value){

    var msg = '<p class="delInfocontent">删除公司:'+value.id +'</p>' ;
      parent.config_delInfo.show(msg,{id:value.id},parent.DmConf.api.new.Del_customer,TBrefresh);
  },
  "click #statu123" : function(a,b,value){
  
    parent.verifyManage.show(2,value,function(){$('#tableMy').bootstrapTable('refresh')})     
  },
}

function delAll(){
      var data = $('#tableMy').bootstrapTable('getSelections');
  var name1 = data.length == 1 ? '<p class="delInfocontent">删除用户:' + data[0].mobile_label + '?</p>' : '<p class="delInfocontent">是否删除用户:' + data[0].mobile_label + '等' + data.length + '条数据?</p>'
      var re_arr = $.map(data,function(v){
    
         return v.id
      }).join(',')

   
      parent.config_delInfo.show(name1,{id:re_arr},parent.DmConf.api.new.Del_customer,TBrefresh);
}
function search_init(){
  create_datePicker($('.begin_time'));
  create_datePicker($('.end_time'));

 $(".begin_time").datetimepicker("setDate", new Date());
 $(".end_time").datetimepicker("setDate", new Date());


  var tableColumns = [
        {width:50,field : "checked" , checkbox:true, align : 'center',valign : 'middle'},
        {width:150,field : 'id',title : '客户ID',align : 'center',valign : 'middle',},
        {width:150,field : 'name',title : '客户名',align : 'center',valign : 'middle',},
        {width:150,field : 'company_name',title : '客户公司名',align : 'center',valign : 'middle',},
        {width:150,field : 'company_phone',title : '客户公司号码',align : 'center',valign : 'middle',},
        {width:150,field: 'telephone', title: '客户个人电话', align : 'center',valign : 'middle',},
        {width:150,field: 'type_name', title: '客户类型', align : 'center',valign : 'middle',},
        {width:150,field: 'reg_date_t', title: '注册时间', align : 'center',valign : 'middle',},
        {width:150,field: 'due_date_t', title: '到期时间', align : 'center',valign : 'middle',},
        {width:150,field: 'status_name', title: '状态', align : 'center',valign : 'middle',},
        {width:150,field: 'parent_name', title: '上级公司', align : 'center',valign : 'middle',},
        {width:150,field: 'phone_count', title: '设备数', align : 'center',valign : 'middle',},
       
        {width:150,field: 'notes', title: '备注', align : 'center',valign : 'middle',},
        {width:150,field: 'Button', title: '操作', events: btn_events,align:'center',formatter:AddEventBtn,width:150},
      ];
     
  function responseHandler(info) {
        
        var status = ["<span style='color:red'>审核中</span>","<span style='color:green'>启用</span>",'未通过',"<span style='color:red'>禁用</span>"];
        var _type = ['普通用户','一级代理商','二级代理商'];
        if(!parent.checkCode1002(info)){
          return 
        }
        for(var i=0;i<info.data.info.list.length;i++){
          info.data.info.list[i].status_name = status[info.data.info.list[i].status] ;
          info.data.info.list[i].reg_date_t = parent.UnixToDateTime(info.data.info.list[i].reg_date) ;
          info.data.info.list[i].due_date_t = parent.UnixToDateTime(info.data.info.list[i].due_date) ;
          info.data.info.list[i].type_name = info.data.info.list[i].parent_id>0 ? _type[2] : _type[info.data.info.list[i].type] ;

        }
        return  { 
                  "total" : info.data.info.page.total ,
                  "rows"  :info.data.info.list
                }

        };
  function queryParams(params){
        var node = $('.container-fluid');
        return { //每页多少条数据
          "session_id": parent.DmConf.userinfo.id,
          'token' : parent.DmConf.userinfo.token,
          "page_count" :params.limit,
          "page" :(params.offset/params.limit)+1, 
          "status":$('#statuss').val(),
          "agent_type":$('#agent_type').val(),
          "company_name":node.find("input[name=company_name]").val(),
          "id":node.find("input[name=id]").val(),
          "telephone":node.find("input[name=telephone]").val(),
          "company_phone":node.find("input[name=company_phone]").val(),
          "company_name":node.find("input[name=company_name]").val(),
          "name":node.find("input[name=company_user_name]").val(),
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





