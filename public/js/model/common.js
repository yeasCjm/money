var OrderInfo = {
  listId:0,
  show(row){
        $('.bg_tick').datetimepicker({
              format: 'yyyy-mm-dd',//显示格式
              todayHighlight: 1,//今天高亮
              minView: "month",//设置只显示到月份
              startView:2,
              forceParse: 0,
              showMeridian: 1,
              todayBtn: true,
              autoclose: 1//选择后自动关闭
            });
       
        $('.end_tick').datetimepicker({
              format: 'yyyy-mm-dd',//显示格式
              todayHighlight: 1,//今天高亮
              minView: "month",//设置只显示到月份
              startView:2,
              forceParse: 0,
              showMeridian: 1,
              todayBtn: true,
              autoclose: 1//选择后自动关闭
            });
       
        $(".bg_tick").datetimepicker("setDate", new Date());
        $(".end_tick").datetimepicker("setDate", new Date());
        if(row){
            this.listId = row.id;
            $('#createOrder').find('input[name=discount]').val(row.discount);
            $('#createOrder').find('input[name=price]').val(row.price);
            $('#createOrder').find('textarea[name=remark]').val(row.remark);
            if(row.mobile_sum == null ){
                $('#createOrder').find('input[name=num]').val(row.mobile_supply);
                $($('#createOrder').find('input[name=phoneSel]')[1]).prop('checked','true')
            }else{
               $('#createOrder').find('input[name=num]').val(row.mobile_sum);
                $($('#createOrder').find('input[name=phoneSel]')[2]).prop('checked','true')
            }

            $(".bg_tick").datetimepicker("setDate", new Date(parent.UnixToDateTime(row.start_date)));
            $(".end_tick").datetimepicker("setDate", new Date(parent.UnixToDateTime(row.end_date)));

        }
        $("#createOrder").modal()
  },
  save(){
    var node = $('#createOrder')
    var dat = {
      operator : 'admin' ,
      price : node.find('input[name=price]').val(),
      discount : node.find('input[name=discount]').val(),
      start_date :  new Date($('#bg_tick').val()).valueOf()/1000,
      end_date :   new Date($('#end_tick').val()).valueOf()/1000,
      remark :　node.find('textarea[name=remark]').val(),
      token:parent.DmConf.userinfo.token,
      session_id:parent.DmConf.userinfo.id,
      customer_id:  window.taskDetailInfo.id,
      id:this.listId
    }
    node.find('input[name=phoneSel]:checked').val() == 0 ? dat['mobile_sum'] = node.find('input[name=num]').val() :  dat['mobile_supply'] = node.find('input[name=num]').val() ;

    var ret = parent.getByRsync(parent.DmConf.api.new.Add_order,dat)
    if(ret.data.code == 0){
        $('#buyHistory').bootstrapTable('refresh')
        $('#createOrder').modal('hide');
      }else{
         parent.plus_alert(ret.data.msg)
      }
  }

}
var transfer_mobile = {
  dataList :'',
  func : "",
  show(data,func){
      //var data = $('#tableMy').bootstrapTable('getSelections');
      if(data.length == 0) return parent.plus_alert('请选择记录') ;
      this.dataList = data;
      this.func = func ;
      $('#customer_sel').find('option').remove()
      var ret = parent.getByRsync(parent.DmConf.api.new.customer_list,{
        session_id:parent.DmConf.userinfo.id,
        token:parent.DmConf.userinfo.token,
        page:1,
        page_count:9999
      })
      if(ret.data.code == 0){
        var info = ret.data.info.list ;
        $('#customer_sel').append("<option value=0 >软件供应商</option>")
        $.each(info,function(i,v){
        $('#customer_sel').append("<option value="+v.id+" >"+v.name+"(客户ID:"+v.id+")"+"</option>")
        })
      }else{  
        parent.plus_alert(ret.data.msg)
      }
      $('#customer_sel').selectpicker('refresh');
      $('.transfer_len').html(data.length)
      commonModal_show($('#transferMobile')); 
  },
  save(){
      var data =  this.dataList ;
      var id_list = $.map(data,function(b){return b.id });
      var imei_list = $.map(data,function(b){return b.imei});
     
      var ret = parent.getByRsync(parent.DmConf.api.new.Customer_mobile,{
        id:id_list.toString(),
        imei:imei_list.toString(),
        token:parent.DmConf.userinfo.token,
        session_id:parent.DmConf.userinfo.id,
        customer_id:$('#customer_sel').val(),

      })
       if(ret.data.code == 0){
          $('#transferMobile').modal('hide');
          if(this.func){
            this.func()
          }
          parent.plus_alert('设置成功')
       }else{
        parent.plus_alert(ret.data.msg)
       }

  }
}

var verifyManage = {
  uid :'',
  func : "",
  type : "",
  show(type,data,func){
      //var data = $('#tableMy').bootstrapTable('getSelections');
      this.func = func ;
      this.type = type ;

       $('#status').selectpicker('refresh');
       $('#status_1').selectpicker('refresh');
       $('.showMis').hide()
      if(type == 1){
        $(".show_type").hide();
        $(".error").show()
        $('#verifyManage').find('#status').val(2);
        this.uid = data.id;

      }else if(type == 2){
         $(".show_type").hide();
         $('.showMis').show();
         this.uid = data.id;
      }else if(type ==4 ){
         $(".show_type").hide();
         $('.showMis').show();
         this.type = 2
        
         var dataL = []
         $.each(data,function(i,v){
            dataL.push(v.id)
         }) 
         this.uid = dataL.toString()

      }else{
         $(".show_type").show();
         var dataL = []
         $.each(data,function(i,v){
            dataL.push(v.id)
         }) 
         this.uid = dataL.toString()
      }
      $("#status").change(function(){
        if($(this).val() == 1){
           $(".error").hide()
        }else{
           $(".error").show()
        }
      })
      commonModal_show($('#verifyManage'),{width:"20%"})
      
  },
  save(){

      var data = {
        id:this.uid,
        token:parent.DmConf.userinfo.token,
        session_id:parent.DmConf.userinfo.id,
        status:$('#status').val(),

      };
      if(this.type == 2){
        data['status'] = $('#status_1').val()
      }
      if($("#status").val() == 2 ) data['error_notes'] = $('#verifyManage').find('textarea[name=error_notes]').val()
      var ret = parent.getByRsync(parent.DmConf.api.new.Status_customer,data)
       if(ret.data.code == 0){
          $('#verifyManage').modal('hide');
          if(this.func){
            this.func()
          }
          parent.plus_alert('设置成功')
       }else{
        parent.plus_alert(ret.data.msg)
       }

  }

};
var Tel_Import = {
  'importf' : function(obj) { //导入资源

      if (!obj.files) { return; } 
      var f = obj.files[0]; 
   
      var reader = new FileReader(); 
      reader.onload = function (e) {
         var data = e.target.result; 
         var wb = XLSX.read(data, { type: 'binary' }); 
        if (!wb.Workbook){
          return parent.plus_alertShow.show('请选择excel文件')
        }
         Tel_Import.data = {data:wb,name:$('#up_xls_btn').val()}
          
         Tel_Import.list();

         var sheet_list =  $("#sheet_list")
         sheet_list.find('option').remove()
         var sheet_data = wb.SheetNames;
         $('.file_name').val($('#up_xls_btn').val().split('\\')[2]);

         for(var i=0;i<sheet_data.length;i++){
            var opt = $('<option value='+sheet_data[i]+'>'+sheet_data[i]+'</option>');
            sheet_list.append(opt)
         }
          sheet_list.selectpicker('refresh');

          sheet_list.change(function(){
              Tel_Import.list(this.value);
          });
          $('#up_xls_btn').val('');
       }
       
       reader.readAsBinaryString(f); 
      
    },
    "data" : "",
    "o"     : function(){ return $('#myModal'); },
    "field" : function(t){   
          var def = [ {"name":"导入内容",    "value":"1"}]
       return def;
    },
    "up"    : function(callback){
          $('#up_xls_btn').click();
    },
    "list" : function(sheet_name){

            var tab = this.o().find(".table-responsive");
            var dats = Tel_Import.data
            
            var sel = $('<select ></select>');
            //sel.append('<option value="">不导入</option>');
            $.each(this.field(), function(i, v){
              sel.append('<option value="'+v.value+'">'+v.name+'</option>');
            });
       
            var reg =  /^[A-Z]+1$/g;
            tab.find("tbody>tr").remove();
            var sheet_data = dats.data.Sheets[dats.data.SheetNames[0]];
            sheet_name ? sheet_data = dats.data.Sheets[sheet_name] : sheet_data = sheet_data
           
             $.each(sheet_data, function(i,v){
                if(i.search(reg) == 0){
                   var n = $('<tr><td>'+i+'</td><td>'+v.v+'</td><td></td></tr>');
                    var c_sel = sel.clone();
                    var def_value = c_sel.find('option:contains("'+v+'")').val();
                    if(def_value){ 
                      if(0 == tab.find('select > option:contains("'+v+'"):selected').length){
                         c_sel.val(def_value);
                         c_sel.css("color","#000");
                      }
                    }

                    n.children("td:last-child").append(c_sel);
                    tab.find("tbody").append(n);
                } 
              });
              


            tab.find("select").change(function(){
                  var num = 0;
                  var v = this.value;
                
                  $.each($(this).parent().parent().parent().find("select"), function(i,n){
                    if(n.value == v) num++;
                  });
               
                  if(num>1) this.value = '';
                  this.style.color = this.value.length > 0 ? '#000' : '#6c6c6c';
            });

    },
    "save" : function(){
                    var node = this.o();
                    var im_xls = node.find(".import_xls");
                    var tab = this.o().find(".table-responsive");
                    var self = this
                    var dats = {};

                    var check_val = $(tab.find("tr")[1]).find('select').val();
                    var ok_val = this.type == 1 ? $('#select_resourceLable').val() : Number(this.type)+Number(1) ;
                   
                    dats[check_val] =  $(tab.find("tr")[1]).children("td:nth-child(1)").text()
                    var list_data = [] ;
                   
                    var o_data = Tel_Import.data.data.Sheets[Tel_Import.data.data.SheetNames[0]] ;

                    var length = String(o_data['!ref'].split(':')[1]).replace(/[^0-9]/ig, "");
                 

                      var str_save = '';
                
                     for(var i=2;i<=99999;i++){
                        for(var attr in dats){
                          var _attr = dats[attr].replace(/[^A-Z]/ig,"")+i;
                          if (o_data[_attr]){
                            str_save += o_data[_attr].v + '_#_';
                          }
                         
                        }
                    
                     }
                     
               
                    var sendData = {
                      content:str_save.substring(0,str_save.length -3),
                      session_id:parent.DmConf.userinfo.id,
                      token:parent.DmConf.userinfo.token,
                      lib_type:self.type,
                      sex : $('#select_sex').val(),
                    }
                    if(self.type <= 1 ){
                      sendData['lib_type'] = 1 ;
                      sendData['action'] = Number(self.type) + 1;

                    }
                    var ret = parent.getByRsync(parent.DmConf.api.new.Add_libtext,sendData)
                    if(ret.data.code == 0){
                      node.modal('hide')
                    }else{
                        parent.plus_alertShow.show(ret.data.msg)
                       return 
                    }
                   
    },
    type:'',
    "go" : function(type,callback){
            var node = this.o();
            this.type = type ;
            //var ret = getByRsync(parent.DmConf.api.mobile.ResourceTypeSearch,{})
         /*    var phone_label = parent.DmConf.data.resource_type*/
            //if(ret.status) phone_label = ret.data;
            $('.file_name').val('');
            $('#sheet_list').find('option').remove();
           
            $('#sheet_list').selectpicker('refresh');
            var dataList = []
           /* $.each(phone_label,function(i,v){
                $('#select_resourceLable').append('<option value='+v.id+'>'+v.name+'</option>')
            });*/
            this.o().find(".table-responsive").find('tbody').find('td').remove();
            $('#select_resourceLable').selectpicker('refresh');
            $('#select_sex').selectpicker('refresh');
            
              $('.common_selResourceLbale').hide()
            
             if(type == 0){
                $('.common_selShowSex').show()
              }else{
                $('.common_selShowSex').hide()
              }
              $('#select_resourceLable').val(type)
            //alert_center(node)
        
           commonModal_show(node)

    }
};


/*设备操作*/
var mobie_control = {
  "m_url" : function(type){
    if(type == 0 ){
      return parent.DmConf.api.new.Applicationaccount_list;
    }else if(type == 1){
      return parent.DmConf.api.new.Applicationaccount_list;
    }else if(type == 2){
      return parent.DmConf.api.new.mobile_list;
    }
  },
    "m_type":"",
    "c_node" :"",
    "save" : function(){
    var id_list = [];
    var str = ''
    var imei_list = '';
    var self = this ;
    $.each($('.choice_mobie').find('label'),function(i,v){
      id_list.push($(v).attr('rowId'))
      str += $(v).text()+';' ;
      if(self.m_type == 2){
  
        imei_list += $(v).attr('imei_id')+',';
        str = i > 1 ? $(v).text() + '等' + (parseInt(i)+Number(1)) + '台手机' : $(v).text() ;
      }
    })
    if(this.m_type == 0){
      this.c_node.contents().find("#addTaskMobile").data('id_list',id_list);
      this.c_node.contents().find("#addTaskMobile1").val(id_list.toString());
      this.c_node.contents().find("#addTaskMobile").val(str);
      this.c_node.contents().find(".addTaskMobile2").html(str);
    }else if(this.m_type == 1){
      this.c_node.contents().find("#addTaskAccount").data('id_list',id_list);
      this.c_node.contents().find("#addTaskAccount1").val(id_list.toString());
      this.c_node.contents().find(".addTaskAccount1").val(id_list.toString());
      this.c_node.contents().find(".addTaskAccount2").html(str);
      this.c_node.contents().find("#addTaskAccount").val(str);

     
    }else if(this.m_type == 2){

      this.c_node.contents().find("#addTaskResource").data('id_list',id_list);
      this.c_node.contents().find("#addTaskResource").val(str)
      this.c_node.contents().find("#addTaskResource1").val(imei_list)
      this.c_node.contents().find(".addTaskResource2").html(str)
    }
   },
  "show_phone" : function(type,node){//显示设备

    if(type == 1){
         return treeview.show(node);
    }
    $('#select_mobieTeam').selectpicker();
    $('.choice_mobie').children('label').remove();
  //  alert_center($('#choice_phone'))
   
    this.m_type = type;
    this.c_node = node;
    var id_list = [] ;
 
    if(type == 0){//大号
        if(this.c_node.contents().find("#addTaskMobile").data('id_list') ){
          id_list = this.c_node.contents().find("#addTaskMobile").data('id_list');

        }
    }else if(type == 1){//小号
   
        if(this.c_node.contents().find("#addTaskAccount").data('id_list') ){
          id_list = this.c_node.contents().find("#addTaskAccount").data('id_list');
        }
    }else if(type == 2){
        if(this.c_node.contents().find("#addTaskResource").data('id_list') ){
        /*   id_list = this.c_node.contents().find("#addTaskResource").data('id_list'); */
        }
    }

    mobie_control.mobie_init(id_list,type);
     commonModal_show($('#choice_phone'));
     setTimeout(function(){
      /*   $("#choice_phone").find('.fixed-table-container').css({ 'max-height': '330px' })  */
       $("#choice_phone").find('.page-list').css({ display:'none' })
      
     },300)
   
  },
  "delete_phone" : function(t){
    var row_id = $(t).parent().attr('rowId');
    $(t).parent().remove();
    mobie_control.check_uncheck(1,row_id);
  },
  "check_uncheck" : function(type,id){
    var data = $('#mobie_tb').bootstrapTable('getOptions').data;
    var allTableData = $('#mobie_tb').bootstrapTable('getData');
    if(type == 1){ //取消选中
      $.each(data,function(i,v){
        if(v.id == id){
            $('#mobie_tb').bootstrapTable('updateRow', {
              index: i,
              row: {checked : false }
            });
        }
      })
    }else if(type == 2){//翻页选中

    }
  },
  "mobie_init" : function(_list,type){
    var self = this ;
    var tableColumns = [];
   
    if(type == 0){
      tableColumns = [
        // {width:150,field : "checked" , checkbox:true,formatter : stateFormatter },
        { field: "checked", checkbox: true, formatter: stateFormatter },
        {width:150,field: 'user_name', title: '账号', align : 'center',valign : 'middle',},
        {width:150,field: 'nick_name', title: '昵称', align : 'center',valign : 'middle',},
        {width:150,field: 'signature', title: '个性签名', align : 'center',valign : 'middle',},
        {width:150,field: 'fan_count', title: '粉丝数', align : 'center',valign : 'middle',},
        {width:150,field: 'like_count', title: '点赞数', align : 'center',valign : 'middle',},
        {width:150,field: 'comment_count', title: '评论数', align : 'center',valign : 'middle',},
        {width:150,field: 'play_count', title: '播放数', align : 'center',valign : 'middle',},
      
        ];
    }else if(type == 1){
      tableColumns = [
        {width:150,field : "checked" , checkbox:true,formatter : stateFormatter },

        {width:150,field: 'branch_no', title: '分身ID', align : 'center',valign : 'middle',},

        {width:150,field: 'mobile_id', title: '设备ID', align : 'center',valign : 'middle',},
        {width:150,field: 'user_name', title: '账号', align : 'center',valign : 'middle',},
        {width:150,field: 'nick_name', title: '昵称', align : 'center',valign : 'middle',},
        {width:150,field: 'signature', title: '个性签名', align : 'center',valign : 'middle',},
        {width:150,field: 'fan_count', title: '粉丝数', align : 'center',valign : 'middle',},
        {width:150,field: 'like_count', title: '点赞数', align : 'center',valign : 'middle',},
        {width:150,field: 'comment_count', title: '评论数', align : 'center',valign : 'middle',},
        {width:150,field: 'play_count', title: '播放数', align : 'center',valign : 'middle',},
        {width:150,field: 'type', title: '应用账号标签', align : 'center',valign : 'middle',},
        ]
    }else if(type == 2){
       var tableColumns = [
         {width:50,field : "checked" , checkbox:true,formatter : stateFormatter },
        {
          width: 100, field: 'mobile_label', title: '手机标签', align: 'center', valign: 'middle', /* formatter: function (value, row, index) { // 单元格格式化函数
            var div = "<div style='width:250px;'>" + value + "</div>";//调列宽，在td中嵌套一个div，调整div大小
            return div;
          } */
 },
         { width: 100, field: 'group_name', title: '手机分组', align : 'center',valign : 'middle',},
         { width: 100,field: 'emp_name', title: '操作人', align : 'center',valign : 'middle',},
         {width:100,field: 'status_name', title: '状态', align : 'center',valign : 'middle',},       
      ];
    }


    $('#mobie_tb').bootstrapTable('destroy') ;
    function responseHandler(info) {
      var is_online_name = ['<span style="color:red">离线</span>', '<span style="color:green">在线</span>']
      var is_busy_name = ['<span style="color:green">空闲</span>', '<span style="color:red">忙碌</span>'];
      var infoList = info.data.info.list;
      var status_name = ['下线', '上线']
      if (self.m_type == 1) {
        for (var i = 0; i < infoList.length; i++) {
          infoList[i]['name'] = infoList[i]['nick_name']
        }
      } else if (self.m_type == 2) {
        for (var i = 0; i < infoList.length; i++) {
          infoList[i]['name'] = infoList[i]['number']
          infoList[i]['status_name'] = status_name[infoList[i]['status']]
        }
      }

      return {
        "total": info.data.info.page.total,
        "rows": infoList
      }

    };
    function queryParams(params) {

      return { //每页多少条数据
        "name": '',
        "page_count": params.limit,
        "page": (params.offset / params.limit) + 1,
        "token": parent.DmConf.userinfo.id,
        'token': parent.DmConf.userinfo.token,
        on_line: 1,
        status: 1,
        "type": 1,
      }
    };
    function queryParamsbig(params) {

      return { //每页多少条数据
        "name": '',
        "page_count": params.limit,
        "page": (params.offset / params.limit) + 1,
        "session_id": parent.DmConf.userinfo.id,
        'token': parent.DmConf.userinfo.token,
        "type": 2,

      }
    };
    function stateFormatter(value, row, index) {

      $.each(_list, function (i, v) {
        if (v == row.id) {
          var span = $('<label mobileId=' + row.mobile_id + '  rowId=' + row.id + ' class="badge badge-gradient-success" style="margin:5px">' + (self.m_type == 0 ? row.user_name : row.mobile_label) + '<i onclick="mobie_control.delete_phone(this)"  style="margin-left:5px" class="iconfont icon-jian"></i></label>');
          $('.choice_mobie').append(span);
          /* value = true
           return {
             checked : true
           }*/
        }
      })

      return value
    };
    $('#mobie_tb').bootstrapTable({//表格初始化
      columns: tableColumns,  //表头
      responseHandler :responseHandler ,
      width:'100%',
      height:'300',
      method: 'post',
      fixedColumns: true,
      fixedNumber: 1, 
      sidePagination:'server',//在服务器分页--前端是client
      pageSize: 999, //每页3条
      pageNumber: 1,  //第1页
      pageList: [100, 300, 600, 1000],  
      cache: false,   //不缓存
      striped: true,
      //dataField: "count",
      pagination: true,
      search: false,
      showRefresh: false,
      showExport: false,
      showFooter: false,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",//必须要有！！！！
      dataType: "json",//数据类型
      ajaxOptions:{
       /* xhrFields: {        //跨域
          withCredentials: true
        },*/
        crossDomain: true,
      },
      url:parent.DmConf.server.url()+ self.m_url(type),//要请求数据的文件路径 
      queryParamsType:'limit',//查询参数组织方式 
      queryParams: (self.m_type == 1 ? queryParams : queryParamsbig),//请求服务器时所传的参数 
     
      // exportTypes: ['csv', 'txt', 'xml'],
      clickToSelect: true,

      onCheck : function(row,v){
   
       
        if(self.m_type == 0){
          var data = $('#mobie_tb').bootstrapTable('getOptions').data;
          $.each(data,function(a,b){
                if(b.id != row.id){
                  $('#mobie_tb').bootstrapTable('updateRow', {
                    index: a,
                    row: {checked : false }
                  });
                }
              
            })
          $.each($('.choice_mobie').find('label'),function(i,v){
                $(v).remove()
            })
    
        }
        var span = $('<label mobileId="'+row.mobile_id+'" imei_id="'+(self.m_type == 2 ? row.imei : 0)+ '" rowId="'+row.id+'" class="badge badge-gradient-success" style="margin:5px">'+ (self.m_type == 0 ? row.user_name : row.mobile_label) +'<i onclick="mobie_control.delete_phone(this)" style="margin-left:5px" class="iconfont icon-jian"></i></label>');
        $('.choice_mobie').append(span)
      },
      onUncheck : function(row,v){
        $.each($('.choice_mobie').find('label'),function(i,v){
          if($(v).attr('rowId') == row.id){
            $(v).remove()
          }
        })
      },
      onCheckAll : function(rows){
        
        $.each(rows,function(i,v){
          var span = $('<label mobileId=' + v.mobile_id + ' mobile_label_id="' + (self.m_type == 2 ? v.imei : 0) + '" rowId=' + v.id + ' class="badge badge-gradient-success" style="margin:5px">' + (self.m_type == 0 ? v.user_name : v.mobile_label) +'<i onclick="mobie_control.delete_phone(this)" style="margin-left:5px" class="iconfont icon-jian"></i></label>');
          $('.choice_mobie').append(span)
        })
        
      },
      onUncheckAll : function(rows,v){
         $.each(rows,function(a,b){
          $.each($('.choice_mobie').find('label'),function(i,v){
              if($(v).attr('rowId') == b.id){
                $(v).remove()
              }
            })
        })
       
      },
    });

    $('#refresh_btn').click(function(){
      $('#mobie_tb').bootstrapTable('refresh')
    })
   
         
  },

};



function modal_alert(msg){

  new show_modal({modalId:'alert_like',modalCon:'<p style="color:#222E3C">'+msg+'</p>',bootstrapOptionObj:{show:true,}});

}
/* =======================================    显示弹窗函数         ====================================================================================================*/

var show_modal = function(setting){
    var _self = this;
   // $('.modal-backdrop').hide()
    //判断为null或者空值
    _self.IsNull = function(value) {
        if (typeof (value) == "function") { return false; }
        if (value == undefined || value == null || value == "" || value.length == 0) {
            return true;
        }
        return false;
    }
    //默认配置
    _self.DefautlSetting = {
        modalId:'',
        titleTxt: '温馨提示',
        modalCon: '这是提示的信息！',
        bootstrapOptionObj: {},
        callback: function() { }
    };
    //读取配置
    _self.Setting = {
        modalId: _self.IsNull(setting.modalId) ? _self.DefautlSetting.modalId : setting.modalId,
        titleTxt: _self.IsNull(setting.titleTxt) ? _self.DefautlSetting.titleTxt : setting.titleTxt,
        modalCon: _self.IsNull(setting.modalCon) ? _self.DefautlSetting.modalCon : setting.modalCon,
        bootstrapOptionObj: _self.IsNull(setting.bootstrapOptionObj) ? _self.DefautlSetting.bootstrapOptionObj : setting.bootstrapOptionObj,
        callback: _self.IsNull(setting.callback) ? _self.DefautlSetting.callback : setting.callback
    };
    //定义函数操作
    _self.int = function(){
        if (_self.Setting.modalId == '') {
            return;
        }
      var node = $("#alert_like")
        if($("#modal_con").children().length >0 ) $("#modal_con").children().remove();
        $("#aler_warm_title").text(_self.Setting.titleTxt);//这里设置弹窗的标题
        $("#modal_con").append(_self.Setting.modalCon);//设置弹窗内容
        var hh = (node.height() - node.find('.modal-content')[0].clientHeight) / 2;
        var ww = (node.width() - node.find('.modal-content')[0].clientWidth) / 2;
        var sty = { top: hh + 'px', left: ww + 'px' }
        $("#" + _self.Setting.modalId).modal(_self.Setting.bootstrapOptionObj).css(sty);//设置弹窗的bootstrap属性方法
       
      
        $("#ok_btn").click(function(){
          _self.Setting.callback();
        })
    }
    //执行操作
    _self.int();
}

//show_modal回调函数，4s后隐藏弹窗

function timeClose(){

  setTimeout(function(){
    $('#alert_like').modal('hide');
    $('.modal-backdrop').hide()
    },4000);
}





var addAccount = {
  node :$('#addAccount'),
  info:'',
  val:"",
  show(m_type,value){
    $('#addAccount').find('input').val('');
    this.val = value
 
    if(value){
      $('#addAccount').find('input[name=user_name]').val(value.user_name);
  /*    $('#addAccount').find('input[name=telephone]').val(value.telephone); */    
      $('#addAccount').find('input[name=fan_count]').val(value.fan_count);    
      $('#addAccount').find('input[name=like_count]').val(value.like_count);
      $('#addAccount').find('input[name=get_fan_count]').val(value.get_fan_count);
      $('#addAccount').find('input[name=play_count]').val(value.play_count);
      $('#addAccount').find('input[name=share_count]').val(value.share_count);
      $('#addAccount').find('input[name=get_like_count]').val(value.get_like_count);
      $('#addAccount').find('input[name=imei]').val(value.imei);
      $('#addAccount').find('input[name=nick_name]').val(value.nick_name);
      
    }
    commonModal_show($('#addAccount'))
   // $('#addAccount').modal()
  },
  save(){

    var data = {
      "id" : this.val ? this.val.id : 0,
      "applicationaccount_code" : parent.DmConf.userinfo.customer_id,
      "user_name" : $('#addAccount').find('input[name=user_name]').val(),
   /*   "telephone" : $('#addAccount').find('input[name=telephone]').val(),   */  
      "fan_count" : $('#addAccount').find('input[name=fan_count]').val(),    
      "like_count" : $('#addAccount').find('input[name=like_count]').val(),
      "nick_name" : $('#addAccount').find('input[name=nick_name]').val(),
      "get_fan_count" : $('#addAccount').find('input[name=get_fan_count]').val(),
      "play_count" : $('#addAccount').find('input[name=play_count]').val(),
      "share_count" : $('#addAccount').find('input[name=share_count]').val(),
      "get_like_count" : $('#addAccount').find('input[name=get_like_count]').val(),
      "imei" : $('#addAccount').find('input[name=imei]').val(),
        "type" :2 ,
      "session_id" : parent.DmConf.userinfo.id,
      "token" : parent.DmConf.userinfo.token
    }
    var ret = parent.getByRsync(parent.DmConf.api.new.Add_applicationaccount,data);
   
    if(ret.data.code == 0){
      $('#addAccount').modal('hide');
 
      $($('#account_list').contents().find('#refresh_btn')).click()

    }else{
      parent.plus_alertShow.show(ret.data.info.msg)
    }

  },

}


var config_delInfo = {
  api_url : "",
  data : '' ,
  c_node : "",
  show(msg,data,api,node){
    this.api_url = api ;
    this.data = data;
    this.c_node = node ;
    $('#config_delInfo').find('.config_info_modify_msg').html('');
    $('#config_delInfo').find('.config_info_modify_msg').html(msg);

    commonModal_show($('#config_delInfo'),{'text-align':'center'})
  },
  save(){
    this.data['session_id'] = parent.DmConf.userinfo.id ;
    this.data['token'] = parent.DmConf.userinfo.token ;
    var ret = parent.getByRsync(this.api_url,this.data)

      if(ret.data.code == 0){
        if(this.c_node){
          setTimeout(function () { this.c_node() }.bind(this), 1000)
          
        }
        $('#config_delInfo').modal('hide');
      }else{
         parent.plus_alert(ret.data.msg)
      }
  }
}

var plus_alertShow = {

  show(msg, func) {
   this.func = func
    $('#plus_alertShow').find('.plus_alertShow_modify_msg').html(msg);
    commonModal_show($('#plus_alertShow'), { 'text-align': 'center' })
  },
  save() {
    $('#plus_alertShow').modal('hide')
   if(this.func){
     this.func()
   }
   
  }
}


//导入评论内容，私信内容
var resourceImport = {
  'importf' : function(obj) { 
      if (!obj.files) { return; } 
      var f = obj.files[0]; 

      var reader = new FileReader(); 
      reader.onload = function (e) {
         var data = e.target.result; 
         var wb = XLSX.read(data, { type: 'binary' }); 
          if (!wb.Workbook) {
            return parent.plus_alertShow.show('请选择excel文件')
          }
         resourceImport.data = {data:wb,name:$('#up_xls_btn_1').val()}
          
         resourceImport.list();

         var sheet_list =  $("#sheet_list")
         sheet_list.find('option').remove()
         var sheet_data = wb.SheetNames;
         $('.file_name').val($('#up_xls_btn_1').val().split('\\')[2]);

         for(var i=0;i<sheet_data.length;i++){
            var opt = $('<option value='+sheet_data[i]+'>'+sheet_data[i]+'</option>');
            sheet_list.append(opt)
         }
          sheet_list.selectpicker('refresh');

          sheet_list.change(function(){
              resourceImport.list(this.value);
          });
          $('#up_xls_btn_1').val('');
       }
       
       reader.readAsBinaryString(f); 
      
    },
    "data" : "",
    "type" : "" ,
    "o"     : function(){ return $('#resourceImport'); },
    "field" : function(t){
         
          var def = [ {"name":"评论内容",  "value":"value"},]
          if(this.type == 2){
            def = [ {"name":"抖音号", "value":"user_name"},{"name":"昵称",   "value":"nick_name"},{"name":"粉丝数量", "value":"fan_count"},{"name":"分组","value":"group_name"},]
          }
       return def;
    },
    "up"    : function(callback){
          $('#up_xls_btn_1').click();
    },
    "list" : function(sheet_name){

            var tab = this.o().find(".table-responsive");
            var dats = resourceImport.data
            
            var sel = $('<select disabled="true"></select>');
            if(this.type == 2 ){
              sel.attr('disabled',false);
              sel.append('<option value="">不导入</option>');
            } 
            $.each(this.field(), function(i, v){
              sel.append('<option value="'+v.value+'">'+v.name+'</option>');
            });
       
            var reg =  /^[A-Z]+1$/g;
            tab.find("tbody>tr").remove();
            var sheet_data = dats.data.Sheets[dats.data.SheetNames[0]];
            sheet_name ? sheet_data = dats.data.Sheets[sheet_name] : sheet_data = sheet_data
          
             $.each(sheet_data, function(i,v){
        
                if(i.search(reg) == 0){
                   var n = $('<tr><td>'+i+'</td><td>'+v.v+'</td><td></td></tr>');
                    var c_sel = sel.clone();
                    var def_value = c_sel.find('option:contains("'+v+'")').val();
                    if(def_value){ 
                      if(0 == tab.find('select > option:contains("'+v+'"):selected').length){
                         c_sel.val(def_value);
                         c_sel.css("color","#000");
                      }
                    }

                    n.children("td:last-child").append(c_sel);
                    tab.find("tbody").append(n);
                } 
              });
              


            tab.find("select").change(function(){
                  var num = 0;
                  var v = this.value;
                
                  $.each($(this).parent().parent().parent().find("select"), function(i,n){
                    if(n.value == v) num++;
                  });
               
                  if(num>1) this.value = '';
                  this.style.color = this.value.length > 0 ? '#000' : '#6c6c6c';
            });

    },
    "save" : function(){
                    var node = this.o();
                    var im_xls = node.find(".import_xls");
                    var tab = this.o().find(".table-responsive");

                    var dats = {};

           
                    $.each(tab.find("tbody tr"), function(i,v){
                        var n = $(v);
         
                        var sql_f = n.find("select").val();
                     
                        if(sql_f.length > 0){
                            dats[n.find('td:first-child').text()] = sql_f;
                        }
                      });
           

                    var list_data = [] ;
                   
                    var o_data = resourceImport.data.data.Sheets[resourceImport.data.data.SheetNames[0]] ;
                    var length = String(o_data['!ref'].split(':')[1]).replace(/[^0-9]/ig, "");
                    var str_save = [];
                  
                    

                      for(var i=2;i<=length;i++){
                         var obj = {}
                          for(var attr in dats){
                            var _attr = attr.replace(/[^A-Z]/ig,"")+i;
                            obj[dats[attr]] = o_data[_attr] ? String(o_data[_attr].v) : ""
                           
                          }
                        str_save.push(obj)
                       }
           
                     if(this.type == 2){ 
                       // var jsonData = JSON.stringify(JSON.stringify(str_save));
                        var jsonData = JSON.stringify(str_save);
                        var ret = parent.getByRsync(parent.DmConf.api.new.Libsame_Add_libsame,{
                          json:jsonData,
                          session_id:parent.DmConf.userinfo.id,
                          token:parent.DmConf.userinfo.token,
                        
                        })
                       }else{
                        this.func(str_save) 
                     }
                     
                     node.modal('hide')
                   
                   
    },
    "go" : function(callback,type){
            var node = this.o();
         
            $('.file_name').val('');
            $('#sheet_list').find('option').remove();
             $('#select_resourceLable').find('option').remove();
            $('#sheet_list').selectpicker('refresh');
            var dataList = []
            this.func = callback;
            this.type = type ;
            this.o().find(".table-responsive").find('tbody').find('td').remove();
            $('#select_resourceLable').selectpicker('refresh');
            commonModal_show(node)
            

    },
    func:""
};





var treeview = {
 
  c_node : '',
  show : function(node,type,parentNode,func,task_type,sixin){//type : 1(不做选择父子节点) ;; parentNode:1(在common中使用),回调，手机类型，显示：sixin:显示今日已私信多少个/

    var defaultData = [{'text':'全部',href:'99999999',}];
    var defaultData_1 = [];
    this.c_node = node;
    this.func = func ;
 
    this.parentNode = parentNode ; 
    var ret = parent.getByRsync(parent.DmConf.api.new.Mobile_all,{
      session_id : parent.DmConf.userinfo.id,
      token : parent.DmConf.userinfo.token,
      customer_id:parent.DmConf.userinfo.customer_id,
      task_type:task_type,
      on_line: 1,/* 0下线，1上线，-1全部 */
    })
    if(ret.data.code == 0){
      var retList = ret.data.info;
      var online_name = ['离线','在线']
      for(var attr in retList){

          var o_attr = {'text':attr,'href':attr}
          var o_attr_arr = [];
         
          $.each(retList[attr],function(i,v){
            var ojbk_mobile_label_name = v.mobile_label ? v.mobile_label : v.imei;
            var ojbk = { 'text': ojbk_mobile_label_name + '<span style="color:red">&emsp;(' + v.task_count + '个任务)</span>', 'href': v.imei, }//(状态:'+online_name[v.on_line]+')&emsp;
            var ojbk_array = []
            $.each(v.list.list,function(a,b){
             
              var child_ojbk = { 'text': b.branch_no + '&emsp;<span style="color:red">' + v.task_count + '个任务' + (sixin == "sixin" ? ';今日已私信' + b.today_message_count+'个':"") +'</span>', 'mobile_label': v.mobile_label, 'imei': v.imei, 'keyword': b.keyword}
     
              child_ojbk['href'] = b.id
              ojbk_array.push(child_ojbk)
            })
            ojbk['nodes'] = ojbk_array
            o_attr_arr.push(ojbk)
          })
          o_attr['nodes'] = o_attr_arr;
          defaultData_1.push(o_attr)
        }
    }else{
     return  parent.plus_alertShow.show(ret.data.info.msg)
    }
    defaultData[0]['nodes'] = defaultData_1
   
    var nodeId_temp = null;
    var self = this ;
    var $checkableTree = $('#treeview-checkable').treeview({
      data: defaultData,
      showIcon: false,
      showCheckbox: true,
      highlightSelected: true,
      highlightSearchResults:true,
      onNodeChecked: function(event, node) {
            if(type == 1){
          
              $checkableTree.treeview('uncheckAll', { silent: $('#chk-check-silent').is(':checked') });
      
              $checkableTree.treeview('checkNode', [node['nodeId'], { silent: true }]);
              return ;
            }
            var selectNodes = getChildNodeIdArr(node); //获取所有子节点
            if (selectNodes) { //子节点不为空，则选中所有子节点
                $('#treeview-checkable').treeview('checkNode', [selectNodes, { silent: true }]);
               
            }
            var parentNode = $("#treeview-checkable").treeview("getNode", node.parentId);
            setParentNodeCheck(node);    
        },
        onNodeUnchecked: function (event, node) {
              if(type == 1) return ;
            // checkmenus.removevalue(node);
            // 取消父节点 子节点取消
            var selectNodes = setChildNodeUncheck(node); //获取未被选中的子节点
            var   childNodes = getChildNodeIdArr(node);    //获取所有子节点
            if (selectNodes && selectNodes.length==0) { //有子节点且未被选中的子节点数目为0，则取消选中所有子节点
              
                $('#treeview-checkable').treeview('uncheckNode', [childNodes, { silent: true }]);
                var cancle_arr = []
 /*                if(node['nodes']){
                    $.each(node['nodes'],function(a,b){
                       if(b.nodes){
                            var d = recursive(b.nodes);
                           
                            for(var aa=0;aa<d.length;aa++){
                              $.each( $('#treeviewLabel').find('span'),function(idx,it){
                                  if($(it).data('href') == d[aa]){
                                    $(it).remove()
                                  }
                              })
                            }
                           
                         }else{
                          
                             $.each( $('#treeviewLabel').find('span'),function(idx,it){
                                  if($(it).data('href') == b.href){
                                    $(it).remove()
                                  }
                              })
                           
                        }
                    })
                }else{
               
                   $.each( $('#treeviewLabel').find('span'),function(idx,it){
            
                          if($(it).data('href') == node.href){
                            $(it).remove()
                          }
                    })
                }*/


            }
            // 取消节点 父节点取消
            var parentNode = $("#treeview-checkable").treeview("getNode", node.parentId);  //获取父节点
            var selectNodes = getChildNodeIdArr(node);
            setParentNodeCheck(node);
           

        }
    });
      var findCheckableNodess = function() {
          return $checkableTree.treeview('search', [ $('#input-check-node').val(), { ignoreCase: false, exactMatch: false } ]);
        };
      var checkableNodes = findCheckableNodess();
     $('#input-check-node').on('keyup', function (e) {
      $('#treeview-checkable').treeview('collapseAll', { silent: true });
          checkableNodes = findCheckableNodess();
        
         // $('#treeview-checkable').treeview('collapseNode', [ checkableNodes, { silent: true, ignoreChildren: false } ]);
          $('.check-node').prop('disabled', !(checkableNodes.length >= 1));
        });

     /* $("#treeCollapseAll").click(function(){
        $('#treeview-checkable').treeview('collapseAll', { silent: true });
      })
      $('#valueSearch').click(function(){
           $('#treeview-checkable').treeview('expandAll')
           checkableNodes = findCheckableNodess();
           var arr_p = []
           if(checkableNodes.length > 0){
              $.each(checkableNodes,function(i,v){
                arr_p.push(v.text)
              });
         
              $.each($('#treeview-checkable').find('li'),function(a,b){
               
                if(arr_p.indexOf($(b).text()) == '-1'){

                    $(b).css({display:'none'})
                }
              })
           }
     
          
      })*/
      $('#btn-check-node.check-node').on('click', function (e) {
          $checkableTree.treeview('checkNode', [ checkableNodes, { silent: $('#chk-check-silent').is(':checked') }]);
      });
    $("#treeviewLabel").html('选择应用账号')
    if (task_type == 1){
      $("#treeviewLabel").html('选择采集手机')
    }
     commonModal_show($('#treeview'))

     // $('#treeview').modal()
  },

  save(){
      var check_tree = $('#treeview-checkable').treeview('getChecked');
      var str = '';
      var save_num = [];
   

      $.each(check_tree,function(i,v){
   
        if(v.parentId != 99999999 && !v.nodes){
         
          var v_name = v.mobile_label.length > 0 ? v.mobile_label : v.imei ;
          str += v_name+':'+v.text +';';
          
          save_num.push(v.href)
        }

      });

      var tot_show = str.split(';')
    
      var o={};
         for(var i=0;i<tot_show.length;i++){
            if(tot_show[i].length == 0) continue ; 
            if(tot_show[i].search('&emsp') != '-1'){
              var kv = tot_show[i].replace('&emsp','').split(':');
             
              var _arr1 = [];
               for(var j=0;j<kv.length; j++){
                    _arr1.push(kv[j]);
                }
                if(_arr1[0] in o){
                    if(typeof(o[_arr1[0]])=='string')
                    {
                        o[_arr1[0]]=[o[_arr1[0]]] ;
                    };
                    o[_arr1[0]].push(_arr1[1])
                }else{
                    o[_arr1[0]]=_arr1[1]
                }
             }
         }

  
      var str_o = '';
      for(var attr in o){
        if(o[attr]){
          var newMs ;
          
          if(((typeof(o[attr]) == 'string')) && o[attr] == '抖音短视频'){
            newMs =  ''
          }else{
            newMs = ':' + o[attr].toString() 
          }
       
          str_o += '<span style="color:red">' + attr + '</span>' + newMs+';'
        }
      }
     
      if(this.parentNode == 1){
     
       $(this.c_node).find(".addTaskAccount1").val(save_num.toString());
       $(this.c_node).find("#addTaskAccount").val(str);
       $(this.c_node).find(".addTaskAccount2").html(str_o);
       $('#treeview').modal('hide');
        return ;
      }
 
      this.c_node.contents().find("#addTaskAccount1").val(save_num.toString());
      this.c_node.contents().find("#addTaskAccount").val(str);
      this.c_node.contents().find(".addTaskAccount2").html(str_o);
      if(this.func){
        this.func(check_tree)
      }
      $('#treeview').modal('hide')
  }
}

var reloadTree = {

   reloadTree(c_node, v_node, signType) {//signType  单选
    this.c_node = c_node
    var defaultData = [{ 'text': '全部', href: '99999999', }];
var defaultData_1 = [];
var ret = parent.getByRsync(parent.DmConf.api.new.Mobile_all, {
  session_id: parent.DmConf.userinfo.id,
  token: parent.DmConf.userinfo.token,
  customer_id: parent.DmConf.userinfo.customer_id,

  on_line: '1',/* 0下线，1上线，-1全部 */
})
if (ret.data.code == 0) {
  var retList = ret.data.info;
  var online_name = ['离线', '在线']
  for (var attr in retList) {

    var o_attr = { 'text': attr, 'href': attr }
    var o_attr_arr = [];

    $.each(retList[attr], function (i, v) {
      var ojbk_mobile_label_name = v.mobile_label ? v.mobile_label : v.imei;
      var ojbk = { 'text': ojbk_mobile_label_name + '<span style="color:red">&emsp;(' + v.task_count + '个任务)</span>', 'href': v.imei, }//(状态:'+online_name[v.on_line]+')&emsp;
      var ojbk_array = []
      $.each(v.list.list, function (a, b) {

        var child_ojbk = { 'text': b.branch_no + '&emsp;<span style="color:red">' + v.task_count + '个任务' + '</span>', 'mobile_label': v.mobile_label, 'imei': v.imei, 'keyword': b.keyword }

        child_ojbk['href'] = b.id
        ojbk_array.push(child_ojbk)
      })
      ojbk['nodes'] = ojbk_array
      o_attr_arr.push(ojbk)
    })
    o_attr['nodes'] = o_attr_arr;
    defaultData_1.push(o_attr)
  }
} else {
  return parent.plus_alertShow.show(ret.data.info.msg)
}
defaultData[0]['nodes'] = defaultData_1

var nodeId_temp = null;
var self = this;
var $checkableTree = c_node.treeview({
  data: defaultData,
  showIcon: false,
  showCheckbox: true,
  highlightSelected: true,
  highlightSearchResults: true,
  onNodeChecked: function (event, node) {
    // if (type == 1) {

    //   $checkableTree.treeview('uncheckAll', { silent: $('#chk-check-silent').is(':checked') });

    //   $checkableTree.treeview('checkNode', [node['nodeId'], { silent: true }]);
    //   return;
    // }

    var selectNodes = self.getChildNodeIdArr(node); //获取所有子节点
    if (selectNodes) { //子节点不为空，则选中所有子节点
      c_node.treeview('checkNode', [selectNodes, { silent: true }]);



    }
 
    var parentNode = c_node.treeview("getNode", node.parentId);
    self.setParentNodeCheck(node, c_node);
     self.saveTree(c_node, v_node)
  },
  onNodeUnchecked: function (event, node) {
    // if (type == 1) return;
    // checkmenus.removevalue(node);
    // 取消父节点 子节点取消
    var selectNodes = self.setChildNodeUncheck(node); //获取未被选中的子节点
    var childNodes = self.getChildNodeIdArr(node);    //获取所有子节点
    if (selectNodes && selectNodes.length == 0) { //有子节点且未被选中的子节点数目为0，则取消选中所有子节点

      c_node.treeview('uncheckNode', [childNodes, { silent: true }]);

    }

    // 取消节点 父节点取消
    var parentNode = c_node.treeview("getNode", node.parentId);  //获取父节点
    var selectNodes = self.getChildNodeIdArr(node, c_node);
    self.setParentNodeCheck(node, c_node);
     self.saveTree(c_node, v_node)

  }
});
var findCheckableNodess = function () {
  return $checkableTree.treeview('search', [$('#input-check-node').val(), { ignoreCase: false, exactMatch: false }]);
};
var checkableNodes = findCheckableNodess();
$('#input-check-node').on('keyup', function (e) {
  c_node.treeview('collapseAll', { silent: true });
  checkableNodes = findCheckableNodess();

  $('.check-node').prop('disabled', !(checkableNodes.length >= 1));
});


$('#btn-check-node.check-node').on('click', function (e) {
  $checkableTree.treeview('checkNode', [checkableNodes, { silent: $('#chk-check-silent').is(':checked') }]);
});
},
  saveTree(c_node, v_node) {
    var check_tree = c_node.treeview('getChecked');
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
    v_node.attr('id_list', save_num.toString())
    v_node.html(str_o)
  },
// 选中父节点时，选中所有子节点
 getChildNodeIdArr(node) {
  var ts = [];
  if (node.nodes) {
    for (var x in node.nodes) {
      ts.push(node.nodes[x].nodeId);
      if (node.nodes[x].nodes) {
        var getNodeDieDai = this.getChildNodeIdArr(node.nodes[x]);
        for (var j in getNodeDieDai) {
          ts.push(getNodeDieDai[j]);
        }
      }
    }
  } else {
    ts.push(node.nodeId);
  }
  return ts;
},

// 选中所有子节点时，选中父节点 取消子节点时取消父节点
 setParentNodeCheck(node) {
   
   var parentNode = this.c_node.treeview("getNode", node.parentId);
  if (parentNode.nodes) {
    var checkedCount = 0;
    for (var x in parentNode.nodes) {
      if (parentNode.nodes[x].state.checked) {
        checkedCount++;
      } else {
        break;
      }
    }
    if (checkedCount == parentNode.nodes.length) {  //如果子节点全部被选 父全选
      this.c_node.treeview("checkNode", parentNode.nodeId);
      this.setParentNodeCheck(parentNode);
    } else {   //如果子节点未全部被选 父未全选
      this.c_node.treeview('uncheckNode', parentNode.nodeId);
      this.setParentNodeCheck(parentNode);
    }
  }
},

// 取消父节点时 取消所有子节点
 setChildNodeUncheck(node) {
  if (node.nodes) {
    var ts = [];    //当前节点子集中未被选中的集合
    for (var x in node.nodes) {
      if (!node.nodes[x].state.checked) {
        ts.push(node.nodes[x].nodeId);
      }
      if (node.nodes[x].nodes) {
        var getNodeDieDai = node.nodes[x];
        for (var j in getNodeDieDai) {
          /**
           * 原转载文章中写的是!getNodeDieDai.nodes[x].state.checked
           * 但是测试不可用、去掉.nodes[x]可用
           */
          if (!getNodeDieDai.state.checked) {
            ts.push(getNodeDieDai[j]);
          }
        }
      }
    }
  }
  return ts;
}

}



// 选中父节点时，选中所有子节点
function getChildNodeIdArr(node) {
    var ts = [];
    if (node.nodes) {
        for (var x in node.nodes) {
            ts.push(node.nodes[x].nodeId);
            if (node.nodes[x].nodes) {
                var getNodeDieDai = getChildNodeIdArr(node.nodes[x]);
                for (var j in getNodeDieDai) {
                    ts.push(getNodeDieDai[j]);
                    }
                }
            }
        } else {
        ts.push(node.nodeId);
        }
    return ts;
}

// 选中所有子节点时，选中父节点 取消子节点时取消父节点
function setParentNodeCheck(node) {
    var parentNode = $("#treeview-checkable").treeview("getNode", node.parentId);
    if (parentNode.nodes) {
        var checkedCount = 0;
        for (var x in parentNode.nodes) {
            if (parentNode.nodes[x].state.checked) {
                checkedCount ++;
            } else {
                break;
            }
        }
        if (checkedCount == parentNode.nodes.length) {  //如果子节点全部被选 父全选
            $("#treeview-checkable").treeview("checkNode", parentNode.nodeId);
            setParentNodeCheck(parentNode);
        }else {   //如果子节点未全部被选 父未全选
            $('#treeview-checkable').treeview('uncheckNode', parentNode.nodeId);
            setParentNodeCheck(parentNode);
        }
    }
}

// 取消父节点时 取消所有子节点
function setChildNodeUncheck(node) {
    if (node.nodes) {
        var ts = [];    //当前节点子集中未被选中的集合
        for (var x in node.nodes) {
            if (!node.nodes[x].state.checked) {
                ts.push(node.nodes[x].nodeId);
            }
            if (node.nodes[x].nodes) {
                var getNodeDieDai = node.nodes[x];
                for (var j in getNodeDieDai) {
　　　　　　　　　　　　/**
　　　　　　　　　　　　　* 原转载文章中写的是!getNodeDieDai.nodes[x].state.checked
　　　　　　　　　　　　　* 但是测试不可用、去掉.nodes[x]可用
　　　　　　　　　　　　　*/
                    if (!getNodeDieDai.state.checked) {
                        ts.push(getNodeDieDai[j]);
                    }
                }
            }
        }
    }
    return ts;
}


var changeStatus = {
  ii : "",
  func:"",
  mm : "",
  show(data,func){
    var data =  data;
    this.func = func
    if (data.length == 0 )   return plus_alert('请选择一条列表记录') ;
    $('.mobiel_status_change_name').html('');
    var id_str = '';
    var imei_str = '';
    $.each(data,function(i,v){
        id_str += ','+v.id;
        imei_str += ','+v.imei ;
    })
    this.ii = id_str ;
    this.mm = imei_str;
    $('.mobiel_status_change_name').html('修改状态的手机串号:'+imei_str);
   
    commonModal_show( $('#mobileInfo'))

  },
  save(){

  var ret = parent.getByRsync(parent.DmConf.api.new.Status_mobile,{
      id : this.ii,
      imei : this.mm,
      session_id : parent.DmConf.userinfo.id,
      token: parent.DmConf.userinfo.token,
      status:$(".mobile_status_change").val()
    })
    if(!ret.data.code){
        $('#mobileInfo').modal('hide');
       this.func()
     }else{
      parent.plus_alert(ret.data.msg)
     }
    $('#mobileInfo').modal('hide');
  }
}
var changeMan  = {
    data:'',
    func:"",
    show(data,func){
        var data = data;
        this.data = data ;
        this.func = func

        if(data.length == 0 ){
            return plus_alert('请选择一条列表记录')
        }
        $("#changeManSel").find('option').remove();
        $.each(parent.DmConf.data.user,function(i,v){
          $("#changeManSel").append('<option value='+v.id+'>'+v.emp_name+'</option>');
        });
        $("#changeManSel").selectpicker('refresh') 
       commonModal_show($("#changeMan")) 
    },
    save(){
        var data =  this.data
        var id_list = [];
        var imei_list = [];
       
        $.each(data,function(i,v){
          id_list.push(v.id)
          imei_list.push(v.imei)
        })
        var ret = parent.getByRsync(parent.DmConf.api.new.Emp_mobile,{
          id : id_list.toString(),
          imei : imei_list.toString(),
          session_id : parent.DmConf.userinfo.id,
          token : parent.DmConf.userinfo.token,
          account_id : $("#changeManSel").val()
        })
        if(ret.data.code == 0){
            
          this.func()
         }else{
          parent.plus_alert(ret.data.msg)
         }
        $('#changeMan').modal('hide');


    }

}


var phoneBelong = {
  data : "",
  func:"",
 show(data,func){
        var data = data ;
        this.data = data
        this.func = func;
        $('.modalHidden').css({"top":"64px","margin-top":"4px"})
        if(data.length == 0 ){
          return plus_alert('请选择一条列表记录')
        }
        var ret = parent.getByRsync(parent.DmConf.api.new.Group_list,{
           session_id : parent.DmConf.userinfo.id,
          token: parent.DmConf.userinfo.token,
          customer_id: parent.DmConf.userinfo.customer_id,
        })
        if(ret.data.code == 0 ){
          $.each(ret.data.info,function(a,b){
            $("#group_name").append('<option value="'+b.group_name+'">'+b.group_name+'</option>')
          })
        }else{  
         return  plus_alert(ret.msg)
        }
        $("#group_name").selectpicker('refresh');
       
        
        commonModal_show($("#phoneBelong"),{width:'25%','text-align':'center'})
        
    },
    save(){
        var data = this.data ;
        var id_list = [];
        var imei_list = [];
        
        $.each(data,function(i,v){
          id_list.push(v.id)
          imei_list.push(v.imei)
        });
      var group_name = $("#phoneBelong").find('input[name=saveSel]:checked').val() == 1 ? $("#group_name_inp").val() : $("#group_name").val();
        var ret = parent.getByRsync(parent.DmConf.api.new.Group_mobile,{
          id : id_list.toString(),
          imei : imei_list.toString(),
          session_id : parent.DmConf.userinfo.id,
          token: parent.DmConf.userinfo.token,
          group_name:group_name
        })
        if(ret.data.code == 0){
            
          this.func()
         }else{
          parent.plus_alert(ret.data.msg)
         }
        $('#phoneBelong').modal('hide');


    }



}
var saveUser2 = {
  type : 0 ,
  api : '' ,
  func : '' ,
  user_id : 0 ,
  rtype : 0,
  node : function(){return $('#addUser2')},
  go : function(type,api,rows,func){
      var node = this.node();
      node.find('input').val('');
     console.log('dasfasdf')
      this.type = type ; 
      this.api = api ;
      this.func = func ;
       this.user_id = 0;
      $('#AddUsers2').text('添加员工')

      if(type == 1){
       
        this.user_id = rows.id ;
        this.rtype = rows.type
        $('#AddUsers2').text('修改员工')
        node.find('input[name=emp_name]').val(rows.emp_name);
        node.find('input[name=teltphone]').val(rows.teltphone);
        node.find('input[name=department]').val(rows.department);
        node.find('input[name=user_name]').val(rows.user_name);
      
        
        /*node.find('textarea[name=note]').val(rows.notes);
        $('#user_status').selectpicker('val',rows.status);
        $('#type').selectpicker('val',rows.type);*/
      }
        commonModal_show( node)
    
  },
  del : function(){

  },
  save : function(){
    var node = this.node();
    var dats = {
          "emp_name": node.find('input[name=emp_name]').val(),
      "telephone": node.find('input[name=telephone]').val(),
          "user_name": node.find('input[name=user_name]').val(),
          
          "department": node.find('input[name=department]').val(),
          type : this.rtype,
          "customer_id":parent.DmConf.userinfo.customer_id,
          "token":parent.DmConf.userinfo.token,
          "session_id":parent.DmConf.userinfo.id,
          "id" : this.user_id
    }
    
    var ret = parent.getByRsync(this.api,dats);
    if(!ret.data.code){
        node.modal('hide')
        this.func()
    
    }else{
      return parent.parent.plus_alertShow.show(ret.data.msg)
    }
  }
}

var saveUser = {
  type : 0 ,
  api : '' ,
  rtype:0,
  func : '' ,
  user_id : 0 ,
  node : function(){return $('#addUser')},
  go : function(type,api,rows,func){
      var node = this.node();
      
      node.find('input').val('');
      $('#usertype').selectpicker('val',0);
      this.type = type ; 
      this.api = api ;
      this.func = func ;
        this.user_id =0;
      $('#AddUsers').text('添加员工') ;
      node.find('input[name=user_name]').prop('disabled',false);
      if(type == 1){
        node.find('input[name=user_name]').prop('disabled', true);
        this.user_id = rows.id ;
        this.rtype = rows.type
        $('#AddUsers').text('修改员工');
        node.find('input[name=emp_name]').val(rows.emp_name);
        node.find('input[name=telephone]').val(rows.telephone);
        node.find('input[name=department]').val(rows.department);
        node.find('input[name=user_name]').val(rows.user_name);
      }
      commonModal_show( node) ;
    
  },
  del : function(){

  },
  save : function(){
    var node = this.node();
    if (this.user_id == 0 && node.find('input[name=password]').val() == ''){
      return parent.plus_alert('请填写密码')
    }
    if (this.user_id == 0 && node.find('input[name=password]').val().length < 6) {
      return parent.plus_alert('密码必须大于6位')
    }
    if (this.user_id != 0 && node.find('input[name=password]').val() != '') {

      if (node.find('input[name=password]').val().length <= 6 && this.user_id != 0) {
        return parent.parent.plus_alertShow.show('密码必须大于6位')
      }
    }
    var dats = {
      "user_name": node.find('input[name=user_name]').val(),
      "telephone": node.find('input[name=telephone]').val(),
      "password": node.find('input[name=password]').val(),
      "department": node.find('input[name=department]').val(),
      "emp_name": node.find('input[name=emp_name]').val(),
      "type": this.rtype, 
      "customer_id": parent.DmConf.userinfo.customer_id,
      "token": parent.DmConf.userinfo.token,
      "session_id": parent.DmConf.userinfo.id,
      "id": this.user_id
    }
  
  
    var ret = parent.getByRsync(this.api,dats);
    if(!ret.data.code){
        node.modal('hide')
        this.func()
    
    }else{
      parent.parent.plus_alertShow.show(ret.data.msg)
    }
  }
}

var saveUser1 = {
  type : 0 ,
  api : '' ,
  func : '' ,
  user_id : 0 ,
  rows1:"",
  node : function(){return $('#addUser1')},
  go : function(type,api,rows,func){
      var node = this.node();
      node.find('input').val('');
      node.find('textarea').val('');
      console.log('sdfasdfasfdasfasfasdf')
       $('#user_status').selectpicker();
         $('#user_status').val('1') ;
       $('#type').selectpicker()
      //$('#user_status').selectpicker('refresh').css({border:"1px solid #aeaeae",padding:"15px"});
      this.type = type ; 
      this.api = api ;
      this.func = func ;
      this.user_id = 0;
      this.rows1 = rows;
      $('#AddUser1s').text('添加公司账户');

      $('.due_date').datetimepicker({
        format: 'yyyy-mm-dd hh:ii:ss',//显示格式
        todayHighlight: 1,//今天高亮
        minView: "0",//设置只显示到月份
        startView:2,
        forceParse: 0,
        showMeridian: 1,
        todayBtn: true,
        autoclose: 1//选择后自动关闭
      });
      $(".due_date").datetimepicker("setDate", new Date());

       node.find('input[name=login_name]').attr('disabled',false)
      if(type == 1){
       
        this.user_id = rows.id ;

        $('#AddUser1s').text('修改公司账户')
         node.find('input[name=user_name]').val(rows.name);

        node.find('input[name=company_phone]').val(rows.company_phone);
        node.find('input[name=login_name]').val(rows.user_name);
        node.find('input[name=password]').val(rows.password);
        node.find('input[name=customer_code]').val(rows.customer_code);
        node.find('input[name=telephone]').val(rows.telephone);
        node.find('input[name=company_name]').val(rows.company_name);
        node.find('input[name=phone_count]').val(rows.phone_count);
        node.find('input[name=user_tel]').val(rows.telephone);
        node.find('input[name=com_code]').val(rows.m_id);
        $(".due_date").datetimepicker("setDate", new Date(rows.due_date_t));
        node.find('textarea[name=notes]').val(rows.notes);
        $('#user_status').selectpicker('val',rows.status);
        $('#type').selectpicker('val',rows.type);

        node.find('input[name=login_name]').attr('disabled',true)
      }
      node.modal()
  },
  del : function(){

  },
  save : function(){
     var node = this.node();
    if( node.find('input[name=password]').val().length <= 6 && this.user_id == 0){
      return parent.parent.plus_alertShow.show('密码必须大于6位')
    }
    if(this.user_id != 0 &&  node.find('input[name=password]').val() != ''){
     
       if( node.find('input[name=password]').val().length <= 6 && this.user_id != 0){
        return parent.parent.plus_alertShow.show('密码必须大于6位')
      }
    }
    if( node.find('input[name=com_code]').val().length > 50 || node.find('input[name=com_code]').val().length < 5 ){
      return parent.parent.plus_alertShow.show('客户号必须大于5位且少于50位')
    }
    var parent_d = Number(this.user_id) == parseInt(0) ? parent.DmConf.userinfo.customer_id : this.rows1.parent_id

    var dats = {
          "name": node.find('input[name=user_name]').val(),
          "user_name": node.find('input[name=login_name]').val(),
          "m_id": node.find('input[name=com_code]').val(),
          "type": $('#type').val(),
          "company_phone": node.find('input[name=company_phone]').val(),
          "password": node.find('input[name=password]').val(),
          "company_name": node.find('input[name=company_name]').val(),
          "telephone": node.find('input[name=telephone]').val(),
          "notes": node.find('textarea[name=notes]').val(),
          "due_date":(new Date($('#due_date').val()).getTime())/1000,
          "session_id":parent.DmConf.userinfo.id,
          "token":parent.DmConf.userinfo.token,
          "id" : this.user_id,
          "parent_id": parent_d,
         
    }

    var ret = parent.getByRsync(this.api,dats);

    if(!ret.data.code){
      if(this.func){
        $('#tableMy').bootstrapTable('refresh');
        this.func()
      }
      node.modal('hide')
    }else{
      parent.parent.plus_alertShow.show(ret.data.msg)
    }
  }
}

//上传图片 视频---七牛云

/*var uploadIV = {


getvl :function(obj){
    //判断浏览器

    var file = obj.files[0];                                      
    if (window.FileReader) {                                                 
       var reader = new FileReader();                                         
       reader.readAsDataURL(file);                                          
       reader.onloadend = function (e) {  
          $('input[name=thumb40000]').val(file['name']);                
          $(".img").attr("src",e.target.result);
         // putb64(e.target.result)
       };    
    }
    var token = this.getToken();
    var data = new FormData();
    data.append("file", file);
    data.append("key", file['name']);
    data.append("token", token);
    $.ajax({
        data: data,
        type: "POST",
        url: '{$QINIU_UP_HOST}',
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
        
        }
    })
},

getToken : function(){
    var loc = window.location.href ;
    var loc_url = loc.split('&a=')[0]+'&a=getToken';
    var s ;
        $.ajax({
            url:loc_url,
            type:'post',
            data:{},
            cache    : false,
            async    : false,
            success:function(data){
             
                s = data ;
            }
        })
    return s ;  
}


}
*/
 function commonModal_show(node,type){
    //type->object,
    node.modal();

    var hh = (node.height() - node.find('.modal-content')[0].clientHeight) / 2;
    var ww = (node.width()- node.find('.modal-content')[0].clientWidth)/2 ;
    hh = hh > 0 ? hh : 0;
    var sty = {top:hh+'px',left:ww+'px'}
    if(type){
        for(var attr in type){
          sty[attr] = type[attr]
         }
    }
    node.find('.modal-dialog').css(sty);
    node.find('.modal-dialog').Tdrag({
     scope: '.modal',
     handle:'.modal-header'
  
   });
  
  } 


function TBrefresh_super_taskList(){
   $('#super_resultList_table').bootstrapTable('refresh');
}
var pause_taskList ={
  
    show(value,api,func,type){
    this.api = api;
    this.func = func;
    this.type = type;
    var self = this ;
        this.value = value ;
        $('#super_taskList_table').bootstrapTable('destroy');
        var tableColumns = [
            {width:150,field : "checked" , checkbox:true,width:"50px"},
          { field: 'branch_no', title: '分身', align: 'center', valign: 'middle', },
          { field: 'application_account_id', title: '应用账号', align: 'center', valign: 'middle', },
          { field: 'mobile_label', title: '手机标签', align: 'center', valign: 'middle', },
         
            { field: 'status_name', title: '任务状态', align: 'center', valign: 'middle', },
         
        ];
   
        function responseHandler(info) {
          if(!parent.checkCode1002(info)){
            return 
          }
          if(info.data.info){
            var task_status_name = parent.DmConf.task_status;
     
            $.each(info.data.info.list.list,function(i,v){
              v.status_name = task_status_name[v.status]
            })
          }

          return  { 
                 
                    "rows"  :info.data.info.list.list
                  }

        }

        function queryParams(params){
          var data = { //每页多少条数据
            "session_id":parent.DmConf.userinfo.id,
            "token":parent.DmConf.userinfo.token,
            "page_count" :99999, 
            "task_id" : value.id,   
            "status"  :self.type ,  
            "page" :(params.offset/params.limit)+1, 
          }    
          return data
        }

        var detail = {
              "columns" :  tableColumns,
              "api": parent.DmConf.api.new.Task_result,
              "responseHandler" :  responseHandler,
              "queryParams" :   queryParams,
              
              
        }
        new parent.get_search_list($('#super_taskList_table'),detail,$("#refresh_btn_table"));       
        commonModal_show($("#super_taskList"))
        setTimeout(function () { $('#super_taskList').find('.pagination-detail').hide()},200)
    },
    save(){
      var data = $('#super_taskList_table').bootstrapTable('getSelections');
      if(data.length == 0) return parent.plus_alert('请选择记录')
      var acc_id = data.map(function(v){return v.application_account_id}).join(',')
      var dats = {
        task_id: this.value.id,
        token: parent.DmConf.userinfo.token,
        session_id: parent.DmConf.userinfo.id,
        application_account_id : acc_id
      }
      var ret = parent.getByRsync(this.api,dats)
      if(ret.data.code == 0){
        $('#super_taskList').modal('hide');
        this.func()
        return parent.plus_alert('保存成功')
      }else{
       
        return parent.plus_alert(ret.data.msg)
      }
    },
  
}


var super_resultList ={
    node : "",
    o_node : "",
    type:"",
    get(type,taskId,o_node){
      
         $('#super_resultList_table').bootstrapTable('destroy');
         var self = this ;
         this.o_node = o_node
         this.type = type
          var tableColumns = [
             
              {width:150,field: 'uid', title: '抖音号',align : 'center',valign : 'middle',  },
              {width:150,field: 'nickname', title: '抖音昵称',align : 'center',valign : 'middle',  },
              {width:150,field: 'sex_name', title: '性别',align : 'center',valign : 'middle', },
           
          ];
          function responseHandler(info) {
            if(!parent.checkCode1002(info)){
              return 
            }
            if(info.data.info){
              var task_status_name = parent.DmConf.task_status;
              var sexName = ['女','男','未知']
              var isfanName = ['未关注','已关注','互相关注'];
          
              if(self.type == 1){

                 self.o_node.contents().find(".super_mobile_show").html(info.data.info.branch_name);
                 self.o_node.contents().find(".super_mobile_show").attr('user_id',info.data.info.user_id);
                
                 var ss = info.data.info.page.is_fan+'人(采集'+info.data.info.page.total+'人，成功关注'+ info.data.info.page.is_fan+'人)';
                
                self.o_node.contents().find(".has_look").html(ss);

              }else{
    
                self.o_node.contents().find("#fan_count_total").val(info.data.info.page.total);
              }
              $.each(info.data.info.list,function(i,v){
                v.reg_date_name = parent.UnixToDateTime(v.reg_date)
                v.sex_name = sexName[v.sex]
                v.isfan_name = isfanName[v.is_fan]
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
              "task_id" : taskId,
              "page" :(params.offset/params.limit)+1, 
            }
       
            return data
          }

          var detail = {
                "columns" :  tableColumns,
                "api" :   parent.DmConf.api.new.Task_fan_result,
                "responseHandler" :  responseHandler,
                "queryParams" :   queryParams,

          }
         
          new parent.get_search_list($('#super_resultList_table'),detail,$("#refresh_btn_table"));       
    },
    show(node,type){
        this.node = node ;

        //this.get(0, node.contents().find("#super_taskList1").val())
        commonModal_show($("#super_resultList"))

    },
    refresh(){
      
      $('#super_resultList_table').bootstrapTable('refresh');
    },
   
   
}



var changePhoneNum = {
  type : "",
  func : "",
  value:"",
  show(value,type){
      create_datePicker_p($('.reg_bg_date'));
      create_datePicker_p($('.reg_end_date'));
      this.type = type ;
      this.value = value ;
      if(type == 1){
        $(".val1").show()
        $('.val2').hide()
        $('input[name=mana_phone]').val(value.phone_count)
      }else{
        $(".val2").show()
        $('.val1').hide()
        $('.reg_bg_time').datetimepicker("setDate", new Date(value.reg_date_t))
        $('.reg_end_time').datetimepicker("setDate", new Date(value.due_date_t))
      }
     
      $('#changePhone').modal(); 
  },
  save(){
     var node =  $('#changePhone') ;
     var dat ={     
        token:parent.DmConf.userinfo.token,
        session_id:parent.DmConf.userinfo.id,   
        customer_id:this.value.id,   
        notes: node.find('input[name=notes]').val(),
      }
      if(this.type == 1){
          dat['phone_count'] = $('input[name=mana_phone]').val();
      }else{
        dat['due_date'] = new Date($("#reg_bg_date").val()).valueOf()/1000;
        dat['start_date'] = new Date($("#reg_end_date").val()).valueOf()/1000;
      }
      var ret = parent.getByRsync(parent.DmConf.api.new.Customer_Phone_count,dat)
       if(ret.data.code == 0){
          $('#changePhone').modal('hide');
          
          parent.plus_alert('设置成功')
       }else{
        parent.plus_alert(ret.data.msg)
       }

  }
}

var uploadFile = {
    type :"" ,
    api_url:"",
    show(type,api){
           this.type = type ;
           this.api_url = api ;
           var self = this ;
           var filename = '';
           commonModal_show($('#uploadFile'));
           var ret = parent.getByRsync(parent.DmConf.api.new.GetQiNiuToken,{ token:parent.DmConf.userinfo.token,session_id:parent.DmConf.userinfo.id, });
           var qiniuyunToken = '';
           var save_arr = []
           if(ret.data.code == 0){
                qiniuyunToken = ret.data.info.token
          
             }else{
              $('#uploadFile').modal('hide')
              return  parent.plus_alert(ret.data.msg)
             }
            var sendDataNum = 0
            if(parent.DmConf.uploadFile == 0){


               $("#test2").fileinput({
                uploadUrl: 'https://up.qbox.me', // you must set a valid URL here else you will get an error
                    allowedFileExtensions : ['jpg', 'png','gif'],
                    overwriteInitial: false,
                    maxFileSize: 50024,
                    maxFilesNum: 10,
                    allowedFileTypes: ['image', 'video', 'flash'],
                   /* slugCallback: function(filename) {
                    
                        return filename.replace('(', '_').replace(']', '_');
                    },*/
                    uploadExtraData:{
                      token:qiniuyunToken,
                   
                    }
                  }).off('filepreupload').on('filepreupload', function(a,b,c) {   
                  }).on("fileuploaded", function(event, outData) { 
                  //文件上传成功后返回的数据， 此处我只保存返回文件的id 
                 
                  // 对应的input 赋值 
             
                     if(outData.jqXHR.status == 200 && outData.jqXHR.readyState == 4){
                        var sendData = {
                           token:parent.DmConf.userinfo.token,
                           session_id:parent.DmConf.userinfo.id, 
                        };
                        if(self.type == 4){
                            sendData['lib_type'] = self.type ; 
                             sendData['content'] = "https://image.gzdameng.com/"+outData.response.key ;
                        }else if(self.type == 1){
                          sendData['url'] = "https://image.gzdameng.com/"+outData.response.key ;
                          sendData['file_name'] =  outData.files[sendDataNum].name ;
                        }else if(self.type == 2){
                           sendData['url'] = "https://image.gzdameng.com/"+outData.response.key ;
                          sendData['file_name'] =  outData.files[sendDataNum].name ;
                        }
                
                        sendDataNum ++ ;
                        var res = parent.getByRsync(self.api_url,sendData);
                     }
                  }); 
                  parent.DmConf.uploadFile = 1;
              }
            $('.fileinput-remove-button').click()
    }
}

var fileZoom = {
  val : "" ,
  func:"",
  "show_images_msg" : function( v){
    var img = $('<img src="'+v+'" style="cursor:pointer;max-width:300px;max-height:200px;"/>');
    img.click(function(){
        parent.ImageZoom.show($(this).attr("src"));
    });
    $('.fileZoom').find('.container').html(img);
    commonModal_show($('#fileZoom'))
},
//创建视频图像
"create_video_img" : function ( v,func) {
          this.val = v ;
          this.func = func;
         
          var video = $('<video id="videoPlay"  controls="true"  src="'+v.url+'" style="cursor:pointer;height:360px;width:500px">浏览器不支持视频播放!</video>');
          video.click(function(){
            //this.play();
            if (this.paused){
               this.play();
            }else{
               this.pause();
            }
          });
          video[0].onended = function(){
           
          };

    
      $('#fileZoom').find('.container').html(video);
      commonModal_show($('#fileZoom'))
    },
  "del_file":function(){
    let value = this.val ; 
 
    parent.config_delInfo.show('确定删除:'+value.file_name+'?',{
        session_id:parent.DmConf.userinfo.id,
        token:parent.DmConf.userinfo.token,
        id:value.id
      },parent.DmConf.api.new.Del_libvideo, this.func)
    $('#fileZoom').hide()
  }
}


/*设备操作*/
var material = {
  "m_url" : function(type){
     var api = parent.DmConf.api.new.Libtext_list;
     if(type == 6){
      api = parent.DmConf.api.new.Libvideo_list
     }else{
      api = parent.DmConf.api.new.Libtext_list
     }
     return api;
  },
    "m_type":"",
    "func" :"",
    "sex_type":"",
    "save" : function(){
    var str_save = [];
    var str = ''

    var self = this ;
    if(this.m_type == 6){
      $.each($('.choice_material_text').find('label'), function (i, v) {
        str_save.push({ "url": $(v).attr('rowId') })
      });
      this.func(str_save)
    }else{
      $.each($('.choice_material_text').find('label'),function(i,v){
        str_save.push({"value":$(v).text()})
      });

       this.func(str_save) 
    }
    
   },
  "show" : function(type,func,sex_type){//显示设备
   
  
    $('.choice_material_text').children('label').remove();
 
    this.m_type = type;
    
    this.func = func;
    this.sex_type = sex_type ;
    var id_list = [] ;
    material.material_init(id_list,type);
     commonModal_show($('#material_text'))
  },
  "delete_text" : function(t){
    var row_id = $(t).parent().attr('rowId');
    $(t).parent().remove();
    material.check_uncheck(1,row_id);
  },
  "check_uncheck" : function(type,id){
    var data = $('#material_text_tb').bootstrapTable('getOptions').data;
    var allTableData = $('#material_text_tb').bootstrapTable('getData');
    if(type == 1){ //取消选中
      $.each(data,function(i,v){
        if(v.id == id){
            $('#material_text_tb').bootstrapTable('updateRow', {
              index: i,
              row: {checked : false }
            });
        }
      })
    }else if(type == 2){//翻页选中

    }
  },
  "material_init" : function(_list,type){
    var self = this ;
    var tableColumns = [];
   
     
    if(type == 6){
       tableColumns = [
        {width:150,field : "checked" , checkbox:true,formatter : stateFormatter },
        {width:150,field: 'file_name', title: '文件名',width:300,align : 'center',valign : 'middle',}
        ]
    }else{
       tableColumns = [
        {width:150,field : "checked" , checkbox:true,formatter : stateFormatter },
        {width:150,field: 'content', title: '内容详情',width:300,align : 'center',valign : 'middle',}
        ]
    }
    $('#material_text_tb').bootstrapTable('destroy')
    $('#material_text_tb').bootstrapTable({//表格初始化
      columns: tableColumns,  //表头
      responseHandler :responseHandler ,
      width:'100%',
      height:'100%',
      method: 'post',
      sidePagination:'server',//在服务器分页--前端是client
      pageSize: 30, //每页3条
      pageNumber: 1,  //第1页
      pageList: [60,100,200,500],  
      cache: false,   //不缓存
      striped: true,
      //dataField: "count",
      pagination: true,
      search: false,
      showRefresh: false,
      showExport: false,
      showFooter: false,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",//必须要有！！！！
      dataType: "json",//数据类型
      ajaxOptions:{
       /* xhrFields: {        //跨域
          withCredentials: true
        },*/
        crossDomain: true,
      },
      url:parent.DmConf.server.url()+ self.m_url(type),//要请求数据的文件路径 
      queryParamsType:'limit',//查询参数组织方式 
      queryParams:  queryParams ,//请求服务器时所传的参数 
     
      // exportTypes: ['csv', 'txt', 'xml'],
      clickToSelect: true,

      onCheck : function(row,v){       
       /*  if(self.m_type != 1 && self.m_type != 2){
          var data = $('#material_text_tb').bootstrapTable('getOptions').data;
          $.each(data,function(a,b){
                if(b.id != row.id){
                  $('#material_text_tb').bootstrapTable('updateRow', {
                    index: a,
                    row: {checked : false }
                  });
                }
              
            })
          $.each($('.choice_material_text').find('label'),function(i,v){
                $(v).remove()
            })

        } */
        var content_name = '';
        var rowId = '';
        if(self.m_type == 6){
          content_name = row.file_name
          rowId = row.url
        }else{
          content_name = row.content ;
          rowId = row.id
        }
        var span = $('<label  rowId="'+rowId+'" class="badge badge-gradient-success" style="margin:5px">'+ content_name +'<i onclick="material.delete_text(this)" class="glyphicon glyphicon-remove-sign"></i></label>');
        $('.choice_material_text').append(span)
      },
      onUncheck : function(row,v){
        $.each($('.choice_material_text').find('label'),function(i,v){
          if($(v).attr('rowId') == row.id){
            $(v).remove()
          }
        })
      },
      onCheckAll : function(rows){

        /*  if(self.m_type != 1 || self.m_type != 2){ 
              var data = $('#material_text_tb').bootstrapTable('getOptions').data;
              $.each(data,function(a,b){
                    
                      $('#material_text_tb').bootstrapTable('updateRow', {
                        index: a,
                        row: {checked : false }
                      });
                    
                  
                })
              return 
          } */

       
        $.each(rows,function(i,v){
          var content_name = '';
          var rowId = '';
          if (self.m_type == 6) {
            content_name = v.file_name
            rowId = v.url
          } else {
            content_name = v.content;
            rowId = v.id
          }
          var span = $('<label   rowId=' + rowId+ ' class="badge badge-gradient-success" style="margin:5px">' + content_name +'<i onclick="material.delete_text(this)" class="glyphicon glyphicon-remove-sign"></i></label>');
          $('.choice_material_text').append(span)
        })
        
      },
      onUncheckAll : function(rows,v){
         $.each(rows,function(a,b){
          $.each($('.choice_material_text').find('label'),function(i,v){
              if($(v).attr('rowId') == b.id){
                $(v).remove()
              }
            })
        })
       
      },
    });

    $('#refresh_material_text_tb').click(function(){
      $('#material_text_tb').bootstrapTable('refresh')
    });
    var self = this ;
    function responseHandler(info) {
      
        var infoList = info.data.info.list;
      
     
        return  { 
                  "total" : info.data.info.page.total ,
                  "rows"  :infoList
                }

        };
        function queryParams(params){
              var data = { //每页多少条数据
                "content" : $('#material_text_tb_search').val(),
                "page_count" :params.limit,
                "page" :(params.offset/params.limit)+1, 
                "session_id": parent.DmConf.userinfo.id,
                'token' : parent.DmConf.userinfo.token,
              
              } 
              if(self.sex_type) data['sex'] = self.sex_type ;
  
              if(self.m_type <= 2){
                data['action'] = self.m_type;
                data['lib_type'] =1;
              }else if(self.m_type == 3){
                data['lib_type'] = 2;
              
              }else if(self.m_type == 6){
                   data['file_name'] =  $('#material_text_tb_search').val();
              }
     
              return data;
          };
      function stateFormatter(value, row, index){

          $.each(_list,function(i,v){
            if(v == row.id){
              var span = $('<label   rowId='+row.id+' class="badge badge-gradient-success" style="margin:5px">'+v.content+'<i onclick="material.delete_phone(this)" class="glyphicon glyphicon-remove-sign"></i></label>');
              $('.choice_material_text').append(span);
              value = true
              return {
                checked : true
              }
            }
          })

          return value
        }
  },

};


var togetherCaiji = {
  show(pData){
    this.pData = pData ;
    var node = $('#togetherCaiji')
    node.find('.addTaskAccount2').html('')
    node.find('.addTaskAccount1').val('')
    node.find('input').val('')

    $('.modal-title span').click(function(){
      $(this).addClass('togetherCaijiActive').siblings().removeClass('togetherCaijiActive')
  
      if($(this).attr('attrValue') == 1){
        node.find('.account').hide();
        node.find('.mobile').show();
        node.find('.showname').html(pData.mobile_label)
      }else{
        node.find('.account').show();
        node.find('.mobile').hide();
      }
    })
    create_datePicker($('.time_tick-togetherCaiji'))
    $("#time_week—togetherCaiji").selectpicker()
    $('#togetherCaiji').find('input[name=time_type_togetherCaiji]').click(function () {

      if ($(this).attr('valueAttr') == 1) {
        $('#togetherCaiji').find('.time_task-togetherCaiji').show()
      } else {
        $('#togetherCaiji').find('.time_task-togetherCaiji').hide()
      }
    })
    commonModal_show(node)
  },
  save(){

    let  node =$("#togetherCaiji") ;
    var dats = {
      "name": node.find('input[name=task_name]').val(),
      "application_account_id": $('.togetherCaijiActive').attr('attrValue') == 0 ? $('#togetherCaiji').find(".addTaskAccount1").val() : this.pData.id,
      "session_id": parent.DmConf.userinfo.id,
      "token": parent.DmConf.userinfo.token,
      time_type: 0 ,
      douyin_uid: this.pData.user_name ,
      'time_type': node.find('input[name=time_type_togetherCaiji]:checked').val(),
      'time_tick': $('#time_type-togetherCaiji').val(),
      'time_week': $('#time_week-togetherCaiji').val() == null ? 0 : $('#time_week-togetherCaiji').val().toString(),
    }
    let error_obj = [
      { at: "name", er_msg: "请填写任务名" },
      { at: "application_account_id", er_msg: "请选择账号" },

    ]

    var err_msg = check_emptyInput(dats, error_obj);
    if (err_msg != 0) {
      return parent.parent.plus_alertShow.show(err_msg)
    } 
  
    var api_url = $('.togetherCaijiActive').attr('attrValue') == 0 ? parent.DmConf.api.new.Add_task_hgcj : parent.DmConf.api.new.Task_Mail_acquisition
    var ret = parent.getByRsync(api_url, dats);

    if (!ret.data.code) {
      parent.parent.plus_alertShow.show('发布成功')
      node.modal('hide')
    } else {
      parent.parent.plus_alertShow.show(ret.data.msg)
    }
  }
}


var togetherGroup = {
  show(data,pData) {
    
    this.pData = pData;
    if(data.length == 0) return parent.plus_alert('请选择记录')
    if(data.length > 39) return parent.plus_alert('建群人数不得超过40个')
    $("#togetherGroup").find(".addTaskMobile2 span").remove();
    $("#togetherGroup").find("input").val('');
    console.log(data)
    $.each(data, function (i, v) {
      var sp = '<span idId='+v.id+' dyId=' + v.unique_id + ' class="okName">' + v.nickname + '<span class="delName" onclick="togetherGroup.delT(this)"></span></span>';
      $("#togetherGroup").find(".addTaskMobile2").append(sp)
    })
   
    commonModal_show($('#togetherGroup'))
  },
  delT(t){

      $(t).parent().remove()
    
  },
  save() {
    var id_list = []
    var uidList = $.map($("#togetherGroup").find('.addTaskMobile2 span'), function (v) {
      id_list.push($(v).attr('idId'))
      return $(v).attr('dyId')
    }).join(',');

    
    let node = $("#togetherGroup");
    var dats = {
      id : id_list.toString() ,
      "group_name": node.find('input[name=group_name]').val(),
      "name": node.find('input[name=task_name]').val(),
      "application_account_id": this.pData.id,
      "session_id": parent.DmConf.userinfo.id,
      "token": parent.DmConf.userinfo.token,
      time_type: 0,
      douyin_uid: uidList,
    }
    
    let error_obj = [
      { at: "name", er_msg: "请填写任务名" },
      { at: "application_account_id", er_msg: "请选择账号" },
      { at: "group_name", er_msg: "请填写群聊名称" },
      { at: "douyin_uid", er_msg: "请选择推送账号" },

    ]

     var err_msg = check_emptyInput(dats, error_obj);
    if (err_msg != 0) {
      return parent.parent.plus_alertShow.show(err_msg)
    } 

    var ret = parent.getByRsync(parent.DmConf.api.new.Add_task_hgjq, dats);

    if (!ret.data.code) {
      parent.parent.plus_alertShow.show('保存成功')
      node.modal('hide')
    } else {
      parent.parent.plus_alertShow.show(ret.data.msg)
    }
  }
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
var sendCusCard = {
  show(data,pData) {
   
    if (data.length == 0) return parent.plus_alert('请选择记录');
    this.pData = pData ;
    var node = $('#sendCusCard') ;
   node.find('input').val('')
    node.find(".addTaskMobile2").find('span').remove();
    $.each(data, function (i, v) { 
      var sp = '<span dyId=' + v.unique_id + ' class="okName">' + v.nickname + '<span class="delName" onclick="sendCusCard.delT(this)"></span></span>';
      node.find(".addTaskMobile2").append(sp)
    })

    commonModal_show(node)
  },
  delT(t) {

    $(t).parent().remove()

  },
  save() {
   
    var uidList = $.map($("#sendCusCard").find('.addTaskMobile2 span'),function(v){
     return $(v).attr('dyId')
    }).join(',') ;

    var data = {
      application_account_id: this.pData.id,
      dy_uid: $("#sendCusCard").find('input[name=appid]').val(),
      time_type: 0,
      session_id: parent.DmConf.userinfo.id,
      token: parent.DmConf.userinfo.token,
      send_uid: uidList,
      name: "推名片",
    }
    
    let error_obj = [
      { at: "name", er_msg: "请填写任务名" },
      { at: "application_account_id", er_msg: "请选择账号" },
      { at: "dy_uid", er_msg: "请选择推送账号" },

    ]

     var err_msg = check_emptyInput(data, error_obj);
    if (err_msg != 0) {
      return parent.parent.plus_alertShow.show(err_msg)
    } 

    var ret = parent.getByRsync(parent.DmConf.api.new.Add_task_dy, data);
    if (ret.data.code == 0) {
      $('#sendCusCard').modal('hide')
      parent.parent.plus_alertShow.show('任务设置成功')
    } else {
      parent.parent.plus_alertShow.show(ret.data.info.msg)
    } 
  }
}

var gotoCheat = {
  show(data, pData) {
    this.pData = pData
    this.data = data
    $('#gotoCheat').find('input').val('')
    $('.contentCheat').find('p:not(:first-child)').remove()
    commonModal_show($('#gotoCheat'))
  },
  addP(){
    $('#gotoCheat').find('.contentCheat').append( '<p class="input-group margin10">\
                                  <input class= "form-control" type = "text" > <span onclick="gotoCheat.addP()" style="margin-left:20px;" class="iconfont icon-jia"></span>\
                                  <span onclick="gotoCheat.delT(this)" style="margin-left:20px;" class="iconfont icon-jian">\
                                </p >')
  },
  delT(t) {

    $(t).parent().remove()

  },
  save() {

    var uidList = $.map($("#gotoCheat").find('.contentCheat p'), function (v) {
      return $(v).find('input').val()
    }).join('_#_');

    var data = {
      application_account_id: this.pData.id,
      time_type: 0,
      group_name: this.data.group_name,
      session_id: parent.DmConf.userinfo.id,
      token: parent.DmConf.userinfo.token,
      message_text: uidList,
      name: $('#gotoCheat').find('input[name=target_video_comment_count]').val(),
    };
    let error_obj = [
      { at: "name", er_msg: "请填写任务名" },
      { at: "application_account_id", er_msg: "请选择账号" },
      { at: "message_text", er_msg: "请选择推送账号" },
    ];
    var err_msg = check_emptyInput(data, error_obj);
    if (err_msg != 0) {
      return parent.parent.plus_alertShow.show(err_msg)
    } ;
    var ret = parent.getByRsync(parent.DmConf.api.new.Add_task_hgql, data);
    if (ret.data.code == 0) {
      $('#gotoCheat').modal('hide')
      parent.parent.plus_alertShow.show('任务设置成功')
    } else {
      parent.parent.plus_alertShow.show(ret.data.info.msg)
    }  
  }
}


var changeKeywordAp = {
  show(data,cz){
    var node = $("#changeKeywordAp");
    this.func = cz ;
    node.find('input').val('');
    var str = data.length == 1 ? '选择了'+data[0].user_name+'1个抖音号'  :  '选择了' + data[0].user_name+'等'+data.length+'个抖音号'
    $('.kywordList').html(str)
    this.data = data ;
    commonModal_show(node)
  },
  save(){
    var id_list = $.map(this.data,function(v){return v.id}).join(',');
    var dats = {
      session_id: parent.DmConf.userinfo.id,
      token: parent.DmConf.userinfo.token,
      id: id_list,
      keyword: $("#changeKeywordAp").find('input[name=target_video_comment_count]').val()
    }
    var ret = parent.getByRsync(parent.DmConf.api.new.Applicationaccount_Update_keyword,dats)
    if(ret.data.code == 0 ){
      $("#changeKeywordAp").modal('hide');
      this.func(dats)
      return parent.plus_alert('保存成功')
    }else{
      return parent.plus_alert(ret.data.msg)
    }
  }
}


var changPhoneType = {
  show(data){
    if(data.length == 0) return parent.plus_alert('请选择记录');
    var node = $("#changPhoneType");
    node.find(".addTaskMobile2").find('span').remove();
    $.each(data, function (i, v) {
      var sp = '<span dyimei="'+v.imei+'" dyId="'+ v.id +'" class="okName">' + v.mobile_label + '<span class="delName" onclick="sendCusCard.delT(this)"></span></span>';
      node.find(".addTaskMobile2").append(sp)
    })
    this.data = data;
   node.find("#type").selectpicker('refresh')
    commonModal_show(node)
    $('.bootstrap-select').css({'margin-right':'18px','margin':0,'padding':0})
  },
  save(){
    var imei_list = $.map($("#changPhoneType").find('.addTaskMobile2 span'), function (v) {
      return $(v).attr('dyimei')
    }).join(',');

    var id_list = $.map($("#changPhoneType").find('.addTaskMobile2 span'), function (v) {  
      return $(v).attr('dyid')
    }).join(',');

    var data = {
      task_type: $("#changPhoneType").find('#type').val(),
      session_id: parent.DmConf.userinfo.id,
      token: parent.DmConf.userinfo.token,
      id: id_list,
      imei: imei_list,
    }

    var ret = parent.getByRsync(parent.DmConf.api.new.Mobile_Task_type_mobile,data);
    if (ret.data.code == 0) {
      parent.parent.plus_alertShow.show('设置成功')
      $("#changPhoneType").modal('hide');
      return;
    } else {
      parent.parent.plus_alertShow.show(ret.data.info.msg)
    }   
  }
}
/* ============= */
function create_datePicker(node) {
  return node.datetimepicker({
    format: 'yyyy-mm-dd hh:ii:ss',//显示格式
    todayHighlight: 1,//今天高亮
    minView: '0',
    startView: 2,
    forceParse: 0,
    showMeridian: 1,
    todayBtn: false,
    autoclose: 1,//选择后自动关闭
    pickerPosition: 'bottom-right',
  });
}
function reloadCity() {
  var ci = parent.DmConf.city.split(',')
  $.each(ci, function (i, v) {
    var opt = '<option value=' + v + '>' + v + '</option>';
    $('#city').append(opt)
  })
  $('#city').selectpicker('refresh');
  $("#city").parent().css({ 'z-index': 7 })
}
//写评论
function write_content(msg) {
  $.each($('.addContent').find('p'), function (a, b) {

    if ($(b).find('input').val().length == 0) {
      $(b).remove()
    }
  })
  $.each(msg, function (i, v) {
    $('.addContent').append('<p class="input-group margin15">\
                <input type="text" class="form-control" name="content" value="'+ v.value + '"     aria-describedby="basic-addon1"><button  onclick="del_msg(this)" type="button" class=" btn_style btn btn-primary" >删除</button>\
              </p>')
  })
}
function addContent(type) {
  $('.addContent').append('<p class="input-group margin15">\
                <input type="text" class="form-control" name="content" placeholder=" "     aria-describedby="basic-addon1"><button  onclick="del_msg(this)" type="button" class=" btn_style btn btn-primary" >删除</button>\
              </p>')
}
//写私信
function write_msg(msg,node) {
  var v_node = node ? node : $('.addMsg');
  $.each(v_node.find('p'), function (a, b) {
   
    if ($(b).find('input').val().length == 0 && a != 0) {
      $(b).remove()
    }
  })
  $.each(msg, function (i, v) {
  
    if (i == 0 && v_node.find('p:first-child').find('input').val().length == 0) {
          v_node.find('p:first-child').find('input').val(v.value)
        } else {
        v_node.append('<p class="input-group margin15">\
                    <input type="text" class="form-control" name="addMsg" value="'+ v.value + '"     aria-describedby="basic-addon1"><button  onclick="del_msg(this)" type="button" class=" btn_style btn btn-primary" >删除</button>\
                  </p>')
        }
  })
}

function addMsg() {
  $('.addMsg').append('<p class="input-group margin15">\
              <input type="text" class="form-control" name="addMsg" placeholder=" "     aria-describedby="basic-addon1"><button  onclick="del_msg(this)" type="button" class="btn_style btn btn-primary" >删除</button>\
            </p>')
}
function del_msg(t) {

  $(t).parent().remove()
}
/* ============= */
var videoCollect = {
  show(pData) {
    this.pData = pData;
  
    $('#videoCollect').find('.addTaskAccount2').html('')
    $('#videoCollect').find('.addTaskAccount1').val('')
    $('#videoCollect').find('input').val('')
    create_datePicker($('.time_tick-videoCollect'))
    $("#time_week—videoCollect").selectpicker()
    $('#videoCollect').find('input[name=time_type_videoCollect]').click(function () {
      
      if ($(this).attr('valueAttr') == 1) {
        $('#videoCollect').find('.time_task-videoCollect').show()
      } else {
        $('#videoCollect').find('.time_task-videoCollect').hide()
      }
    })
    reloadCity()
    commonModal_show($('#videoCollect'))
  },
  save() {

    let node = $("#videoCollect");
    var comment_num = $('input[name=concern_0]').val() + '_' + $('input[name=concern_1]').val();
    var data = {
      "task_type": 1,
      "application_account_id": $('#videoCollect').find(".addTaskAccount1").val(),
      "task_time": node.find('input[name=ctime]').val(),
      "session_id": parent.DmConf.userinfo.id,
      "acquisition_num": comment_num,
      "name": node.find('input[name=task_name]').val(),
      'time_type': node.find('input[name=time_type_videoCollect]:checked').val(),
      'time_tick': $('#time_type-videoCollect').val(),
      'time_week': $('#time_week-videoCollect').val() == null ? 0 : $('#time_week-videoCollect').val().toString(),
      "token": parent.DmConf.userinfo.token,
      "customer_id": parent.DmConf.userinfo.customer_id,
      "id": 0,
    }

    let error_obj = [
      { at: "name", er_msg: "请填写任务名" },
      { at: "application_account_id", er_msg: "请选择应用账号" },

      { at: "task_time", er_msg: "请填写采集时长" },
      { at: "acquisition_num", er_msg: "请填写正确的评论数量", detail: { len: 2, } },
    ]


    if (node.find('input[name=key_type]:checked').attr('valueAttr') == 1) {
      data['video_type'] = 1;
      data['class_name'] = node.find('input[name=class_name]').val();
      error_obj.push({ at: 'class_name', er_msg: "请填写关键词" })
    } else if (node.find('input[name=key_type]:checked').attr('valueAttr') == 2) {
      data['video_type'] = 2;
      data['city'] = $('#city').val();
      error_obj.push({ at: 'city', er_msg: "请选择城市" })
    } else if (node.find('input[name=key_type]:checked').attr('valueAttr') == 3) {
      data['video_type'] = 3;
      data['big_dy'] = node.find('input[name=big_dy]').val();
      error_obj.push({ at: 'big_dy', er_msg: "请填写大号" })
    }

    var err_msg = check_emptyInput(data, error_obj);
    if (err_msg != 0) {
      return parent.plus_alertShow.show(err_msg)
    }


    var ret = parent.getByRsync(parent.DmConf.api.new.Add_task_acquisition, data);
    if (ret.data.code == 0) {
      $('#videoCollect').modal('hide')
      parent.plus_alertShow.show('任务设置成功')
    } else {
      parent.plus_alertShow.show(ret.data.info.msg)
    }
  }
}

var msgCollect = {
 removePlayurl(t) {
    $(t).parent().remove()
  },
  /* addFilterTit() {
    $('.filter_title').append(' <span class="filter_title_children "><input class="smd_height37" style="width:120px" type="text"><span onclick="secMsgDiscuss.addFilterTit()"  style="margin-left:5px" class= "iconfont icon-jia" ></span ><span onclick="secMsgDiscuss.removeFilterTit(this)"  style="margin-left:5px" class="iconfont icon-jian "></span></span>')
  },
  removeFilterTit(y) {
    $(y).parent().remove()
  }, */
  addPlayurl(url, type) {

    var v_url = url ? url : '';

    if (type) {
      $('#msgCollect').find('.moreUrlist').append(' <div class="input-group margin10 dyORvideo_1" >\
    <span class= "input-group-addon width90" id = "basic-addon1" > 视频</span >\
    <input disabled type="text" value="'+ v_url + '" class="form-control" name="play_url" placeholder="请输入链接" aria-describedby="basic-addon1">\
    <span onclick="msgCollect.addPlayurl()" class=" left10pxSp iconfont icon-jia"></span><span onclick="msgCollect.removePlayurl(this)" class=" left10pxSp iconfont icon-jian"></span>\
    </div>');
    } else {
      $('#msgCollect').find('.moreUrlist').append(' <div class="input-group margin10 dyORvideo_1" >\
    <span class= "input-group-addon width90" id = "basic-addon1" > 视频</span >\
    <input type="text" value="'+ v_url + '" class="form-control" name="play_url" placeholder="请输入链接" aria-describedby="basic-addon1">\
    <span onclick="msgCollect.addPlayurl()" class=" left10pxSp iconfont icon-jia"></span><span onclick="msgCollect.removePlayurl(this)" class=" left10pxSp iconfont icon-jian"></span>\
    </div>');
    }

  },
  show(pData) {
    this.pData = pData;

    $('#msgCollect').find('.addTaskAccount2').html('');
    $('#msgCollect').find('.addTaskAccount1').val('');
    $('#msgCollect').find('input').val('');

    create_datePicker($('.time_tick-msgCollect'));
    $("#time_week—msgCollect").selectpicker();
    $('#msgCollect').find("#sex_type").selectpicker();
    $('.moreUrlist div:not(:first-child)').remove();
    $('.moreUrlist1').attr('disabled',false)
    $('#msgCollect').find('input[name=time_type_msgCollect]').click(function () {
      if ($(this).attr('valueAttr') == 1) {
        $('#msgCollect').find('.time_task-msgCollect').show()
      } else {
        $('#msgCollect').find('.time_task-msgCollect').hide()
      }
    })
   
    if(pData) {

      $.each(pData, function (i, v) {

        if (i == 0) {

          $('#msgCollect').find('.moreUrlist1').val(v.url).attr('disabled', true)
        } else {
          msgCollect.addPlayurl(v.url, 1)
        }

      })
      
    }
    commonModal_show($('#msgCollect'))
  },
  save() {


    var urlist =  $('#msgCollect').find('.moreUrlist').find('input[name=play_url]').map(function (v) { return this.value; }).get().filter(item => item);
    var comment_time = $('#msgCollect').find('input[name=rightTime]:checked').attr('attrValue') == 0 ? $('#msgCollect').find('input[name=timeHour]').val() * 3600 : $('#msgCollect').find('input[name=rightTime]:checked').attr('attrValue') == 1 ? $('#msgCollect').find('input[name=timeMin]').val() * 60 : $('#msgCollect').find('input[name=timeDay]').val() * 86400;
    var node =  $('#msgCollect');
    var filter_title = node.find('input[name=filterMsg-msgCollect]').val().split('+');
    var data = {
      "application_account_id":  $('#msgCollect').find('.addTaskAccount1').val(),
      "task_type": 2,
      'is_filter': node.find('input[name=is_filter-msgCollect]').prop('checked') ? 1 : 0,
      'filter_title': JSON.stringify(filter_title),
      "session_id": parent.DmConf.userinfo.id,
      "url_list": JSON.stringify(urlist),
      "name": node.find('input[name=task_name]').val(),
      "is_god":  node.find('input[name=is_god]').prop('checked')?1:0,
      "sex":  $('#msgCollect').find("#sex_type").val(),
      "class_name":  $('#msgCollect').find('input[name=class_name]').val().replace(/\+/ig, ','),
      "task_time": comment_time,
      "token": parent.DmConf.userinfo.token,
      "customer_id": parent.DmConf.userinfo.customer_id,
      'time_type': node.find('input[name=time_type_msgCollect]:checked').val(),
      'time_tick': $('#time_type-msgCollect').val(),
      'time_week': $('#time_week-msgCollect').val() == null ? 0 : $('#time_week-msgCollect').val().toString(),
      "id": 0,
    }
     let error_obj = [
      { at: "name", er_msg: "请填写任务名" },
      { at: "application_account_id", er_msg: "请选择应用账号" },
    ]
    if (data['is_god'] == 0) {
      error_obj.push({ at: "url_list", er_msg: "请填写视频链接", detail: { "len": 2 } }, { at: "task_time", er_msg: "请填写评论时长" })

    }
    var err_msg = check_emptyInput(data, error_obj);
    if (err_msg != 0) {
      return parent.plus_alertShow.show(err_msg)
    }


    var ret = parent.getByRsync(parent.DmConf.api.new.Add_task_acquisition, data);
    if (ret.data.code == 0) {
      $('#msgCollect').modal('hide')
      parent.plus_alertShow.show('任务设置成功')
    } else {
      parent.plus_alertShow.show(ret.data.info.msg)
    } 
  }
}


var secMsgDiscuss = {
  
  delT(t) {
    $(t).parent().remove()
  },
  show(pData) {
    this.pData = pData;

    $('#secMsgDiscuss').find('.addTaskAccount2').html('');
    $('#secMsgDiscuss').find('.addTaskAccount1').val('');
    $('#secMsgDiscuss').find('input').val('');
    $('#secMsgDiscuss').find('.addContent p:not(:first-child)').remove()
    create_datePicker($('.time_tick-secMsgDiscuss'));
    $("#time_week—secMsgDiscuss").selectpicker();
    $('#secMsgDiscuss').find("#sex_type").selectpicker();
    $('.filter_title_children:not(:first-child)').remove()
    $('#secMsgDiscuss').find('input[name=time_type_secMsgDiscuss]').click(function () {
      if ($(this).attr('valueAttr') == 1) {
        $('#secMsgDiscuss').find('.time_task-secMsgDiscuss').show()
      } else {
        $('#secMsgDiscuss').find('.time_task-secMsgDiscuss').hide()
      }
    })

    if (pData) {
      var vv = []
      //$('#secMsgDiscuss').find(".addTaskMobile2").find('span').remove()
      $.each(pData, function (i, v) {
       /*  var sp = '<span dyId=' + v.url + ' class="okName">' + v.url + '<span class="delName" onclick="secMsgDiscuss.delT(this)"></span></span>';
        $('#secMsgDiscuss').find(".addTaskMobile2").append(sp) */
        vv.push(v.url )
      })
     
      $('#secMsgDiscuss').find('input[name=urlist-secMsgDiscuss]').val(vv.toString()).attr('title', vv.toString()).attr('urlIl',JSON.stringify(vv))
    }
    commonModal_show($('#secMsgDiscuss'))
  },
  save(){
    var node = $('#secMsgDiscuss');
    var addCont = node.find('.addContent').find('input[name=content]').map(function () { return this.value; }).get().join("_#_");
   
    var filter_title = $('#secMsgDiscuss').find('input[name=filterMsg-secMsgDiscuss]').val().split('+');
    var data = {
      "application_account_id": $('#secMsgDiscuss').find('.addTaskAccount1').val(),
      "is_like": node.find('input[name=is_like-secMsgDiscuss]').prop('checked') ? 1 : 0,
      "videos": $('#secMsgDiscuss').find('input[name=urlist-secMsgDiscuss]').attr('urlIl'),
      "session_id": parent.DmConf.userinfo.id,
      'time_type': node.find('input[name=time_type_secMsgDiscuss]:checked').attr('valueAttr'),
      'time_tick': $('#time_tick-secMsgDiscuss').val(),
      'time_week': $('#time_week-secMsgDiscuss').val() == null ? 0 : $('#time_week-secMsgDiscuss').val().toString(),
      "name": "二次点赞评论",
      "comment_count" : node.find('input[name=pinglunshuliang]').val(),
      "message_text": addCont,
      'is_filter': node.find('input[name=is_filter-secMsgDiscuss]').prop('checked') ? 1 : 0,
      'filter_title': JSON.stringify(filter_title),
      "keywords": node.find('input[name=keywords]').val().replace(/\+/ig,','),
      "token": parent.DmConf.userinfo.token,
      "customer_id": parent.DmConf.userinfo.customer_id,
      "id": 0,
    };
    let error_obj = [
      { at: "application_account_id", er_msg: "请选择应用账号" },
      { at: "videos", er_msg: "请选择视频地址" },
      { at: "comment_count", er_msg: "评论数量不能为空" },
      
    ]
    var err_msg = check_emptyInput(data, error_obj);
    if (err_msg != 0) {
      return parent.plus_alertShow.show(err_msg)
    }
    if(data['comment_count'] == 0) return parent.plus_alertShow.show('评论数量不能为0')
    let imLen = JSON.parse(data['videos'])
    let appLen = data['application_account_id'].split(',')
    if (appLen.length > imLen.length) {
      parent.plus_alert('选择执行账号多于执行视频，将导致多余的执行账号不执行该次任务。')
    }
    setTimeout(function () {
      var ret = parent.getByRsync(parent.DmConf.api.new.Add_task_dzpl, data);
      if (ret.data.code == 0) {
        $('#secMsgDiscuss').modal('hide')
        parent.plus_alertShow.show('任务设置成功')
      } else {
        parent.plus_alertShow.show(ret.data.info.msg)
      }
    }, 2000)}
}



var concernAndcheat = {
  changeCli(){
    $('#concernAndcheat').find('input[name=taskType_concernAndcheat]:checked').attr('valueAttr') == 1 ? parent.treeview.show($('#concernAndcheat'), 0, 1, '', '-1', 'sixin') : parent.treeview.show($('#concernAndcheat'), 0, 1, '', '-1' )
    
  },
  show(pData,type) { //type : 0:全部 ， 1：私信，2：关注
    this.pData = pData;

    $('#concernAndcheat').find('.addTaskAccount2').html('');
    $('#concernAndcheat').find('.addTaskAccount1').val('');
    $('#concernAndcheat').find('input').val('');
   
    create_datePicker($('.time_tick-concernAndcheat'));
    $("#time_week—concernAndcheat").selectpicker();
    $('#concernAndcheat').find("#sex_type").selectpicker();
    $('#concernAndcheat').find('.addMsg p:not(:first-child)').remove()
    $('#concernAndcheat').find('input[name=time_type_concernAndcheat]').click(function () {
      if ($(this).attr('valueAttr') == 1) {
        $('#concernAndcheat').find('.time_task-concernAndcheat').show()
      } else {
        $('#concernAndcheat').find('.time_task-concernAndcheat').hide()
      }
    })
    var idl='' 
    var  idnick = '' ;
    $.each(pData, function (i, v) {
      idl += v.unique_id +','
      idnick += v.nickname + '+' + v.unique_id +';'
    /*   var sp = '<span dyId=' + v.unique_id + ' class="okName">' + v.nickname + '+' + v.unique_id + '<span class="delName" onclick="del_msg(this)"></span></span>';
      $('#concernAndcheat').find(".addTaskMobile2").append(sp) */
    })
    $('#concernAndcheat').find('input[name=dyuidnickname]').val(idnick).attr('dyId',idl).attr('title',idnick)
    $('#concernAndcheat').find('input[name=taskType_concernAndcheat]').change(function () {
      if ($(this).attr('valueAttr') == 1) {
        $('#concernAndcheat').find('.cheat_show').show()
        $('#concernAndcheat').find('.concern_show').hide()
      } else {
        $('#concernAndcheat').find('.concern_show').show()
        $('#concernAndcheat').find('.cheat_show').hide()
      }
    })
    if(type == 1){
      $('#task1Do-concernAndcheat').click()
      $('.taskDo-concernAndcheat').css({ 'visibility': 'hidden' })
      
    }else{
      $('.taskDo-concernAndcheat').css({ 'visibility': 'inherit' })
    }



    commonModal_show($('#concernAndcheat'))
  },
  save() {
 
    var node = $('#concernAndcheat');
    var addMsg = node.find('.addMsg').find('input[name=addMsg]').map(function () { return this.value; }).get().join("_#_");
  
    var data = {
      "application_account_id": $('#concernAndcheat').find('.addTaskAccount1').val(),
      "unique_id": $('#concernAndcheat').find('input[name=dyuidnickname]').attr('dyId'),
      "session_id": parent.DmConf.userinfo.id,
      'time_type': node.find('input[name=time_type-concernAndcheat]:checked').attr('valueAttr'),
      'time_tick': $('#time_tick-concernAndcheat').val(),
      'time_week': $('#time_week-concernAndcheat').val() == null ? 0 : $('#time_week-concernAndcheat').val().toString(),
      "token": parent.DmConf.userinfo.token,
      "customer_id": parent.DmConf.userinfo.customer_id,
      "id": 0,
    };
    var api ;
    let error_obj = [
      { at: "name", er_msg: "请填写任务名" },
      { at: "application_account_id", er_msg: "请选择应用账号" },
    ] ;

    if ($('#concernAndcheat').find('input[name=taskType_concernAndcheat]:checked').attr('valueAttr') == 0){
      data['name'] = '关注';
      data['fan_time'] = node.find('input[name=fan_time_0]').val() + '_' + node.find('input[name=fan_time_1]').val() ;
      error_obj.push({ at: "fan_time", er_msg: "请填写正确的关注间隔", detail: { len: 2, }} );
      api = parent.DmConf.api.new.Add_task_fan
    }else{
      data['name'] = '私信';
     /*  data["target_message_count"]= node.find('input[name=tagret_num]').val(); */
      data['message_text'] = addMsg;
      data['send_model'] = node.find('input[name=sendmodel_concernAndcheat]:checked').attr('valueAttr')
/*       error_obj.push({ at: "target_message_count", er_msg: "请填写私信数量" },) */
      api = parent.DmConf.api.new.Add_task_message 
    }
   console.log(data)
  var err_msg = check_emptyInput(data, error_obj);
    if (err_msg != 0) {
      return parent.plus_alertShow.show(err_msg)
    }

    var ret = parent.getByRsync(api, data);
    if (ret.data.code == 0) {
      parent.plus_alertShow.show('任务设置成功')
      $("#concernAndcheat").modal('hide')
    } else {
      parent.plus_alertShow.show(ret.data.info.msg)
    }   
  }
}

var goodsCollect = {

  show(pData) {
    this.pData = pData;

    $('#goodsCollect').find('.addTaskAccount2').html('');
    $('#goodsCollect').find('.addTaskAccount1').val('');
    $('#goodsCollect').find('input').val('');
    $('#goodsCollect').find(".addTaskMobile2 span").remove()
  

   

    commonModal_show($('#goodsCollect'))
  },
  save() {

    var node = $('#goodsCollect');
  
    var data = {
      "application_account_id": $('#goodsCollect').find('.addTaskAccount1').val(),
      "name": $('#goodsCollect').find('input[name=task_name]').val(),
      "session_id": parent.DmConf.userinfo.id,
      "task_type" : 3,
      "token": parent.DmConf.userinfo.token,
      "customer_id": parent.DmConf.userinfo.customer_id,
      "id": 0,
    };
    var api;
    let error_obj = [
      { at: "name", er_msg: "请填写任务名" },
      { at: "application_account_id", er_msg: "请选择应用账号" },
    ]

    
    var err_msg = check_emptyInput(data, error_obj);
    if (err_msg != 0) {
      return parent.plus_alertShow.show(err_msg)
    }
 

    var ret = parent.getByRsync(parent.DmConf.api.new.Add_task_acquisition, data);
    if (ret.data.code == 0) {
      node.modal('hide')
      parent.plus_alertShow.show('任务设置成功')
    } else {
    
      parent.plus_alertShow.show(ret.data.info.msg)
    }
  }
}

var fensCollectAll = {

  show(pData) {
    this.pData = pData;

    $('#fensCollectAll').find('.addTaskAccount2').html('');
    $('#fensCollectAll').find('.addTaskAccount1').val('');
    $('#fensCollectAll').find('input').val('');
    $('#fensCollectAll').find(".addTaskMobile2 span").remove();

    create_datePicker($('.time_tick-fensCollectAll'));
    $("#time_week—fensCollectAll").selectpicker();
    $('#fensCollectAll').find('input[name=time_type_fensCollectAll]').click(function () {
      if ($(this).attr('valueAttr') == 1) {
        $('#fensCollectAll').find('.time_task-fensCollectAll').show()
      } else {
        $('#fensCollectAll').find('.time_task-fensCollectAll').hide()
      }
    })
    commonModal_show($('#fensCollectAll'))
  },
  save() {

    var node = $('#fensCollectAll');
    var filter_title = node.find('input[name=filterMsg-fensCollectAll]').val().split('+');

     
    var data = {
      "application_account_id": $('#fensCollectAll').find('.addTaskAccount1').val(),
      "name": $('#fensCollectAll').find('input[name=task_name]').val(),
      "session_id": parent.DmConf.userinfo.id,
      'time_type': node.find('input[name=time_type-fensCollectAll]:checked').attr('valueAttr'),
      'is_filter': node.find('input[name=is_filter-fensCollectAll]').prop('checked') ? 1 : 0,
      'time_tick': $('#time_tick-fensCollectAll').val(),
      "big_dys": node.find('input[name=big_dys]').val().replace(/\+/ig,','),
      "nicktitle":JSON.stringify(filter_title) ,
      'time_week': $('#time_week-fensCollectAll').val() == null ? 0 : $('#time_week-fensCollectAll').val().toString(),
    /*   "is_open_window": node.find('input[name=is_open_window-fensCollectAll]').prop('checked') ?  1 : 0 , */
      "token": parent.DmConf.userinfo.token,
      "customer_id": parent.DmConf.userinfo.customer_id,
      "id": 0,
    };

  let error_obj = [
     
      { at: "application_account_id", er_msg: "请选择应用账号" },
      { at: "big_dys", er_msg: "请填写抖音号" },
    ]


    var err_msg = check_emptyInput(data, error_obj);
    if (err_msg != 0) {
      return parent.plus_alertShow.show(err_msg)
    }
    

    var ret = parent.getByRsync(parent.DmConf.api.new.Task_Add_big_acquisition, data);
    if (ret.data.code == 0) {
      node.modal('hide')
      parent.plus_alertShow.show('任务设置成功')
    } else {
      parent.plus_alertShow.show(ret.data.info.msg)
    }  
  }
}



var replyVideo = {

  show(data,pData) {
    this.pData = pData;
    var node = $("#replyVideo")
   
    $('#replyVideo').find('input').val('');

    create_datePicker($('.time_tick-replyVideo'));
    $("#time_week—replyVideo").selectpicker();
    $('#replyVideo').find('input[name=time_type_replyVideo]').click(function () {
      if ($(this).attr('valueAttr') == 1) {
        $('#replyVideo').find('.time_task-replyVideo').show()
      } else {
        $('#replyVideo').find('.time_task-replyVideo').hide()
      }
    })
    var idl = []
    var nik = []
    $.each(data, function (i, v) {
      idl.push(v.unique_id)
      nik.push(v.nickname)
    })
  
    $("#replyVideo").find('input[name=douyin_uid-replyVideo]').attr('dyId',idl.toString()).val(nik.toString()).attr('title',nik.toString())
    commonModal_show($('#replyVideo'))
  },
  save() {

    var node = $('#replyVideo');
    var douyin_uid = $("#replyVideo").find('input[name=douyin_uid-replyVideo]').attr('dyId')
    var data = {
      "application_account_id": this.pData.id,
      "session_id": parent.DmConf.userinfo.id,
      'time_type': node.find('input[name=time_type-replyVideo]:checked').attr('valueAttr'),
      'video_url': node.find('input[name=video_url-replyVideo]').val(),
      'message': node.find('input[name=message-replyVideo]').val(),
      'douyin_uid': douyin_uid ,
      'time_tick': $('#time_tick-replyVideo').val(),
    
      'time_week': $('#time_week-replyVideo').val() == null ? 0 : $('#time_week-replyVideo').val().toString(),
     
      "token": parent.DmConf.userinfo.token,
      "customer_id": parent.DmConf.userinfo.customer_id,
      "id": 0,
    };

    let error_obj = [
      { at: "douyin_uid", er_msg: "请填写抖音号" },
      { at: "video_url", er_msg: "请填写视频链接" },
    ]
 

    var err_msg = check_emptyInput(data, error_obj);
    if (err_msg != 0) {
      return parent.plus_alertShow.show(err_msg)
    }


    var ret = parent.getByRsync(parent.DmConf.api.new.Task_Add_share_video, data);
    if (ret.data.code == 0) {
      node.modal('hide')
      parent.plus_alertShow.show('任务设置成功')
    } else {
      parent.plus_alertShow.show(ret.data.info.msg)
    } 
  }
}



var livingRoomFollow = {

  show( ) {
    
    var node = $("#livingRoomFollow")
    $('#livingRoomFollow').find('.addTaskAccount2').html('');
    $('#livingRoomFollow').find('.addTaskAccount1').val('');
    $('#livingRoomFollow').find('input').val('');

    create_datePicker($('.time_tick-livingRoomFollow'));
    $("#time_week—livingRoomFollow").selectpicker();
    $('#livingRoomFollow').find('input[name=time_type_livingRoomFollow]').click(function () {
      if ($(this).attr('valueAttr') == 1) {
        $('#livingRoomFollow').find('.time_task-livingRoomFollow').show()
      } else {
        $('#livingRoomFollow').find('.time_task-livingRoomFollow').hide()
      }
    })


   
    commonModal_show($('#livingRoomFollow'))
  },
  save() {
    
    var node = $('#livingRoomFollow');
  
    var data = {
      "live_url": node.find('input[name=douyin]').val(),
      "keywords": node.find('input[name=keyword]').val().replace(/\+/ig, ','),
      "fan_count": node.find('input[name=fan_count]').val(),
      "application_account_id": $('#livingRoomFollow').find('.addTaskAccount1').val(),
      search_type: node.find('input[name=douyinOrzhibojian]:checked').attr('valueAttr'),
      dy_uid: node.find('input[name=douyin1]').val(),
      "session_id": parent.DmConf.userinfo.id,
      "name": node.find('input[name=task_name]').val(), 
      "session_id": parent.DmConf.userinfo.id,
      'time_type': node.find('input[name=time_type-livingRoomFollow]:checked').attr('valueAttr'),
      'time_tick': $('#time_tick-livingRoomFollow').val(),
      "fan_time": node.find('input[name=time_livingRoomFollow]:checked').attr('valueAttr') == 0 ? node.find('input[name=timeDay]').val() : 0 ,
      'time_week': $('#time_week-livingRoomFollow').val() == null ? 0 : $('#time_week-livingRoomFollow').val().toString(),

      "token": parent.DmConf.userinfo.token,
      "customer_id": parent.DmConf.userinfo.customer_id,
      "id": 0,
    };

    let error_obj = [
      { at: "name", er_msg: "请填写任务名" },
      { at: "application_account_id", er_msg: "请选择账号" },
     
      /*  { at: "keywords", er_msg: "请填写关键词" }, */
      { at: "fan_count", er_msg: "请填写关注数" },
    ]
    if (data['search_type'] == 1){
      error_obj.push({ at: "live_url", er_msg: "请填写直播间链接" })
    }else{
      error_obj.push({ at: "dy_uid", er_msg: "请填写抖音号" })
    }
    if(node.find('input[name=time_livingRoomFollow]:checked').attr('valueAttr') == 0)  error_obj.push({ at: "fan_time", er_msg: "请填写关注时长" }) ;

    var err_msg = check_emptyInput(data, error_obj);
    if (err_msg != 0) {
      return parent.plus_alertShow.show(err_msg)
    }


    var ret = parent.getByRsync(parent.DmConf.api.new.Task_Add_question_fan, data);
    if (ret.data.code == 0) {
      node.modal('hide')
      parent.plus_alertShow.show('任务设置成功')
    } else {
      parent.plus_alertShow.show(ret.data.info.msg)
    }
  }
}


// 修改密码
var change_passwd = {
  show: function () {
    $('#change_password').find('input').val('')
    commonModal_show($('#change_password'))  
  },
  save: function () {
    var dats = {
      session_id: parent.DmConf.userinfo.id,
      token: parent.DmConf.userinfo.token,

      password: $('#change_password').find('input[name=password]').val(),
      new_password: $('#change_password').find('input[name=new_password]').val(),
    }
    var ret = getByRsync(parent.DmConf.api.new.Update_password, dats);
    if (ret.data.code == 0) {
      parent.plus_alertShow.show('修改密码成功')
      $('#change_password').modal('hide');
    } else {
      parent.plus_alertShow.show(ret.data.msg)
    }
  },
  goHome() {
    mainHeight = $(document.body).height() - 105;
    var content = '<iframe id="main_indexHome" src="apps/main.html" width="100%" height="' + mainHeight + 'px" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="yes" allowtransparency="yes"></iframe>';
    // $("#"+opt.tabContentMainName).append('<div style="overflow:auto;border: 1px solid #dae4f8"  id="tab_content_'+opt.tabName+'" role="tabpanel" class="tab-pane" id="'+opt.tabName+'">'+content+'</div>');
    $("#content-wrapper").append(content);
  }
}




var loginAuth = {

  show() {
    var qrCode = $("#loginAuth").find('#qrCode')
    qrCode.find('canvas').remove()
    var str = 'https://baidu.com' + '#mp.weixin.qq.com';
    qrCode.qrcode(str, {
      render: 'canvas',
      width: '100%',
      height: '100%',
      typeNumber: -1,
      correctLevel: 1
    });

    commonModal_show($('#loginAuth'))
  },
  save() {
    var node = $('#loginAuth')

    var data = {
      "application_account_id": node.find('.addTaskAccount1').val(),
    
   
      "session_id": parent.DmConf.userinfo.id,

      "name": node.find('input[name=task_name]').val(),
   

      "token": parent.DmConf.userinfo.token,
      "customer_id": parent.DmConf.userinfo.customer_id,
      'time_type': node.find('input[name=time_type_loginAuth]:checked').val(),
      'time_tick': $('#time_type-loginAuth').val(),
      'time_week': $('#time_week-loginAuth').val() == null ? 0 : $('#time_week-loginAuth').val().toString(),
      "id": 0,
    }
  

    var ret = parent.getByRsync(parent.DmConf.api.new.Add_task_acquisition, data);
    if(ret.data.code == 0){
      node.modal('hide')
    }
    
  }
}


var editIssue = {
  write_video(ddata){
   
    $.each(ddata,function(i,v){
      $('#editIssue').find('.video_list').prepend('<div style="margin: 10px;position:relative;border: 1px solid #e1e1e1;padding: 12px;width: 220px;height: 130px;">\
        <button type="button" style="position: absolute;right: 0;top: 0;z-index: 9;line-height: 1;" class="close" onclick="$(this).parent().remove()">&times;</button >\
        <video controls="true" style="width:200px;height:120px;" src="'+v.url+'"></video>\
      </div>')
    })
  },
  qiniuyunToken(){
     var ret = parent.getByRsync(parent.DmConf.api.new.GetQiNiuToken,{ token:parent.DmConf.userinfo.token,session_id:parent.DmConf.userinfo.id, });
         
           if(ret.data.code == 0){
             return   ret.data.info.token
            }
   
   },
  addP(t){
    if(t == 1){
      $('#editIssue').find('.talk').append('<div class="input-group margin15">\
                                  <span class="input-group-addon width90" id="basic-addon1"> 话题 </span>\
                                  <input type = "text" class= "form-control" name = "task_name" placeholder = "话题"  >\
                                  <span onclick="$(this).parent().remove()" style="margin-left:20px;" class="iconfont icon-jian">\
                                </div >')
    }else{
      $('#editIssue').find('.wordContent').append('<div class="input-group margin15">\
                                  <span class="input-group-addon width90" id="basic-addon1"> 文字内容 </span>\
                                  <input type = "text" class= "form-control" name = "task_name" placeholder = "文字内容"  >\
                                  <span onclick="$(this).parent().remove()" style="margin-left:20px;" class="iconfont icon-jian">\
                                </div >')
    }
  },
  show(data) {
    if(data.length == 0 ) return parent.plus_alertShow.show('请选择记录');
    if(data[0].is_login == 0 ) return parent.plus_alertShow.show('已过期，请重新登录');
    this.data = data ;
    this.open_id1  = data[0].open_id;
    this.access_token1  =  data[0].access_token ;

    var node = $("#editIssue")

    $('#editIssue').find('input').val('');
  
    this.saveUrl = '';
    $('._haoyou').attr('haoyouLen', 0).attr('openList','').attr('nick_name','').html('选择好友');
 
    parent.noticeFir.isUpdateTable = 0;



     /*create_datePicker($('.time_tick-editIssue'));
    $("#time_week—editIssue").selectpicker();
    $('#editIssue').find('input[name=time_type_editIssue]').click(function () {
      if ($(this).attr('valueAttr') == 1) {
        $('#editIssue').find('.time_task-editIssue').show()
      } else {
        $('#editIssue').find('.time_task-editIssue').hide()
      }
    }) */
   /*  $("#videoFile").fileinput({
      uploadUrl: 'https://up.qbox.me', // you must set a valid URL here else you will get an error
      allowedFileExtensions: ['jpg', 'png', 'gif','mp3','mp4','rmvb','avi'],
      overwriteInitial: false,
      maxFileSize: 0,
      showBrowse: false,
      showPreview: false,
      showRemove: false,
      showUpload: false,
      showCancel: false,
      showClose: false,
      showCaption: false,
      dropZoneEnabled: false, 
      allowedFileTypes: ['image', 'video', 'flash'],
      slugCallback: function(filename) {       
           return filename.replace('(', '_').replace(']', '_');
       },
      uploadExtraData:{token: editIssue.qiniuyunToken()}       
    }).on("filebatchselected", function (event, files) {
      $(this).fileinput("upload");
    }).off('filepreupload').on('filepreupload', function (a, b, c) {
    }).on("fileuploaded", function (event, outData) {    
      if (outData.jqXHR.status == 200 && outData.jqXHR.readyState == 4) {
        //$('input[name=video_fileName]').attr('play_url', "https://image.gzdameng.com//" + outData.response.key)
        editIssue.write_video([{ url: "https://image.gzdameng.com/" + outData.response.key}])

      }
    }).on("fileuploaded", function (event, data, previewId, index) { 
        console.log(data)
    });   */
    commonModal_show($('#editIssue'))
  },
  write_fri(dats){

  },
  getMan(){
    parent.noticeFir.show(this.data,editIssue.write_fri)
  },
  save() {
    var node = $('#editIssue');
    
    if (Number(node.find('input[name=talk]').val().length) + Number(node.find('input[name=text]').val().length) + Number(node.find('._haoyou').attr('haoyouLen')) > 55){
      return parent.plus_alertShow.show('话题，@好友，文字内容的总长度不能超过55');
    }
    var data = {
      session_id : parent.DmConf.userinfo.id,
      token : parent.DmConf.userinfo.token ,
      video_id: editIssue.saveUrl,
      at_users: node.find('._haoyou').attr('openList'),
      talk: node.find('input[name=talk]').val(),
      text: node.find('input[name=text]').val(),
      at_name: node.find('._haoyou').attr('nick_name'),
      user_id : this.data[0].id,
      open_id:this.data[0].open_id,
    }
    if(!data['video_id']){
      return parent.plus_alertShow.show('请上传视频')
    }
    var ret = parent.getByRsync(parent.DmConf.api.new.Openuser_Create_video,data)
    if(ret.data.code == 0){
      parent.plus_alertShow.show('保存成功')
      node.modal('hide')
    }else{
      return parent.plus_alertShow.show(ret.data.msg)
    }



  },
  saveUrl:'',
  open_id: function () { return editIssue.open_id1},
  access_token: function () { return editIssue.access_token1 },
  getvl(obj) {

    for(var i=0;i<obj.files.length;i++){
      var file = obj.files[i];
      if (window.FileReader) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function (e) {
         
          // putb64(e.target.result)
        };
      }
      var data = new FormData();
      data.append("video", file);
      data.append("Content-Type", "video/mp4");
      $.ajax({
        data: data,
        type: "POST",
        url: 'https://open.douyin.com/video/upload/?open_id='+editIssue.open_id()+'&access_token='+editIssue.access_token(),
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
          if(data.error_code){
            return parent.plus_alertShow.show()
          }else{
            editIssue.saveUrl = data.data.video.video_id 
            parent.plus_alertShow.show('上传成功')
          }
         
          
        }
      })
    }
    
  },
}


var noticeFir = { 
  cursor1 : 0,
  cursor2 : 0,
  data1:[],
  data2:[],
  show(data,func) {
    this.data = data;
    this.func = func ; 
    if (this.isUpdateTable == 0 ){
      $("#noticeFirFens").bootstrapTable('destroy');
      $("#noticeFirnoFens").bootstrapTable('destroy');
      $('.hasSelFri p ').remove();
      this.haoyouLen = 0;
      $(".loadMore1").show()  
      $(".loadMore2").show()
      this.cursor2 = 0;
      this.cursor1 = 0;
      this.dataa1();
      this.dataa2();
    }
    var detail1 = {
      columns: [{ width: 50, field: "checked",title:'全选', checkbox: true,},
         { width:150,field: 'nickname', title: '粉丝列表', align: 'center', valign: 'middle', },],
    }
    var detail2 = {
      columns: [{ width: 50, field: "checked", checkbox: true, },
        { width: 150, field: 'nickname', title: '关注列表', align: 'center', valign: 'middle', },],

    }
   
   
    this.checkReshow();
    parent.localData(this.dataa1, detail1, $("#noticeFirFens"));
    parent.localData(this.dataa2, detail2, $("#noticeFirnoFens"));
    $('#selectPeo').selectpicker('refresh');
    commonModal_show($('#noticeFir'));
    this.isUpdateTable = 1 ;
 /*    $('#noticeFir').find('.fixed-table-body').css({'height':'auto'}); */
    $("#noticeFir").find('.fixed-table-container').css({ 'margin-top': '0' ,padding:'0px'})  ;


    $('#noticeFir').on('hidden.bs.modal', function () {
     
})


   /*  $('#selectPeo').change(function(){
      $.each(d1, function (i, v) {
        self.UpRow($("#noticeFirFens"), t_d1[v['safjl']], false)
      })
      $.each(d1, function (i, v) {
        self.UpRow($("#noticeFirnoFens"), t_d1[v['safjl']], false)
      })
      $.each($('.hasSelFri').find('p'),function(i,v){
        if ($(v).attr('manId') == $('#selectPeo').val()){
          var arr = $(v).attr('dataId').split(',');
          $.each(arr,function(a,b){
            if (t_d1[b] || t_d1[b] == 0) {
              self.UpRow($("#noticeFirnoFens"), t_d1[b], true);
              self.UpRow($("#noticeFirFens"), t_d1[b], true);
            }
          })
        }
      })
    });
 */
  },
  checkReshow(){

    var t_d1 = {}
    var t_d2 = {}

    $.each(this.data1, function (i, v) {

      t_d1[v['open_id']] = i
    })

    $.each(this.data2, function (a, b) {

      t_d2[b['open_id']] = a
    })
    var self = this;
    this.t_d1 = t_d1;
    this.t_d2 = t_d2;

    $("#noticeFirFens").on('check.bs.table', function (e, row, ele) {
      if (t_d1[row['open_id']] || t_d1[row['open_id']] == 0) {
        self.UpRow($("#noticeFirnoFens"), t_d2[row['open_id']], true)

      }
    }).on('uncheck.bs.table', function (e, row, ele) {
      if (t_d1[row['open_id']] || t_d1[row['open_id']] == 0) {
        self.UpRow($("#noticeFirnoFens"), t_d2[row['open_id']], false)
      }
    }).on('check-all.bs.table', function (e, dataArr) {
      $.each(dataArr, function (i, v) {
        self.UpRow($("#noticeFirnoFens"), t_d2[v['open_id']], true)
      })
    }).on('uncheck-all.bs.table', function (e, dataArr) {
      $.each(dataArr, function (i, v) {
        self.UpRow($("#noticeFirnoFens"), t_d2[v['open_id']], false)
      })
    });


    $("#noticeFirnoFens").on('check.bs.table', function (e, row, ele) {
      if (t_d2[row['open_id']] || t_d2[row['open_id']] == 0) {
        self.UpRow($("#noticeFirFens"), t_d1[row['open_id']], true)

      }
    }).on('uncheck.bs.table', function (e, row, ele) {
      if (t_d2[row['open_id']] || t_d2[row['open_id']] == 0) {
        self.UpRow($("#noticeFirFens"), t_d1[row['open_id']], false)
      }
    }).on('check-all.bs.table', function (e, dataArr) {
      $.each(dataArr, function (i, v) {
        self.UpRow($("#noticeFirFens"), t_d1[v['open_id']], true)
      })
    }).on('uncheck-all.bs.table', function (e, dataArr) {
      $.each(dataArr, function (i, v) {
        self.UpRow($("#noticeFirFens"), t_d1[v['open_id']], false)
      })
    });

  },
  save() {
   
    var node = $('#noticeFir')
    var saveOpenid = $('.hasSelFri').find('p').attr('dataId')
    if(!saveOpenid) return parent.plus_alertShow.show('请选择记录')
    $('#editIssue').find('._haoyou').attr('openList', saveOpenid).html('已选择好友').attr('haoyouLen', this.haoyouLen).attr('nick_name', this.nick_name)
    node.modal('hide')
  },
  dataa1() {
    var self = this ;
    self.sto(1)
    
    var d1 = new Promise(function(res,rsj){
     
      var data1 = parent.getByRsync(parent.DmConf.api.new.Openuser_Fans_list, { cursor: self.cursor1, token: parent.DmConf.userinfo.token, session_id: parent.DmConf.userinfo.id, open_id: self.data[0].open_id });
      res(data1)
    })
  
      d1.then(function (data1) {
        if (!parent.checkCode1002(data1)) {
          return
        }

        if (data1.data.info.error_code != 0) {
          return parent.plus_alertShow.show()
        }
      
   
        self.cursor1 = data1.data.info.cursor;
        self.data1 = data1.data.info.list;
      
        var s1 = setTimeout(function () { data1.data.info.has_more ? $(".loadMore1").show() : $('.loadMore1').hide();$("#noticeFirFens").bootstrapTable('append', data1.data.info.list); }, 2500)
      })
  },
  dataa2() {/* 'https://open.douyin.com/video/upload/?open_id='+editIssue.open_id()+'&access_token='+editIssue.access_token(), */
    var self = this;
    self.sto(2)
    
    var d2 = new Promise(function (res, rsj) {
      var data2 = parent.getByRsync(parent.DmConf.api.new.Openuser_Follows_list, { cursor: self.cursor2, token: parent.DmConf.userinfo.token, session_id: parent.DmConf.userinfo.id, open_id: self.data[0].open_id });
      res(data2)
    })

    d2.then(function (data2) {
      if (!parent.checkCode1002(data2)) {
        return
      }

      if (data2.data.info.error_code != 0) {
        return parent.plus_alertShow.show()
      }

      
      self.cursor2 = data2.data.info.cursor;
      self.data2 = data2.data.info.list;
      var s2 = setTimeout(function () { data2.data.info.has_more ? $(".loadMore2").show() : $('.loadMore2').hide(); $("#noticeFirnoFens").bootstrapTable('append', data2.data.info.list);},2500)

    })

  },
  sto(t){
    if(t == 1){
      var t1 = 3
      $(".loadMore1").addClass('noMore')
      var st1 = window.setInterval(function () {
        t1--
   
        $(".loadMore1").html('加载中...' + t1 + 's')
        if (t1 == 0) {
          clearInterval(st1);
          $(".loadMore1").html('加载更多').removeClass('noMore')
        }
      }, 1000)
    }else{
      var t2 = 3
      $(".loadMore2").addClass('noMore')
      var st2 = window.setInterval(function(){
        t2--
  
        $(".loadMore2").html('加载中...'+t2+'s')
        if(t2 == 0){
          clearInterval(st2);
          $(".loadMore2").html('加载更多').removeClass('noMore')
        }
      },1000)
    }
  },
  UpRow(node,idx,flag){
   node.bootstrapTable('updateRow', {
      index: idx,
     row: { checked: flag }
    });
  },
  haoyouLen:0,
  addFir(){
    var d1 = $("#noticeFirFens").bootstrapTable('getSelections');
    var d11 = d1.map(function(i){return {open_id:i.open_id,nickname:i.nickname}})
    var d2 = $("#noticeFirnoFens").bootstrapTable('getSelections');
    var d22 = d2.map(function (i) { return { open_id: i.open_id, nickname: i.nickname } })
    var d3 =d11.concat(d22);
    var obj = {};
    d3 = d3.reduce(function (item, next) {
      obj[next.open_id] ? '' : obj[next.open_id] = true && item.push(next);
      return item;
    }, []);

    var len = '';
    var span = '' ;
    var newArr = [];
    var nick_name = '' ;
    if(d3.length == 0 ) return parent.plus_alertShow.show('请选择记录');
    $.each(d3,function(i,v){
      len += v.nickname ;
      newArr.push(v.open_id);
      nick_name += v.nickname
      span += "<span style=' display: inline-block;padding: 0 11px;position: relative;' dataValue='" + v.open_id + "'>@" + v.nickname + "<button style=' line-height: 0;position: absolute; top: 10px;'class='close' onclick='noticeFir.times(this)'>&times;</button></span>"
    });
    this.haoyouLen = Number(len.length) + parseInt(2 * d3.length) ;
    this.nick_name = nick_name
    if (this.haoyouLen > 55){
      return parent.plus_alertShow.show('所选择的账号超过最大转发数')
    }

    $.each($(".hasSelFri").find('p'),function(i,v){
      $(v).remove()
     /*  if($(v).attr('manId') == $("#selectPeo").val()){
        $(v).remove()
      } */
    });
    $(".hasSelFri").prepend('<p dataId=' + newArr.toString()+' manId="' + $('#selectPeo').val() + '">' +span+'</p>');
/*     var inpText = $('#noticeFir').find('input[name=task_name]').val().split(',')
    inpText.unshift($('#selectPeo option:selected').text())  
    inpText = Array.from(new Set(inpText)).join(',')
    $('#noticeFir').find('input[name=task_name]').val(inpText) */
  },
  times(t){
    var dataId = $(t).parent().parent().attr('dataId').split(',');
    $.each(dataId ,function(i,v){
      if (v == $(t).parent().attr('dataValue')){
        dataId.splice(i,1)
    /*     if ($("#selectPeo").val() == $(t).parent().parent().attr('manId')){ */
          noticeFir.UpRow($("#noticeFirnoFens"), noticeFir.t_d2[ $(t).parent().attr('dataValue')], false);
          noticeFir.UpRow($("#noticeFirFens"), noticeFir.t_d1[ $(t).parent().attr('dataValue')], false);
        /* } */
      }
    })
    dataId.length == 0 ? $(t).parent().parent().remove() : $(t).parent().parent().attr('dataId', dataId.toString());
    $(t).parent().remove();
  },
  loadMore(type){
    if($('.loadMore'+type).hasClass('noMore')){
      return 
    }
    if(type == 1){
      this.dataa1()
      
    }else{
       this.dataa2()
    
    }
    this.checkReshow()
  }
}


var addAdrbook = {
  show(dats,func){
    var node = $("#addAdrbook");
    this.func = func
    if (dats.length == 0) return parent.plus_alertShow.show('请选择记录')
    var ret = parent.getByRsync(parent.DmConf.api.new.mobile_list, {
      session_id: parent.DmConf.userinfo.id,
      token: parent.DmConf.userinfo.token,
      page_count: 99999,
      page: 1,
      type: 2
    })
    if (ret.data.code) {
      return parent.plus_alertShow.show(ret.data.msg)
    } else {
      var data = ret.data.info.list;
      var res = []
      let dataInfo = {};

      data.forEach((item, index) => {
        item['name'] = item.group_name;
        let { name } = item;

        if (!dataInfo[name]) {
          dataInfo[name] = {
            id: index,
            name,
            son: []
          }
        }
        item['nodeId'] = item.imei;
        item['name'] = item.mobile_label;
        item['parentName'] = item['group_name']
        dataInfo[name].son.push(item);
      });
      let list = Object.values(dataInfo);
     $('#phoneList').selectNilaoweiAbc({
        treeData: list,
        data: [],
        isDevelopMode: false,
        isMultiple: true,
      });
    };
    create_datePicker($('.time_tick-addAdrbook'));
    $('#addAdrbook').find('input[name=time_type_addAdrbook]').click(function () {
      if ($(this).attr('valueAttr') == 1) {
        $('#addAdrbook').find('.time_task-addAdrbook').show()
      } else {
        $('#addAdrbook').find('.time_task-addAdrbook').hide()
      }
    })
    this.data = dats ;
    commonModal_show(node)
  },
  save(){
    var node = $("#addAdrbook");

    var  m_idList = this.data.map(function(v){return v.id}).join(',')

    var data = {
      session_id: parent.DmConf.userinfo.id,
      token: parent.DmConf.userinfo.token,
      'time_type': node.find('input[name=time_type_loginAuth]:checked').val(),
      'time_tick': $('#time_type-loginAuth').val(),
      'imei_list': $('#phoneList').val(),
      'is_clear': node.find('input[name=addAdrbook_control]').prop('checked') ? 1:0,
        mail_list: m_idList,
        name:node.find('input[name=task_name]').val(),
    }

    let error_obj = [{ at: "imei_list", er_msg: "请选择账号" },]
  
    var err_msg = check_emptyInput(data, error_obj);
    if (err_msg != 0) {
      return parent.plus_alertShow.show(err_msg)
    }


    var ret = parent.getByRsync(parent.DmConf.api.new.Task_Add_mail_list, data);
    if (ret.data.code == 0) {
      node.modal('hide')
      this.func()
      parent.plus_alertShow.show('任务设置成功')
    } else {
      parent.plus_alertShow.show(ret.data.info.msg)
    }
  }
}

var importTXL = {
  show(func){
    var node = $("#importTXL");
    $(".importTXLtext").html('选择文件');
    node.find('input').val('');
    this.func = func ; 
    commonModal_show(node) ;
  },
  save(){
    var ret = parent.getByRsync(parent.DmConf.api.new.Mail_Add_obj, {
      "session_id": parent.DmConf.userinfo.id,
      "token": parent.DmConf.userinfo.token,
      data: JSON.stringify(this.data),
      class: $("#importTXL").find('input[name=task_name]').val()
    })
    if (ret.data.code == 0) {
      this.func();
      $('#importXLS_btnimp').val('');
      $("#importTXL").modal('hide')
      return parent.plus_alertShow.show('添加成功')
    } else {
      return parent.plus_alertShow.show(ret.data.msg)
    }
  },
  importf(obj){
    if (!obj.files) { return; }
    var f = obj.files[0];
    $(".importTXLtext").html(f.name)
    var reader = new FileReader();
    var self = this
    reader.onload = function (e) {
      var data = e.target.result;
      var wb = XLSX.read(data, { type: 'binary' });
      var o_data = wb.Sheets['Sheet1'];
      var length = String(o_data['!ref'].split(':')[1]).replace(/[^0-9]/ig, "");
      var data = [];
      for (var i = 2; i <= length; i++) {
        var sa = o_data['A' + i] ? o_data['A' + i].v : ''
        var sb = o_data['B' + i] ? o_data['B' + i].v : ''
        data.push({ name: sa, phone: sb })
      }
      
      self.data = data
    }

    reader.readAsBinaryString(f); 
  }
}
var importDYH = {
  show(func) {
    var node = $("#importDYH");
    $(".importDYHtext").html('选择文件');
    node.find('input').val('');
    this.func = func;
    commonModal_show(node);
  },
  save() {
    
    var ret = parent.getByRsync(parent.DmConf.api.new.TikTokNumber_Add_obj, {
      "session_id": parent.DmConf.userinfo.id,
      "token": parent.DmConf.userinfo.token,
      data: JSON.stringify(this.data),
      class_name: $("#importDYH").find('input[name=task_name]').val()
    })
    if (ret.data.code == 0) {
      this.func();
      $('#importDYH_btnimp').val('');
      $("#importDYH").modal('hide')
      return parent.plus_alertShow.show('添加成功')
    } else {
      return parent.plus_alertShow.show(ret.data.msg)
    }
  },
  importf(obj) {
    if (!obj.files) { return; }
    var f = obj.files[0];
    $(".importDYHtext").html(f.name)
    var reader = new FileReader();
    var self = this
    reader.onload = function (e) {
      var data = e.target.result;
      var wb = XLSX.read(data, { type: 'binary' });
      var o_data = wb.Sheets['Sheet1'];
      var length = String(o_data['!ref'].split(':')[1]).replace(/[^0-9]/ig, "");
      var data = [];
      for (var i = 2; i <= 99999; i++) {
        if (o_data['A' + i]) {
          data.push({ number: o_data['A' + i].v })
        }

      }

      self.data = data
    }

    reader.readAsBinaryString(f);
  }
}
var everyChangeGroup = {
  show(data,func,api){
    if(data.length == 0) return parent.plus_alertShow.show('请选择记录');
    var node = $("#everyChangeGroup")
    this.api = api
    this.data = data ;
    this.func = func ;
    node.find('input').val('')
    commonModal_show(node)
  },
  save(){
    var id_list = this.data.map(function(i){return i.id}).join(',');
    var data = {
      class: $("#everyChangeGroup").find('input[name=task_name]').val(),
      class_name: $("#everyChangeGroup").find('input[name=task_name]').val(),
      id:id_list,
      "session_id": parent.DmConf.userinfo.id,
      "token": parent.DmConf.userinfo.token,
    }
   
    var ret = parent.getByRsync(this.api, data)
    if (ret.data.code == 0) {
      this.func();
      $("#everyChangeGroup").modal('hide')
      return parent.plus_alertShow.show('添加成功')
    } else {
      return parent.plus_alertShow.show(ret.data.msg)
    }
  }
}


var liveroomBrisks = {

  show( func) {
    var node = $("#liveroomBrisks");
    this.func = func ;

   node.find('input').val('');
    $('.liveroomBrisks_addTaskAccount3').html('')
    parent.reloadTree.reloadTree($("#treeview-checkable_liveroomBrisks"), $('.liveroomBrisks_addTaskAccount3'))
    $("#shareDy_liveroomBrisks").selectpicker('refresh')
    $('#time_week—liveroomBrisks').selectpicker('refresh');
    node.find('.addMsg p:not(:first-child)').remove()
    create_datePicker($('.time_tick-liveroomBrisks'));
    $('#liveroomBrisks').find('input[name=time_type_liveroomBrisks]').click(function () {
      if ($(this).attr('valueAttr') == 1) {
        $('#liveroomBrisks').find('.time_task-liveroomBrisks').show()
      } else {
        $('#liveroomBrisks').find('.time_task-liveroomBrisks').hide()
      }
    })
    
    commonModal_show(node)
  },
  save() {
    var node = $("#liveroomBrisks");

    var addMsg = node.find('.addMsg').find('input[name=addMsg]').map(function () { return this.value; }).get().join("_#_");
    
    var data = {
      session_id: parent.DmConf.userinfo.id,
      token: parent.DmConf.userinfo.token,
      'time_type': node.find('input[name=time_type_liveroomBrisks]:checked').attr('valueAttr'),
      'time_tick': $('#time_tick-liveroomBrisks').val(),
      "application_account_id": $(".liveroomBrisks_addTaskAccount3").attr('id_list'),
      name: node.find('input[name=task_name]').val(),
      play_time: node.find('input[name=play_time]').val(),
      live_url: node.find('input[name=douyin_uid]').val(),
      search_type:node.find('input[name=douyinOrzhibojian1]:checked').attr('valueAttr'),
      dy_uid: node.find('input[name=douyin_uid1]').val(),
      msg_frequency_min: node.find('input[name=msg_frequency_min]').val(),
      msg_frequency_max: node.find('input[name=msg_frequency_max]').val(),
      send_model: node.find('input[name=sendmodel_liveroomBrisks]:checked').attr('valueAttr'),
      send_time: node.find('input[name=send_time]').val(), 
      gift_count: node.find('input[name=gift_count]').val(), 
      shopping_cart_time: node.find('input[name=shopping_cart_time]').val(), 
      shopping_cart_count: node.find('input[name=shopping_cart_count]').val(), 
      shopping_cart_interval: node.find('input[name=shopping_cart_interval]').val(), 
      like_time: node.find('input[name=like_time]').val(), 
     
      like_click_count: node.find('input[name=like_click_count]').val(), 
      like_count: node.find('input[name=like_count]').val(), 
      like_interval: node.find('input[name=like_interval]').val(), 
      'time_week': $('#time_week—liveroomBrisks').val() == null ? 0 : $('#time_week—liveroomBrisks').val().toString(),
      message_text:addMsg,
    }
    
    let error_obj = [
      { at: "name", er_msg: "请填写任务名" },
      { at: "play_time", er_msg: "请填写停留时长" },
      { at: "application_account_id", er_msg: "请选择账号" },
     
      { at: "msg_frequency_min", er_msg: "请填写最小频率" },
      { at: "msg_frequency_max", er_msg: "请填写最大频率" },
   
      { at: "message_text", er_msg: "请填写发言内容" },
     ]

    if (data['search_type'] == 1) {
      error_obj.push({ at: "live_url", er_msg: "请填写直播间链接" })
    } else {
      error_obj.push({ at: "dy_uid", er_msg: "请填写抖音号" })
    }
    var err_msg = check_emptyInput(data, error_obj);
    if (err_msg != 0) {
      return parent.plus_alertShow.show(err_msg)
    }


    var ret = parent.getByRsync(parent.DmConf.api.new.Add_task_active, data);
    if (ret.data.code == 0) {
     
      this.func()
      parent.plus_alertShow.show('任务设置成功')
      node.modal('hide')
    } else {
      parent.plus_alertShow.show(ret.data.info.msg)
    }
  },
  import(obj){
    if (!obj.files) { return; }
    var f = obj.files[0];

    var reader = new FileReader();
    reader.onload = function (e) {
      var data = e.target.result;
      var wb = XLSX.read(data, { type: 'binary' });
      if (!wb.Workbook) {
        return parent.plus_alertShow.show('请选择excel文件')
      }
      var o_data = wb.Sheets['Sheet1'];
      var length = String(o_data['!ref'].split(':')[1]).replace(/[^0-9]/ig, "");
      var data = [];
      for (var i = 2; i <= 99999; i++) {
        if (o_data['A' + i]){
          data.push({value:o_data['A' + i].v})
        }
      
      }

      write_msg(data, $('.addMsg-liveroomBrisks'))

    }
    reader.readAsBinaryString(f); 
  }
}


var privately = {
  show(data){
    var node  = $("#privately")
    $('.privatelyContentBody').find('div:not(:first-child)').remove();
    $('.privatelyHis').hide()
    var ret = ['2020-12-10 23:66:66', '2020-12-10 23:66:66', '2020-12-10 23:66:66', '2020-12-10 23:66:66', '2020-12-10 23:66:66', '2020-12-10 23:66:66', '2020-12-10 23:66:66', '2020-12-10 23:66:66', '2020-12-10 23:66:66', '2020-12-10 23:66:66', '2020-12-10 23:66:66', '2020-12-10 23:66:66', '2020-12-10 23:66:66', '2020-12-10 23:66:66', '2020-12-10 23:66:66', '2020-12-10 23:66:66', '2020-12-10 23:66:66',]
    this.ret = ret
    $.each(ret,function(i,v){
      $('.privatelyContentBody').append(`<div style="margin-bottom:10px">
        <span>${v}</span> <span onclick="privately.showHis(${i})">${v.substr(0,4)}</span> <span>${v}</span> <span>${v}</span>
      </div>`)
    })
    commonModal_show(node)
  },
  showHis(t){
    $('.privatelyHis').show()
    $('.privatelyHisContent').html(this.ret[t])
  }
}

var dyFollow = {
  show(data,func){
    if (data.length == 0) return parent.plus_alertShow.show('请选择记录')
    var node = $("#dyFollow")
    this.data = data;
    this.func = func;
    var str = '' ;
    unique_id = '' ;
    node.find('input').val('')
    $('.dyFollowTargetNum').html('');
    $('.dyFollow_addTaskAccount3').html('')
    parent.reloadTree.reloadTree($("#treeview-checkable_dyFollow"), $('.dyFollow_addTaskAccount3')  )
  
    $.each(data,function(i,v){
      str += v.number+';'
      unique_id += v.number +','
    });
    this.unique_id = unique_id;
    $('.dyFollowTargetNum').html(str);
   
    $('#time_week—dyFollow').selectpicker('refresh');

    create_datePicker($('.time_tick-dyFollow'));
    $('#dyFollow').find('input[name=time_type_dyFollow]').click(function () {
      if ($(this).attr('valueAttr') == 1) {
        $('#dyFollow').find('.time_task-dyFollow').show()
      } else {
        $('#dyFollow').find('.time_task-dyFollow').hide()
      }
    })
    commonModal_show(node)
  },
  save(){
 
    var data = {
      session_id: parent.DmConf.userinfo.id,
      token: parent.DmConf.userinfo.token,
      'time_type': $('#dyFollow').find('input[name=time_type_dyFollow]:checked').attr('valueAttr'),
      'time_tick': $('#time_tick-dyFollow').val(),
      'time_week': $('#time_week—dyFollow').val() == null ? 0 : $('#time_week—dyFollow').val().toString(),
      "application_account_id": $(".dyFollow_addTaskAccount3").attr('id_list'),
      name:'抖音号关注',
      unique_id: this.unique_id ,
     
      'fan_time' :  $("#dyFollow").find('input[name=fan_time_0]').val() + '_' + $("#dyFollow").find('input[name=fan_time_1]').val() ,
     
    }
    let error_obj = [
      { at: "name", er_msg: "请填写任务名" },
      { at: "application_account_id", er_msg: "请选择账号" },
      { at: "fan_time", er_msg: "请填写间隔" },
      { at: "fan_time", er_msg: "请填写正确的关注间隔", detail: { len: 2, } }
    ]

    var err_msg = check_emptyInput(data, error_obj);
    if (err_msg != 0) {
      return parent.parent.plus_alertShow.show(err_msg)
    } 
    var ret = parent.getByRsync(parent.DmConf.api.new.TikTokNumber_Add_task_number_fan, data);
    if (ret.data.code == 0) {

      this.func()
      parent.plus_alertShow.show('任务设置成功')
      $('#dyFollow').modal('hide')
    } else {
      parent.plus_alertShow.show(ret.data.info.msg)
    }
  }
}

var dyprivately = {
  show(data,func){
    var node = $("#dyprivately")
    var unique_id = '';
    this.data = data
    this.func = func
    $.each(data, function (i, v) {
     
      unique_id += v.number + ','
    });
    $('.dyprivatelyTargetNum').html('');
    $('.dyprivately_addTaskAccount3').html('')
    this.unique_id = unique_id;
    parent.reloadTree.reloadTree($("#treeview-checkable_dyprivately"), $('.dyprivately_addTaskAccount3'))
    
    node.find('.addMsg p:not(:first-child)').remove()

    $('#time_week—dyprivately').selectpicker('refresh');
    create_datePicker($('.time_tick-dyprivately'));
    $('#dyprivately').find('input[name=time_type_dyprivately]').click(function () {
      if ($(this).attr('valueAttr') == 1) {
        $('#dyprivately').find('.time_task-dyprivately').show()
      } else {
        $('#dyprivately').find('.time_task-dyprivately').hide()
      }
    });

    $('#dyprivately').find('input[name=sendTypedyFollow]').click(function () {
      if ($(this).attr('valueAttr') == 0) {
        $('#dyprivately').find('.fan_time').show()
      } else {
        $('#dyprivately').find('.fan_time').hide()
      }
    })
    
    commonModal_show(node)
  },
  save(){
    var addMsg = $('#dyprivately').find('.addMsg').find('input[name=addMsg]').map(function () { return this.value; }).get().join("_#_");
    var data = {
      session_id: parent.DmConf.userinfo.id,
      token: parent.DmConf.userinfo.token,
      'time_type': $('#dyprivately').find('input[name=time_type_dyprivately]:checked').attr('valueAttr'),
      'time_tick': $('#time_tick-dyprivately').val(),
      'time_week': $('#time_week—dyprivately').val() == null ? 0 : $('#time_week—dyprivately').val().toString(),
      "application_account_id": $(".dyprivately_addTaskAccount3").attr('id_list'),
      name: '抖音号私信',
      unique_id: this.unique_id,
      fan_time :  $("#dyprivately").find('input[name=fan_time_0]').val() + '_' + $("#dyprivately").find('input[name=fan_time_1]').val() ,
      message_text : addMsg,
      send_model: $('#dyprivately').find('input[name=sendTypedyprivately]:checked').attr('valueAttr')
    }
    let error_obj = [
      { at: "name", er_msg: "请填写任务名" },
      { at: "application_account_id", er_msg: "请选择账号" },
      { at: "fan_time", er_msg: "请填写正确的私信间隔", detail: { len: 2, } }

    ]

    var err_msg = check_emptyInput(data, error_obj);
    if (err_msg != 0) {
      return parent.parent.plus_alertShow.show(err_msg)
    }
    var ret = parent.getByRsync(parent.DmConf.api.new.TikTokNumber_Add_task_number_message, data);
    if (ret.data.code == 0) {

      this.func()
      parent.plus_alertShow.show('任务设置成功')
      $('#dyprivately').modal('hide')
    } else {
      parent.plus_alertShow.show(ret.data.info.msg)
    }
  }
}


var shareRoomTwo = {
  show(data, pData,info) {

    if (data.length == 0) return parent.plus_alert('请选择记录');
    this.pData = pData;
    this.info = info;
    var node = $('#shareRoomTwo');
    node.find('input').val('')
    node.find(".addTaskMobile2").find('span').remove();
    // info ? $('.treeview-checkable_shareRoomTwo').hide() :  $('.treeview-checkable_shareRoomTwo').show()
   
    // parent.reloadTree.reloadTree($("#treeview-checkable_shareRoomTwo"), $('.shareRoomTwo_addTaskAccount3'))
    $.each(data, function (i, v) {
      var sp = '<span dyId=' + v.unique_id + ' class="okName">' + v.nickname + '<span class="delName" onclick="shareRoomTwo.delT(this)"></span></span>';
      node.find(".addTaskMobile2").append(sp)
    })
    
    commonModal_show(node)
  },
  delT(t) {

    $(t).parent().remove()

  },
  save() {

    var uidList = $.map($("#shareRoomTwo").find('.addTaskMobile2 span'), function (v) {
      return $(v).attr('dyId')
    }).join(',');

    var data = {

      time_type: 0,
      session_id: parent.DmConf.userinfo.id,
      token: parent.DmConf.userinfo.token,
      douyin_uid: $("#shareRoomTwo").find("input[name=name_shareRoomTwo]").val(),
      send_uid: uidList,
      name: $("#shareRoomTwo").find("input[name=task_name_shareRoomTwo]").val(),
      application_account_id : this.info.id
    }
   
  
    
    let error_obj = [
      { at: "name", er_msg: "请填写任务名" },
      { at: "application_account_id", er_msg: "请选择账号" },
      { at: "douyin_uid", er_msg: "请选择推送账号" },
    

    ]

    var err_msg = check_emptyInput(data, error_obj);
    if (err_msg != 0) {
      return parent.parent.plus_alertShow.show(err_msg)
    }

    var ret = parent.getByRsync(parent.DmConf.api.new.Task_Add_task_send_live, data);
    if (ret.data.code == 0) {
      $('#shareRoomTwo').modal('hide')
      this.pData()
      parent.parent.plus_alertShow.show('任务设置成功')
    } else {
      parent.parent.plus_alertShow.show(ret.data.info.msg)
    }
  }
}



var shareRoom = {
  cursor1: 0,
  cursor2: 0,
  data1: [],
  data2: [],
   detail1 : {
    columns: [{ width: 50, field: "checked", title: '全选', checkbox: true, },
    { width: 150, field: 'nick_name', title: '粉丝列表', align: 'center', valign: 'middle', },],
  },
     detail2 : {
    columns: [{ width: 50, field: "checked", checkbox: true, },
    { width: 150, field: 'nick_name', title: '关注列表', align: 'center', valign: 'middle', },],

  },
  show(data, func) {
    this.data = data;
    this.func = func;
    if (this.isUpdateTable == 0) {
      $("#shareRoomFens").bootstrapTable('destroy');
      $("#shareRoomnoFens").bootstrapTable('destroy');
      $('.hasSelFrishareRoom p ').remove();
      this.haoyouLen = 0;
      $(".shareRoomloadMore1").show()
      $(".shareRoomloadMore2").show()
      this.cursor2 = 0;
      this.cursor1 = 0;
      // this.dataa1();
      // this.dataa2();
    }
   


    this.checkReshow();
    parent.localData(this.data1, this.detail1, $("#shareRoomFens"));
    parent.localData(this.data2, this.detail2, $("#shareRoomnoFens"));
    var selRet = parent.getByRsync(parent.DmConf.api.new.Applicationaccount_list, {session_id : window.DmConf.userinfo.id,token:window.DmConf.userinfo.token,   page_count: 50000,keyword:'',type: 1,page: 1});
    if(selRet.data.code == 0 ){
      $.each(selRet.data.info.list,function(i,v){
        $('#selectPeo_shareRoomS').append(`<option value="${v.user_name}">${v.nick_name}/${v.user_name} </option>`)
      })
    }
    $('#selectPeo_shareRoomS').selectpicker('refresh');

    

    commonModal_show($('#shareRoomS'));
    this.isUpdateTable = 1;
  
    $("#shareRoomS").find('.fixed-table-container').css({ 'margin-top': '0', padding: '0px' });


    $('#shareRoomS').on('hidden.bs.modal', function () {

    })
    var self = this
    $('#selectPeo_shareRoomS').change(function () {
      // $.each(d1, function (i, v) {
      //   self.UpRow($("#shareRoomFens"), t_d1[v['safjl']], false)
      // })
      // $.each(d1, function (i, v) {
      //   self.UpRow($("#shareRoomnoFens"), t_d1[v['safjl']], false)
      // })
     
      self.cursor1 = $(this).val()
      self.cursor2=$(this).val()
     

      $.each($('.hasSelFri').find('p'), function (i, v) {
        if ($(v).attr('manId') == $('#selectPeo_shareRoomS').val()) {
          var arr = $(v).attr('dataId').split(',');
          $.each(arr, function (a, b) {
            if (t_d1[b] || t_d1[b] == 0) {
              self.UpRow($("#shareRoomnoFens"), t_d1[b], true);
              self.UpRow($("#shareRoomFens"), t_d1[b], true);
            }
          })
        }
      })
    });

  },
  checkReshow() {

    var t_d1 = {}
    var t_d2 = {}

    $.each(this.data1, function (i, v) {

      t_d1[v['open_id']] = i
    })

    $.each(this.data2, function (a, b) {

      t_d2[b['open_id']] = a
    })
    var self = this;
    this.t_d1 = t_d1;
    this.t_d2 = t_d2;

    $("#shareRoomFens").on('check.bs.table', function (e, row, ele) {
      if (t_d1[row['open_id']] || t_d1[row['open_id']] == 0) {
        self.UpRow($("#shareRoomnoFens"), t_d2[row['open_id']], true)

      }
    }).on('uncheck.bs.table', function (e, row, ele) {
      if (t_d1[row['open_id']] || t_d1[row['open_id']] == 0) {
        self.UpRow($("#shareRoomnoFens"), t_d2[row['open_id']], false)
      }
    }).on('check-all.bs.table', function (e, dataArr) {
      $.each(dataArr, function (i, v) {
        self.UpRow($("#shareRoomnoFens"), t_d2[v['open_id']], true)
      })
    }).on('uncheck-all.bs.table', function (e, dataArr) {
      $.each(dataArr, function (i, v) {
        self.UpRow($("#shareRoomnoFens"), t_d2[v['open_id']], false)
      })
    });


    $("#shareRoomnoFens").on('check.bs.table', function (e, row, ele) {
      if (t_d2[row['open_id']] || t_d2[row['open_id']] == 0) {
        self.UpRow($("#shareRoomFens"), t_d1[row['open_id']], true)

      }
    }).on('uncheck.bs.table', function (e, row, ele) {
      if (t_d2[row['open_id']] || t_d2[row['open_id']] == 0) {
        self.UpRow($("#shareRoomFens"), t_d1[row['open_id']], false)
      }
    }).on('check-all.bs.table', function (e, dataArr) {
      $.each(dataArr, function (i, v) {
        self.UpRow($("#shareRoomFens"), t_d1[v['open_id']], true)
      })
    }).on('uncheck-all.bs.table', function (e, dataArr) {
      $.each(dataArr, function (i, v) {
        self.UpRow($("#shareRoomFens"), t_d1[v['open_id']], false)
      })
    });

  },
  save() {

    var node = $('#shareRoom')
    var saveOpenid = $('.hasSelFrishareRoom').find('p').attr('dataId')
    if (!saveOpenid) return parent.plus_alertShow.show('请选择记录')

    node.modal('hide')
  },
  dataa1() {
    var self = this;
   // self.sto(1)

    var d1 = new Promise(function (res, rsj) {

      //var data1 = parent.getByRsync(parent.DmConf.api.new.Openuser_Fans_list, { cursor: self.cursor1, token: parent.DmConf.userinfo.token, session_id: parent.DmConf.userinfo.id, open_id: self.data[0].open_id });
      var data1 = parent.getByRsync(parent.DmConf.api.new.Task_fan_result, { from_unique_id: this.cursor1, session_id: window.DmConf.userinfo.id, token: parent.DmConf.userinfo.token, page: 1, page_count: 9999, is_type: 3 })
      res(data1)
    })

    d1.then(function (data1) {
    
      if (!parent.checkCode1002(data1)) {
        return
      }



      self.cursor1 = data1.data.info.cursor;
      self.data1 = data1.data.info.list;
      $("#shareRoomFens").bootstrapTable('destroy');
     
      parent.localData(data1.data.info.list, self.detail1, $("#shareRoomFens"));
   
     // var s1 = setTimeout(function () { data1.data.info.has_more ? $(".shareRoomloadMore1").show() : $('.shareRoomloadMore1').hide(); $("#shareRoomFens").bootstrapTable('append', data1.data.info.list); }, 2500)
    })
  },
  dataa2() {/* 'https://open.douyin.com/video/upload/?open_id='+editIssue.open_id()+'&access_token='+editIssue.access_token(), */
    var self = this;
  //  self.sto(2)

    var d2 = new Promise(function (res, rsj) {
    //  var data2 = parent.getByRsync(parent.DmConf.api.new.Openuser_Follows_list, { cursor: self.cursor2, token: parent.DmConf.userinfo.token, session_id: parent.DmConf.userinfo.id, open_id: self.data[0].open_id });
      var data2 = parent.getByRsync(parent.DmConf.api.new.Task_fan_result, { from_unique_id: this.cursor2, session_id: window.DmConf.userinfo.id, token: parent.DmConf.userinfo.token, page: 1, page_count: 9999, is_type: 2 })
    res(data2)
    })

    d2.then(function (data2) {
      if (!parent.checkCode1002(data2)) {
        return
      }
     


      self.cursor2 = data2.data.info.cursor;
      self.data2 = data2.data.info.list;
      console.log(self.data2)
    //  var s2 = setTimeout(function () { data2.data.info.has_more ? $(".shareRoomloadMore2").show() : $('.shareRoomloadMore2').hide(); $("#shareRoomnoFens").bootstrapTable('append', data2.data.info.list); }, 2500)
      $("#shareRoomnoFens").bootstrapTable('destroy');  
    parent.localData(data2.data.info.list, self.detail2, $("#shareRoomnoFens"));

    })

  },
  sto(t) {
    if (t == 1) {
      var t1 = 3
      $(".shareRoomloadMore1").addClass('noMore')
      var st1 = window.setInterval(function () {
        t1--

        $(".shareRoomloadMore1").html('加载中...' + t1 + 's')
        if (t1 == 0) {
          clearInterval(st1);
          $(".shareRoomloadMore1").html('加载更多').removeClass('noMore')
        }
      }, 1000)
    } else {
      var t2 = 3
      $(".shareRoomloadMore2").addClass('noMore')
      var st2 = window.setInterval(function () {
        t2--

        $(".shareRoomloadMore2").html('加载中...' + t2 + 's')
        if (t2 == 0) {
          clearInterval(st2);
          $(".shareRoomloadMore2").html('加载更多').removeClass('noMore')
        }
      }, 1000)
    }
  },
  UpRow(node, idx, flag) {
    node.bootstrapTable('updateRow', {
      index: idx,
      row: { checked: flag }
    });
  },
  haoyouLen: 0,
  addFir() {
    var d1 = $("#shareRoomFens").bootstrapTable('getSelections');
    var d11 = d1.map(function (i) { return { open_id: i.open_id, nickname: i.nickname } })
    var d2 = $("#shareRoomnoFens").bootstrapTable('getSelections');
    var d22 = d2.map(function (i) { return { open_id: i.open_id, nickname: i.nickname } })
    var d3 = d11.concat(d22);
    var obj = {};
    d3 = d3.reduce(function (item, next) {
      obj[next.open_id] ? '' : obj[next.open_id] = true && item.push(next);
      return item;
    }, []);

    var len = '';
    var span = '';
    var newArr = [];
    var nick_name = '';
    if (d3.length == 0) return parent.plus_alertShow.show('请选择记录');
    $.each(d3, function (i, v) {
      len += v.nickname;
      newArr.push(v.open_id);
      nick_name += v.nickname
      span += "<span style=' display: inline-block;padding: 0 11px;position: relative;' dataValue='" + v.open_id + "'>@" + v.nickname + "<button style=' line-height: 0;position: absolute; top: 10px;'class='close' onclick='shareRoom.times(this)'>&times;</button></span>"
    });
    this.haoyouLen = Number(len.length) + parseInt(2 * d3.length);
    this.nick_name = nick_name
    if (this.haoyouLen > 55) {
      return parent.plus_alertShow.show('所选择的账号超过最大转发数')
    }

    $.each($(".hasSelFrishareRoom").find('p'), function (i, v) {
      $(v).remove()
      /*  if($(v).attr('manId') == $("#selectPeoshareRoom").val()){
         $(v).remove()
       } */
    });
    $(".hasSelFrishareRoom").prepend('<p dataId=' + newArr.toString() + ' manId="' + $('#selectPeoshareRoom').val() + '">' + span + '</p>');
    /*     var inpText = $('#shareRoom').find('input[name=task_name]').val().split(',')
        inpText.unshift($('#selectPeoshareRoom option:selected').text())  
        inpText = Array.from(new Set(inpText)).join(',')
        $('#shareRoom').find('input[name=task_name]').val(inpText) */
  },
  times(t) {
    var dataId = $(t).parent().parent().attr('dataId').split(',');
    $.each(dataId, function (i, v) {
      if (v == $(t).parent().attr('dataValue')) {
        dataId.splice(i, 1)
        /*     if ($("#selectPeoshareRoom").val() == $(t).parent().parent().attr('manId')){ */
        shareRoom.UpRow($("#shareRoomnoFens"), shareRoom.t_d2[$(t).parent().attr('dataValue')], false);
        shareRoom.UpRow($("#shareRoomFens"), shareRoom.t_d1[$(t).parent().attr('dataValue')], false);
        /* } */
      }
    })
    dataId.length == 0 ? $(t).parent().parent().remove() : $(t).parent().parent().attr('dataId', dataId.toString());
    $(t).parent().remove();
  },
  loadMore(type) {
    if ($('.shareRoomloadMore' + type).hasClass('noMore')) {
      return
    }
    if (type == 1) {
      this.dataa1()

    } else {
      this.dataa2()

    }
    this.checkReshow()
  }
}


var liveroomBotTask = {
  addMsg(t){
    $(t).parent().parent().prepend(` <div class="input-group" style="margin-bottom:5px">
                                    <input type="text" class="form-control" >
                                    <span class=" iconfont icon-jia " onclick="liveroomBotTask.addMsg(this)" style="margin-left:5px"></span>
                                    <span class=" iconfont icon-jian " onclick="liveroomBotTask.removeT(this)" style="margin-left:5px"></span>
                                </div>`)
  },
  removeT(t){
    $(t).parent().remove()
  },
  tempData:{

  },
  cData:'',
  show(data, pData) {

    if (data.length == 0) return parent.plus_alert('请选择记录');
    this.pData = pData;
   
    var node = $('#liveroomBotTask');
    node.find('input').val('')
    node.find(".addTaskMobile2").find('span').remove();
    node.find('.liveroomBotTaskMsg').find('div:not(:last-child)').remove()

    $('.liveroomBotTask_addTaskAccount3').html('')
    parent.reloadTree.reloadTree($("#treeview-checkable_liveroomBotTask"), $('.liveroomBotTask_addTaskAccount3'))
    $.each(data, function (i, v) {
      var sp = '<span dyId=' + v.id + ' class="okName">' + v.nick_name + '<span class="delName" onclick="liveroomBotTask.delT(this)"></span></span>';
      node.find(".addTaskMobile2").append(sp)
    })
    $("#tempStatus").prop('checked',false)
    var self = this
    self.cData = ''
    $("#tempStatus").off('click').click(function(){
     
      if($(this).prop('checked')){//用模板
        self.cData = {
          liwuhuifu: node.find('input[name=liwuhuifu]').val(),
          dingshigonggao: node.find('input[name=dingshigonggao]').val(),
          ruchanghuifu: node.find('input[name=ruchanghuifu]').val(),
          guanzhuhuifu: node.find('input[name=guanzhuhuifu]').val(),
        }
        node.find('input[name=dingshigonggao]').val('欢迎来到[主播]的直播间，喜欢主播的朋友请点下关注，谢谢!')
        node.find('input[name=ruchanghuifu]').val('欢迎[粉丝]!')
        node.find('input[name=liwuhuifu]').val('感谢[粉丝]送的[礼物]!')
        node.find('input[name=guanzhuhuifu]').val('感谢[粉丝]的关注!')
      }else{
        node.find('input[name=liwuhuifu]').val(self.cData.liwuhuifu)
        node.find('input[name=dingshigonggao]').val(self.cData.dingshigonggao)
        node.find('input[name=ruchanghuifu]').val(self.cData.ruchanghuifu)
        node.find('input[name=guanzhuhuifu]').val(self.cData.guanzhuhuifu)
      }
    
    })

    $('#time_week—liveroomBotTask').selectpicker('refresh');
    create_datePicker($('.time_tick-liveroomBotTask'));
    $('#liveroomBotTask').find('input[name=time_type_liveroomBotTask]').click(function () {
      if ($(this).attr('valueAttr') == 1) {
        $('#liveroomBotTask').find('.time_task-liveroomBotTask').show()
      } else {
        $('#liveroomBotTask').find('.time_task-liveroomBotTask').hide()
      }
    });

    
    commonModal_show(node)
  },
  delT(t) {

    $(t).parent().remove()

  },
  save() {
    var guanzhuhuifu = $.map($('.liveroomBotTask_guanzhuhuifu').find('input'),function(v){
      return $(v).val()
    }).join(',').replace(',','_#_')
    var dingshigonggao = $.map($('.liveroomBotTask_dingshigonggao').find('input'), function (v) {
      return $(v).val()
    }).join(',').replace(',', '_#_')
    var ruchanghuifu = $.map($('.liveroomBotTask_ruchanghuifu').find('input'), function (v) {
      return $(v).val()
    }).join(',').replace(',', '_#_')
    var liwuhuifu = $.map($('.liveroomBotTask_liwuhuifu').find('input'), function (v) {
      return $(v).val()
    }).join(',').replace(',', '_#_')

    var node = $('#liveroomBotTask')
    
    var data = {
      session_id: parent.DmConf.userinfo.id,
      token: parent.DmConf.userinfo.token,
      'time_type': node.find('input[name=time_type_liveroomBotTask]:checked').attr('valueAttr'),
      'time_tick': $('#time_tick-liveroomBotTask').val(),
      "application_account_id": $(".liveroomBotTask_addTaskAccount3").attr('id_list') ,
      name: node.find('input[name=task_name]').val(),
      'time_week': $('#time_week—liveroomBotTask').val() == null ? 0 : $('#time_week—liveroomBotTask').val().toString(),
      message_text : dingshigonggao,
      notice_time_interval: node.find('input[name=notice_time_interval]').val(),
      ignore_gift_text: node.find('input[name=ignore_gift_text]').val(),
      comment_text : ruchanghuifu,
      gift_text : liwuhuifu,
      follow_text : guanzhuhuifu,
      check_time_interval: node.find('input[name=check_time_interval]').val(),
      search_type: node.find('input[name=botdouyinOrzhibojian1]:checked').attr('valueAttr')
    }

    let error_obj = [
      { at: "name", er_msg: "请填写任务名" },
      { at: "application_account_id", er_msg: "请选择账号" }, 
    ]

    if (data['search_type'] == 1) {
      data['live_url'] = node.find('input[name=douyin_uid]').val()
      error_obj.push({ at: "live_url", er_msg: "请填写直播间链接" })
    } else {
      data['dy_uid'] = node.find('input[name=douyin_uid1]').val()
      error_obj.push({ at: "dy_uid", er_msg: "请填写抖音号" })
    }
    var err_msg = check_emptyInput(data, error_obj);
    if (err_msg != 0) {
      return parent.plus_alertShow.show(err_msg)
    }


    var ret = parent.getByRsync(parent.DmConf.api.new.Task_Add_task_live_rebot, data);
    if (ret.data.code == 0) {
      node.modal('hide')
      this.pData()
      parent.parent.plus_alertShow.show('任务设置成功')
    } else {
      parent.parent.plus_alertShow.show(ret.data.info.msg)
    }
  }
}
