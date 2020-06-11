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

function saveChangeUser(){

    var dats = {
          id:window.taskDetailInfo.id,
          parent_id:window.taskDetailInfo.parent_id,
          name : $('#bulletin').find('input[name=name]').val(),
          type : $("#detail_type").val(),
          company_name : $('#bulletin').find('input[name=company_name]').val(),
          telephone : $('#bulletin').find('input[name=telephone]').val(),
          company_phone: $('#bulletin').find('input[name=company_phone]').val(),
          notes: $('#bulletin').find('input[name=notes]').val(),
          status : window.taskDetailInfo.status,
          session_id :parent.DmConf.userinfo.id,
          token :parent.DmConf.userinfo.token,
        
    }
    var ret = parent.getByRsync(parent.DmConf.api.new.add_customer,dats);
     if(ret.data.code == 0){
      parent.plus_alertShow.show('修改成功')
    }else{
      parent.plus_alertShow.show(ret.msg)
    }
}

function _reload(){$('#tableMy').bootstrapTable('refresh')}
function AddEventBtn_his(a,value,c){

  return [ '<button id="mobile_info"  type="button" class="btn" >修改</button> ', '<button id="del_info"  type="button" class="btn">删除</button> '].join('') 
}

var btn_events_his = {

  "click #mobile_info" : function(a,b,value){
    OrderInfo.show(value)

  },
  "click #del_info" : function(a,b,value){
      parent.config_delInfo.show('确定删除订单?',{
        session_id:parent.DmConf.userinfo.id, 
        token:parent.DmConf.userinfo.token,
        id:value.id
      },parent.DmConf.api.new.Del_order,)
  }
}


function search_init(){
 
 
  window.taskDetailInfo.type == 0 ? $('.manageList_customer').hide() : $('.manageList_customer').show()
  var statusName = ['无效','有效']
  $('#bulletin').find('input[name=id]').val(window.taskDetailInfo.id);
  $('#bulletin').find('input[name=name]').val(window.taskDetailInfo.name);
  $('#detail_type').val(window.taskDetailInfo.type);
  $('#bulletin').find('input[name=company_name]').val(window.taskDetailInfo.company_name);
  $('#bulletin').find('input[name=status_name]').val(statusName[window.taskDetailInfo.status]);
  $('#bulletin').find('input[name=telephone]').val(window.taskDetailInfo.telephone);
  $('#bulletin').find('input[name=company_phone]').val(window.taskDetailInfo.company_phone);
  $('#detail_status_name').val(window.taskDetailInfo.status);
  $('#bulletin').find('input[name=parent_name]').val(window.taskDetailInfo.parent_name);
  $('#bulletin').find('input[name=notes]').val(window.taskDetailInfo.notes);
  $("#detail_type").selectpicker('refresh');
   
          
  }


function buy_history(){

  $('.manaNum').html(window.taskDetailInfo.phone_count);
  $('.reg_date').html(window.taskDetailInfo.reg_date_t);
  $('.end_date').html(window.taskDetailInfo.due_date_t);
 var tableColumns = [
       {width:150,field: 'end_date_t', title: '操作时间', align : 'center',valign : 'middle',},
      /* {width:150,field: 'imei', title: '操作人', align : 'center',valign : 'middle',},*/
       {width:150,field: 'reg_time_t', title: '开始时间', align : 'center',valign : 'middle',},
       {width:150,field: 'start_date_t', title: '结束时间', align : 'center',valign : 'middle',},
       {width:150,field: 'mobile_sum_t', title: '客户自备数量', align : 'center',valign : 'middle',},
       {width:150,field: 'mobile_supply_t', title: '手机供应数量', align : 'center',valign : 'middle',},
       {width:150,field: 'remark', title: '备注', align : 'center',valign : 'middle',},
     /*   {width:150,field: 'Button', title: '操作', events: btn_events_his,formatter:AddEventBtn_his},*/
      ];
      function responseHandler(info) {
        if(!parent.checkCode1002(info)){
          return 
        }
        if(info.data.info){
     
   
          $.each(info.data.info.list,function(i,v){
            v.reg_time_t = v.start_date == null ? '' :  parent.UnixToDateTime(v.start_date);
            v.start_date_t = v.end_date == null ? '' :parent.UnixToDateTime(v.end_date)
            v.end_date_t =  v.reg_date == null ? "" :  parent.UnixToDateTime(v.reg_date)
            v.mobile_sum_t = v.mobile_sum <= 0 ? '' :  v.mobile_sum 
            v.mobile_supply_t = v.mobile_supply <= 0 ? '' :  v.mobile_supply 
          })
        }

        return  { 
                   "total" : info.data.info.page.total ,
                  "rows"  :info.data.info.list
                }

      }

      function queryParams(params){
        var node = $('#tb');
        return{ //每页多少条数据
              "session_id":parent.DmConf.userinfo.id,
              "token":parent.DmConf.userinfo.token,
              "page_count" :params.limit,
              "page" :(params.offset/params.limit)+1, 
              "customer_id":window.taskDetailInfo.id
            } 

        }
      var detail = {
            "columns" :  tableColumns,
            "api" :   parent.DmConf.api.new.Order_list,
            "responseHandler" :  responseHandler,
            "queryParams" :   queryParams
      }
      new parent.get_search_list($('#buyHistory'),detail,$('#refresh_btn'));


}

function phoneList(){
  var tableColumns = [
         {width:150,field : "checked" , checkbox:true,},
      /*   {width:150,field: 'imei', title: '手机串号', align : 'center',valign : 'middle',}, */
        {width:150,field: 'mobile_label', title: '手机标签', align : 'center',valign : 'middle',},
        {width:150,field: 'customer_code', title: '客户ID', align : 'center',valign : 'middle',},
        {width:150,field: 'user_name', title: '客户名称', align : 'center',valign : 'middle',},
/*        {width:150,field: 'imei', title: '在线账号', align : 'center',valign : 'middle',},*/
        {width:150,field: 'parent_id_name', title: '身份', align : 'center',valign : 'middle',},
        {width:150,field: 'company_name', title: '公司名称', align : 'center',valign : 'middle',},
        {width:150,field: 'emp_name', title: '归属人', align : 'center',valign : 'middle',},
      /*  {width:150,field: 'imei', title: '设备来源', align : 'center',valign : 'middle',},*/
        {width:150,field: 'brand', title: '品牌', align : 'center',valign : 'middle',},
        {width:150,field: 'model', title: '型号', align : 'center',valign : 'middle',},
        {width:150,field: 'apk_verion', title: 'apk版本', align : 'center',valign : 'middle',},
        {width:150,field: 'branch', title: '分身', align : 'center',valign : 'middle',},
        {width:150,field: 'branch_online', title: '抖音号', align : 'center',valign : 'middle',},
        {width:150,field: 'on_line_name', title: '设备状态', align : 'center',valign : 'middle',},
        {width:150,field: 'status', title: '后台状态', align : 'center',valign : 'middle',},
        {width:150,field: 'network_name', title: '设备网络', align : 'center',valign : 'middle',},
 /*       {width:150,field: 'branch_online', title: '故障信息', align : 'center',valign : 'middle',},
        {width:150,field: 'branch_online', title: '最后发起任务时间', align : 'center',valign : 'middle',},*/
        {width:150,field: 'branch_online', title: '操作', align : 'center',valign : 'middle',},
       
 
       
      ];

  function responseHandler(info) {
        var is_online_name = ['<span style="color:red">离线</span>','<span style="color:green">在线</span>'];
        var status = ['<span style="color:red">无效</span>','<span style="color:green">有效</span>'];
        var is_network_name = ['<span >移动网络</span>','<span >WIFI</span>'];
        var parent_name = ['一级代理','二级代理']
        if(!parent.checkCode1002(info)){
          return 
        }
         for(var i=0;i<info.data.info.list.length;i++){
            info.data.info.list[i].status_name = status[info.data.info.list[i].status] ;
             info.data.info.list[i].on_line_name = is_online_name[info.data.info.list[i].on_line] ;
            info.data.info.list[i].network_name = is_network_name[info.data.info.list[i].network] ;
            info.data.info.list[i].parent_id_name = parent_name[info.data.info.list[i].parent_id] ;
            

        }
    
        return  { 
                 "total" : info.data.info.page.total ,
                  "rows"  :info.data.info.list
                }

        };
  function queryParams(params){
        var node = $('#tb');
    
        return { //每页多少条数据
          "mobile_label" : node.find('input[name=label_name]').val(),
          "page_count" :params.limit,
          "page" :(params.offset/params.limit)+1, 
          "session_id": parent.DmConf.userinfo.id,
          'token' : parent.DmConf.userinfo.token,
          "customer_id":window.taskDetailInfo.id,
        } 
  };

   var detail = {
        "columns" :  tableColumns,
        "api" :   parent.DmConf.api.new.mobile_list,
        "responseHandler" :  responseHandler,
        "queryParams" :   queryParams,
        "clickToSelect" : false,
      }
   new parent.get_search_list($('#phoneList'),detail,$('#refresh_btn'))
}

function accountList(){


  var tableColumns = [
       {width:150,field : "checked" , checkbox:true,},
      
     /*   {width:150,field: 'customer_id', title: '客户ID', align : 'center',valign : 'middle',},*/
         {width:150,field: 'branch_no', title: '分身ID', align : 'center',valign : 'middle',},
       /* {width:150,field: 'mobile_id', title: '设备ID', align : 'center',valign : 'middle',},*/
        {width:150,field: 'user_name', title: '抖音号', align : 'center',valign : 'middle',},
        {width:150,field: 'password', title: '密码', align : 'center',valign : 'middle'},
        {width:150,field: 'telephone', title: '电话号码', align : 'center',valign : 'middle',},
        {width:150,field: 'nick_name', title: '昵称', align : 'center',valign : 'middle',},
        {width:150,field: 'signature', title: '个性签名', align : 'center',valign : 'middle',},
        {width:150,field: 'fan_count', title: '粉丝数', align : 'center',valign : 'middle',},      
        {width:150,field: 'get_like_count', title: '获赞数', align : 'center',valign : 'middle',},
        {width:150,field: 'get_fan_count', title: '关注数', align : 'center',valign : 'middle',},
        {width:150,field: 'like_count', title: '点赞数', align : 'center',valign : 'middle',},
        {width:150,field: 'message_count', title: '私信数', align : 'center',valign : 'middle',},
        {width:150,field: 'comment_count', title: '评论数', align : 'center',valign : 'middle',},
        {width:150,field: 'comment_fan_count', title: '评论区关注数', align : 'center',valign : 'middle',},
        {width:150,field: 'play_count', title: '播放数', align : 'center',valign : 'middle',},
        {width:150,field: 'reg_date_t', title: '创建时间', align : 'center',valign : 'middle',},
        {width:150,field: 'last_update_date_t', title: '最后一次更新时间', align : 'center',valign : 'middle',},
   
       /* {width:150,field: 'Button', title: '操作', events: btn_events,align:'center',formatter:AddEventBtn}
*/       
      ];
    
  function responseHandler(info) {
        var is_online_name = ['<span style="color:red">离线</span>','<span style="color:green">在线</span>']
        var is_busy_name = ['<span style="color:green">空闲</span>','<span style="color:red">忙碌</span>'];
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
          "customer_id" : window.taskDetailInfo.id,
          "page_count" :params.limit,
          "user_name" :node.find('input[name=user_name]').val(),
          "page" :(params.offset/params.limit)+1, 
          "session_id": parent.DmConf.userinfo.id,
          'token' : parent.DmConf.userinfo.token,
          "type": 1,
        } 
  };

   var detail = {
        "columns" :  tableColumns,
        "api" :   parent.DmConf.api.new.Applicationaccount_list,
        "responseHandler" :  responseHandler,
        "queryParams" :   queryParams,
        "clickToSelect" : false,
      }
   new parent.get_search_list($('#accountList'),detail,$('#refresh_btn'))
}


function taskList(){

     var tableColumns = [
       {width:150,field: 'name', title: '任务名称',align : 'center',valign : 'middle',  },
         /*{field: 'get_fan_count', title: '关注数', align : 'center',valign : 'middle',},
        {width:150,field: 'like_count', title: '点赞数', align : 'center',valign : 'middle',},
        {width:150,field: 'message_count', title: '私信数', align : 'center',valign : 'middle',},
        {width:150,field: 'comment_count', title: '评论数', align : 'center',valign : 'middle',},
        {width:150,field: 'comment_fan_count', title: '评论区关注数', align : 'center',valign : 'middle',},*/
        {width:150,field: 'time_tick_name', title: '启动时间',align : 'center',valign : 'middle', },
        {width:150,field: 'mobile_info', title: '手机列表',align : 'center',valign : 'middle', },
        {width:150,field: 'reg_date_name', title: '生成时间',align : 'center',valign : 'middle', },
       /* {width:150,field: 'resource_status_name', title: '操作人',align : 'center',valign : 'middle', },*/
        {width:150,field: 'resource_status_name', title: '状态',align : 'center',valign : 'middle', },
        {width:150,field: 'task_type_name', title: '是否循环',align : 'center',valign : 'middle',},
        {width:150,field: 'notes', title: '备注',align : 'center',valign : 'middle',},
    
       /* {width:150,field: 'Button', title: '操作', events: btn_events,align:'center',formatter:AddEventBtn},*/
      ];
      function responseHandler(info) {
        if(!parent.checkCode1002(info)){
          return 
        }
        if(info.data.info){
          var task_status_name = parent.DmConf.task_status;
   
          $.each(info.data.info.list,function(i,v){
            v.time_tick_name = parent.UnixToDateTime(v.time_tick);
            v.reg_date_name = parent.UnixToDateTime(v.reg_date)
            v.resource_status_name = task_status_name[v.task_status]
            v.task_type_name = ( v.task_type == 0 || v.task_type == null )  ? '不循环' : "周"+v.task_type
          })
        }

        return  { 
                   "total" : info.data.info.page.total ,
                  "rows"  :info.data.info.list
                }

      }

      function queryParams(params){
        var node = $('#tb');
        return{ //每页多少条数据
          "session_id":parent.DmConf.userinfo.id,
          "token":parent.DmConf.userinfo.token,
          "page_count" :params.limit,
          "customer_id":window.taskDetailInfo.id,
          "page" :(params.offset/params.limit)+1, } 
        }
      var detail = {
            "columns" :  tableColumns,
            "api" :   parent.DmConf.api.new.Task_list,
            "responseHandler" :  responseHandler,
            "queryParams" :   queryParams
      }
      new parent.get_search_list($('#taskList'),detail,$('#refresh_btn'));


  
}


function AddEventBtn_manage(a,value,c){

  return [ '<button id="mobile_info"  type="button" class="btn" >详情</button> ', ].join('') 
}

var btn_events_manage = {

  "click #mobile_info" : function(a,b,value){
    var vv = JSON.stringify(value) ;
    
    parent.mainPlatform.show_child_iframe('apps/userInfo/userDetail.html',value.name+'的详情','userDetail_'+value.id,false,false,value)

  },
  "click #del_info" : function(a,b,value){
      parent.config_delInfo.show('确定删除订单?',{
        session_id:parent.DmConf.userinfo.id, 
        token:parent.DmConf.userinfo.token,
        id:value.id
      },parent.DmConf.api.new.Del_order,)
  }
}


function manageList(){
  var tableColumns = [
        {width:150,field : "checked" , checkbox:true, align : 'center',valign : 'middle'},
        {width:150,field : 'name',title : '客户名',align : 'center',valign : 'middle',},
        {width:150,field : 'company_name',title : '客户公司名',align : 'center',valign : 'middle',},
        {width:150,field : 'company_phone',title : '客户公司号码',align : 'center',valign : 'middle',},
        {width:150,field: 'telephone', title: '客户个人电话', align : 'center',valign : 'middle',},
        {width:150,field: 'type_name', title: '客户类型', align : 'center',valign : 'middle',},
        {width:150,field: 'reg_date_t', title: '注册时间', align : 'center',valign : 'middle',},
        {width:150,field: 'due_date_t', title: '到期时间', align : 'center',valign : 'middle',},
        {width:150,field: 'status_name', title: '状态', align : 'center',valign : 'middle',},
        {width:150,field: 'notes', title: '备注', align : 'center',valign : 'middle',},
       {width:150,field: 'Button', title: '操作', events: btn_events_manage,formatter:AddEventBtn_manage,width:150},
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
           "customer_id":window.taskDetailInfo.id,
          'token' : parent.DmConf.userinfo.token,
          "page_count" :params.limit,
          "page" :(params.offset/params.limit)+1, 
        } 
  };

   var detail = {
        "columns" :  tableColumns,
        "api" :   parent.DmConf.api.new.customer_list,
        "responseHandler" :  responseHandler,
        "queryParams" :   queryParams,
        "clickToSelect" : false,
      }
   new parent.get_search_list($('#customerList'),detail,$('#refresh_btn'))
}

  function refresh123(node){
      node.bootstrapTable('refresh')
  }

var saveUser = {
  type : 0 ,
  api : '' ,
  func : '' ,
  user_id : 0 ,
  node : function(){return $('#addUser')},
  go : function(type,api,rows,func){
      var node = this.node();
      node.find('input').val('');
      node.find('textarea').val('');
      $('#user_status').val('1') ;
       $('#user_status').selectpicker()
      //$('#user_status').selectpicker('refresh').css({border:"1px solid #aeaeae",padding:"15px"});
      this.type = type ; 
      this.api = api ;
      this.func = func ;
      $('#AddUsers').text('添加登录账户')
      $('.hide_user_psd').show()
      if(type == 1){
       
        this.user_id = rows.id ;
        //$('.hide_user_psd').hide()
        $('#AddUsers').text('修改账号')
        node.find('input[name=user_name]').val(rows.user_name);
        node.find('input[name=user_tel]').val(rows.telephone);
        
        node.find('textarea[name=note]').val(rows.notes);
   
        $('#user_status').selectpicker('val',rows.status);
        $('#type').selectpicker('val',rows.type);
      }
      node.modal()
  },
  del : function(){

  },
  save : function(){
    var node = this.node();
    var dats = {
          "user_name": node.find('input[name=user_name]').val(),
          "type": $('#type').val(),
          "password": node.find('input[name=psd]').val(),
          "telephone": node.find('input[name=user_tel]').val(),
          "notes": node.find('textarea[name=note]').val(),
          "status":$('#user_status').val(),
          /*"customer_id":window.taskDetailInfo.id,*/
          "id" : this.user_id
    }
    //this.type == 0 ? dats.password =  node.find('input[name=psd]').val()  : dats.id = this.user_id
    var ret = parent.getByRsync(this.api,dats);
    if(!ret.data.code){
      if(this.func){
        this.func()
      }
      node.modal('hide')
    }else{
      parent.plus_alertShow.show(ret.data.msg)
    }
  }
}


