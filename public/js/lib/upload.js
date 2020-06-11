//夹在库
if($(document).find("script[src='/public/js/lib/plupload.full.min.js']").length < 1){
    var req = document.createElement('script');
    req.type = 'text/javascript';
    req.src = '/public/js/lib/plupload.full.min.js';
    document.getElementsByTagName("head")[0].appendChild(req);
}  
 var Dm_Upload = function(o){
       var info = {
         api      : parent.DmConf.server.url(),
         button   : o ? o.button : "",  //按钮的ID
         percent  : o ? o.percent : null, //百分比
         start    : o ? o.start : false,  //选择后上传
         ok       : o ? o.ok : null,
         mime_types : o ? o.mime_types : [],
         addfile  : o ? o.addfile : null, //添加文件回调
         err      : o ? o.err : null,
         data     : o ? o.data : null,/*参数*/
         before   : o ? o.before : null,
         show_name   : o ? o.show_name : null,
         show_pic   : o ? o.show_pic : null,
    		 browse_btn : o ? o.browse_btn : null,
    		 removeF : o ? o.removeF : null ,
       };
       info.api += o.api ? o.api : "";

   var uploader = new plupload.Uploader({
                    runtimes : 'html5,flash,silverlight,html4',  
                     //浏览文件按钮  
                    browse_button :info.browse_btn,   
                    /*container: document.getElementById('container'),  */
                    //请求路径   
                    url : info.api, 
                    multi_selection: false,
                     //多部分上传  
                    multipart :true ,  
                     // 上传分块每块的大小，这个值小于服务器最大上传限制的值即可。  
                    chunk_size: '9mb',   
                   //可以使用该参数来限制上传文件的类型  
                    filters : {  
                             max_file_size : '10mb',  
                             mime_types: info.mime_types,
                    //不允许选取重复文件   
                     prevent_duplicates : true   
                    },  
                    //当Plupload初始化完成后触发   
                    init: {  
                           PostInit: function() {  
                               
                      }, 
                      //上传时的附加参数，以键/值对的形式传入，   
                      multipart_params: info.data,   
                   //设置你的参数  
                      BeforeUpload : info.before,   
  										removeFile : info.removeF,
                  //文件添加后，将文件名称和文件大小写入上传队列  
                   FilesAdded: function(up, files) { 
                   
                  
                       
                         

                        
                         
                        
                     }, 
                     FileFiltered:function(uploader, file){
                       
                     },
                      //文件上传过程中，显示百分比   
                      UploadProgress: function(up, file) {  
                                document.getElementById(file.id).getElementsByTagName('b')    
                                         [0].innerHTML = '<span>' + file.percent + "%</span>";  
                      },
                       FileUploaded : Uploaded_ev,
  
                           //文件上传完毕后，刷新页面，同时清空上传队列   
                      UploadComplete: function(up, files) {  
                            
                           
                      }   
                      }  
                  }); 
          
                     //初始化控件   
                     uploader.init();  



       this.destroy = function(){
         uploader.destroy();
       };
      this.removeFile = function(file){

         uploader.removeFile(file.id);
       };
       this.start = function(){
         uploader.start();

       };
       function Uploaded_ev(up, file, u){
            var res = JSON.parse(u.response);
            //console.log(res);
            if(info.ok) info.ok(res);
        }

   
 
 }
  
  
