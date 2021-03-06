let { Tool, Event, Storage, RequestReadFactory } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    memberInfo: undefined,
    menuArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isLogin: Storage.didLogin()
    })
    this.initMenuArray();
    this.requestData();
    //注册通知
    Event.on('loginSuccessEvent', this.loginSuccess, this)
    Event.on('logoutEvent', this.logoutSuccess, this)
    Event.on('refreshMemberInfoNotice', this.loginSuccess, this)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    Event.off('loginSuccessEvent', this.loginSuccess)
    Event.off('logoutEvent', this.logoutSuccess)
    Event.off('refreshMemberInfoNotice', this.logoutSuccess)
  },

  /**
   * 登录成功
   */
  loginSuccess: function () {
    //获取用户数据
    this.requestMemberInfo();
  },

  /**
   * 退出登录成功
   */
  logoutSuccess: function () {
    this.setData({
      memberInfo: undefined,
      isLogin: false
    })
  },

  /**
   * 菜单点击
   */
  onMenuItemListener: function (e) {
    if (!Storage.didLogin()) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return;
    }
    let title = e.currentTarget.dataset.title;
    let url = '';
    if (title == '我的奖励') {
      //url = '/pages/my/my-award/my-award';
      if (this.data.memberInfo.IsSalesclerk == 'True'){
        url = '/pages/my/sale-changed/sale-changed';
      } else{
        url = '/pages/my/my-award/my-award';
      }
    } else if (title == '赚金币') {
      url = '/pages/my/sign/sign';
    } else if (title == '宝宝日记') {
      url = '/pages/my/baby-diary/baby-diary';
    } else if (title == '我的秒杀') {
        url = '/pages/my/my-seckill/my-seckill'
    } else if (title == '我的众筹') {
      url = '/pages/my/my-raise/my-raise';
    } else if (title == '我的团购') {
        url = '/pages/order/order-list/order-list?type=2'
    } else if (title == '我的试用') {
        url = '/pages/my/my-levy/my-levy';
    } else if (title == '我的积分订单') {
      url = '/pages/order/order-list/order-list?type=1'
    } else if (title == '我的问答') {
      url = '/pages/my/my-question/my-question';
    } else if (title == '发表的帖子') {
      url = '/pages/my/my-create-post/my-create-post';
    } else if (title == '回复的帖子') {
      url = '/pages/my/my-reply-post/my-reply-post';
    } else if (title == '收货地址管理') {
      url = '/pages/address/address';
    } else if (title == '扫一扫') {
      this.onCodeClickListener();
      return;
    }

    wx.navigateTo({
      url: url
    })
  },

  /**
   * 消息
   */
  onMessageClickListener: function () {
    wx.navigateTo({
      url: '/pages/message/message'
    })
  },

  /**
   * 扫码积分
   */
  onCodeClickListener: function () {
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        let result = res.result;
        let code = '';
        if (result.length > 0) {
          //如果字符串中包含code.topmom.com.cn,那么说明是积分,跳转到扫码成功界面
          if (result.indexOf('code.topmom.com.cn') >= 0) {
            code = result.substring(result.indexOf('?') + 1);
          } else if (!result.indexOf('http') == 0) {
            code = result;
          } else {
            Tool.showAlert('二维码不符合规范');
          }
        } else {
          Tool.showAlert('二维码不符合规范');
        }
        
        if (code.length > 0) {
          wx.navigateTo({
            //url: '/pages/code-success/code-success?code=' + code
            url: '/pages/code-web/code?code=' + code
          })
        }
      }
    })
  },

  /**
   * 设置
   */
  onSettingClickListener: function () {
    wx.navigateTo({
      url: '/pages/my/setting/setting'
    })
  },

  /**
   * 编辑资料
   */
  onEditClickListener: function () {
    if (Storage.didLogin()) {
      wx.navigateTo({
        url: '/pages/my/edit-profile/edit-profile'
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },
  /**
   * 金币
   */
  onCoinClickListener: function () {
    if (Storage.didLogin()) {
      wx.navigateTo({
        url: '/pages/my/coins/coins'
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },
  /**
   * 收藏
   */
  onCollectClickListener: function () {
    if (Storage.didLogin()) {
      wx.navigateTo({
        url: '/pages/my/collect/collect'
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },

  /**
   * 请求统一入口
   */
  requestData: function () {
    if (Storage.didLogin()) {
      this.requestMemberInfo();
    } else {
      this.setData({
        memberInfo: undefined
      });
    }
  },

  /**
   * 登录用户信息 
   */
  requestMemberInfo: function () {
    let r = RequestReadFactory.memberInfoRead();
    r.finishBlock = (req) => {
      let memberInfo = Storage.currentMember();

      this.setData({
        memberInfo: memberInfo,
        isLogin: true
      });

    };
    r.addToQueue();
  },
  /**
 * 初始化菜单数据
 */
  initMenuArray: function () {
    let menuArray = [
      {
        icon: '/res/img/my/cell/my-cell-award-icon.png',
        title: '我的奖励',
        hasArrow: true
      },
      {
        icon: '/res/img/my/cell/my-cell-sign-icon.png',
        title: '赚金币',
        hasArrow: true
      },
    //   {<!-- todo 1.3 -->
    //     icon: '/res/img/my/cell/my-cell-baby-diary-icon.png',
    //     title: '宝宝日记',
    //     hasArrow: true
    //   },
      {
        icon: '/res/img/my/cell/my-cell-qrcode-scan.png',
        title: '扫一扫',
        hasArrow: true,
        hasDivide: true
      },
      {
        icon: '/res/img/my/cell/my-cell-seckill-icon.png',
        title: '我的秒杀',
        hasArrow: true,
        hasDivide: true
      },
      {
        icon: '/res/img/my/cell/my-cell-raise-icon.png',
        title: '我的众筹',
        hasArrow: true
      },
      {
        icon: '/res/img/my/cell/my-cell-group-buy-icon.png',
        title: '我的团购',
        hasArrow: true
      },
      {
        icon: '/res/img/my/cell/my-cell-free-trial-icon.png',
        title: '我的试用',
        hasArrow: true
      },
      {
        icon: '/res/img/my/cell/my-cell-points-order-icon.png',
        title: '我的积分订单',
        hasArrow: true
      },
    //   {<!-- todo 1.3 -->
    //     icon: '/res/img/my/cell/my-cell-qa-icon.png',
    //     title: '我的问答',
    //     hasArrow: true,
    //     hasDivide: true
    //   },
    //   {
    //     icon: '/res/img/my/cell/my-cell-create-post-icon.png',
    //     title: '发表的帖子',
    //     hasArrow: true
    //   },
    //   {
    //     icon: '/res/img/my/cell/my-cell-reply-post-icon.png',
    //     title: '回复的帖子',
    //     hasArrow: true
    //   },
      {
        icon: '/res/img/my/cell/my-cell-address-icon.png',
        title: '收货地址管理',
        hasArrow: true,
        hasDivide: true
      }
    ];
    this.setData({
      menuArray: menuArray
    });
  }
})