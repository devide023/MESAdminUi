import Vue from 'vue'
import router from '@/router/index'
Vue.directive('fun', {
    inserted: function (el, binding) {
        const funs = router.currentRoute.meta.funs
        if (funs) {
            const hadfun = funs.filter(item => {
                return item === binding.value.code
            })
            if (hadfun.length === 0) {
                el.parentNode.removeChild(el);
            }
        } else {
            el.parentNode.removeChild(el);
        }
    }
})

Vue.directive('hide', {
    inserted: function (el, binding) {
        const hidecols = router.currentRoute.meta.hidefields
        const col = binding.value.code
        if (hidecols) {
            let exist = hidecols.filter(i => i === col).length
            if (exist > 0) {
                el.parentNode.removeChild(el);
            }
        }
    }
})

Vue.directive('edit', {
    inserted: function (el, binding) {
        const editcols = router.currentRoute.meta.editfields
        const col = binding.value.code
        if (editcols) {
            let exist = editcols.filter(i => i === col).length
            if (exist === 0) {
                el.parentNode.removeChild(el);
            }
        }
    }
})

