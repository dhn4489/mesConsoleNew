import { login, logout, getInfo, beforelogin,getProjects } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    username: '',
    // member:'',
    // roles:[],
    // foreignid:''
    member: sessionStorage.getItem('member') || '', // 从 sessionStorage 读取
    roles: JSON.parse(sessionStorage.getItem('roles')) || [], // 从 sessionStorage 读取
    foreignid: sessionStorage.getItem('foreignid') || '' // 从 sessionStorage 读取
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USERNAME: (state,username)=>{
    state.username=username
  },
  SET_MEMBER: (state,member)=>{
    state.member=member
    sessionStorage.setItem('member', member); // 存储到 sessionStorage
  },
  SET_ROLES:(state,roles)=>{
    state.roles=roles
    sessionStorage.setItem('roles', JSON.stringify(roles)); // 存储到 sessionStorage
  },
  SET_FOREIGNID:(state,foreignid)=>{
    state.foreignid=foreignid
    sessionStorage.setItem('foreignid', foreignid); // 存储到 sessionStorage
  
  },
  RESET_CHIOCE: (state) => {
    Object.assign(state, getDefaultState())
    sessionStorage.clear() // 清空 sessionStorage 数据
    console.log('state cleared successfully.')
    console.log('sessionStorage after reset:', sessionStorage)
    //location.reload();

  },
}

const actions = {
  // user login
  
  login({ commit }, userInfo) {
  //  console.log(process.env.VUE_APP_BASE_API); // 应输出 '/dev-api'
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
     // console.log('Sending login request with data:', { id: username.trim(), password: password });
      login({ "username": username.trim(), "password": password }).then(response => {
        const  {data}  = response
           console.log('response in login: ',data)
         commit('SET_TOKEN', data)
         setToken(data)
         resolve()
          // 检查后端返回的code值，code为0表示成功
      // if (data && data.code === 0 && data.data) {
      //   const token = data.data
      //   commit('SET_TOKEN', token)
      //   setToken(token)
      //   resolve()
      // } else {
      //   // 如果code不是0，表示失败，输出错误信息
      //   console.error('Login failed: ', data.message || 'Unknown error')
      //   reject(new Error(data.message || 'Login failed'))
      // }
      }).catch(error => {
        // console.error('Error response:', error.response);
        // reject(error)
        if (error.response) {
          console.error('Error response:', error.response);
          reject(error.response);  // 返回完整的错误响应
        } else {
          console.error('Request error:', error.message);  // 捕获其他类型的错误
          reject(error);
        }
      })
    })
  },
  beforelogin({ commit }, userInfo) {
    const { username, password } = userInfo

    return new Promise((resolve, reject) => {
      // 调用后台接口进行账号验证，注意这里不涉及 token 的处理
      commit('SET_USERNAME',username)
    //  console.log(' run beforelofin')
      beforelogin({ username: username.trim(), password: password }).then(response => {
       // const { data } = response
        // 如果账号存在且验证通过，则执行某些操作
      //  console.log('response in beforelogin',response)
        if (response.code === 0) {
          // 根据需求可以执行其他操作
          console.log('success')
          resolve()
        } else {
          reject('Account does not exist or incorrect credentials')
          console.log('fail')
        }
      }).catch(error => {
        console.log('error caught:', error)  // 捕获到的错误
        reject(error)
      })
    })
  },
 //获取用户拥有的member信息
  async getProjects({ commit }, identity) {
      try {
        const response = await getProjects({ identity })  // 请求 API 获取数据
     //  console.log('response in getproject',response.data)
        if (response.code === 0) { 
          return response.data  // 返回获取到的数据
        } else {
          throw new Error('获取项目数据失败')
        }
      } catch (error) {
        throw error  // 抛出错误，方便组件捕获
      }
    },
  
  // 获取所选member信息
  getInfo({ commit  },userInfo) {
 
    console.log('tabledataa in getinfo',userInfo)
    const typeMap = {
      1: 'projectGroup',
      2: 'processGroup',
      // 3: '物流组',
      // 4: '研发组',
      7:'fund',
      8:'business'
      // 可以继续扩展其他组别
    };
    
    // 获取对应类型的组别名称
    const groupName = typeMap[userInfo.type] || 'unknowen';  // 默认为 '未知组'
    
    // 设置 member
    commit('SET_MEMBER',groupName)
    //设置外键
    commit('SET_FOREIGNID',userInfo.foreignID)
    //console.log('foreign id',userInfo.foreignID)
    return new Promise((resolve, reject) => {
      getInfo({ groupname: groupName, foreignid: userInfo.foreignID }).then(response => {
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }

       // const { name, avatar,roles } = data
       //const {name} = data
        //commit('SET_NAME', name)
        //commit('SET_AVATAR', avatar)
        // 提取所有的 name，如果 data 是一个数组，收集所有 name；否则直接用 data.name
  const names = Array.isArray(data) 
  ? data.map(item => item.name)  // 提取每个对象的 name
  : [data.name];                // 如果 data 不是数组，将单个 name 放入数组
  console.log('names in getinfo1:',names)
        // 提交到 SET_ROLES
      commit('SET_ROLES', names);

       // commit('SET_ROLES',name)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_CHIOCE')
        commit('RESET_STATE')
        location.reload();
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

