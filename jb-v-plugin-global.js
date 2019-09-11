var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// This exports the plugin object.
export default {
    // Tudo criado neste arquivo será global
    install (Vue, options) {
        //================================================
        // 1.Variaveis
        //================================================
        /**
         * ======================
         * Expressoes regulares
         * ======================
         */
        Vue.prototype.$buscarRegExp = function (tipo){

            let regex = {
                email: /^[^@]+@[^@]+\.[^@]+$/,
                cpf: /\d{3}\.\d{3}\.\d{3}-\d{2}/,
                cnpj: /\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/,
                date_ptbr: /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)((19|20))(\d{2})$/,
                date_us: /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/,
                time: /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/,
                datetime_us: /^\d\d\d\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][\d]|3[01]) (00|[\d]|1[\d]|2[0-3]):([\d]|[0-5][\d])?:?([\d]|[0-5][\d])$/,
                espacos: /\s/g,
            }

            return regex[tipo]
        }

        //================================================
        // 2. Diretivas
        //================================================
        Vue.directive('my-directive', {
            bind (el, binding, vnode, oldVnode) {}
        })

        //================================================
        // 3. Opções no componente
        //================================================
        Vue.mixin({
            created: function () {}
        })

        //================================================
        // 4. Metodos
        //================================================

        // ACOES
        Vue.prototype.$redirecionar = function (url) {
            window.location.href = url;
        }
        // OBJETOS
        Vue.prototype.$mesclarComponentesViaRef = function ($this, ignore=[]){
            let vuetify_comp = $this.$refs[$this.vuetify_ref]

            if( ! this.$typeof(ignore,'array')){
                ignore = [ignore]
            }

            if(ignore.indexOf('_props')<0){
                Object.assign(vuetify_comp._props, $this._props)
            }
            if(ignore.indexOf('$scopedSlots')<0){
                Object.assign(vuetify_comp.$scopedSlots, $this.$scopedSlots)
            }
            if(ignore.indexOf('$slots')<0){
                Object.assign(vuetify_comp.$slots, $this.$slots)
            }
            if(ignore.indexOf('_events')<0){
                Object.assign(vuetify_comp._events, $this._events)
            }


        }
        Vue.prototype.$clonarObjeto = function (obj){
            return JSON.parse(JSON.stringify(obj));
        }
        Vue.prototype.$criarObjetoMensagensForm = function (mensagens, tipo, detalhes) {
            return {
                mensagens: mensagens,
                tipo: tipo,
                detalhes: detalhes
            }
        }
        Vue.prototype.$buscaItemDatatable = function (datatable, valor_procurado, campo_de_busca='value', case_sensitive=false) {
            if(valor_procurado==undefined){
                return {
                    index: -1,
                    result: null,
                }
            }

            if( ! case_sensitive){
                valor_procurado = valor_procurado.toString().toUpperCase()
            }

            let indexItem = -1;
            let result = datatable.filter( dtItem => {
                let dtitem_valor = ! case_sensitive ? dtItem[campo_de_busca].toString().toUpperCase() : dtItem[campo_de_busca]

                if(dtitem_valor == valor_procurado){
                    indexItem = datatable.indexOf(dtItem)
                    return datatable[indexItem];
                }
            });

            return {
                index: indexItem,
                result: result.length ? result[0] : null,
            }
        }
        // ARRAY
        Vue.prototype.$criarArrayParaCombobox = function (obj, campo_text, campo_value){
            let primeira_key = Object.keys(obj)[0]
            let primeiro_item = obj[primeira_key]
            let obj_valido = {}.hasOwnProperty.call(primeiro_item, campo_text) && {}.hasOwnProperty.call(primeiro_item, campo_value)

            if( ! obj_valido){
                return []
            }

            let array = [];
            for (const item of obj ) {
                array.push({text:item[campo_text], value:item[campo_value]})
            }
            return array;
        }
        Vue.prototype.$removerElementosVaziosArray = function (array) {
            return array.filter(function (el) {
                return !!el;
            });
        }
        // DATE
        Vue.prototype.$passaDatetimeParaPtbr = function (datetime) {
            if(this.$buscarRegExp('datetime_us').test(datetime) || this.$buscarRegExp('date_us').test(datetime)){
                let [date, time] = datetime.split(' ')
                datetime = [date.split('-').reverse().join('/'), time].join(' ')
            }
            return datetime;
        }
        // STRING
        Vue.prototype.$removerEspacos = function (string) {
            let regex = this.$buscarRegExp('espacos')
            return string.replace(regex, ''); //remove os espaços
        }
        Vue.prototype.$removerAcentos = function (str) {
            str.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
            return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        }
        // MOEDA
        Vue.prototype.$formataNumeroParaMoeda = function (value, digits) {
            if(parseFloat(value)){
                value = new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: digits || 2
                }).format(value)
            }

            return value
        }
        // NUMEROS
        Vue.prototype.$formataNumeroParaCartaoCredito = function (numero) {
            var str = this.$removerEspacos(numero)
            var numberChunks = str.match(/.{1,4}/g); //separa o numero em grupos de 4
            var result = numberChunks.join(' ');
            return result
        }
        // OUTROS
        Vue.prototype.$typeof = function (v, eTipo){
            let tipo = typeof v
            if(tipo=='object' && Array.isArray(v))
            {
                tipo = 'array'
            }
            if(eTipo){
                return eTipo === tipo
            }
            return tipo
        }
        Vue.prototype.$isJson = function (str, pass_object) {
            let isJSON = require('is-json');
            return isJSON(str, pass_object);
        }



        // Vue.prototype.$setFocus = function (ref) {
        //     //seta focus no mozilla firefox e edge principalmente
        //     console.log(this.$refs);

        //     const element = this.$refs[ref].$el.querySelector('input')
        //     if (element) this.$nextTick(() => { element.focus() })
        // }





    }
}


