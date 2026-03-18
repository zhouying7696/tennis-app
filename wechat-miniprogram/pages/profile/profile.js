// profile.js
Page({
  data: {
    currentTime: '',
    user: {
      id: '123456',
      name: '张三',
      level: '中级',
      levelNum: 5,
      currentXp: 680,
      nextLevelXp: 1000,
      xpPercentage: 68,
      stats: {
        activities: 24,
        wins: 15,
        ranking: 87
      }
    }
  },

  onLoad() {
    this.updateCurrentTime();
    setInterval(this.updateCurrentTime, 60000);
  },

  updateCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.setData({
      currentTime: `${hours}:${minutes}`
    });
  },

  navigateToMyActivities() {
    wx.showToast({
      title: '查看我的活动',
      icon: 'none'
    });
  },

  navigateToMyTournaments() {
    wx.showToast({
      title: '查看我的比赛',
      icon: 'none'
    });
  },

  navigateToMyVenues() {
    wx.showToast({
      title: '管理常用场地',
      icon: 'none'
    });
  },

  navigateToSettings() {
    wx.showToast({
      title: '进入设置页面',
      icon: 'none'
    });
  },

  navigateToHelp() {
    wx.showToast({
      title: '进入帮助页面',
      icon: 'none'
    });
  },

  navigateToAbout() {
    wx.showToast({
      title: '进入关于页面',
      icon: 'none'
    });
  }
});
