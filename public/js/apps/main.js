require.config({
  baseUrl: "../../public/js",
  urlArgs: "v=" + parseInt(parseInt((new Date()).getTime() / 1000) / 100).toString(),  // 每分钟更新，方便开发,生产环境去掉
  paths: {
    "public": "lib/public"
  }
});

require(["public"], function () {
  web_init()
});
function AddEventBtn(a, value, c) {
  var arr = []
  if (value.user_name) {
    arr = ['<button id="caiji"  type="button" class="btn" >播放</button> ',]
  }
  return arr.join('');

}
var btn_events = {
  "click #caiji": function (a, b, value) {
    parent.togetherCaiji.show(value)
  },



}

function search_init(search_data) {
 
  //千万级以下的Y轴也能显示

    var retPro1 = new Promise(function (res, rej) {
      var ret1 = parent.getByRsync(parent.DmConf.api.new.Report_Mobile_nums, { session_id: parent.DmConf.userinfo.id, token: parent.DmConf.userinfo.token })
      res(ret1)
    })
    retPro1.then(function (data) {
      var obj = [];
      if (data.data.code == 0) {
        var obj = [
          { value: data.data.info.online, name: '在线' },
          { value: data.data.info.outline, name: '离线' },
          { value: data.data.info.failed, name: '故障' },
        ]

        eh1(obj)
      }
    })

 
  getData()
  aboutData()
 /*  setTimeout(function () { eh3(0); eh4(0); eh5(0); eh6(0) }, 1000) */


  /* $('#tableMy').bootstrapTable('destroy');


  var tableColumns = [
    { width: 100, field: 'user_name', title: '排行', align: 'center', valign: 'middle', },
    { width: 100, field: 'nick_name', title: '视频内容', align: 'center', valign: 'middle', },
    { width: 100, field: 'mobile_label', title: '播放量', align: 'center', valign: 'middle', },
    { width: 150, field: 'keyword', title: '点赞量', align: 'center', valign: 'middle', },
    { width: 100, field: 'hg_count', title: '评论量', align: 'center', valign: 'middle', },
    { width: 100, field: 'hg_count', title: '私信量', align: 'center', valign: 'middle', },
    { width: 100, field: 'hg_count', title: '转发量', align: 'center', valign: 'middle', },
    { width: 170, field: 'Button', title: '操作', events: btn_events, align: 'center', formatter: AddEventBtn },
  ];
  function responseHandler(info) {
    if (!parent.checkCode1002(info)) {
      return
    }
    if (info.data.info) {

      $.each(info.data.info.list, function (i, v) {

        v.reg_date_name = parent.UnixToDateTime(v.reg_date);


      })
    }

    return {
      "total": info.data.info.page.total,
      "rows": info.data.info.list
    }

  }

  function queryParams(params) {
    var node = $('#tb');
    var data = { //每页多少条数据
      "session_id": parent.DmConf.userinfo.id,
      "token": parent.DmConf.userinfo.token,
      "page_count": params.limit,
      "keyword": node.find('input[name=keyword_sma]').val(),
      type: 1,
      "page": (params.offset / params.limit) + 1,
    }
    csData = data;
    if (window.taskDetailInfo) {
      data = window.taskDetailInfo.showIframe_data;

    }


    return data
  }
  var detail = {
    "columns": tableColumns,
    "api": parent.DmConf.api.new.mobile_list,
    "responseHandler": responseHandler,
    "queryParams": queryParams,
    'page': window.taskDetailInfo ? parseInt(window.taskDetailInfo.showIframe_data.page) : 0,
    'pageSize': window.taskDetailInfo ? parseInt(window.taskDetailInfo.showIframe_data.page_count) : 50,
  }

  new parent.get_search_list($('#tableMy'), detail, $('#refresh_btn'), returnBack); */


  $('.tooltipCom1').on('click', 'span', function () {
    $(this).addClass('tooltipComActive1').siblings().removeClass('tooltipComActive1');
    if($(this).attr('dataId') == 0){
     
      $(".changeSpanshow").html('历史')
    } else{

      $(".changeSpanshow").html('今日')
    } 
    aboutData()
    getData()
  })



  $('.tooltipCom').on('click', 'span', function () {
    $(this).addClass('tooltipComActive').siblings().removeClass('tooltipComActive');
    
    if ($(this).attr('dataId') == 0) {
      $(".changeSpanshow1").html('今天');
    } else {
      $(".changeSpanshow1").html($(this).attr('dataId')+'天')
      
    } 
    eh3($(this).attr('dataId')); eh4($(this).attr('dataId')); eh5($(this).attr('dataId')); eh6($(this).attr('dataId'));
  })
}

function aboutData(){
  var retPro1 = new Promise(function (res, rej) {
    var ret1 = parent.getByRsync(parent.DmConf.api.new.Report_New_index, { session_id: parent.DmConf.userinfo.id, token: parent.DmConf.userinfo.token, id_today: $('.tooltipComActive1').attr('dataId') })
    res(ret1)
  })
  retPro1.then(function (data) {

    if (data.data.code == 0) {

      $(".sec1comContent>div:eq(0)>p:eq(1)>span:eq(0)").html(data.data.info.sum_phone);
      $(".sec1comContent>div:eq(1)>p:eq(1)>span:eq(0)").html(data.data.info.sum_dy);
      $(".sec1comContent>div:eq(2)>p:eq(1)>span:eq(0)").html(data.data.info.sum_fan);
      $(".sec1comContent>div:eq(3)>p:eq(1)>span:eq(0)").html(data.data.info.sum_video);
      $(".sec1comContent>div:eq(4)>p:eq(1)>span:eq(0)").html(data.data.info.sum_acquisition_comment);
     
    }
  })

}

function setLocData(){
  var day2 = new Date();
  day2.setTime(day2.getTime());
  var s2 = day2.getFullYear() + "-" + (day2.getMonth() + 1) + "-" + day2.getDate() + ' 23:59:59';
  window.localStorage.setItem('express_time', (new Date(s2)).valueOf());
  var ret1 = parent.getByRsync(parent.DmConf.api.new.Report_Sum_fans, { session_id: parent.DmConf.userinfo.id, token: parent.DmConf.userinfo.token, is_today: 0 }).data.info.list ;

  window.localStorage.setItem('index_data',JSON.stringify(ret1));
  return ret1
}
function getData(type){
    var retPro2 = new Promise(function (res, rej) {
    var ret1 = '' ;
    if ($('.tooltipComActive1').attr('dataId') == 0) {
      if (!window.localStorage.getItem('express_time')) {//首次获取历史记录
          ret1 = setLocData();
      } else {//判断时间是不是在当天，当天的数据不更新
        var expT = window.localStorage.getItem('express_time');
        if(expT > (new Date()).valueOf()){//当天
          ret1 = window.localStorage.getItem('index_data') ? JSON.parse(window.localStorage.getItem('index_data')) : [];
        }else{
          ret1 = setLocData();
        };   
      };
    } else {//获取今天的
      ret1 = parent.getByRsync(parent.DmConf.api.new.Report_Sum_fans, { session_id: parent.DmConf.userinfo.id, token: parent.DmConf.userinfo.token, is_today: 1 }).data.info.list
    };
    res(ret1);
  });
  retPro2.then(function (data) {
 
      var _list = data;
      var d_date = [];
      tab2Data = { contentData: [] };
       tab3Data = { contentData: [] };
      tab4Data = { contentData: [] };
      tab5Data = { contentData: [] };
      tab6Data = { contentData1: [], contentData2: [] }; 
      $.each(_list, function (i, v) {
        d_date.push(v.date);
        tab2Data.contentData.push(v.fans_count);
         tab3Data.contentData.push(v.fans_change_count);
        tab4Data.contentData.push(v.comment_count);
        tab5Data.contentData.push(v.like_count);
        tab6Data.contentData1.push(v.message_count);
        tab6Data.contentData2.push(v.share_count); 
      });
      tab2Data.headData = d_date;
       tab3Data.headData = d_date;
      tab4Data.headData = d_date;
      tab5Data.headData = d_date;
      tab6Data.headData = d_date; 
      eh2(tab2Data);
  })
  
}
function changeData(iid, type) {



}
function eh1(data){
  option1 = {
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c}"
    },
    series: [
      {
        name: '手机数',
        type: 'pie',
        labelLine: {
          show: false
        },
        label: {
          show: false
        },
        data: data,/*  [
          { value: 235, name: '在线' },
          { value: 100, name: '离线' },
          { value: 12, name: '故障' },
        ] */
      }
    ],
    color: ['#27DBDD', '#EA5872', '#E5CF0D',]
  };
  var $tab1 = $('#main')[0];
  var tab1Table = echarts.init($tab1);
  tab1Table.setOption(option1);
  $('.thridCon>p:eq(0)>span:eq(2)').html(data[0].value);
  $('.thridCon>p:eq(1)>span:eq(2)').html(data[1].value);
  $('.thridCon>p:eq(2)>span:eq(2)').html(data[2].value);
}
function eh2(data){

  var option2 = {
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c}"
    },
    xAxis: {
      type: 'category',
      data: data.headData.slice(7).reverse(), //['7-23', '7-24', '7-25', '7-26', '7-27', '7-28', '7-29']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '总粉丝数',
        type: 'line',
        stack: '总量',
        areaStyle: {
          normal: {
            color: '#68E6E7' //改变区域颜色
          }
        },
        itemStyle: {
          normal: {
            color: '#68E6E7', //改变折线点的颜色
            lineStyle: {
              color: '#68E6E7' //改变折线颜色
            }
          }
        },
        data: data.contentData.slice(7).reverse(),//[1202, 13332, 1401, 13124, 190, 10, 213330]
      }
    ]
  };
  var $tab2 = $('#main2')[0];
  var tab2Table = echarts.init($tab2);
  tab2Table.setOption(option2);
}
function eh5(iid) {

  var option5 = {
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c}"
    },
    xAxis: {
      type: 'category',
      data: window.tab5Data.headData.slice(iid).reverse()
    },
    yAxis: {
      type: 'value'
    }, grid: {
      left: 70
    },
    series: [
      {
        name: '点赞趋势',
        type: 'line',
        stack: '总量',

        itemStyle: {
          normal: {
            color: '#36CCAE',
            lineStyle: {
              color: '#36CCAE' //改变折线颜色
            }
          }
        },
        data: window.tab5Data.contentData.slice(iid).reverse()
      }
    ]
  };
  var $tab5 = $('#main5')[0];
  var tab5Table = echarts.init($tab5);
  tab5Table.setOption(option5);
}
function eh4(iid) {
  var option4 = {
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c}"
    },
    xAxis: {
      type: 'category',
      data: window.tab4Data.headData.slice(iid).reverse()
    },
    grid: {
      left: 70
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '点赞趋势',
        type: 'line',
        stack: '总量',

        itemStyle: {
          normal: {
            color: '#36CCAE',
            lineStyle: {
              color: '#36CCAE' //改变折线颜色
            }
          }
        },
        data: window.tab4Data.contentData.slice(iid).reverse()
      }
    ]
  };
  var $tab4 = $('#main4')[0];
  var tab4Table = echarts.init($tab4);
  tab4Table.setOption(option4);
}
function eh3(iid) {

  var option3 = {
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c}"
    },
    grid: {
      left: 70
    },
    xAxis: {
      type: 'category',
      data: window.tab3Data.headData.slice(iid).reverse(),
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '点赞趋势',
        type: 'line',
        stack: '总量',

        itemStyle: {
          normal: {
            color: '#36CCAE',
            lineStyle: {
              color: '#36CCAE' //改变折线颜色
            }
          }
        },
        data: window.tab3Data.contentData.slice(iid).reverse()
      }
    ]
  };
  var tab3Table = echarts.init($('#main3')[0]);
  tab3Table.setOption(option3);
}
function eh6(iid) {

  var option6 = {
    title: {
      text: ''
    },
    grid: {
      left: 70
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['私信数量', '转发数量',]
    },
    toolbox: {

    },

    xAxis: [{
      type: 'category',
      data: window.tab6Data.headData.slice(iid).reverse()
    }],
    yAxis: [{
      type: 'value'
    }],
    series: [{
      name: '私信数量',
      type: 'line',

      itemStyle: {
        normal: {
          color: '#36CCAE',
          lineStyle: {
            color: '#36CCAE' //改变折线颜色
          }
        }
      },

      data: window.tab6Data.contentData1.slice(iid).reverse()
    },
    {
      name: '转发数量',
      type: 'line',


      data: window.tab6Data.contentData2.slice(iid).reverse()
    },

    ]
  };
  var $tab6 = $('#main6')[0];
  var tab6Table = echarts.init($tab6);
  tab6Table.setOption(option6);
}