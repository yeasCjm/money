
// 发送协议
var send_Protocol = {
        //格式转换
        framt: function(n){
                var s = [0x00,0x00,0x00,0x00];
                if(n<0xff){
                  s[0] = n;
                } else if(n<0xffff){
                  s[0] = (n&0x00ff);
                  s[1] = ((n>>8)&0x00ff);
                } else if(n<0xffffff){
                  s[0] = (n&0x0000ff);
                  s[1] = ((n>>8)&0x0000ff);
                  s[2] = ((n>>16)&0x0000ff);
                } else {
                  s[0] = (n&0x000000ff);
                  s[1] = ((n>>8)&0x000000ff);
                  s[2] = ((n>>16)&0x000000ff);
                  s[3] = ((n>>24)&0x000000ff);
                }
                return s;
        },
        getInt : function(d){
          return ( (d[3]<<24&0xff000000) | (d[2]<<16&0x00ff0000) | (d[1]<<8&0x0000ff00) | (d[0]&0x000000ff) );
        },
        getString : function(d){
          var str = '';
          for(var i=0; i<d.length; i++){
            str += String.fromCharCode(d[i]);
          }
          return str;
        },
        recv: function(d){
          //console.log(d);
          var header = {
            command_id    : this.getInt(d.slice(0,4)),
            version_id    : this.getInt(d.slice(4,8)),
            err_code      : this.getInt(d.slice(8,12)),
            need_response : this.getInt(d.slice(12,16)),
            body_size     : this.getInt(d.slice(16,20)),
          };

          var body = {
            message_size : this.getInt(d.slice(20,24)),
            raw          : d.slice(24),
          };
          return {"header":header, "body": body};
        },
        msg: function(s){
          var arr = [];
          for(var i = 0; i < s.length; i++){
            arr.push(s.charCodeAt(i));
          }
          return this.framt(s.length).concat(arr);
        },
        //协议头
        head : function(o){
                var d = {
                  command_id    : o.command  ? this.framt(o.command)  : this.framt(0),
                  version_id    : o.version  ? this.framt(o.version)  : this.framt(1),
                  err_code      : o.code     ? this.framt(o.code)     : this.framt(0),
                  need_response : o.response ? this.framt(o.response) : this.framt(0),
                  body_size     : o.size     ? this.framt(o.size+4)   : this.framt(0),
                  message_size  : this.framt(o.size),
                };

                return d.command_id.concat(d.version_id).
                concat(d.err_code).
                concat(d.need_response).
                concat(d.body_size).
                concat(d.message_size);
        },
       //登陆请求
       login : function(o){
               var ipaddr = parent.DmConf.myinfo.ip;
               var tel_ext = o.tel_ext ? o.tel_ext : localStorage.getItem("tel_ext");

               var dats = this.framt(2).  //版本
                          concat(this.msg(o.user)).
                          concat(this.msg(o.password)).
                          concat(this.msg(ipaddr ? ipaddr : "127.0.0.1")).
                          concat(this.framt(1)).
                          concat(this.framt(20)).
                          concat(this.msg(tel_ext ? tel_ext : "000"));

               var header = this.head({
                 command  : 1000,
                 response : 1,
                 size     : dats.length,
               });

               return (new Uint8Array(header.concat(dats)));
       },
       //拨打电话
       call_phone : function(o){
             var uid = parent.DmConf.myinfo.id; //当前用户ID
             var group_id = parent.DmConf.myinfo.group_id; //部门
             var user_cannel_id = parent.DmConf.myinfo.user_cannel_ip.user_cannel_id_one; //通道

             //数据
             var dats = this.msg(o.telephone).
                        concat(this.framt(uid)).
                        concat(this.framt(o.customer_id)).
                        concat(this.framt(user_cannel_id)).
                        concat(this.framt(group_id));

             var header = this.head({
               command  : 1001,
               response : 1,
               size     : dats.length,
             });

             return (new Uint8Array(header.concat(dats)));
       },
};
