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


function search_init(){
  create_datePicker($('.time_tick1'))
  $('input[name=time_type1]').click(function () {

    if ($(this).val() == 1) {
      $('.time_task1').show()
    } else {
      $('.time_task1').hide()
    }
  })

  create_datePicker($('.time_tick'))
  $('input[name=time_type]').click(function () {

    if ($(this).val() == 1) {
      $('.time_task').show()
    } else {
      $('.time_task').hide()
    }
  })
  reloadCity()
}
function shpwTree(t,type){
  var check_tree = t ;
  var str = '';
  var save_num = [];


  $.each(check_tree, function (i, v) {

    if (v.parentId != 99999999 && !v.nodes) {

      var v_name = v.mobile_label.length > 0 ? v.mobile_label : v.imei;
      str += v_name + ':' + v.text + ';';

      save_num.push(v.href)
    }

  });

  var tot_show = str.split(';')

  var o = {};
  for (var i = 0; i < tot_show.length; i++) {
    if (tot_show[i].length == 0) continue;
    if (tot_show[i].search('&emsp') != '-1') {
      var kv = tot_show[i].replace('&emsp', '').split(':');

      var _arr1 = [];
      for (var j = 0; j < kv.length; j++) {
        _arr1.push(kv[j]);
      }
      if (_arr1[0] in o) {
        if (typeof (o[_arr1[0]]) == 'string') {
          o[_arr1[0]] = [o[_arr1[0]]];
        };
        o[_arr1[0]].push(_arr1[1])
      } else {
        o[_arr1[0]] = _arr1[1]
      }
    }
  }


  var str_o = '';
  for (var attr in o) {
    if (o[attr]) {
      var newMs;

      if (((typeof (o[attr]) == 'string')) && o[attr] == '抖音短视频') {
        newMs = ''
      } else {
        newMs = ':' + o[attr].toString()
      }

      str_o += '<span style="color:red">' + attr + '</span>' + newMs + ';'
    }
  }

  $("#addTaskAccount1" + type).val(save_num.toString());
  $("#addTaskAccount" + type).val(str);
  $(".addTaskAccount2" + type).html(str_o);

}
function saveCJ(check_tree){
  shpwTree(check_tree,1)
}
function saveDZ(check_tree){
  shpwTree(check_tree,2)
}

function delT(t){
  $(t).parent().remove()
}


function saveTask(){

  var node = $('.container-fluid'); 
  var addCont = $('.addContent').find('input[name=content]').map(function () { return this.value; }).get().join("_#_");
  var addMsg = $('.addMsg').find('input[name=addMsg]').map(function () { return this.value; }).get().join("_#_");
/*   var filter_title = node.find('input[name=filter_tit]').val().split('+'); */
  var comment_time = node.find('input[name=rightTime]:checked').attr('attrValue') == 0 ? node.find('input[name=timeHour]').val() * 3600 : node.find('input[name=rightTime]:checked').attr('attrValue') == 1 ? node.find('input[name=timeMin]').val() * 60 : node.find('input[name=timeDay]').val() * 86400;
  var comment_num = $('input[name=concern_0]').val() + '_' + $('input[name=concern_1]').val();
  var data = {
    "application_account_id1": $('#addTaskAccount11').val(),
    "application_account_id": $('#addTaskAccount12').val(),
    "acquisition_num1" : comment_num ,
    "task_time1": node.find('input[name=task_time1]').val(), 
    "session_id" : parent.DmConf.userinfo.id,
    'time_type1': node.find('input[name=time_type1]:checked').val(),
    'time_tick1': $('#time_tick1').val(),
    'time_week1': $('#time_week1').val() == null ? 0 : $('#time_week1').val().toString(),
    "comment_time": comment_time,
    "keywords": node.find('input[name=keywords]').val().replace(/\+/ig, ','),
    "token" : parent.DmConf.userinfo.token,
    "customer_id" : parent.DmConf.userinfo.customer_id,
    /* "sex1" : $("#sex_type").val(), */
    "id" : 0,
/*     message_text: addMsg, */
    comment_text: addCont,
    is_like: node.find('input[name=is_like]:checked').val() ,
/*     is_filter: node.find('input[name=is_filter]').prop('checked') ? 1 : 0,
    filter_title: JSON.stringify(filter_title), */
    'time_type': node.find('input[name=time_type]:checked').val(),
    'time_tick': $('#time_tick').val(),
    'time_week': $('#time_week').val() == null ? 0 : $('#time_week').val().toString(),
    'send_model': node.find('input[name=sendmodeladdtask]:checked').attr('valueAttr'),
    "name1" : node.find('input[name=name1]').val()
  }

   let error_obj = [
     { at: "name1", er_msg: "请填写任务名" },
    { at: "application_account_id", er_msg: "请选择点赞评论应用账号" },
     { at: "application_account_id1", er_msg: "请选择采集任务应用账号" },
  
     { at: "keywords", er_msg: "请填写二次点赞评论私信的关键词" },
 

     { at: "comment_time", er_msg: "请填写二次点赞评论私信评论时间" },
    { at: "acquisition_num1", er_msg: "请填写采集数量", detail: { len: 2, } },
     { at: "task_time1", er_msg: "请填写采集时间" },
  /*    { at: "comment_text", er_msg: "请填写评论内容" }, */
  ]

  if (node.find('input[name=key_type]:checked').val() == 1) {
    data['video_type1'] = 1;
    data['class_name1'] = node.find('input[name=class_name1]').val().replace(/\+/ig, ',');
    error_obj.push({ at: 'class_name1', er_msg: "请填写采集与评论点赞的关键词" })
  } else if (node.find('input[name=key_type]:checked').val() == 2) {
    data['video_type1'] = 2;
    data['city1'] = $('#city').val();
    error_obj.push({ at: 'city1', er_msg: "请选择城市" })
  } else if (node.find('input[name=key_type]:checked').val() == 3) {
    data['video_type1'] = 3;
    data['big_dy1'] = node.find('input[name=big_dy]').val();
    error_obj.push({ at: 'big_dy1', er_msg: "请填写大号" })
  }
  if(data['is_like'] == 0 ){
    error_obj.push({ at: "comment_text", er_msg: "请填写评论内容" })
  }

   var err_msg = check_emptyInput(data, error_obj);
  if (err_msg != 0) {
    return parent.plus_alertShow.show(err_msg)
  } 

      var ret = parent.getByRsync(parent.DmConf.api.new.Add_like_comment_message_again, data);
    if (ret.data.code == 0) {
      parent.plus_alertShow.show('任务设置成功')
    } else {
      parent.plus_alertShow.show(ret.data.info.msg)
    }  
 
  
}