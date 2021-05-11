import Vue from 'vue'
Vue.directive('fun', {
    inserted: function (el, binding, vnode, oldVnode) {
        const funs = vnode.context.$route.meta.fun;
        if (funs) {
            const hadfun = funs.filter(item => {
                return item.title === binding.value.fun
            })
            if (hadfun.length === 0) {
                el.parentNode.removeChild(el);
            }
        } else {
            el.parentNode.removeChild(el);
        }
    }
})

