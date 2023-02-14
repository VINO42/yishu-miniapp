// app.js
globalData: {
  regionId:null;
  regionName: "全国";
  publish:null
}
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  editTabBar: function () {
    var _curPageArr = getCurrentPages();
    var _curPage = _curPageArr[_curPageArr.length - 1];
    var _pagePath = _curPage.__route__;
    if (_pagePath.indexOf('/') != 0) {
      _pagePath = '/' + _pagePath;
    }
    var tabBar = this.globalData.tabBar;
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == _pagePath) {
        tabBar.list[i].active = true;//根据页面地址设置当前页面状态    
      }
    }
    _curPage.setData({
      tabBar: tabBar
    });
  },
  //第二种状态的底部  
  editTabBar2: function () {
    var _curPageArr = getCurrentPages();
    var _curPage = _curPageArr[_curPageArr.length - 1];
    var _pagePath = _curPage.__route__;
    if (_pagePath.indexOf('/') != 0) {
      _pagePath = '/' + _pagePath;
    }
    var tabBar = this.globalData.tabBar2;
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == _pagePath) {
        tabBar.list[i].active = true;//根据页面地址设置当前页面状态    
      }
    }
    _curPage.setData({
      tabBar: tabBar
    });
  },  

  globalData: {
    userInfo: null,
    tabBar: {
      "color": "#9E9E9E",
      "selectedColor": "#f00",
      "backgroundColor": "#fff",
      "borderStyle": "#ccc",
      "custom": true,
      "list": [
        {
          pagePath: "/pages/index/index",
          text: "首页",
          iconPath: "/images/home.png",
          selectedIconPath: "/images/home.png",
          "clas": "menu-item",
          active: true
        },
        {
          "pagePath": "/pages/myBooks/myBooks",
          "text": "我的",
          "iconPath": "/images/mine.png",
          "selectedIconPath": "/images/mine.png",
          "clas": "menu-item",
          active: true
        }
      ],
      "position": "bottom"
    },
    tabBar2: {
      "color": "#9E9E9E",
      "selectedColor": "#f00",
      "backgroundColor": "#fff",
      "borderStyle": "#ccc",
      "custom": true,
      "list": [
        {
          "pagePath": "/pages/index/index",
          "text": "首页",
          "iconPath": "/images/home.png",
          "selectedIconPath": "/images/home.png",
          "clas": "menu-item2",
          active: true
        },      
         {
          "pagePath": "/pages/publishBook/publishBook",
          "text": "发布图书",
          "iconPath": "/images/upload.png",
          "selectedIconPath": "/images/upload.png",
          "clas": "menu-item2",
          active: true
        },
        {
          "pagePath": "pages/myBooks/myBooks",
          "text": "我的发布",
          "iconPath": "/images/mine.png",
          "selectedIconPath": "/images/mine.png",
          "clas": "menu-item2",
          active: true
        }
      ],
      "position": "bottom"
    }
  }
})
