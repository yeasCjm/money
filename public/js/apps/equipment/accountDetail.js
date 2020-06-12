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

  return ['<button id="remove_acc"  type="button" class="btn">移除分身</button> ', ].join('') 
}
var btn_events = {

 
  "click #remove_acc" : function(a,b,value){
  
    var msg = '移除分身ID:'+value.id ;
      parent.config_delInfo.show(msg,{id:value.id},parent.DmConf.api.new.Del_applicationaccount,TBrefresh);

  }
}

function search_init(){
  
$('.smd_page_header').html('手机编号:'+(window.taskDetailInfo.mobile_label ? window.taskDetailInfo.mobile_label : window.taskDetailInfo.imei ) +'的详情')

  var tableColumns = [
    { width: 50,field : "checked" , checkbox:true,},
      
     /*   {width:150,field: 'customer_id', title: '客户ID', align : 'center',valign : 'middle',},*/
         {width:100,field: 'branch_no', title: '分身ID', align : 'center',valign : 'middle',},
       /* {width:100,field: 'mobile_id', title: '设备ID', align : 'center',valign : 'middle',},*/
        {width:100,field: 'user_name', title: '抖音号', align : 'center',valign : 'middle',},
/*        {width:100,field: 'password', title: '密码', align : 'center',valign : 'middle',
        editable: {
                    type: 'text',
                    title: '修改密码',
                    validate: function (v) {
                        var data = $('#tableMy').bootstrapTable('getData');
                        var idx = $(this).parent().parent().data('index');
                        var d_id = data[idx].id;
                        var dats = {id:data[idx].id,token :parent.DmConf.userinfo.token,session_id:parent.DmConf.userinfo.id,password:v,id :d_id,telphone:data[idx].telphone};
                        var ret = parent.getByRsync(parent.DmConf.api.new.Add_applicationaccount, dats);
                        $('#tableMy').bootstrapTable('refresh')
                    }
                },},
        {width:100,field: 'telephone', title: '电话号码', align : 'center',valign : 'middle',
        editable: {
                    type: 'text',
                    title: '修改手机',
                    validate: function (v) {
                        var data = $('#tableMy').bootstrapTable('getData');
                        var idx = $(this).parent().parent().data('index');
                        var d_id = data[idx].id;
                        var dats = {id:data[idx].id,token :parent.DmConf.userinfo.token,session_id:parent.DmConf.userinfo.id,telphone:v,id :d_id,password:data[idx].password};
                        var ret = parent.getByRsync(parent.DmConf.api.new.Add_applicationaccount, dats);
                        $('#tableMy').bootstrapTable('refresh')
                    }
                },}, */
        {width:100,field: 'nick_name', title: '昵称', align : 'center',valign : 'middle',},
        {width:100,field: 'signature', title: '个性签名', align : 'center',valign : 'middle',},
        {width:75,field: 'get_fan_count', title: '粉丝数', align : 'center',valign : 'middle',},      
        {width:75,field: 'get_like_count', title: '获赞数', align : 'center',valign : 'middle',},
        {width:75,field: 'fan_count', title: '关注数', align : 'center',valign : 'middle',},
       /*  {width:100,field: 'like_count', title: '点赞数', align : 'center',valign : 'middle',},
        {width:100,field: 'message_count', title: '私信数', align : 'center',valign : 'middle',},
        {width:100,field: 'comment_count', title: '评论数', align : 'center',valign : 'middle',},
        {width:100,field: 'comment_fan_count', title: '评论区关注数', align : 'center',valign : 'middle',},
        {width:100,field: 'play_count', title: '播放数', align : 'center',valign : 'middle',}, */
          {width:150,field: 'reg_date_time', title: '创建时间', align : 'center',valign : 'middle',},
        {width:150,field: 'last_upload_date_time', title: '最后一次更新时间', align : 'center',valign : 'middle',},
       {width:100,field: 'Button', title: '操作', events: btn_events,align:'center',formatter:AddEventBtn},]
    
  function responseHandler(info) {
        var is_online_name = ['<span style="color:red">离线</span>','<span style="color:green">在线</span>']
        var is_busy_name = ['<span style="color:green">空闲</span>','<span style="color:red">忙碌</span>'];
         if(!parent.checkCode1002(info)){
          return 
        }
        $('.detailMsg').find('p').html('');
        $($('.detailMsg').find('p')[0]).html("手机标识号:"+window.taskDetailInfo.mobile_label);
        $($('.detailMsg').find('p')[1]).html("品牌:"+window.taskDetailInfo.brand);
        $($('.detailMsg').find('p')[2]).html("设备型号:"+window.taskDetailInfo.model);
        $($('.detailMsg').find('p')[3]).html("apk版本:"+window.taskDetailInfo.apk_verion);
        $($('.detailMsg').find('p')[4]).html("设备状态:"+window.taskDetailInfo.status_name);
        $($('.detailMsg').find('p')[5]).html("设备网络:"+window.taskDetailInfo.network_name);
        $($('.detailMsg').find('p')[6]).html("总点赞数:"+info.data.info.like_count);
        $($('.detailMsg').find('p')[7]).html("总获赞数:"+ info.data.info.get_like_count);
        $($('.detailMsg').find('p')[8]).html("关注数:"+ info.data.info.get_fan_count);
        $($('.detailMsg').find('p')[9]).html("粉丝数:"+ info.data.info.fan_count);
        $($('.detailMsg').find('p')[10]).html("评论:"+ info.data.info.comment_count);
        $($('.detailMsg').find('p')[11]).html("播放量:"+ info.data.info.play_count);

         for(var i=0;i<info.data.info.list.length;i++){
          info.data.info.list[i].reg_date_time = info.data.info.list[i].reg_date > 0 ? parent.UnixToDateTime(info.data.info.list[i].reg_date) : '';
            info.data.info.list[i].last_upload_date_time = info.data.info.list[i].last_update_date > 0 ? parent.UnixToDateTime(info.data.info.list[i].last_update_date) : '';


         }
        return  { 
                  /*"total" : info.data.info.page.total ,*/
                  "rows"  :info.data.info.list
                }

        };
  function queryParams(params){
        var node = $('#tb');
       
        return { //每页多少条数据
          "customer_id" : parent.DmConf.userinfo.customer_id,
          "mobile_id" : window.taskDetailInfo.id,
          "keyword" :node.find('input[name=user_name]').val(),
          "imei" : window.taskDetailInfo.imei,
          "session_id": parent.DmConf.userinfo.id,
          'token' : parent.DmConf.userinfo.token,
          'type' : 1 ,
        } 
  };

   var detail = {
        "columns" :  tableColumns,
        "api" :   parent.DmConf.api.new.Mobile_applicationaccount,
        "responseHandler" :  responseHandler,
        "queryParams" :   queryParams,
        "clickToSelect" : false,
      }
   new parent.get_search_list($('#tableMy'),detail,$('#refresh_btn'))
  
          
  }

  function start_mission(o){
    var rows = $('#tableMy').bootstrapTable('getSelections')
    parent.start_mission.go('',rows)
  }

var alert_changeName ={
    node : "",

   show : function(o){ //修改名字
      var info =  $(o).data('info');
      alert_changeName.node = o;
      $('#mobileTitle').data('info',info);
      $('#mobileTitle').find('input[name=mobiel_title]').val(info.name);
     
      $('#mobileTitle').modal('show').find('.modal-dialog').css({width:"43%",top:"25%"});

    },
   save : function(){
      var dats = {
        name : $('#mobileTitle').find('input[name=mobiel_title]').val(),
        id: $('#mobileTitle').data('info').id
      }
      var text = '<i class="mdi mdi-box-cutter"></i>'+dats.name
       
      var ret = parent.getByRsync(parent.DmConf.api.device.add,dats)
      if(ret.status){
         $('#mobileTitle').modal('hide')
         $(alert_changeName.node).html(text)
      }else{
        parent.plus_alertShow.show(ret.msg)
      }
   }
  }
