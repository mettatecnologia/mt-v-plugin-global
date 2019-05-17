var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// This exports the plugin object.
export default {
    // Tudo criado neste arquivo será global
    install (Vue, options) {
        // 1.Variaveis

        // 2. Diretivas
        Vue.directive('my-directive', {
            bind (el, binding, vnode, oldVnode) {}
        })

        // 3. Opções no componente
        Vue.mixin({
            created: function () {}
        })

        // 4. Metodos
        Vue.prototype.$isJson = function (str, pass_object) {
            let isJSON = require('is-json');
            return isJSON(str, pass_object);
        }
        Vue.prototype.$setFocus = function (ref) {
            //seta focus no mozilla firefox e edge principalmente
            const element = this.$refs[ref].$el.querySelector('input')
            if (element) this.$nextTick(() => { element.focus() })
        }
        Vue.prototype.$buscaItemDatatable = function (datatable, valor, campo='value') {
            let indexItem = -1;
            let result = datatable.filter( dtItem => {
                if(dtItem[campo] == valor){
                    indexItem = datatable.indexOf(dtItem)
                    return datatable[indexItem];
                }
            });

            return {
                index: indexItem,
                result: result.length ? result[0] : null,
            }
        }



    }
}


