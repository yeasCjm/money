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

  return [  '<button id="del_info"  type="button" class="btn">删除</button> '].join('') 
}
var btn_events = {

    "click #del_info" : function(a,b,value){
      // parent.fileZoom.create_video_img({'file_name':v.file_name,'url':v.play_url,'id':v.id},_reloadVideo)
    },
    "click #mobile_info" : function(a,b,value){
        parent.addAccount.show(2,value)
    }
}


function search_init(){



  var tableColumns = [
        {width:150,field : "checked" , checkbox:true,},
       
        {width:150,field: 'file_name', title: '视频标题', align : 'center',valign : 'middle',},
        {width:150,field: 'video_show', title: '缩略图', align : 'center',valign : 'middle',width:150,formatter:function(a,v){
          return "<video style='width:50px;height:50px'src="+v.play_url+"></video>"
        }},
        {width:150,field: 'play_url', title: '视频链接', align : 'center',valign : 'middle',},
        {width:150,field: 'reg_date_name', title: '发布时间', align : 'center',valign : 'middle',},
        {width:150,field: 'imei_info', title: '手机标识号', align : 'center',valign : 'middle',},
        {width:150,field: 'mobile_info', title: '手机标签', align : 'center',valign : 'middle',},
        {width:150,field: 'admin', title: '操作人', align : 'center',valign : 'middle',},
      
        {width:150,field: 'user_name_info', title: '发视频账号', align : 'center',valign : 'middle',},
        {width:150,field: 'branch_info', title: '抖音号昵称', align : 'center',valign : 'middle',},
    
  
       /* {width:150,field: 'Button', title: '操作', events: btn_events,align:'center',formatter:AddEventBtn},*/
      ];

  function responseHandler(info) {
        var is_online_name = ['<span style="color:red">离线</span>','<span style="color:green">在线</span>']
        var is_busy_name = ['<span style="color:green">空闲</span>','<span style="color:red">忙碌</span>'];
         if(!parent.checkCode1002(info)){
          return 
        }
         $.each(info.data.info.list,function(i,v){
           
            v.reg_date_name = parent.UnixToDateTime(v.reg_date)
            
          })
        return  { 
                   "total" : info.data.info.page.total ,
                  "rows"  :info.data.info.list
                }

        };
  function queryParams(params){
        var node = $('#tb');

        return { //每页多少条数据
          "customer_id" : parent.DmConf.userinfo.customer_id,
          "page_count" :params.limit,
          "file_name" :node.find('input[name=user_name]').val(),
          "video_title" :node.find('input[name=video_title_ser]').val(),
          "page" :(params.offset/params.limit)+1, 
          "session_id": parent.DmConf.userinfo.id,
          'token' : parent.DmConf.userinfo.token,
          "type": 2,
        } 
  };

   var detail = {
        "columns" :  tableColumns,
        "api" :   parent.DmConf.api.new.Task_video_list,
        "responseHandler" :  responseHandler,
        "queryParams" :   queryParams,
        "clickToSelect" : false,
      }
   new parent.get_search_list($('#tableMy'),detail,$('#refresh_btn'))

          
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
