// detail.js
Page({
  data: {
    currentTime: '',
    activity: {
      id: 1,
      type: '友谊赛',
      title: '周末网球友谊赛',
      hostName: '张三',
      date: '2024-06-15',
      startTime: '14:00',
      endTime: '16:00',
      venueName: '网球中心',
      venueAddress: '体育中心路123号',
      courtType: '硬地',
      level: '中级',
      currentPlayers: 2,
      maxPlayers: 4,
      fee: 100,
      description: '周末一起打网球，欢迎中级水平的球友参加！请自备球拍和球，准时到达。',
      rules: '1. 采用友谊赛规则，比分不计入排名\n2. 请自备球拍和球\n3. 按时到达，不要迟到\n4. 穿着运动服装和运动鞋'
    },
    participants: [
      { name: '张三', level: '中级', levelClass: 'mid' },
      { name: '李四', level: '高级', levelClass: 'adv' }
    ],
    emptySlots: [],
    participantAvatars: ['pa-green', 'pa-orange']
  },

  onLoad(options) {
    this.updateCurrentTime();
    setInterval(this.updateCurrentTime, 60000);
    this.calculateEmptySlots();
  },

  updateCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.setData({
      currentTime: `${hours}:${minutes}`
    });
  },

  calculateEmptySlots() {
    const { currentPlayers, maxPlayers } = this.data.activity;
    const emptyCount = maxPlayers - currentPlayers;
    const emptySlots = Array(emptyCount).fill({});
    this.setData({ emptySlots });
  },

  goBack() {
    wx.navigateBack();
  },

  joinActivity() {
    const { currentPlayers, maxPlayers } = this.data.activity;
    if (currentPlayers >= maxPlayers) {
      wx.showToast({
        title: '活动已满员',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '确认加入',
      content: `确定要加入"${this.data.activity.title}"吗？`,
      success: (res) => {
        if (res.confirm) {
          // 模拟加入活动
          wx.showLoading({
            title: '加入中...'
          });

          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({
              title: '加入成功',
              icon: 'success'
            });
            // 更新参与人数和空槽
            const updatedActivity = {
              ...this.data.activity,
              currentPlayers: this.data.activity.currentPlayers + 1
            };
            this.setData({ activity: updatedActivity });
            this.calculateEmptySlots();
          }, 1500);
        }
      }
    });
  },

  shareActivity() {
    wx.showActionSheet({
      itemList: ['分享给微信好友', '分享到朋友圈'],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 分享给微信好友
          wx.showToast({
            title: '分享给微信好友',
            icon: 'none'
          });
        } else if (res.tapIndex === 1) {
          // 分享到朋友圈
          wx.showToast({
            title: '分享到朋友圈',
            icon: 'none'
          });
        }
      }
    });
  }
});
