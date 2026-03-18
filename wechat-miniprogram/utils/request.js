// request.js
const app = getApp();

// 基础请求配置
const request = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: app.globalData.baseUrl + url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': app.globalData.token ? `Bearer ${app.globalData.token}` : ''
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          // 未授权，跳转到登录页
          wx.redirectTo({
            url: '/pages/login/login'
          });
          reject(new Error('未授权'));
        } else {
          reject(new Error(res.data.message || '请求失败'));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

// 封装常用请求方法
const api = {
  // 认证相关
  auth: {
    register: (data) => request('/auth/register', { method: 'POST', data }),
    login: (data) => request('/auth/login', { method: 'POST', data })
  },
  // 用户相关
  user: {
    getProfile: () => request('/users/profile'),
    updateProfile: (data) => request('/users/profile', { method: 'PUT', data })
  },
  // 活动相关
  activity: {
    getList: (params) => request('/activities', { data: params }),
    getDetail: (id) => request(`/activities/${id}`),
    create: (data) => request('/activities', { method: 'POST', data }),
    update: (id, data) => request(`/activities/${id}`, { method: 'PUT', data }),
    delete: (id) => request(`/activities/${id}`, { method: 'DELETE' }),
    join: (id) => request(`/activities/${id}/join`, { method: 'POST' }),
    leave: (id) => request(`/activities/${id}/leave`, { method: 'POST' })
  },
  // 场地相关
  venue: {
    getList: (params) => request('/venues', { data: params }),
    getDetail: (id) => request(`/venues/${id}`),
    create: (data) => request('/venues', { method: 'POST', data }),
    update: (id, data) => request(`/venues/${id}`, { method: 'PUT', data }),
    delete: (id) => request(`/venues/${id}`, { method: 'DELETE' })
  },
  // 赛事相关
  tournament: {
    getList: (params) => request('/tournaments', { data: params }),
    getDetail: (id) => request(`/tournaments/${id}`),
    create: (data) => request('/tournaments', { method: 'POST', data }),
    update: (id, data) => request(`/tournaments/${id}`, { method: 'PUT', data }),
    delete: (id) => request(`/tournaments/${id}`, { method: 'DELETE' }),
    join: (id) => request(`/tournaments/${id}/join`, { method: 'POST' }),
    leave: (id) => request(`/tournaments/${id}/leave`, { method: 'POST' })
  },
  // 统计相关
  stats: {
    getUserStats: () => request('/stats/users'),
    getActivityStats: () => request('/stats/activities'),
    getVenueStats: () => request('/stats/venues'),
    getTournamentStats: () => request('/stats/tournaments')
  }
};

module.exports = {
  request,
  api
};