import {getStore, setStore} from '@/util/store'
import {isURL} from '@/util/validate'
import {getUserInfo, loginByUsername, logout} from '@/api/login'
import {deepClone, encryption} from '@/util/util'
import website from '@/const/website'
import {GetMenu} from '@/api/admin/menu'

function addPath(ele, first) {
    const propsConfig = website.menu.props;
    const propsDefault = {
        label: propsConfig.label || 'label',
        path: propsConfig.path || 'path',
        icon: propsConfig.icon || 'icon',
        children: propsConfig.children || 'children'
    };
    const isChild = ele[propsDefault.children] && ele[propsDefault.children].length !== 0;
    if (!isChild && first) {
        ele[propsDefault.path] = ele[propsDefault.path] + '/index';
        return;
    }
    ele[propsDefault.children].forEach(child => {
        if (!isURL(child[propsDefault.path])) {
            child[propsDefault.path] = `${ele[propsDefault.path]}/${child[propsDefault.path] ? child[propsDefault.path] : 'index'}`.replace("//", "/");
        }
        addPath(child);
    });
}

const user = {
    state: {
        userInfo: {},
        permissions: {},
        roles: [],
        menu: getStore({
            name: 'menu'
        }) || [],
        menuAll: [],
        expires_in: getStore({
            name: 'expires_in'
        }) || '',
        auth_code: getStore({
            name: 'auth_code'
        }) || '',
        refresh_token: getStore({
            name: 'refresh_token'
        }) || ''
    },
    actions: {
        // 根据用户名登录
        LoginByUsername({commit}, userInfo) {
            const user = encryption({
                data: userInfo,
                key: 'breeze2020Secret',
                param: ['password']
            })
            return new Promise((resolve, reject) => {
                loginByUsername(user.username, user.password, user.code, user.codeId).then(response => {
                    commit('SET_AUTH_CODE', response);
                    commit('CLEAR_LOCK');
                    resolve();
                }).catch(error => {
                    reject(error);
                })
            })
        },
        GetUserInfo({commit}) {
            return new Promise((resolve, reject) => {
                getUserInfo().then((res) => {
                    commit('SET_USER_INFO', res);
                    commit('SET_ROLES', res.roles || []);
                    commit('SET_PERMISSIONS', res.permissions || []);
                    resolve(res);
                }).catch(() => {
                    reject();
                })
            })
        },
        // 登出
        LogOut({commit}) {
            return new Promise((resolve, reject) => {
                logout().then(() => {
                    commit('SET_MENU', [])
                    commit('SET_PERMISSIONS', [])
                    commit('SET_USER_INFO', {})
                    commit('SET_AUTH_CODE', '')
                    commit('SET_ROLES', [])
                    commit('DEL_ALL_TAG')
                    commit('CLEAR_LOCK')
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 注销session
        FedLogOut({commit}) {
            return new Promise(resolve => {
                commit('SET_MENU', [])
                commit('SET_PERMISSIONS', [])
                commit('SET_USER_INFO', {})
                commit('SET_AUTH_CODE', '')
                commit('SET_REFRESH_TOKEN', '')
                commit('SET_ROLES', [])
                commit('DEL_ALL_TAG')
                commit('CLEAR_LOCK')
                resolve()
            })
        },
        // 获取系统菜单
        GetMenu({commit}, type) {
            return new Promise(resolve => {
                GetMenu().then((res) => {
                    let menu = deepClone(res);
                    menu.forEach(ele => {
                        addPath(ele);
                    });
                    commit('SET_MENU', {type, menu});
                    resolve(menu);
                })
            })
        }
    },
    mutations: {
        SET_AUTH_CODE: (state, auth_code) => {
            state.auth_code = auth_code;
            setStore({
                name: 'auth_code',
                content: state.auth_code,
                type: 'session'
            });
        },
        SET_EXPIRES_IN: (state, expires_in) => {
            state.expires_in = expires_in
            setStore({
                name: 'expires_in',
                content: state.expires_in,
                type: 'session'
            })
        },
        SET_REFRESH_TOKEN: (state, rfToken) => {
            state.refresh_token = rfToken
            setStore({
                name: 'refresh_token',
                content: state.refresh_token,
                type: 'session'
            })
        },
        SET_USER_INFO: (state, userInfo) => {
            state.userInfo = userInfo
        },
        SET_MENU: (state, params = {}) => {
            let {menu, type} = params;
            if (type !== false) {
                state.menu = menu;
            }
            setStore({
                name: 'menu',
                content: menu,
                type: 'session'
            });
        },
        SET_MENU_ALL: (state, menuAll) => {
            state.menuAll = menuAll
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_PERMISSIONS: (state, permissions) => {
            const list = {}
            for (let i = 0; i < permissions.length; i++) {
                list[permissions[i]] = true
            }
            state.permissions = list
        }
    }
}
export default user
