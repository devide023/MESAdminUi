import request from '@/utils/request'
export default {
    menu_list:(data)=>{
        return request({
            url:'/menu/list',
            method:'post',
            data
        })
    },
    menu_tree:(data)=>{
        return request({
            url:'/menu/tree',
            method:'post',
            data
        })
    },
    menu_sub:(data)=>{
        return request({
            url:'/menu/submenu',
            method:'post',
            data
        })
    },
    add_menu:(data)=>{
        return request({
            url:'/menu/add',
            method:'post',
            data
        })
    },
    edit_menu:(data)=>{
        return request({
            url:'/menu/edit',
            method:'post',
            data
        })
    },
    find_menu:(data)=>{
        return request({
            url:'/menu/find',
            method:'get',
            params:data
        })
    },
    get_menucode:(data)=>{
        return request({
            url:'/menu/menucode',
            method:'get',
            params:data
        })
    },
    add_menu_funs:(data)=>{
        return request({
            url: '/menu/add_funs_field',
            method: 'post',
            data
        })
    },
    menu_permission_tree:()=>{
        return request({
            url: '/menu/permission_tree',
            method: 'get'
        })
    }
}