import request from '@/utils/request';
export default
    {
        role_list: function (data) {
            return request({
                url: "/role/list",
                method: "post",
                data: data
            });
        },

        all_role_list: function () {
            return request({
                url: "/role/alllist",
                method: "get"
            })
        },
        add_role: (data) => {
            return request({
                url: "/role/add",
                method: "post",
                data
            })
        }

    }