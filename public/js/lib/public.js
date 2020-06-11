


/* 检查时间是否是1970 */
function isDate_1970(d){
  return ((new Date(d).valueOf()) > 0) ? d : "";
}

function create_datePicker(node){
  return node.datetimepicker({
        format: 'yyyy-mm-dd hh:ii:ss',//显示格式
        todayHighlight: 1,//今天高亮
        minView: '0',
        startView:2,
        forceParse: 0,
        showMeridian: 1,
        todayBtn: false,
        autoclose: 1,//选择后自动关闭
        pickerPosition:'bottom-right',
      });
}

function create_datePicker_new(node, type) {//0:开始时间 1,结束时间
  node.datetimepicker({
    format: 'yyyy-mm-dd ',//显示格式
    todayHighlight: 1,//今天高亮
    minView: 'month',
    startView: 2,
    forceParse: 0,
    showMeridian: 1,
    todayBtn: false,
    autoclose: 1,//选择后自动关闭
  });
  type == 0 ? node.datetimepicker("setDate", new Date(parent.getLocalTime().substr(0, 11) + "00:00:00")) : node.datetimepicker("setDate", new Date(parent.getLocalTime().substr(0, 11) + "23:59:59"))

  return
}



/* var enter_search = {
	'first' : function(event){
	        var e = e || window.event ||  arguments.callee.caller.arguments[0];
	        var code = e.keyCode || e.which || e.charCode;
	        if(code == 13){
	            getData(0);//具体处理函数
	}}}
 */
var create_option = {

  "create_resource_all" : function(node){
    var resource_type = parent.DmConf.data.resource_type;
    for(var attr in resource_type){
       node.append('<option value='+resource_type[attr].id+'>'+resource_type[attr].name+'</option>')
    }
    node.selectpicker('refresh');
  },


}

function gobackHis(url){
  window.location.href =  url
}

function returnBack(){
  if(window.taskDetailInfo){

    setTimeout(function(){

      $('.conTable').find('.fixed-table-body')[0].scrollTop = window.taskDetailInfo.showIframe_data.scrollTop;

      window.taskDetailInfo = '';

    },500)
  }
  

}


function reloadCity(node){
  var ci = parent.DmConf.city.split(',')
  var c_node = node ? node : $("#city")
  $.each(ci,function(i,v){
      var opt = '<option value='+v+'>'+v+'</option>';
       c_node.append(opt)
    })
    c_node.selectpicker('refresh');
     c_node.parent().css({'z-index':7}) 
}
//刷新表格

function TBrefresh(node){

    node ? node.bootstrapTable('refresh') : $("#tableMy").bootstrapTable('refresh')
}

function write_video(msg){

  $('input[name=video_fileName]').val(msg.file_name)
  $('input[name=video_fileName]').attr('msg',msg['url'])
}
//写评论
function write_content(msg){
      $.each($('.addContent').find('p'),function(a,b){

      if($(b).find('input').val().length == 0){
        $(b).remove()
      }
    })
    $.each(msg,function(i,v){
          $('.addContent').append('<p class="input-group margin10">\
                <input type="text" class="form-control" name="content" value="'+v.value+'"     ><button  onclick="del_msg(this)" type="button" class=" btn_style btn btn-primary" >删除</button>\
              </p>') 
    })
}
function addContent(type){
  
  $('.addContent').append('<p class="input-group margin10">\
                <input type="text" class="form-control" name="content" placeholder=" "     ><button  onclick="del_msg(this)" type="button" class=" btn_style btn btn-primary" >删除</button>\
              </p>') 
}


//写私信
function write_msg(msg){
   $.each($('.addMsg').find('p'),function(a,b){

      if($(b).find('input').val().length == 0){
        $(b).remove()
      }
    })
  
    $.each(msg,function(i,v){
          $('.addMsg').append('<p class="input-group margin10">\
                <input type="text" class="form-control" name="addMsg" value="'+v.value+'"     ><button  onclick="del_msg(this)" type="button" class=" btn_style btn btn-primary" >删除</button>\
              </p>') 
    })
}

function addMsg(){
  $('.addMsg').append('<p class="input-group margin10">\
              <input type="text" class="form-control" name="addMsg" placeholder=" "     ><button  onclick="del_msg(this)" type="button" class="btn_style btn btn-primary" >删除</button>\
            </p>')
}

var emojiAttr = ''

function write_emoji(t){
  var eomId = $(t).attr('src').match(/[0-9].png/g)[0].split('.')[0];
  
  $('.emojiBtn').popover('hide')
}

function del_msg(t) {

  $(t).parent().remove()
}


function htmlContent(){
  var h = ' ' ;

  for(var i=0;i<132;i++){
    
    h += '<img style="width:30px;margin:10px" onclick="write_emoji(this)" src="../../../public/css/icon2/emoji/'+i+'.png" />' 
  }
  
  return h
}

function transfer_time(str) {
  var s = ''
  var days = Math.floor(str / 86400);
  var hours = Math.floor((str % 86400) / 3600);
  var minutes = Math.floor(((str % 86400) % 3600) / 60);
  var seconds = Math.floor(((str % 86400) % 3600) % 60);
  if (days > 0) s += days + "天";
  if (hours > 0) s += hours + "时";
  if (minutes > 0) s += minutes + "分";
  if (seconds > 0) s += seconds + "秒";

  return s
}

/* 检查非空填写::::::除了间隔 */
/*  var data = {
    "name": $("input[name=task_name]").val(),
  }
  var error_obj = [
    { at: "name", er_msg: "请填写人物名" },
    { at: "name", er_msg: "请填写人物名" detail:{len:1,} },(len:长度判断,)
  ] */
function check_emptyInput(obj, arr) {
  var er = 0;

  for (var i = 0; i < arr.length; i++) {

    if (arr[i]['detail']) {
      
      var len = obj[arr[i]['at']].split('').length;
     
      if (len <= arr[i]['detail']['len']) {
        er = arr[i]['er_msg'];
        break;
      }
    }
    if (!obj[arr[i]['at']]) {
      er = arr[i]['er_msg'];
      break;
    }
  }
  return er;
}

$("#tb").on('keydown','input',function(e){
 
  if (e.keyCode == 13) {
    search_init()
  }
})

var publicFunc = {
  showTaskStatus : function(node){
    var task_status = parent.DmConf.task_status ;
    for(var i=0;i<task_status.length;i++){
      node.append('<option value='+i+'>'+task_status[i]+'</option>')
    }
    return node.selectpicker('refresh')
  },
  goHis(h,data){
  
    parent.mainPlatform.show_child_iframe(h, 'asdfasdfasdfasfasdf', data['showIframe'], false, false, data, )
  }
}

