import {serialize} from '@/util/util'
import NProgress from 'nprogress' // progress bar
import errorCode from '@/const/errorCode'
import router from "@/router/router"
import {Message} from 'element-ui'
import 'nprogress/nprogress.css'
import store from "@/store"; // progress bar style

axios.defaults.timeout = 30000
// 返回其他状态吗
axios.defaults.validateStatus = function (status) {
    return status >= 200 && status <= 500; // 默认的
}
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true
// NProgress Configuration
NProgress.configure({
    showSpinner: false
});

// HTTP request拦截
axios.interceptors.request.use(config => {
    // start progress bar
    NProgress.start();
    const isToken = (config.headers || {}).isToken === false;
    let token = store.getters.auth_code;
    if (token && !isToken) {
        // token
        config.headers['auth_code'] = token;
    }
    // headers中配置serialize为true开启序列化
    if (config.methods === 'post' && config.headers.serialize) {
        config.data = serialize(config.data)
        delete config.data.serialize
    }
    return config
}, error => {
    return Promise.reject(error)
});

// HTTP response拦截
axios.interceptors.response.use(res => {
    NProgress.done();
    const status = Number(res.status) || 200;
    // const result = JSON.parse(res.data);
    const result = res.data;
    const message = result.msg || errorCode[status] || errorCode['default'];
    if (result.code === 20005) {
        store.dispatch('FedLogOut').then(() => {
            router.push({path: '/login'});
        })
        return;
    }
    if (result.code != 0) {
        Message({
            message: result.msg,
            type: 'error'
        });
        return Promise.reject(new Error(result.msg));
    }
    return result.data;
}, error => {
    NProgress.done();
    return Promise.reject(new Error(error));
});
export default axios
