import {getStore, removeStore, setStore} from '@/util/store'
import {checkLastUpdateTime, getAllDict} from '@/api/admin/dict'

const dict = {
    state: {
        times: 0
    },
    actions: {
        GetAllDicts({commit}) {
            checkLastUpdateTime().then(times => {
                const lastTime = getStore({name: "DICT_LAST_UPDATE_TIME"});
                if (times != lastTime) {
                    this.state.times = times;
                    return new Promise((resolve, reject) => {
                        getAllDict().then(response => {
                            commit('SET_SYS_DICT', response);
                            commit('SET_SYS_DICT_UPDATE_TIME', this.state.times);
                            resolve();
                        }).catch(error => {
                            reject(error);
                        })
                    });
                }
            });
        }
    },
    mutations: {
        SET_SYS_DICT: (state, dicts) => {
            removeStore({
                name: 'SYS_STORE_DICT_DATAS'
            });
            setStore({
                name: 'SYS_STORE_DICT_DATAS',
                content: dicts
            });
        },
        SET_SYS_DICT_UPDATE_TIME: (state, times) => {
            setStore({
                name: 'DICT_LAST_UPDATE_TIME',
                content: times
            });
        }
    }
}
export default dict
