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
  return ['<button id="caiji"  type="button" class="btn" >取关</button> ',].join('');
 
}
var btn_events = {
  "click #caiji" : function(a,b,value){
    delCus([value])
  },
 
  

}

$('.changeTable').on('click','span',function(){
  $(this).addClass('active').siblings().removeClass('active');
  let app_type = $(this).attr('app_type')
  $('.showw span').hide()
  $('.showwH').hide()
  if(app_type == 1){
    $('.b11').show();
    $('.b1').show();
    $('.b2').show();
    $('.b3').show();
    $('.b6').show();
    $('.b9').show();
  }else if(app_type == 2){
    $('.b4').show();
    $('.b1').show(); 
    $('.b2').show();
    $('.b6').show();
    $('.b8').show();
    $('.b9').show();
  }else if(app_type == 3){
    $('.b5').show()
    $('.b8').show()
    $('.b9').show();
  } else  if(app_type == 4){
    $('.b5').show()
  }
  $('.b7').show()
  search_init(app_type)
})


function sendCa(typd){
  var data = $('#tableMy').bootstrapTable('getSelections')
  if (data.length == 0) return parent.plus_alertShow.show('请选择记录')
  if(typd == 2){
    parent.togetherGroup.show(data, window.taskDetailInfo)
  }else if(typd == 3){

    if (data.length > 200) return parent.plus_alertShow('选择抖音号不得超过200')
    
    parent.replyVideo.show(data, window.taskDetailInfo)
  }else if(typd == 4){
    parent.concernAndcheat.show(data)
  } else if (typd == 5) {
    parent.concernAndcheat.show(data,1)
  }else{
    parent.sendCusCard.show(data, window.taskDetailInfo)
  }
 
}

function delCus(data){
  if(data.length == 0) return parent.plus_alert("请选择记录");
  var str = data.length == 1 ? '<p>确定取关抖音号:' + data[0]['nickname'] + "?</p>" : '<p>确定取关抖音号:' + data[0]['nickname'] + "等"+data.length+"个抖音号吗?</p>" ;
  var esId = []
  let dyId = $.map(data,function(v){
    esId.push(v.id)
    return v.unique_id
  }).join(',');
  
  parent.config_delInfo.show(str, {
    application_account_id : window.taskDetailInfo.id ,
    douyin_uid: dyId,
    es_id: esId.toString(),
    token: parent.DmConf.userinfo.token,
    session_id: parent.DmConf.userinfo.id,
    name:"取关抖音号"
  }, parent.DmConf.api.new.Add_task_hgqxgz);
  
}
function search_init(ap_type){
  
    $('#tableMy').bootstrapTable('destroy');
  if(ap_type == 4) {
    return search_init1()
  }
  this.ap_type = ap_type ;
      var tableColumns = [
        { width: 50,field: "checked", checkbox: true, },
        { width: 100,field: 'unique_id', title: '抖音号',align : 'center',valign : 'middle',  },
        { width: 100,field: 'nickname', title: '昵称',align : 'center',valign : 'middle', },
        { width: 50, field: 'sex_name', title: '性别', align: 'center', valign: 'middle', },

      ];
     
      if(this.ap_type == 1){
        tableColumns.push({ width: 75, field: 'is_jq_name', title: '是否加群', align: 'center', valign: 'middle', }, { width: 75, field: 'is_sx_name', title: '是否私信', align: 'center', valign: 'middle', }, { width: 150, field: 'Button', title: '操作', events: btn_events, align: 'center', formatter: AddEventBtn } )
      }else if(this.ap_type == 2){
        tableColumns.push({ width: 75, field: 'is_hg_name', title: '是否互关', align: 'center', valign: 'middle', }, { width: 75, field: 'is_sx_name', title: '是否私信', align: 'center', valign: 'middle', },{ width: 150, field: 'Button', title: '操作', events: btn_events, align: 'center', formatter: AddEventBtn })
      } else if (this.ap_type == 3){
        tableColumns.push({ width: 75, field: 'is_hg_name', title: '是否互关', align: 'center', valign: 'middle', }, { width: 75, field: 'is_sx_name', title: '是否私信', align: 'center', valign: 'middle', }, { width: 150, field: 'addtime_t', title: '采集时间', align: 'center', valign: 'middle', },)
      }
  
      function responseHandler(info) {
        if(!parent.checkCode1002(info)){
          return 
        }
        var sex_type = ['女','男'];
        var _name = ['否','是']
        if(info.data.info){

          $.each(info.data.info.list,function(i,v){
            v.sex_name = sex_type[v.sex]
            v.is_hg_name = _name[v.is_hg]
            v.is_jq_name = _name[v.join_group]
            v.is_sx_name = _name[v.is_message]
            v.addtime_t = parent.UnixToDateTime(v.addtime)

          
          })
        }

        return  { 
                   "total" : info.data.info.page.total ,
                  "rows"  :info.data.info.list
                }

      }
      var self = this ;
      
      function queryParams(params){
     

        var data = { //每页多少条数据
          "session_id":parent.DmConf.userinfo.id,
          "token":parent.DmConf.userinfo.token,
          "page_count" :params.limit,
           "is_type": self.ap_type, 
           "from_unique_id" : window.taskDetailInfo.user_name,
          "sex": $("#sex").val(),
          unique_id: $('#tb').find('input[name=user_name]').val(),
         "is_message" : $("#is_message").val(),
          "page" :(params.offset/params.limit)+1, 
        }
       
        if(ap_type == 1){
       
          data["join_group"] = $("#is_join_group").val() ;
        }else if(ap_type == 2){
        
          data["follow_each_other"] = $("#follow_each_other").val();
        }else if(ap_type == 3){
          var d = $('#begin_date').val().split('至')
          data["begin_date"]=d[0] + ' 00:00:00';
          data["end_date"]= d[1] + ' 23:59:59';
          data["follow_each_other"] = $("#follow_each_other").val();
        }
        return data
      }
      
      var detail = {
            "columns" :  tableColumns,
        "api": parent.DmConf.api.new.Task_fan_result ,
            "responseHandler" :  responseHandler,
            "queryParams" :   queryParams
      }
      new parent.get_search_list($('#tableMy'),detail,$('#refresh_btn'));
      
}


function search_init1() {
  $('#tableMy').bootstrapTable('destroy');

  this.ap_type = ap_type;
  var tableColumns = [
    { width: 50, field: "checked", checkbox: true, },
    { width: 100, field: 'unique_id', title: '抖音号', align: 'center', valign: 'middle', },
    { width: 100, field: 'nickname', title: '昵称', align: 'center', valign: 'middle', },
  /*   { width: 50, field: 'sex_name', title: '性别', align: 'center', valign: 'middle', },
    { width: 50, field: 'age', title: '年龄', align: 'center', valign: 'middle', }, */
    { width: 100, field: 'follow_name', title: '是否关注', align: 'center', valign: 'middle', },
  ];
  function responseHandler(info) {
    if (!parent.checkCode1002(info)) {
      return
    }
    var sex_type = ['女', '男'];
    var _name = ['否', '是','相互关注']
    if (info.data.info) {

      $.each(info.data.info.list, function (i, v) {
     /*    v.sex_name = sex_type[v.sex] */
        v.follow_name = _name[v.is_follow]
        v.unique_id = v.short_id
      })
    }

    return {
      "total": info.data.info.page.total,
      "rows": info.data.info.list
    }

  }
  var self = this;

  function queryParams(params) {

    var data = { //每页多少条数据
      "session_id": parent.DmConf.userinfo.id,
      "token": parent.DmConf.userinfo.token,
      "page_count": params.limit,
      "application_account_id": window.taskDetailInfo.id,
      "page": (params.offset / params.limit) + 1,
    }



    return data
  }
 
  
  var detail = {
    "columns": tableColumns,
    "api": parent.DmConf.api.new.Task_mail_result,
    "responseHandler": responseHandler,
    "queryParams": queryParams
  }
  new parent.get_search_list($('#tableMy'), detail, $('#refresh_btn'));

}

