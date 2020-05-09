/**
 * 全站权限配置
 *
 */
import router from './router/router'
import store from '@/store'
import {validatenull} from '@/util/validate'
// progress bar 进度条
import NProgress from 'nprogress'
// progress bar style
import 'nprogress/nprogress.css'

NProgress.configure({showSpinner: false});

/**
 * 全局路由，进入路由前的业务处理
 */
router.beforeEach((to, from, next) => {
  // 缓冲设置
  if (to.meta.keepAlive === true && store.state.tags.tagList.some(ele => {
    return ele.value === to.fullPath;
  })) {
    to.meta.$keepAlive = true;
  } else {
    NProgress.start();
    if (to.meta.keepAlive === true && validatenull(to.meta.$keepAlive)) {
      to.meta.$keepAlive = true;
    } else {
      to.meta.$keepAlive = false;
    }
  }
  const meta = to.meta || {};
  if (store.getters.auth_code) {
    if (to.path === '/login') {
      next({path: '/'});
    } else {
      // NOTE: 当用户角色不存在时，会存在无限请求用户信息接口的问题
      if (store.getters.roles.length === 0) {
        store.dispatch('GetUserInfo').then(() => {
          next();
        }).catch(() => {
          store.dispatch('FedLogOut').then(() => {
            next({path: '/login'});
          });
        });
      } else {
        const value = to.query.src || to.fullPath;
        const label = to.query.name || to.name;
        if (meta.isTab !== false && !validatenull(value) && !validatenull(label)) {
          store.commit('ADD_TAG', {
            label: label,
            value: value,
            params: to.params,
            query: to.query,
            group: router.$avueRouter.group || []
          })
        }
        next();
      }
    }
  } else {
    if (meta.isAuth === false) {
      // 跳转至下个路由
      next();
    } else {
      // 跳转至登录页
      next({path: '/login'});
    }
  }
})

router.afterEach(() => {
  NProgress.done()
  const title = store.getters.tag.label
  router.$avueRouter.setTitle(title)
})
