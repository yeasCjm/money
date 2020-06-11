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

function _reload() { $('#bulletin_1').bootstrapTable('refresh') };
function _reloadDis() { $('#discuss_1').bootstrapTable('refresh') };
function _reloadH() { $('#buyHistory').bootstrapTable('refresh') };
function _reloadVideo() { $('#videoList1').bootstrapTable('refresh') };
function _reloadSamePeople() { $('#same_com1').bootstrapTable('refresh') };

function AddEventBtn_his(a,value,c){

  return [ /*'<button id="mobile_info"  type="button" class="btn" >修改</button> ', */'<button id="del_info"  type="button" class="btn">删除</button> '].join('') 
}

var btn_events_his = {

  "click #mobile_info" : function(a,b,value){
      parent.modifyMsg(value)

  },
  "click #del_info" : function(a,b,value){
    
       parent.config_delInfo.show(' <p class="delInfocontent">确定删除:'+value.content+'?</p>',{
        session_id:parent.DmConf.userinfo.id,
        token:parent.DmConf.userinfo.token,
        id:value.id
      },parent.DmConf.api.new.Del_libtext,_reload)

      
  }
}

function delAll(data,api,type){
  if(data.length == 0)  return parent.plus_alert('请选择记录');

  var id_list = [];
  var cont = '是否删除:' ;
  var rel = '';
  $.each(data,function(i,v){
    id_list.push(v.id);
    if (api == 'Del_libtext'){
      cont += ' <p class="delInfocontent">'+v.content +'</p>';
     
    } else if (api == 'Libsame_Del_libsame'){
      cont += ' <p class="delInfocontent">' +v.user_name +'</p>' ;
    
    } else if (api == 'Del_libvideo'){
      cont += ' <p class="delInfocontent">' +v.file_name +'</p>' ;
     
    }
  })

  if (api == 'Del_libtext') {
    if(type == 1){
      rel = _reload;
    }else if(type == 2){
      rel = _reloadDis;
    }else if(type == 3){
      rel = _reloadH;
    }
    
  } else if (api == 'Libsame_Del_libsame') {
    rel = _reloadSamePeople    ;

  } else if (api == 'Del_libvideo') {
    rel = _reloadVideo  ;

  }

  parent.config_delInfo.show(cont, {
    session_id: parent.DmConf.userinfo.id,
    token: parent.DmConf.userinfo.token,
    id: id_list.toString(), 
  }, parent.DmConf.api.new[api], rel)

}

function search_init(){
  $('#tableMy').bootstrapTable('destroy')
  var sel_valList = [{'id':'-1','text':"全部"},{'id':1,"text":'男'},{'id':0,'text':"女"},]
  var tableColumns = [
    { width: 50,field: "checked", checkbox: true, },
        {width:150,field: 'content', title: '内容详情',width:300,align : 'center',valign : 'middle',
        
        editable: {
                    type: 'text',
                    title: '修改内容',
                    validate: function (v) {
                      
                        var data = $('#bulletin_1').bootstrapTable('getData');
                        var idx = $(this).parent().parent().data('index');
                        var d_id = data[idx].id;
                        var dats = {
                            id:data[idx].id,
                            token :parent.DmConf.userinfo.token,
                            session_id:parent.DmConf.userinfo.id,
                            content:v,
                            action:data[idx].action,
                            lib_type:data[idx].lib_type
                          };
                        var ret = parent.getByRsync(parent.DmConf.api.new.Add_libtext, dats);
                        $('#bulletin_1').bootstrapTable('refresh')
                    }
                },},
        {width:150,field: 'admin', title: '操作人',align : 'center',valign : 'middle', },
       
                {width:150,field: 'sex_name', title: '分类',align : 'center',valign : 'middle',  formatter: function (value, row, index) {

                    return "<a   style=\"color:green;text-decoration:none\" data-text=\""+row.sex_name+"\" data-title=\"修改分类\">" + row.sex_name + "</a";
                },
          editable: {
                    type: 'select',
                    title: '修改分类',
                    source:sel_valList,
                    validate: function (v) {
                     
                        var data = $('#bulletin_1').bootstrapTable('getData');
                        var idx = $(this).parent().parent().data('index');

                        var d_id = data[idx].id;
                        var change_id = '';
              
                        $.each(sel_valList,function(a,b){
                          if(b.text == v){
                            change_id = b.id
                          }
                        })
                        var dats = {id:data[idx].id,
                            token :parent.DmConf.userinfo.token,
                            session_id:parent.DmConf.userinfo.id,
                            content:data[idx].content,
                            action:data[idx].action,
                            sex:change_id,
                            lib_type:data[idx].lib_type};
                        var ret = parent.getByRsync(parent.DmConf.api.new.Add_libtext, dats);
                        $('#bulletin_1').bootstrapTable('refresh')
                    }
                },},
        {width:150,field: 'add_time_t', title: '操作时间',align : 'center',valign : 'middle', },
        {width:150,field: 'Button', title: '操作', events: btn_events_his,formatter:AddEventBtn_his},
      ];
      function responseHandler(info) {
        if(!parent.checkCode1002(info)){
          return 
        }
        if(info.data.info){
          var task_status_name = ['全部','','私信','评论'];
          var sex_name = ['全部','女','男',];
   
          $.each(info.data.info.list,function(i,v){
            v.add_time_t = parent.UnixToDateTime(v.add_time);
            let action_t = Number(v.action) +1 ;
            v.status_name_t = task_status_name[action_t];

            let sex_num  = Number(v.sex) + 1 ;
           
            v.sex_name = sex_name[sex_num]
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
              "lib_type" :1 ,
              "action" :　1,
              "sex" : $('#sex_text').val(),
            
              "content" : $('#content_sel1').val(),
            } 

        }
      var detail = {
            "columns" :  tableColumns,
            "api" :   parent.DmConf.api.new.Libtext_list,
            "responseHandler" :  responseHandler,
            "queryParams" :   queryParams
      }
      new parent.get_search_list($('#bulletin_1'),detail,$('#refresh_btn'));

   
          
  }


function AddEventBtn_dis(a,value,c){

  return [ /*'<button id="mobile_info"  type="button" class="btn" >修改</button> ', */'<button id="del_info"  type="button" class="btn">删除</button> '].join('') 
}

var btn_events_dis = {

  "click #mobile_info" : function(a,b,value){
      parent.modifyMsg(value)

  },
  "click #del_info" : function(a,b,value){
    
       parent.config_delInfo.show('确定删除:'+value.content+'?',{
        session_id:parent.DmConf.userinfo.id,
        token:parent.DmConf.userinfo.token,
        id:value.id
      },parent.DmConf.api.new.Del_libtext,_reload)

      
  }
}


function check_discuss(){
  
  var sel_valList = [{'id':'-1','text':"全部"},{'id':1,"text":'男'},{'id':0,'text':"女"},]
  var tableColumns = [
    { width: 50, field: "checked", checkbox: true, },
        {width:150,field: 'content', title: '内容详情',width:300,align : 'center',valign : 'middle',
        
        editable: {
                    type: 'text',
                    title: '修改内容',
                    validate: function (v) {
                      
                        var data = $('#discuss_1').bootstrapTable('getData');
                        var idx = $(this).parent().parent().data('index');
                        var d_id = data[idx].id;
                        var dats = {
                            id:data[idx].id,
                            token :parent.DmConf.userinfo.token,
                            session_id:parent.DmConf.userinfo.id,
                            content:v,
                            action:data[idx].action,
                            lib_type:data[idx].lib_type,
                         
                          };
                        var ret = parent.getByRsync(parent.DmConf.api.new.Add_libtext, dats);
                        $('#discuss_1').bootstrapTable('refresh')
                    }
                },},
        {width:150,field: 'admin', title: '操作人',align : 'center',valign : 'middle', },
     
               
        {width:150,field: 'add_time_t', title: '操作时间',align : 'center',valign : 'middle', },
        {width:150,field: 'Button', title: '操作', events: btn_events_dis,formatter:AddEventBtn_dis},
      ];
      function responseHandler(info) {
        if(!parent.checkCode1002(info)){
          return 
        }
        if(info.data.info){
       
          var sex_name = ['全部','女','男',];
   
          $.each(info.data.info.list,function(i,v){
            v.add_time_t = parent.UnixToDateTime(v.add_time);
            
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
              "lib_type" :1 ,
              "action" :　2,
              "sex" : $('#sex_text').val(),
            
              "content" : $('#content_sel1').val(),
            } 

        }
      var detail = {
            "columns" :  tableColumns,
            "api" :   parent.DmConf.api.new.Libtext_list,
            "responseHandler" :  responseHandler,
            "queryParams" :   queryParams
      }
      new parent.get_search_list($('#discuss_1'),detail,$('#refresh_btn'));

   
          
  }

function download_mould(src){  
 /* parent.downloadFile('/module/xls/导入模板下载.xls')
  parent.downloadFile('/module/xls/导入模板下载.xls')*/
  var s = src ? src : '/module/xls/导入模板下载.xls'
   parent.downloadFile(s)
}


function buy_history(){

 var tableColumns = [
   { width: 50,field: "checked", checkbox: true, },
        {width:150,field: 'content', title: '内容详情',width:300,align : 'center',valign : 'middle', editable: {
                    type: 'text',
                    title: '修改内容',
                    validate: function (v) {
                      
                        var data = $('#buyHistory').bootstrapTable('getData');
                        var idx = $(this).parent().parent().data('index');
                        var d_id = data[idx].id;
                        var dats = {
                            id:data[idx].id,
                            token :parent.DmConf.userinfo.token,
                            session_id:parent.DmConf.userinfo.id,
                            content:v,
                            action:data[idx].action,
                            lib_type:data[idx].lib_type
                          };
                        var ret = parent.getByRsync(parent.DmConf.api.new.Add_libtext, dats);
                        $('#buyHistory').bootstrapTable('refresh')
                    }
                }, },
        {width:150,field: 'admin', title: '操作人',align : 'center',valign : 'middle', },

        {width:150,field: 'add_time_t', title: '操作时间',align : 'center',valign : 'middle', },

        {width:150,field: 'Button', title: '操作', events: btn_events_his,formatter:AddEventBtn_his},
      ];
      function responseHandler(info) {
        if(!parent.checkCode1002(info)){
          return 
        }
        if(info.data.info){
          var task_status_name = ['','私信','评论'];
          var sex_name = ['全部','男','女'];
   
          $.each(info.data.info.list,function(i,v){
            v.add_time_t = parent.UnixToDateTime(v.add_time);
           
           
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
              "lib_type" : 2 ,
               "content" : $('#content_sel2').val(),
            } 

        }
      var detail = {
            "columns" :  tableColumns,
            "api" :   parent.DmConf.api.new.Libtext_list,
            "responseHandler" :  responseHandler,
            "queryParams" :   queryParams,
      }
      new parent.get_search_list($('#buyHistory'),detail,$('#refresh_btn'));


}

function phoneList(){
 var tableColumns = [
   { width: 50, field: "checked", checkbox: true, },
        {width:150,field: 'content', title: '内容详情',align : 'center',valign : 'middle',  },
        {width:150,field: 'admin', title: '操作人',align : 'center',valign : 'middle', },

        {width:150,field: 'add_time_t', title: '操作时间',align : 'center',valign : 'middle', },
        {width:150,field: 'status_name_t', title: '分类',align : 'center',valign : 'middle',},
        {width:150,field: 'Button', title: '操作', events: btn_events_his,formatter:AddEventBtn_his},
      ];
      function responseHandler(info) {
        if(!parent.checkCode1002(info)){
          return 
        }
        if(info.data.info){
          var task_status_name = ['','私信','评论'];
          var sex_name = ['全部','男','女'];
   
          $.each(info.data.info.list,function(i,v){
            v.add_time_t = parent.UnixToDateTime(v.add_time);
           
           
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
              "lib_type" : 3 ,
            } 

        }
      var detail = {
            "columns" :  tableColumns,
            "api" :   parent.DmConf.api.new.Libtext_list,
            "responseHandler" :  responseHandler,
            "queryParams" :   queryParams,
      }
   new parent.get_search_list($('#phoneList'),detail,$('#refresh_btn'))
}




function AddEventBtn_acc(a,value,c){

  return [ '<button id="del_info"  type="button" class="btn">查看大图</button> ','<button id="del_info"  type="button" class="btn">删除</button> '].join('') 
}

var btn_events_acc = {

  "click #mobile_info" : function(a,b,value){
    OrderInfo.show(value)

  },
  "click #del_info" : function(a,b,value){
       parent.config_delInfo.show('确定删除:'+value.content+'?',{
        session_id:parent.DmConf.userinfo.id,
        token:parent.DmConf.userinfo.token,
        id:value.id
      },parent.DmConf.api.new.Del_libtext,TBrefresh($('#accountList')))
  }
}

function accountList(){


  var tableColumns = [
    { width: 50,field: "checked", checkbox: true, },
        {width:150,field: 'content_name', title: '内容详情',align : 'center',valign : 'middle',  },
        {width:150,field: 'admin', title: '操作人',align : 'center',valign : 'middle', },

        {width:150,field: 'add_time_t', title: '操作时间',align : 'center',valign : 'middle', },
      /*  {width:150,field: 'status_name_t', title: '分类',align : 'center',valign : 'middle',},*/
        {width:150,field: 'Button', title: '操作', events: btn_events_acc,formatter:AddEventBtn_acc},
      ];
      function responseHandler(info) {
        if(!parent.checkCode1002(info)){
          return 
        }
        if(info.data.info){
          var task_status_name = ['','私信','评论'];
          var sex_name = ['全部','男','女'];
   
          $.each(info.data.info.list,function(i,v){
            v.add_time_t = parent.UnixToDateTime(v.add_time);
            v.content_name = '<img src="'+v.content+'"/>'
           
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
              "lib_type" : 4 ,
            } 

        }
      var detail = {
            "columns" :  tableColumns,
            "api" :   parent.DmConf.api.new.Libtext_list,
            "responseHandler" :  responseHandler,
            "queryParams" :   queryParams,
      }
   new parent.get_search_list($('#accountList'),detail,$('#refresh_btn'))
}


function taskList(){

   var tableColumns = [
        { width:50, field: "checked", checkbox: true, },
        {width:150,field: 'content', title: '内容详情',align : 'center',valign : 'middle',  },
        {width:150,field: 'admin', title: '操作人',align : 'center',valign : 'middle', },

        {width:150,field: 'add_time_t', title: '操作时间',align : 'center',valign : 'middle', },
        {width:150,field: 'status_name_t', title: '分类',align : 'center',valign : 'middle',},
        {width:150,field: 'Button', title: '操作', events: btn_events_his,formatter:AddEventBtn_his},
      ];
      function responseHandler(info) {
        if(!parent.checkCode1002(info)){
          return 
        }
        if(info.data.info){
          var task_status_name = ['','私信','评论'];
          var sex_name = ['全部','男','女'];
   
          $.each(info.data.info.list,function(i,v){
            v.add_time_t = parent.UnixToDateTime(v.add_time);
           
           
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
              "lib_type" : 5 ,
            } 

        }
      var detail = {
            "columns" :  tableColumns,
            "api" :   parent.DmConf.api.new.Libtext_list,
            "responseHandler" :  responseHandler,
            "queryParams" :   queryParams,
      }
      new parent.get_search_list($('#taskList'),detail,$('#refresh_btn'));


  
}


function AddEventBtn_video(a,value,c){

  return [ '<button id="mobile_info"  type="button" class="btn">播放</button> ','<button id="del_info"  type="button" class="btn">删除</button> '].join('') 
}

var btn_events_video = {

  "click #mobile_info" : function(a,b,v){

    parent.fileZoom.create_video_img({'file_name':v.file_name,'url':v.url,'id':v.id},_reloadVideo)

  },
  "click #del_info" : function(a,b,value){
      parent.config_delInfo.show('确定删除:'+value.content+'?',{
        session_id:parent.DmConf.userinfo.id,
        token:parent.DmConf.userinfo.token,
        id:value.id
      },parent.DmConf.api.new.Del_libvideo,_reloadVideo)
  }
}




function videoList(){

   var tableColumns = [
         {width:50, field: "checked", checkbox: true, },
        {width:150,field: 'file_name', title: '文件名',align : 'center',valign : 'middle',  },
        {width:150,field: 'content_name', title: '内容详情',align : 'center',valign : 'middle',  width:"100px"},
        {width:150,field: 'url', title: '外部链接',align : 'center',valign : 'middle',  width:"120px"},
        {width:150,field: 'admin', title: '操作人',align : 'center',valign : 'middle', },
        {width:150,field: 'add_time_t', title: '操作时间',align : 'center',valign : 'middle', },
        {width:150,field: 'Button', title: '操作', events: btn_events_video,formatter:AddEventBtn_video},
      ];
      function responseHandler(info) {
        if(!parent.checkCode1002(info)){
          return 
        }
        if(info.data.info){
          var task_status_name = ['','私信','评论'];
          var sex_name = ['全部','男','女'];
   
          $.each(info.data.info.list,function(i,v){
              v.add_time_t = parent.UnixToDateTime(v.add_time);
              v.content_name = '<video style="width:50px" src="'+v.url+'"/></video>'
           
          })
        }

        return  { 
                   "total" : info.data.info.page.total ,
                  "rows"  :info.data.info.list
                }

      }


      function queryParams(params){
        var node = $('#videoList');
        return{ //每页多少条数据
              "session_id":parent.DmConf.userinfo.id,
              "token":parent.DmConf.userinfo.token,
              "page_count" :params.limit,
              "page" :(params.offset/params.limit)+1, 
              "file_name" : node.find("input[name=file_name]").val()
            } 

        }
      var detail = {
            "columns" :  tableColumns,
            "api" :   parent.DmConf.api.new.Libvideo_list,
            "responseHandler" :  responseHandler,
            "queryParams" :   queryParams,
      }
      new parent.get_search_list($('#videoList1'),detail,$('#refresh_btn'));


  
}

function audioList(){

   var tableColumns = [
        {width:50, field: "checked", checkbox: true, },
        {width:150,field: 'content', title: '内容详情',align : 'center',valign : 'middle',  },
        {width:150,field: 'admin', title: '操作人',align : 'center',valign : 'middle', },

        {width:150,field: 'add_time_t', title: '操作时间',align : 'center',valign : 'middle', },
        {width:150,field: 'status_name_t', title: '分类',align : 'center',valign : 'middle',},
        {width:150,field: 'Button', title: '操作', events: btn_events_his,formatter:AddEventBtn_his},
      ];
      function responseHandler(info) {
        if(!parent.checkCode1002(info)){
          return 
        }
        if(info.data.info){
          var task_status_name = ['','私信','评论'];
          var sex_name = ['全部','男','女'];
   
          $.each(info.data.info.list,function(i,v){
            v.add_time_t = parent.UnixToDateTime(v.add_time);
           
           
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
             
            } 

        }
      var detail = {
            "columns" :  tableColumns,
            "api" :   parent.DmConf.api.new.Libmusic_Libmusic_list,
            "responseHandler" :  responseHandler,
            "queryParams" :   queryParams,
      }
      new parent.get_search_list($('#audioList1'),detail,$('#refresh_btn'));


  
}

function AddEventBtn_same_com(a,value,c){

  return [ '<button id="del_info"  type="button" class="btn">删除</button> '].join('') 
}

var btn_events_same_com = {

  "click #mobile_info" : function(a,b,value){
    OrderInfo.show(value)

  },
  "click #del_info" : function(a,b,value){
      parent.config_delInfo.show('确定删除:'+value.user_name+'?',{
        session_id:parent.DmConf.userinfo.id,
        token:parent.DmConf.userinfo.token,
        id:value.id
      },parent.DmConf.api.new.Libsame_Del_libsame,_reloadSamePeople)

  }
}


function same_com(){
  
  var tableColumns = [
        {width:50, field: "checked", checkbox: true, },
        {width:150,field : 'user_name',title : '抖音号',align : 'center',valign : 'middle',},
        {width:150,field : 'nick_name',title : '抖音号昵称',align : 'center',valign : 'middle',},
        {width:150,field : 'fan_count',title : '粉丝数',align : 'center',valign : 'middle',},
        {width:150,field: 'group_name', title: '分组', align : 'center',valign : 'middle',   editable: {
                    type: 'text',
                    title: '修改分组',
                    validate: function (v) {
                        var data = $('#same_com1').bootstrapTable('getData');
                        var idx = $(this).parent().parent().data('index');
                        var d_id = data[idx].id;
                        var dats = {id:d_id,token :parent.DmConf.userinfo.token,session_id:parent.DmConf.userinfo.id,group_name:v,};
                        var ret = parent.getByRsync(parent.DmConf.api.new.Libsame_Group_libsame, dats);
                        $('#same_com1').bootstrapTable('refresh')
                    }
                },},
       {width:150,field: 'Button', title: '操作', events: btn_events_same_com,formatter:AddEventBtn_same_com,},
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
        } 
  };

   var detail = {
        "columns" :  tableColumns,
        "api" :   parent.DmConf.api.new.Libsame_Libsame_list,
        "responseHandler" :  responseHandler,
        "queryParams" :   queryParams,
        "clickToSelect" : false,
      }
   new parent.get_search_list($('#same_com1'),detail,$('#refresh_btn'))
}

  function refresh123(node){
      node.bootstrapTable('refresh')
  }

