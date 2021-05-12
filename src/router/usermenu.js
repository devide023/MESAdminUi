export function get_user_menus(menulist) {
  console.log(menulist)
  const routlist = [];
  menulist.forEach(item => {
    let mitem = {}
    let funs=[]
    let editfields=[]
    let readfields=[]
    let hidefields=[]
    if(item.menu_permission)
    {
      funs = item.menu_permission.funs
      editfields=item.menu_permission.editfields 
      hidefields=item.menu_permission.hidefields
      readfields=item.menu_permission.readfields
    }
    mitem = {
      path: item.path,
      name: item.code,
      component: () => import('@/layout/index.vue'),
      meta: {
        title: item.title,
        icon: item.icon,
        funs:funs,
        editfields:editfields,
        hidefields:hidefields,
        readfields:readfields
      }
    };
    if(item.children.length > 0){
      mitem.children = submenu(item.children);
    }
    routlist.push(mitem);
  });
  routlist.push({
    path: '*',
    redirect: '/404',
    hidden: true
  });
  return routlist;
}
function submenu(sub) {
  const slist = [];
  sub.forEach((i) => {
    let mitem = {};
    let funs=[]
    let editfields=[]
    let readfields=[]
    let hidefields=[]
    console.log(mitem)
    if(i.menu_permission)
    {
      funs = i.menu_permission.funs
      editfields=i.menu_permission.editfields 
      hidefields=i.menu_permission.hidefields
      readfields=i.menu_permission.readfields
    }
      mitem = {
        path: i.path,
        name: i.code,
        component: (resolve) => require(['@/views/' + i.viewpath + '.vue'], resolve),
        meta: {
          title: i.title,
          icon: i.icon,
          funs:funs,
          editfields:editfields,
          hidefields:hidefields,
          readfields:readfields
        }
      };
      const haschild = i.children.length;
      if (haschild > 0) {
        mitem.children = submenu(i.children);
      }
      slist.push(mitem);
  });
  return slist;
}