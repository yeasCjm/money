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


function search_init(haowu_type){
  console.log(window.taskDetailInfo)
  var dats = {
    "task_id": window.taskDetailInfo.task_id,
    haowu_id: window.taskDetailInfo.haowu_id,
    "customer_id": parent.DmConf.userinfo.customer_id,
    "token": parent.DmConf.userinfo.token,
    "session_id": parent.DmConf.userinfo.id,
    "page" : 1 ,
    order_type : 'asc',
    order_field : 'addtime' ,
    "pageSize" : 999999
  }

  var ret = parent.getByRsync(parent.DmConf.api.new.Task_Task_haowu_report, dats);
  var timeDate = [] ;
  var newData = [] ;
  var newData1 = []
  if(ret.data.code == 0 ){
      $.each(ret.data.info.list,function(i,v){
        timeDate.push(v.date)
        newData.push(v.order_count)
        newData1.push(v.price)
      })
  }else{
    return parent.plus_alertShow.show(ret.data.msg)
  }




  var $tab1 = document.getElementById('main');

  var tab1Option = {
    title: {
      text: '人气值',      //主标题
      textStyle: {
        color: '#000',        //颜色
        fontStyle: 'normal',     //风格
        fontWeight: 'normal',    //粗细
        fontFamily: 'Microsoft yahei',   //字体
        fontSize: 15,     //大小
        align: 'center'   //水平对齐
      },
    /*   subtext: '时间',      //副标题
      subtextStyle: {          //对应样式
        color: '#F27CDE',
        fontSize: 15
      }, */
      itemGap: 7
    },

    xAxis: {
      type: 'category',
      data:timeDate ,// ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },

   

    line: {
     
    },
    tooltip: {
     
      trigger: 'item',           // 触发类型，默认数据触发，见下图，可选为：'item' ¦ 'axis'
      showDelay: 20,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
      hideDelay: 100,            // 隐藏延迟，单位ms
      transitionDuration: 0.4,  // 动画变换时间，单位s
      backgroundColor: 'rgba(0,0,0,0.7)',     // 提示背景颜色，默认为透明度为0.7的黑色
      borderColor: '#333',       // 提示边框颜色
      borderRadius: 4,           // 提示边框圆角，单位px，默认为4
      borderWidth: 0,            // 提示边框线宽，单位px，默认为0（无边框）
      padding: 5,                // 提示内边距，单位px，默认各方向内边距为5，
      // 接受数组分别设定上右下左边距，同css
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'line',         // 默认为直线，可选为：'line' | 'shadow'
        lineStyle: {          // 直线指示器样式设置
          color: '#48b',
          width: 2,
          type: 'solid'
        },
        shadowStyle: {                       // 阴影指示器样式设置
          width: 'auto',                   // 阴影大小
          color: 'rgba(150,150,150,0.3)'  // 阴影颜色
        }
      },
      textStyle: {
        color: '#fff'
      }
    },
    series: [{
      data: newData ,//[820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      itemStyle: {
        normal: {
         
          label: {
            show: true,
          
          },
          lineStyle: {
            width: 2,
            type: 'solid',
            shadowColor: 'rgba(0,0,0,0)', //默认透明
            shadowBlur: 5,
            shadowOffsetX: 3,
            shadowOffsetY: 3
          }
        },
     
      },
   
    }]
  };

  var tab1Table = echarts.init($tab1);
  tab1Table.setOption(tab1Option);

  var $tab2 = document.getElementById('main1');

  var tab2Option = {
    title: {
      text: '价格',      //主标题
      textStyle: {
        color: '#000',        //颜色
        fontStyle: 'normal',     //风格
        fontWeight: 'normal',    //粗细
        fontFamily: 'Microsoft yahei',   //字体
        fontSize: 15,     //大小
        align: 'center'   //水平对齐
      },
      /*   subtext: '时间',      //副标题
        subtextStyle: {          //对应样式
          color: '#F27CDE',
          fontSize: 15
        }, */
      itemGap: 7
    },

    xAxis: {
      type: 'category',
      data: timeDate,// ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },



    line: {

    },
    tooltip: {

      trigger: 'item',           // 触发类型，默认数据触发，见下图，可选为：'item' ¦ 'axis'
      showDelay: 20,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
      hideDelay: 100,            // 隐藏延迟，单位ms
      transitionDuration: 0.4,  // 动画变换时间，单位s
      backgroundColor: 'rgba(0,0,0,0.7)',     // 提示背景颜色，默认为透明度为0.7的黑色
      borderColor: '#333',       // 提示边框颜色
      borderRadius: 4,           // 提示边框圆角，单位px，默认为4
      borderWidth: 0,            // 提示边框线宽，单位px，默认为0（无边框）
      padding: 5,                // 提示内边距，单位px，默认各方向内边距为5，
      // 接受数组分别设定上右下左边距，同css
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'line',         // 默认为直线，可选为：'line' | 'shadow'
        lineStyle: {          // 直线指示器样式设置
          color: '#48b',
          width: 2,
          type: 'solid'
        },
        shadowStyle: {                       // 阴影指示器样式设置
          width: 'auto',                   // 阴影大小
          color: 'rgba(150,150,150,0.3)'  // 阴影颜色
        }
      },
      textStyle: {
        color: '#fff'
      }
    },
    series: [{
      data: newData1,//[820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      itemStyle: {
        normal: {

          label: {
            show: true,

          },
          lineStyle: {
            width: 2,
            type: 'solid',
            shadowColor: 'rgba(0,0,0,0)', //默认透明
            shadowBlur: 5,
            shadowOffsetX: 3,
            shadowOffsetY: 3
          }
        },

      },

    }]
  };

  var tab2Table = echarts.init($tab2);
  tab2Table.setOption(tab2Option);
      
}

