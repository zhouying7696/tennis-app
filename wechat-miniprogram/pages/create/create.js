// create.js
Page({
  data: {
    currentTime: '',
    activityType: '',
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    venue: null,
    courtType: '',
    maxPlayers: 4,
    level: '',
    feeEnabled: false,
    fee: '',
    perPersonFee: 0,
    description: '',
    selectedRuleTemplate: '',
    rules: [],
    customRule: '',
    showRulePreview: false,
    rulePreview: ''
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

  goBack() {
    wx.navigateBack();
  },

  selectActivityType() {
    // 模拟活动类型选择
    const types = ['友谊赛', '训练', '比赛', '活动'];
    wx.showActionSheet({
      itemList: types,
      success: (res) => {
        this.setData({
          activityType: types[res.tapIndex]
        });
      }
    });
  },

  onTitleInput(e) {
    this.setData({
      title: e.detail.value
    });
  },

  selectDate() {
    wx.datePicker({
      startDate: new Date(),
      success: (res) => {
        this.setData({
          date: res.date
        });
      }
    });
  },

  selectTime() {
    // 模拟时间选择
    wx.showModal({
      title: '选择时间',
      content: '请选择活动开始和结束时间',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            startTime: '14:00',
            endTime: '16:00'
          });
        }
      }
    });
  },

  selectVenue() {
    // 模拟场地选择
    const venues = [
      { id: 1, name: '网球中心', address: '体育中心路123号' },
      { id: 2, name: '城市网球场', address: '城市公园内' },
      { id: 3, name: '大学网球场', address: '大学路456号' }
    ];
    wx.showActionSheet({
      itemList: venues.map(v => v.name),
      success: (res) => {
        this.setData({
          venue: venues[res.tapIndex]
        });
      }
    });
  },

  selectCourtType() {
    // 模拟场地类型选择
    const types = ['硬地', '红土', '草地'];
    wx.showActionSheet({
      itemList: types,
      success: (res) => {
        this.setData({
          courtType: types[res.tapIndex]
        });
      }
    });
  },

  decreasePlayers() {
    if (this.data.maxPlayers > 2) {
      this.setData({
        maxPlayers: this.data.maxPlayers - 1
      });
      this.updatePerPersonFee();
    }
  },

  increasePlayers() {
    if (this.data.maxPlayers < 12) {
      this.setData({
        maxPlayers: this.data.maxPlayers + 1
      });
      this.updatePerPersonFee();
    }
  },

  selectLevel() {
    // 模拟水平要求选择
    const levels = ['不限', '新手', '中级', '高级'];
    wx.showActionSheet({
      itemList: levels,
      success: (res) => {
        this.setData({
          level: levels[res.tapIndex]
        });
      }
    });
  },

  toggleFee() {
    this.setData({
      feeEnabled: !this.data.feeEnabled
    });
    this.updatePerPersonFee();
  },

  onFeeInput(e) {
    this.setData({
      fee: e.detail.value
    });
    this.updatePerPersonFee();
  },

  updatePerPersonFee() {
    if (this.data.feeEnabled && this.data.fee) {
      const perPerson = parseFloat(this.data.fee) / this.data.maxPlayers;
      this.setData({
        perPersonFee: perPerson
      });
    } else {
      this.setData({
        perPersonFee: 0
      });
    }
  },

  onDescriptionInput(e) {
    this.setData({
      description: e.detail.value
    });
  },

  addQuickTag(e) {
    const tag = e.currentTarget.dataset.text || e.target.innerText;
    this.setData({
      description: this.data.description + ' ' + tag
    });
  },

  selectRuleTemplate(e) {
    const template = e.currentTarget.dataset.template;
    this.setData({
      selectedRuleTemplate: template
    });
    
    // 根据模板设置规则
    let rules = [];
    switch (template) {
      case 'friendly':
        rules = [
          { category: '比赛规则', text: '采用友谊赛规则，比分不计入排名', checked: true },
          { category: '装备要求', text: '请自备球拍和球', checked: true },
          { category: '时间安排', text: '按时到达，不要迟到', checked: true }
        ];
        break;
      case 'training':
        rules = [
          { category: '训练内容', text: '基础技术训练和实战演练', checked: true },
          { category: '装备要求', text: '请自备球拍和球', checked: true },
          { category: '注意事项', text: '穿着运动服装和运动鞋', checked: true }
        ];
        break;
      case 'competitive':
        rules = [
          { category: '比赛规则', text: '采用正式比赛规则', checked: true },
          { category: '装备要求', text: '请自备球拍和球', checked: true },
          { category: '比赛纪律', text: '服从裁判判罚，保持体育精神', checked: true }
        ];
        break;
    }
    this.setData({ rules });
    this.updateRulePreview();
  },

  toggleRule(e) {
    const index = e.currentTarget.dataset.index;
    const rules = [...this.data.rules];
    rules[index].checked = !rules[index].checked;
    this.setData({ rules });
    this.updateRulePreview();
  },

  deleteRule(e) {
    const index = e.currentTarget.dataset.index;
    const rules = [...this.data.rules];
    rules.splice(index, 1);
    this.setData({ rules });
    this.updateRulePreview();
  },

  onCustomRuleInput(e) {
    this.setData({
      customRule: e.detail.value
    });
  },

  addCustomRule() {
    if (this.data.customRule) {
      const rules = [...this.data.rules, {
        category: '自定义',
        text: this.data.customRule,
        checked: true
      }];
      this.setData({
        rules,
        customRule: ''
      });
      this.updateRulePreview();
    }
  },

  toggleRulePreview() {
    this.setData({
      showRulePreview: !this.data.showRulePreview
    });
  },

  updateRulePreview() {
    const checkedRules = this.data.rules.filter(rule => rule.checked);
    const preview = checkedRules.map(rule => `${rule.category}: ${rule.text}`).join('\n');
    this.setData({
      rulePreview: preview
    });
  },

  get isFormValid() {
    return (
      this.data.activityType &&
      this.data.title &&
      this.data.date &&
      this.data.startTime &&
      this.data.endTime &&
      this.data.venue &&
      this.data.courtType &&
      this.data.level
    );
  },

  submitActivity() {
    if (!this.isFormValid) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    // 准备活动数据
    const activityData = {
      type: this.data.activityType,
      title: this.data.title,
      date: this.data.date,
      startTime: this.data.startTime,
      endTime: this.data.endTime,
      venueId: this.data.venue.id,
      venueName: this.data.venue.name,
      courtType: this.data.courtType,
      maxPlayers: this.data.maxPlayers,
      level: this.data.level,
      fee: this.data.feeEnabled ? this.data.fee : 0,
      description: this.data.description,
      rules: this.data.rules.filter(rule => rule.checked).map(rule => rule.text).join('\n')
    };

    // 模拟API调用
    wx.showLoading({
      title: '发布中...'
    });

    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '发布成功',
        icon: 'success'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }, 1500);
  }
});
