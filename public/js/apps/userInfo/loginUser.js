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
  var arr = ['<button id="mobile_info"  type="button" class="btn" >修改</button> ', ]
  if(value.type != 1){
    arr.push('<button id="del_info"  type="button" class="btn">删除</button> ')
  }
  return arr.join('') 
}

var btn_events = {

  "click #mobile_info" : function(a,b,value){
    parent.saveUser.go(1,parent.DmConf.api.new.add_account,value,TBrefresh)

  },
  "click #del_info" : function(a,b,value){
      delAll([value])

  }
}

function delAll(data){

  if(data.length == 0 ) return parent.plus_alert('请选择记录');
  var msg = data.length == 1 ? '<p>确定删除' + data[0].user_name + '?</p>' : '<p>确定删除' + data[0].user_name + '等' + data.length + '条记录?</p>'; 
  var flag = true
  var id_list = data.map(function (v) {if(v.type == 1){flag = false}; return v.id}).join(',')
  if(!flag){
   return  parent.plus_alert('不能删除管理员账号')
  }
  parent.config_delInfo.show(msg, {
    id: id_list,
    token: parent.DmConf.userinfo.token,
    session_id: parent.DmConf.userinfo.id,
    customer_id: parent.DmConf.userinfo.customer_id,
  }, parent.DmConf.api.new.Del_account, TBrefresh);
}
function search_init(){
  create_datePicker($('.begin_time'));
  create_datePicker($('.end_time'));

 $(".begin_time").datetimepicker("setDate", new Date());
 $(".end_time").datetimepicker("setDate", new Date());


  var tableColumns = [
    { width: 50, field: "checked", checkbox: true, align: 'center', valign: 'middle' },
    { width: 150, field: 'emp_name', title: '员工名', align: 'center', valign: 'middle', },
    { width: 150, field: 'user_name', title: '登录账号', align: 'center', valign: 'middle', },
    { width: 150, field: 'department', title: '部门', align: 'center', valign: 'middle', },
    { width: 150, field: 'telephone', title: '电话', align: 'center', valign: 'middle', },

        {width:150,field: 'Button', title: '操作', events: btn_events,align:'center',formatter:AddEventBtn},
      ];
     
  function responseHandler(info) {
        
        var status = ['<span >普通用户</span>','<span >管理员</span>'];
        if(!parent.checkCode1002(info)){
          return 
        }
        for(var i=0;i<info.data.info.list.length;i++){

     
          
          info.data.info.list[i].type_name = status[info.data.info.list[i].type] ;
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
          "customer_id":parent.DmConf.userinfo.customer_id,
          "page_count" :params.limit,
          "page" :(params.offset/params.limit)+1, 
        } 
  };

   var detail = {
        "columns" :  tableColumns,
        "api" :   parent.DmConf.api.new.account_list,
        "responseHandler" :  responseHandler,
        "queryParams" :   queryParams,
        "clickToSelect" : false,
      }
   new parent.get_search_list($('#tableMy'),detail,$('#refresh_btn'))
   
          
  }





