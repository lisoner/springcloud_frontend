import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'font-awesome/css/font-awesome.min.css'
import axios from 'axios'
import qs from 'qs'
import {
	getCurDate,
	setSessionStorage,
	getSessionStorage,
	removeSessionStorage,
	setLocalStorage,
	getLocalStorage,
	removeLocalStorage
} from './common.js'

// 设置axios的基础url部分
axios.defaults.baseURL = 'http://localhost:14000/';
// 设置响应拦截器
axios.interceptors.response.use(function(response) {
	if (response.data.code === 403) {
		location.href = '/error403';
	}
	return response;
}, function(error) {
	console.log(error);
	return Promise.reject(error);
});

Vue.config.productionTip = false

// 将axios挂载到vue实例上，使用时就可以 this.$axios 这样使用了
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
Vue.prototype.$getCurDate = getCurDate;
Vue.prototype.$setSessionStorage = setSessionStorage;
Vue.prototype.$getSessionStorage = getSessionStorage;
Vue.prototype.$removeSessionStorage = removeSessionStorage;
Vue.prototype.$setLocalStorage = setLocalStorage;
Vue.prototype.$getLocalStorage = getLocalStorage;
Vue.prototype.$removeLocalStorage = removeLocalStorage;

router.beforeEach(function(to, from, next) {
	let user = sessionStorage.getItem('user');
	// 除了登录、注册、首页、商家列表、商家信息之外，都需要判断是否登录
	if (!(to.path === '/' || to.path === '/index' || to.path === '/businessList' || to.path === '/businessInfo' || to.path === '/login' || to.path === '/register' || to.path === '/error403')) {
		if (user == null) {
			router.push('/login');
			location.reload();
		}
	}
	next();
});

new Vue({
	router,
	render: h => h(App),
	data() {
		return {
			userId: '',
			password: ''
		};
	},
	methods: {
		login() {
			let url = `/UserController/getUserByIdByPass/${this.userId}/${this.password}`;
			this.$axios.get(url).then(response => {
				let user = response.data.result;
				if (user == null || user === '') {
					alert('用户名或密码不正确！');
				} else {
					// sessionstorage有容量限制，为了防止数据溢出，所以不将userImg数据放入session中
					user.userImg = '';
					this.$setSessionStorage('user', user);
					this.$router.go(-1);
				}
			}).catch(error => {
				console.error(error);
			});
		}
	},
	created() {
		// 如果需要自动登录，可以在这里调用 login 方法
		// this.login();
	}
}).$mount('#app')