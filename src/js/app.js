import './../sass/style.scss';
// Основные зависимости
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMeta from 'vue-meta';
import Axios from 'axios';
import VueAxios from 'vue-axios';

// Компоненты приложения
import mainComponent from 'Components/mainComponent/mainComponent';

// vuex
import {store} from 'Store/store'

Vue.use(VueRouter);
Vue.use(VueMeta);
Vue.use(VueAxios, Axios);

// Роутер приложения
export const router = new VueRouter({
	mode: 'history',
	base: '/',
	routes: [
		{
			path: '/',
			component: mainComponent,
		},
		// {
		// 	path: '*',
		// 	component: ErrorsComponent,
		// 	name: 'error'
		// }
	]
});
// Инициализируем приложение
export const app = new Vue({
	el: '#app',
	store,
	router,
	template: `<router-view></router-view>`,
	components: {
		"mainComponent": mainComponent
	},
	methods: {
	},
	mounted() {
		// alert('')
	},
	beforeDestroy() {
	},
});

//Полифил для ie9 для создания кастомных событий
(function () {
	if ( typeof window.CustomEvent === "function" ) return false;
	function CustomEvent ( event, params ) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		var evt = document.createEvent( 'CustomEvent' );
		evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
		return evt;
	}
	CustomEvent.prototype = window.Event.prototype;
	window.CustomEvent = CustomEvent;
})();
