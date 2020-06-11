var Message_Socket = function(obj){
    var callback_list = {
      "msg": function(d){
        return obj.msg ? obj.msg(d) : 0;
      },
      "talk": function(d){
        return obj.talk ? obj.talk(d) : 0;
      },
      "error": function(d){
        return obj.error ? obj.error(d) : 0;
      },
      "close": function(d){
        return obj.close ? obj.close(d) : 0;
      },
      "connected": function(d){
        return obj.connected ? obj.connected(d) : 0;
      },
      "login": function(d){
        return obj.login ? obj.login(d) : 0;
      }
    };

    var Tel_Status = {
      "0" : {text:"空闲", color:"green"},
      "1" : {text:"摘机", color:"red"},
      "2" : {text:"开始拨号", color:"#000"},
      "3" : {text:"拨号中", color:"blue"},
      "4" : {text:"通话中", color:"green"},
      "5" : {text:"等待挂机", color:"#000"},
      "6" : {text:"响铃中", color:"red"},
    };

    var bar_stat = {
      "obj"        : $("#socket_connect_status"),
      "islogin"    : function(){
        //var node = $("#socket_connect_status");
        this.obj.attr('src', '/public/img/main/connected.png');
        this.obj.attr('title', '消息推送已链接');
      },
      "disconnected" : function(){
        this.obj.attr('src', '/public/img/main/disconnected.png');
        this.obj.attr('title', '消息推送未链接');

        toLogout_msg('消息推送登陆失败,链接失败!');
      },
      "nologin"    : function(){
        this.obj.attr('src', '/public/img/main/ws_nologin.png');
        this.obj.attr('title', '消息推送接口未登陆');
      },
    };


    var msg_proc = {
      "1000" : { //登陆状态反馈
          event    :"login",
          active : function(d){
                  parent.DmConf.ws.logined = true;
                  bar_stat.islogin();
          },
          des:"登陆"
      },
      "1012" : { //收到电话状态
         event : "telephone_status",
         active : function(d){
           if(d.message_size > 7){
               var raw = d.raw.length > 8 ? d.raw.slice(d.raw.length - 8, d.raw.length) : d.raw;
               //console.log("raw("+raw.length+"): ",raw);
               var user_channel_id = parent.send_Protocol.getInt(raw.slice(0,4)); //通道
               var status_code = parent.send_Protocol.getInt(raw.slice(4,8));
               var status_obj = Tel_Status[status_code]; //状态
               if(status_obj){
                 var n = $("#telephone_status");
                 parent.DmConf.tel.status = status_code;
                 n.text(status_obj.text);
                 n.css("color", status_obj.color);
               }
               if(6 != status_code){
                  parent.DmConf.tel.ring(false);
               }
           }
         },
         des : "电话状态"
      },
      "1003" : { //通知消息
        event  : "notice_msgs_event",
        active : function(d){
            var raw = d.raw;
            if(raw.length > 3){
                var len = 0;
                var n = 0;
                //发起通知的用户
                var user_id = parent.send_Protocol.getInt(raw.slice(0,4));
                var notice_user = parent.DmConf.data.user_list[user_id];

                //console.log("user: ", notice_user.real_name);

                //通知标题
                n = parent.send_Protocol.getInt(raw.slice(4,8));
                len = 8;
                var notice_title = parent.send_Protocol.getString(raw.slice(len, len+n));
                len += n;

                //console.log("notice_title: " + notice_title);

                //时间
                n = parent.send_Protocol.getInt(raw.slice(len, len+4));
                len += 4;
                var pdate = parent.send_Protocol.getString(raw.slice(len, len+n));
                len += n;

                //console.log("pdate: " + pdate);

                //消息内容
                n = parent.send_Protocol.getInt(raw.slice(len, len+4));
                len += 4;
                var notice_content = parent.send_Protocol.getString(raw.slice(len, len+n));
                len += n;

                //console.log("notice_content: " + notice_content);


            }
        }
      },
      //改变参数消息
      "1006" : {
        event  : "uage_change_event",
        active : function(d){
            var raw = d.raw;
            if(raw.length > 3){
                var len = 0, n = 0;
                //其他人改变了参数设置
                var user_id = parent.send_Protocol.getInt(raw.slice(0,4));
            }
        }
      },
      "1009" : {  //用户被踢出
        event  : "kill_user_event",
        active : function(d){
           parent.DmConf.eject = true;
           parent.DmConf.ws.logined = false;
           bar_stat.nologin();

           /*
           get_dats(DmConf.api.user.logout, {"token" : DmConf.token});

           $.messager.alert("系统消息", "您已被系统踢出，请重新登陆!", "info", function(){
               location.reload();
           });
           $(".panel-tool-close").css("display","none");
           */
           toLogout_msg('您已被系统踢出，请重新登陆!');
        },
        des : ""
      },
      "1004" : {  // 收到内部消息
          event  : "sms_event",
          active : function(d){
            var raw = d.raw;
            if(raw.length > 3){
              var len = 0;
              var n = 0;
              var from_user_id = parent.send_Protocol.getInt(raw.slice(0,4));
              var to_user_id = parent.send_Protocol.getInt(raw.slice(4,8));

              n = parent.send_Protocol.getInt(raw.slice(8,12));
              len = 12;
              var org_file_name = parent.send_Protocol.getString(raw.slice(len, len+n));
              len += n;

              n = parent.send_Protocol.getInt(raw.slice(len, len+4));
              len += 4;
              var attach = parent.send_Protocol.getString(raw.slice(len, len+n));
              len += n;

              n = parent.send_Protocol.getInt(raw.slice(len, len+4));
              len += 4;
              var bill_sn = parent.send_Protocol.getString(raw.slice(len, len+n));
              len += n;

              var from_user_name = parent.DmConf.data.user_list[from_user_id];

              //console.log("from_user_id: " + from_user_id + "\nto_user_id: " + to_user_id + "\norg_file_name: " + org_file_name + "\nattach: " + attach + "\nbill_sn: " + bill_sn + "\n");

              pop_msgs( bill_sn );

            }
          },
          des : ""
      },
      "1002" : {  //收到来电
        event : "call_event",
        active : function(d){
          var raw = d.raw;
          if(raw.length > 3){
                var len = 0;
                var n = 0;
                var proc_one = parent.send_Protocol.getInt(raw.slice(0,4));
                var proc_two = parent.send_Protocol.getInt(raw.slice(4,8));

                n = parent.send_Protocol.getInt(raw.slice(8,12));
                len = 12;
                var from_tel = parent.send_Protocol.getString(raw.slice(len, len+n));
                len += n;

                n = parent.send_Protocol.getInt(raw.slice(len, len+4));
                len += 4;
                var to_tel = parent.send_Protocol.getString(raw.slice(len, len+n));
                len += n;

                parent.get_dats(parent.DmConf.api.custom.getRevCallCustomer, {telephone:from_tel}, function(dats, err){
                  var msgs = {
                    customer_id:0,
                    customer_name:'(未知客户)',
                    to_telephone:to_tel,
                    from_telephone:from_tel,
                    encry_tel : '',
                    area:'',
                    time:parent.getLocalTime()
                  };
                  if(dats.status && dats.data){
                    msgs.customer_id = dats.data.customer_id;
                    msgs.customer_name = dats.data.customer_name;
                    msgs.area = dats.data.addr;
                    msgs.encry_tel = dats.data.encry_tel;
                  }
                  parent.Call_Event.ring_up(msgs);
                });
           }
        },
        des : ""
      },
      "2010" : {
         event  : "stop_word_event",
         active : function(d){
              var raw = d.raw;
              console.log("got 2010 message", raw);
         },
         des : ""
      }

    };

    var err_code = {
      "4005" : "用户名或密码错误，请重新输入！",
      "4006" : "该用户已登陆，请勿重复登陆！",
      "4008" : "您正在使用的系统超出最大终端数许可，请联系软件商购买更多许可！",
      "4010" : "该IP已有用户登陆，请勿重复登陆！",
      "4012" : "您的用户名不允许从此IP登陆！",
      "4013" : "您的用户名已被暂停使用！",
      "4014" : "您当前使用的客户端软件版本过低，请安装最新版本",
      "4015" : "您正在使用的系统超出微信最大终端数许可，请联系软件商购买更多许可或设置此工号不登陆微信！",
    };
    //weboskcet信息
    var sock = parent.DmConf.ws;

    //是否有接收到服务端回应的ready
    var ready = false;

    var ws = null;
    connect();  // 链接

    //链接
    function connect(){
      ws = new WebSocket(sock.host);
      // 链接打开
      ws.onopen = function (e) {
         check();
         bar_stat.nologin();
      };
      // 收到消息事件
      ws.onmessage = function (e) {
        recv(e);
      };
      // 链接错误
  	  ws.onerror = function(e){
        error(e);
        bar_stat.disconnected();
      };
      // 链接关闭事件
  	  ws.onclose = function(e){
        close(e);
        bar_stat.disconnected();
      };
    }

    //重链
    function reconnect(){
      setTimeout(connect, 5000);
    }

    // 心跳检测, 每30秒
    function ping(){
      if(1 == ws.readyState){
         ws.send("\x01");
         setTimeout(ping, (sock.ping_time ? sock.ping_time : 30000));
      }
    }

    // websocket发生错误
    function error(e){
      console.log("connection error !", e);
      sock.logined = false;
      callback_list.error(e);
    }

    // websocket关闭
    function close(e){
      console.log("connection close !");
      sock.logined = false;
      callback_list.close(e);
      reconnect();
    }

    // 为外部提供websocket状态
    this.status = function(){
      return ws.readyState;
    }

    // 发送消息
    this.msg = function(dats){
       if(ready){
         send(dats);
       } else {
         console.log('websocket ready is false !');
       }
    };

    // 登录
    this.login = function(dats){
      var proc_data = send_Protocol.login({
              user: dats.user,
              password: dats.password
          });
      send(proc_data);
    };


    function send(data){
      if(!ws){
        console.log("ws is null!");
        return;
      }
      if(data){
        ws.send(data);
      }
    }

    // 接收消息
    function recv(res){
      if('READY' == res.data){
          ready = true;
          var tel_ext = localStorage.getItem("tel_ext") ? localStorage.getItem("tel_ext") : "";
          send(send_Protocol.login({
                  user     : parent.DmConf.myinfo.user_name,
                  password : parent.DmConf.myinfo.password,
                  tel_ext  : tel_ext,
              }));
      } else {
          var reader = new FileReader();
          reader.readAsArrayBuffer(res.data);
          reader.onload = function (e) {
              var result = send_Protocol.recv(new Uint8Array(reader.result));
              //console.log(result);
              if(0 == result.header.err_code){
                var msgs = msg_proc[result.header.command_id.toString()];
                var des = (msgs ? msgs.event : "");
                if(msgs){
                  if(msgs.active) msgs.active(result.body);
                }
                console.log(des + ' ok : ', result);
              } else {
                var err = err_code[result.header.err_code.toString()];
                console.log('websocket result error: ' + (err ? err : ""));
              }
          };
      }
    };

    // 检查 session, session 作为 token 传递给ws 服务端作为验证登录凭据
    function check(){
      //setTimeout(ping, (DmConf.ws.ping_time ? DmConf.ws.ping_time : 30000) ); //30秒后，尝试发送心跳检查
/*
      if(!sock.logined){
        console.log("未登陆!");
      }
*/
      //callback_list.connected(window.session);
    };

    this.test_pop = function(sn){
        pop_msgs(sn);
    };


    //右下角消息弹窗
    function pop_msgs(bill_sn){
      var node = $(".pop_recv_msg");

      var next_msg = node.find("> p:last-child a:nth-child(3)").eq(0);
      var prev_msg = node.find("> p:last-child a:nth-child(2)").eq(0);

      next_msg.off('click');
      next_msg.click(function(){ //下一条记录
        var numobj = $(this).parent().find('span').eq(0);
        var arr = numobj.text().split('/');
        if(arr.length > 1){
           arr[0] = parseInt(arr[0]);
           arr[1] = parseInt(arr[1]);
           if(arr[1] >= arr[0]){
              arr[0] = arr[1] > arr[0] ? arr[0] + 1 : arr[0];
              var o = parent.DmConf.msgs[arr[0] - 1];
              if(o) show_pop_msgs(o);
              numobj.text(arr[0] + '/' + arr[1]);
           }
        }
      });

      prev_msg.off('click');
      prev_msg.click(function(){
          var numobj = $(this).parent().find('span').eq(0);
          var arr = numobj.text().split('/');
          if(arr.length > 1){
             arr[0] = parseInt(arr[0]);
             arr[1] = parseInt(arr[1]);
             if(arr[0] >= 1){
                arr[0] = arr[0] > 1 ? (arr[0] - 1) : arr[0];
                var o = parent.DmConf.msgs[arr[0] - 1];
                if(o) show_pop_msgs(o);
                numobj.text(arr[0] + '/' + arr[1]);
             }
          }
      });

      parent.get_dats(parent.DmConf.api.Sms.getBySn, {"bill_sn": bill_sn}, function(d){
          if(d.status && d.data){
              var msg = d.data;
              var fuser = parent.DmConf.data.user_list[msg.from_user_id];
              parent.DmConf.msgs.push(msg);
              show_pop_msgs(msg);

              node.find('> p:last-child').children('span').text(parent.DmConf.msgs.length + '/' + parent.DmConf.msgs.length);
          }
      });

      var opt = parent.DmConf.dialog_opt();
      opt.title = '收到消息';
      opt.modal = false;
      opt.top = 'calc(100% - ' + (node.height() + 100) + 'px)';
      opt.left = 'calc(100% - 330px)';
      delete opt.buttons;
      node.dialog(opt);
    }

    //显示弹窗消息
    function show_pop_msgs(msg){
        var node = $(".pop_recv_msg");
        var fuser = parent.DmConf.data.user_list[msg.from_user_id];
        node.find('> p:first-child span:first-child').text(fuser ? fuser.user_name : '未知用户');
        node.find('> p:first-child span:last-child').text('[' + msg.pdate + ']');
        node.children('textarea').val(msg.content.replace(/&nbsp;/ig," "));
    }

    //退出登陆提示
    function toLogout_msg(msg){
        get_dats(DmConf.api.user.logout, {"token" : DmConf.token});
        $.messager.alert("系统消息", msg, "info", function(){
            location.reload();
        });
        $(".panel-tool-close").css("display","none");
    }

};
