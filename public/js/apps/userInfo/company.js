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
function _reload(){$('#tableMy').bootstrapTable('refresh')}
var btn_events = {

  "click #mobile_info" : function(a,b,value){
    saveUser.go(1,parent.DmConf.api.new.add_account,value,_reload)

  },
  "del_info" : function(a,b,value){
    
  }
}


function search_init(){
  var ret = parent.getByRsync(parent.DmConf.api.new.customer_detail,{
          session_id : parent.DmConf.userinfo.id,
          token:parent.DmConf.userinfo.token,
          customer_id :parent.DmConf.userinfo.customer_id,
         
        })
        if(ret.data.code == 0 ){

          $('.per_tel').html(ret.data.info.telephone);
          $('.company_num').html(ret.data.info.company_phone);
          $('.company_name').html(ret.data.info.company_name);
          $('.company_code').html(ret.data.info.m_id);
          $('.phone_count').html(ret.data.info.phone_count);
          $('.start_date').html(parent.UnixToDateTime(ret.data.info.reg_date));
          $('.end_date').html(parent.UnixToDateTime(ret.data.info.due_date));

          var res = parent.getByRsync(parent.DmConf.api.new.Apkversion_Apkversion,{ session_id : parent.DmConf.userinfo.id,token:parent.DmConf.userinfo.token,})
          if(res.data.code == 0){

               $('.down_url').html(res.data.info.url);
              var str = res.data.info.url+'#mp.weixin.qq.com' ;
              $('#qrCode').qrcode(str,{ render : 'canvas',
                  width       : '100%',
                  height      : '100%',
                  typeNumber  : -1,
                  correctLevel    : 1
              });
          }
         
  }
  var tableColumns = [
        {width:150,field : "reg_time_1" , title : '购买时间',align : 'center',valign : 'middle',},
        {width:150,field : 'start_date_1',title : '开始时间',align : 'center',valign : 'middle',},
        {width:150,field: 'end_date_1', title: '到期时间', align : 'center',valign : 'middle',},
        {width:150,field: 'mobile_sum', title: '手机数量', align : 'center',valign : 'middle',},
        {width:150,field: 'discount', title: '折扣', align : 'center',valign : 'middle',},
        {width:150,field: 'price', title: '价格', align : 'center',valign : 'middle',},
        {width:150,field: 'status', title: '状态', align : 'center',valign : 'middle',},
      ];
     
  function responseHandler(info) {
       
     
        if(!parent.checkCode1002(info)){
          return 
        }

        var ret  = parent.getByRsync(parent.DmConf.api.new.customer_list,{
          session_id : parent.DmConf.userinfo.id,
          token:parent.DmConf.userinfo.token,
       
          id:parent.DmConf.userinfo.customer_id
        })
        if(ret.data.code == 0 ){
       
          $('.per_tel').html(ret.data.info.list[0].telephone);
          $('.company_num').html(ret.data.info.list[0].company_phone);
          $('.company_name').html(ret.data.info.list[0].company_name);
          $('.phone_count').html(ret.data.info.list[0].phone_count);
        
        if(info.data.info.list.length > 0){
            for(var i=0;i<info.data.info.list.length;i++){
              info.data.info.list[i].reg_time_1 = info.data.info.list[i].reg_time ? parent.UnixToDateTime(info.data.info.list[i].reg_time ) : "";
              info.data.info.list[i].start_date_1 =info.data.info.list[i].start_date ? parent.UnixToDateTime(info.data.info.list[i].start_date ) : "";
              info.data.info.list[i].end_date_1 = info.data.info.list[i].end_date ? parent.UnixToDateTime(info.data.info.list[i].end_date ) :"";
            }
        }
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
        "api" :   parent.DmConf.api.new.Order_list,
        "responseHandler" :  responseHandler,
        "queryParams" :   queryParams,
        "clickToSelect" : false,
      }
    //  new parent.get_search_list($('#tableMy'),detail,$('#refresh_btn'));
      $("#chage_span").click(function(){
        


    })    
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
          "customer_id":parent.DmConf.userinfo.customer_id,
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