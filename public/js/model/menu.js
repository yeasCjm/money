var SystemMenu = [{

    	title: '云控管理',
    	icon: 'douyin',
    	isCurrent: true,
    	grant: 1,
    	menu: [ /* {
                grant: 123211233132,
                title: '数据统计',
                note: 'statistics',
                name: 'static',
                type :1 ,
                icon: 'static',
                href : "apps/main.html",
                children :[],
            },  */ {
                grant: 123,
                title: '手机云控',
                note: 'equipment123213',
                type : 0 ,/*是否为管理员菜单*/
                icon: 'phone',
                children: [

                    {
                        grant:123,
                        name:"equipment",
                        title: "手机列表",
                        icon:"phone",
                        type : 0 ,
                        href : "apps/equipment/all_equipment.html",
                    },

                    {
                        grant:1323,
                        name:"account_list",
                        title: "抖音账号",
                        type : 0 ,
                        icon:"douyinhao",
                        href : "apps/equipment/account_list.html",
                    },
                ]

            }, {
                grant: 1233132,
                title: '任务列表',
                note: '_tasklist',
                name: 'tasklist',
                type: 0,/*管理员菜单*/
                icon: 'renwu',
                href: "apps/tasklist/tasklist.html",
                children: [
                   
                    // {
                    //     grant: 123,
                    //     title: "手机操作",
                    //     name: "clean_storage",
                    //     type: 0,
                    //     icon: "qinglihuancun",
                    //     href: "apps/tasklist/clean_storage.html",
                    // }
                ]
            },  {//暂时不上第二期
                grant: 123211233132,
                title: '好友管理',
                note: 'togetherF1',
                name: 'togetherF',
                type: 0,
                icon: 'douyin',
                href: "apps/tasklist/togetherF.html",
                children: [],
            }, {
                grant: 1233132,
                title: '直播任务',
                note: '_new_collectliveRoom',
                type: 0,/*管理员菜单*/
                icon: 'zhibo',
                children: [
                    {
                        grant: 123,
                        title: "关注",
                        name: "new_collectliveRoom",
                        type: 0,
                        icon: "zhiboguanzhu",
                        href: "apps/tasklist/new_collectliveRoom.html",
                    },
                    {
                        grant: 123,
                        title: "活跃",
                        name: "liveroomBrisk",
                        type: 0,
                        icon: "qinglihuancun",
                        href: "apps/tasklist/liveroomBrisk.html",
                    },
                    {
                        grant: 123,
                        title: "机器人",
                        name: "liveroomBot",
                        type: 0,
                        icon: "jiqiren",
                        href: "apps/tasklist/liveroomBot.html",
                    }
                ]
            },
              {
                grant: 123123213131435,
                title: "采集列表",
                name: "col_info",
                type: 0,
                icon: "caiji",
                children: [
                    
                    {
                        grant: 1243321,
                        title: "视频采集",
                        name: "collect_msgVideo_result",
                        type: 0,
                        icon: "caijijieguo",
                        href: "apps/tasklist/collect_video_result.html",
                    }, {
                        grant: 1243321,
                        title: "评论采集",
                        name: "collect_msgComment_result",
                        type: 0,
                        icon: "caijijieguo",
                        href: "apps/tasklist/collect_msg_result.html",
                    }, {
                        grant: 123,
                        title: "视频评中评",
                        name: "new_collectAll",
                        type: 0,
                        icon: "caiji",
                        href: "apps/tasklist/new_collectAll.html",
                    }, {
                        grant: 123,
                        title: "大号采集",
                        name: "collectBigAcc",
                        type: 0,
                        icon: "caiji",
                        href: "apps/tasklist/collectBigAcc.html",
                    }, 
                  /*    {
                        grant: 123,
                        title: "视频采集",
                        name: "new_collectVideo",
                        type: 0,
                        icon: "caiji",
                        href: "apps/tasklist/new_collectVideo.html",
                    },
                    {
                        grant: 123,
                        title: "评论采集",
                        name: "new_collectComment",
                        type: 0,
                        icon: "pinglun",
                        href: "apps/tasklist/new_collectComment.html",
                    }, 
                    {
                        grant: 123,
                        title: "好物榜采集",
                        name: "niceGood_collect",
                        type: 0,
                        icon: "abc",
                        href: "apps/tasklist/niceGood_collect.html",
                    }, 
                  
                    {
                        grant: 1243321,
                        title: "爆品捕捉",
                        name: "collect_msgHaowu_result",
                        type: 0,
                        icon: "caijijieguo",
                        href: "apps/tasklist/collect_haowu_result.html",
                    },*/
                ]
            }, {
                grant: 121231231232133,
                title: "评论区私信",
                name: "msg_discuss",
                type: 0,
                note: 'msg_discuss1',
                icon: "super_discuss",
                href: "apps/tasklist/msg_discuss.html",

            }, {
                grant: 21321321312123,
                title: "推荐",
                name: "recommed",
                note:"recomend1",
                type: 0,
                icon: "tuijian",
                href: "apps/tasklist/recommed.html",
            },{
                grant: 123211233132,
                title: '养号管理',
                note: 'addtask',
                name: 'setTask',
                type :0 ,/*管理员菜单*/
                icon: 'douyin',
                href : "apps/tasklist/addtask.html",
                children :[],
            },/* {
                grant: 123211233132,
                title: '推名片',
                note: 'sendCard',
                name: 'card',
                type: 0,
                icon: 'card',
                href: "apps/tasklist/sendCard.html",
                children: [],
            },
          
                    
                ]
            },{
                grant: 123315532,
                title: '点赞私信管理',
                note: '_tasklist3',
                type : 0 ,
                icon: 'pinglun',
                children: [
                    {
                        grant:123,
                        title: "同城",
                        name:"same_city",
                        type : 0 ,
                        icon:"same_city",
                        href : "apps/tasklist/same_city.html",
                    },
                     {
                        grant:123,
                        title: "精准",
                        name:"accurate",
                        type : 0 ,
                        icon:"jingzhun",
                        href : "apps/tasklist/accurate.html",
                    },
                    /* {
                        grant:123,
                        title: "搜索",
                        name:"search_res",
                        type : 0 ,
                        icon:"sousuo",
                        href : "apps/tasklist/search_res.html",
                    },
                    {
                        grant:123,
                        title: "通讯录",
                        name:"communication",
                        type : 0 ,
                        icon:"tongxunlu",
                        href : "apps/tasklist/communication.html",
                    },{
                        grant:123,
                        title: "同行",
                        name:"peer",
                        type : 0 ,
                        icon:"shujuguanli",
                        href : "apps/tasklist/peer.html",
                    },{
                        grant:123,
                        title: "推荐",
                        name:"recommed",
                        type : 0 ,
                        icon:"tuijian",
                        href : "apps/tasklist/recommed.html",
                    },
                ]
            },
            /* {
                grant: 5566,
                title: '蹭热门',
                note: 'component',
                type : 0 ,
                icon: 'gongwenbao',
                children: [{
                        grant: 658958,
                        title: '大号管理',
                        note: 'major_num1',
                        name: 'major_num',
                        type :0 ,
                        icon: 'douyin',
                        href : "apps/plugin/major_num.html",
                        
                    },
                    {
                        grant: 6589258,
                        title: '蹭热门',
                        note: 'support_major1',
                        name: 'support_major',
                        type :0 ,
                        icon: 'xiaohaodingdahao',
                        href : "apps/plugin/support_major.html",
                       
                }, ]
            }, */ {
                grant: 6589258,
                title: '热门任务',
                note: 'support_major1',
                name: 'support_major',
                type: 0,
                icon: 'xiaohaodingdahao',
                href: "apps/plugin/support_major.html",

            },
        	/*{
                grant: 5566,
                title: '视频管理(开发中)',
                note: 'video',
                type : 0 ,
                icon: 'video',
                children: [{
                        grant: 658958,
                        title: '历史视频',
                        note: 'video_his1',
                        name: 'video_his',
                        type :0 ,
                        icon: 'list',
                        href : "apps/video/video_his.html",
                        
                    },
                    {
                        grant: 6589258,
                        title: '发视频(开发中)',
                        note: 'send_video1',
                        name: 'send_video',
                        type :0 ,
                        icon: 'video',
                        href : "apps/video/send_video.html",
                       
                }, ]
            },
            {
                grant: 1233333345,
                title: "发布管理",
                note: "fabuguanli1",
                name: "fabuguanli",
                type: 0,
                icon: "caiji",
                children: [
                    {
                        grant: 12413321,
                        title: "发布管理",
                        name: "sendManage",
                        type: 0,
                        icon: "caijijieguo",
                        href: "apps/video/videoList.html",
                    },
                ] 
            },
             {
                grant: 6589258,
                title: '发布作品',
                note: 'send_video1',
                name: 'send_video',
                type: 0,
                icon: 'video',
                href: "apps/video/send_video.html",

            }, */{
                grant: 123211233132,
                title: '素材库',
                note: 'drama',
                name: 'drama',
                type : 0 ,
                icon: 'static',
                href : "apps/drama/drama.html",
                children :[],
            },{
                grant: 123132,
                title: '公司管理',
                note: 'users',
                type : 1 ,
                icon: 'gongsi',
                children: [
                    {
                        grant:123,
                        title: "公司",
                        name:"company",
                        type : 0 ,
                        icon:"wenjianjia",
                        href : "apps/userInfo/company.html",
                    },
                   /*  {
                        grant:123,
                        title: "员工管理",
                        name:"userInfo",
                        type : 0 ,
                        icon:"yuangong",
                        href : "apps/userInfo/userInfo.html",
                    }, */
                     {
                        grant:123,
                        title: "员工管理",
                        name:"userInfo",
                        type : 0 ,
                        icon:"yuangong",
                        href : "apps/userInfo/loginUser.html",
                    },
                  
                ]
            },
                {
                grant: 123211233132,
                title: '故障报错',
                note: 'drama',
                name: 'drama1',
                type :0 ,
                icon: 'repeat',
                href : "apps/plugin/repeat.html",
                children :[],
            },
        ],
    },
 {

        title: '后台管理',
        icon: 'douyin',
        isCurrent: false,
        grant: 1,
        menu: [{
                grant: 123211233132,
                title: '数据统计',
                note: 'statistics1',
                name: 'static1',
                type :1 ,/*管理员菜单*/
                icon: 'static',
                href : "apps/main.html",
                children :[],
            },{
                grant: 1233132,
                title: '客户管理',
                note: 'customerManage',
                type : 0 ,/*管理员菜单*/
                icon: 'renmen',
                 name:"customerManage",
                href : "apps/customerManage/customerManage.html",
                children: [
                 
                      
                ]
            },{
                grant: 123,
                title: '总手机',
                note: 'equipment',
                 name:"equipment1",
                type : 0 ,/*是否为管理员菜单*/
                icon: 'phone',
                 href : "apps/equipment/all_equipment.html",
                children: [

                ]

            },
    
          
        ],
    },

];

var mainPlatform = {

    init: function(){
         this._createTopMenu()
         this.bindEvent()
        
    },
    bindEvent: function(){
        var self = this;

        $(document).on('click', '.top_menu', function() {
         $('.pf-nav-item').removeClass('current');
        $(this).addClass('current');

        var m = $(this).data('sort');
        self._createSiderMenu(SystemMenu[m], m);
        $('.top_menu_a').removeClass('top_menu_a_active')
        $(this).find('.top_menu_a').addClass('top_menu_a_active')
    });

    },
    _createTopMenu: function(){
        var menuStr = '';
        var currentIndex = 0;
        for(var i = 0, len = SystemMenu.length; i < len; i++) {
                if(!SystemMenu[i]) continue;
                  menuStr += '<li class="nav-item top_menu" data-sort="'+i+'">'+
                      '<a class="top_menu_a  ">'+
                          '<span class="iconfont icon-'+SystemMenu[i].icon+'"></span>'+
                          '<span class="pf-nav-title">'+ SystemMenu[i].title +'</span>'+
                      '</a></li>';
            if (SystemMenu[i].isCurrent){
                currentIndex = i;
                this._createSiderMenu(SystemMenu[i], i);
            }
        }
        $('.navbar-nav').html(menuStr + $('.navbar-nav').html())     
        $($('.navbar-nav').children('li')[0]).find('a').addClass('top_menu_a_active');

    },

    _createSiderMenu: function(menu, index){
        $('.nav').html('');
        var menuStr = '';
        var total_menu = menu.menu;
      
        for(var i = 0, len = total_menu.length; i < len; i++){
            if(parent.DmConf.userinfo.type == total_menu[i].type ||  total_menu[i].type == 0){
                if(total_menu[i].href){
               
                        var mean_hrefL = total_menu[i].href +'?t='+ new Date().valueOf();
                  
                        menuStr += '<li class="nav-item" onclick="mainPlatform.show_child_iframe(\''+mean_hrefL+'\',\''+total_menu[i].title+'\',\''+total_menu[i].name+'\',false,this)">\
                        <a class="nav-link" data-toggle="collapse" href="#'+total_menu[i].note+'" aria-expanded="false" aria-controls="'+total_menu[i].note+'">\
                          <span style="background:url(\'/public/css/icon2/body/'+total_menu[i].icon+'.png\') center center;background-size: 100%;margin-right:7px;display:inline-block;height: 17px;width:23px"></span><span class="menu-title">'+total_menu[i].title+'</span>\
                        </a><div class="collapse" id="'+total_menu[i].note+'"><ul class="nav flex-column sub-menu">' ;
                    

                }else{
  
                    if(total_menu[i].check_name   && parent.DmConf.userinfo[total_menu[i].check_name] == 0){

                        continue;

                    } 
                   menuStr += '<li class="nav-item">\
                        <a class="nav-link"  data-toggle="collapse" href="#'+total_menu[i].note+'" aria-expanded="true" aria-controls="'+total_menu[i].note+'">\
                          <span style="background:url(\'/public/css/icon2/body/'+total_menu[i].icon+'.png\') center center;background-size: 100%;margin-right:7px;display:inline-block;height: 17px;width:23px"></span><span class="menu-title"><i class="iconfont icon-'+total_menu[i].icon+'"></i>'+total_menu[i].title+'</span>\
                          <i class="glyphicon glyphicon-chevron-down menu-icon"></i>\
                        </a><div class="collapse" id="'+total_menu[i].note+'"><ul class="nav flex-column sub-menu">' ;      
                        for(var a=0;a<total_menu[i].children.length;a++){
                            if(parent.DmConf.userinfo.type == total_menu[i].children[a].type ||  total_menu[i].children[a].type == 0 ){

                                if(total_menu[i].children[a].children && total_menu[i].children[a].children.length>0){
                                   
                                    menuStr +=   '<li class="nav-item nav-click" showChild="'+total_menu[i].children[a].note+'"  style="cursor:pointer" ><a class="siderNav_a "><span style="background:url(\'/public/css/icon2/body/'+total_menu[i].children[a].icon+'.png\') ;margin-right:5px;background-size: 100%;display:inline-block;height: 17px;width:23px;vertical-align:text-top;"></span>'+total_menu[i].children[a].title+'</a>'
                                    var secUl='<ul style="margin-bottom:0" class="nav">';
                                  
                                    for(var jj=0;jj<total_menu[i].children[a].children.length;jj++){
                                        var mean_href = total_menu[i].children[a].children[jj].href +'?t='+ new Date().valueOf();
                                        secUl += '<li class="nav-item nav_children nav_children_'+total_menu[i].children[a].note+'" onclick="mainPlatform.show_child_iframe(\''+mean_href+'\',\''+total_menu[i].children[a].children[jj].title+'\',\''+total_menu[i].children[a].children[jj].name+'\',false,this)"><a class="siderNav_a  cAct_'+total_menu[i].children[a].children[jj].name+' " style="cursor:pointer;padding:6px 49px;" ><span style="background:url(\'/public/css/icon2/body/'+total_menu[i].children[a].children[jj].icon+'.png\') ;margin-right:5px;background-size: 100%;display:inline-block;height:19px;width:20px;vertical-align:text-top;"></span>'+total_menu[i].children[a].children[jj].title+'</a></li>';
                                       
                                    }
                                   
                                    secUl += '</ul></li>'
                                    menuStr +=secUl
                            }else{

                                var mean_href = total_menu[i].children[a].href +'?t='+ new Date().valueOf();
                                menuStr += '<li class="nav-item " onclick="mainPlatform.show_child_iframe(\''+mean_href+'\',\''+total_menu[i].children[a].title+'\',\''+total_menu[i].children[a].name+'\',false,this)"><a class="siderNav_a  cAct_'+total_menu[i].children[a].name+' " style="cursor:pointer" ><span style="background:url(\'/public/css/icon2/body/'+total_menu[i].children[a].icon+'.png\') ;margin-right:5px;background-size: contain;display:inline-block;height:19px;width:20px;vertical-align:text-top;"></span>'+total_menu[i].children[a].title+'</a></li>'
                            }
                        }
                        
                    }
                }
                 menuStr += '</ul></div></li>'
            }
        }
       
        $('.nav').html($('.nav').html()+menuStr);

        $('.nav-link').click(function(){
            if($(this).find('i').hasClass('glyphicon-chevron-down')){
                 $($(this).find('i')[1]).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
                 $($(this).find('i')[1]).addClass('icon-green');
             }else{
                 $($(this).find('i')[1]).removeClass('icon-green');
                 $($(this).find('i')[1]).removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
             }           
        })
        
       $($('.nav-link')[0]).click(); 
      $($('.nav-link:eq(0)')).parent().find('#equipment123213 .nav-item:eq(0)').click() 
        $(".nav-click").off('click').click(function(){
            $('.nav-click').find('ul li').addClass('nav_children');
            var cl = $(this).attr('showChild');
            $('.nav_children_'+cl).removeClass('nav_children');

        })
    },
    show_child_iframe : function(url,tit,name,f,t, info,type,type_info,isremove){//跳转的url,标题，标识，数据，返回动作，返回动作的info,是否销毁iframe

        $('.nav-click').find('ul li').addClass('nav_children');
           
        var opt = {
             tabMainName:'tabContainer',
             tabName:name,
             tabTitle:tit,
             tabUrl:url,
             tabContentMainName:"content-wrapper"
        }
         if(!f){
            $('.nav').find('a').removeClass('navSiderActive');
            $(t).find('a').addClass('navSiderActive');
        } 
        if (!isremove) $("#" + opt.tabContentMainName).find('iframe').remove();
       
        //固定TAB中IFRAME高度
        mainHeight = $(document.body).height() - 105;
       
        var content =  '<iframe id="'+opt.tabName+'" src="' + opt.tabUrl + '" width="100%" height="'+mainHeight+'px" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="yes" allowtransparency="yes"></iframe>';
       // $("#"+opt.tabContentMainName).append('<div style="overflow:auto;border: 1px solid #dae4f8"  id="tab_content_'+opt.tabName+'" role="tabpanel" class="tab-pane" id="'+opt.tabName+'">'+content+'</div>');
        $("#"+opt.tabContentMainName).prepend(content);
        //this.addTab(opt,f,info)

        if(info){
          
        

            if(type){
                info['showIframe'] = type ;
                info['showIframe_data'] = type_info ;
            }
            $('#'+opt.tabName)[0].contentWindow.taskDetailInfo = info
        
        }
    },
  
    destory_iframe: function (idName, sName) {
        $('#' + sName).show();
        $('#' + idName).remove();
    },
    show_iframe: function (url,tit, name, info,hName) {
        $('#' + hName).hide();
        this.show_child_iframe(url, tit, name, '', '', info, '', '' ,true);
    },
    changTab:function(t,f){

        var tgname = $(t).find('a').attr('href');
        $(tgname).siblings().hide();
        $(tgname).siblings().removeClass('nowActive');
        $(tgname).show();
        $(tgname).addClass('nowActive');
        if(!f) $("#tabContainer").find('a').css({ padding: ' 0','border-bottom':'',color: '',})
        $(t).find('a').css({ padding: '16px 0','border-bottom':' 3px solid #0056b3',color: '#0056b3',})
        var navName = $(t).find('a').attr('href').replace('#tab_content_','.cAct_');
        $('.nav').find('a').removeClass('navSiderActive');
        $(navName).addClass('navSiderActive');

    },
    addTab: function (options,flag,info) {
     //option:
     //tabMainName:tab标签页所在的容器
     //tabName:当前tab的名称
     //tabTitle:当前tab的标题
     //tabUrl:当前tab所指向的URL地址

        var exists = this.checkTabIsExists(options.tabMainName, options.tabName);
        $("#tabContainer").find('a').css({ padding: ' 0','border-bottom':'',color: '',})

        if(exists){
            $('#tab_content_'+options.tabName).siblings().hide();
            $('#tab_content_'+options.tabName).siblings().removeClass('nowActive');
            $('#tab_content_'+options.tabName).show();
            $('#tab_content_'+options.tabName).addClass('nowActive');
            $('#tab_li_'+options.tabName).find('a').css({ padding: '16px 0','border-bottom':' 3px solid #0056b3',color: '#0056b3',})

        } else {
            if(flag){//少了个X
            $("#"+options.tabMainName).append('<div class="tabpanelLi" onclick="mainPlatform.changTab(this)" id="tab_li_'+options.tabName+'"><a  style="padding:16px 0;border-bottom:3px solid #0056b3;color:#0056b3" href="#tab_content_'+options.tabName+'" data-toggle="tab" id="tab_a_'+options.tabName+'">'+options.tabTitle+'</a></div>');
            }else{
                $("#"+options.tabMainName).append('<div class="tabpanelLi" onclick="mainPlatform.changTab(this)" id="tab_li_'+options.tabName+'"><a  style="padding:16px 0;border-bottom:3px solid #0056b3;color:#0056b3" href="#tab_content_'+options.tabName+'" data-toggle="tab" id="tab_a_'+options.tabName+'"><button style="display:none" class="close closeTab" type="button" onclick="mainPlatform.stopTOli(this, event);mainPlatform.closeTab(this);">×</button>'+options.tabTitle+'</a></div>');
            }
            
        //固定TAB中IFRAME高度
            mainHeight = $(document.body).height() - 215;

            var content = '';
            if(options.content){
             content = option.content;
            } else {
                content = '<iframe id="'+options.tabName+'" src="' + options.tabUrl + '" width="100%" height="'+mainHeight+'px" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="yes" allowtransparency="yes"></iframe>';
            }
            $("#"+options.tabContentMainName).append('<div style="overflow:auto"  id="tab_content_'+options.tabName+'" role="tabpanel" class="tab-pane" id="'+options.tabName+'">'+content+'</div>');
            $('#tab_content_'+options.tabName).siblings().hide();
            $('#tab_content_'+options.tabName).siblings().removeClass('nowActive');
            $('#tab_content_'+options.tabName).show();
            $('#tab_content_'+options.tabName).addClass('nowActive');
        }
         $('#tabContainer').find('.tabpanelLi').mouseover(function(){
           $(this).find('.closeTab').show()
        }).mouseout(function(){
             $(this).find('.closeTab').hide()
        })
       
        if(info){
            $('#'+options.tabName)[0].contentWindow.taskDetailInfo = info
        }
    },
    stopTOli: function (dom,e) {
       if (e && e.stopPropagation)
            e.stopPropagation()
        else
            window.event.cancelBubble = true
        // 阻止默认浏览器动作(W3C)
        if (e && e.preventDefault) {
            e.preventDefault();
        } else {
            // IE中阻止函数器默认动作的方式
            window.event.returnValue = false;
        }
        return false;
    } , 
     /**
      * 关闭标签页
      * @param button
      */
     closeTab : function  (button) {
         //通过该button找到对应li标签的id
         var li_id = $(button).parent().attr('href');
         var id = li_id.replace("#tab_content_","");
         //如果关闭的是当前激活的TAB，激活他的前一个TAB
         if ("#"+$(".nowActive").attr('id') == li_id) {
            var prevId = $(button).parent().parent().prev()
            this.changTab(prevId,true)
           
            $(".nowActive").prev().show();
           
         }
          
         //关闭TAB
         $( li_id).remove();
         $("#tab_li_" + id).remove();
     },
      
     /**
      * 判断是否存在指定的标签页
      * @param tabMainName
      * @param tabName
      * @returns {Boolean}
      */
    checkTabIsExists: function (tabMainName, tabName){
         var tab = $("#"+tabMainName+" > #tab_li_"+tabName);
         //console.log(tab.length)
         return tab.length > 0;
     }
};
