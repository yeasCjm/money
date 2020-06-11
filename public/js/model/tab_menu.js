var Tab_Menu = {
  /*聊天管理*/
  "5678" : {
    title: "用户管理",
    menu:[
      {grant:000, id:"u_add", text:"新增", icon:"", status:1},
      {grant:000, id:"u_changeStatus", text:"修改状态", icon:"", status:1},

    ]
  },
  
  "5566" : {
    title: "号码资源",
    menu:[
      {grant:000, id:"n_import", text:"导入", icon:"", status:1},
      {grant:000, id:"u_alloc", text:"分配",children:[
        {grant:000, id:"n_average", text:"平均分配", icon:"", status:1},
        {grant:000, id:"n_appoint", text:"特定分配", icon:"", status:1},
        {grant:000, id:"n_shareMe", text:"只分配给我", icon:"", status:1},
      ], icon:"", status:1},

    ]
  },
  "56456":{
    title: "公司账号管理",
    menu:[
      {grant:000, id:"u_add", text:"新增", icon:"", status:1},
      {grant:000, id:"u_update", text:"修改", icon:"", status:1},
      {grant:000, id:"u_detail", text:"详情", icon:"", status:1},
      {grant:000, id:"u_del", text:"删除", icon:"", status:1},
      

    ]
  },
  "564":{
    title: "用户管理",
    menu:[
      {grant:000, id:"u_add", text:"新增", icon:"", status:1},
      {grant:000, id:"u_update", text:"修改", icon:"", status:1},
      {grant:000, id:"u_detail", text:"详情", icon:"", status:1},
      {grant:000, id:"u_del", text:"删除", icon:"", status:1},
      

    ]
  },

}