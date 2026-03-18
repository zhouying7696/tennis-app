// index.js
const app = getApp();
const { api } = require('../../utils/request');

Page({
  data: {
    currentTime: '',
    userInfo: {},
    activities: [],
    loading: false,
    searchText: ''
  },

  onLoad() {
    this.updateCurrentTime();
    this.getUserInfo();
    this.getActivities();
  },

  onShow() {
    this.updateCurrentTime();
  },

  // 更新当前时间
  updateCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.setData({
      currentTime: `${hours}:${minutes}`
    });
  },

  // 获取用户信息
  getUserInfo() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      });
    } else {
      // 尝试从本地存储获取
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        this.setData({
          userInfo
        });
      }
    }
  },

  // 获取活动列表
  getActivities() {
    this.setData({ loading: true });
    api.activity.getList()
      .then(res => {
        this.setData({
          activities: res.activities || [],
          loading: false
        });
      })
      .catch(err => {
        console.error('获取活动列表失败:', err);
        this.setData({ loading: false });
      });
  },

  // 刷新活动列表
  refreshActivities() {
    this.getActivities();
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({
      searchText: e.detail.value
    });
  },

  // 查看全部活动
  viewAllActivities() {
    wx.navigateTo({
      url: '/pages/filter/filter'
    });
  },

  // 跳转到创建活动页
  goToCreate() {
    wx.navigateTo({
      url: '/pages/create/create'
    });
  },

  // 跳转到赛事页
  goToTournament() {
    wx.navigateTo({
      url: '/pages/tournament/tournament'
    });
  },

  // 跳转到场地页
  goToVenues() {
    wx.navigateTo({
      url: '/pages/venues/venues'
    });
  },

  // 跳转到个人中心
  goToProfile() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    });
  },

  // 跳转到筛选页
  goToFilter() {
    wx.navigateTo({
      url: '/pages/filter/filter'
    });
  },

  // 跳转到活动详情
  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  // 报名活动
  joinActivity(e) {
    const id = e.currentTarget.dataset.id;
    api.activity.join(id)
      .then(res => {
        wx.showToast({
          title: '报名成功',
          icon: 'success'
        });
        // 刷新活动列表
        this.getActivities();
      })
      .catch(err => {
        wx.showToast({
          title: err.message || '报名失败',
          icon: 'none'
        });
      });
  },

  // 阻止事件冒泡
  preventBubbling(e) {
    e.stopPropagation();
  }
});