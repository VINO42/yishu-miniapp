//获取应用实例 BD3124
var constant = require('../../utils/constant');
import Dialog from '@vant/weapp/dialog/dialog';

const app = getApp()
Page({
  data: {
    listArr: [],     //数据集合
    pageIndex: 1,    //展示的当前页码
    pageSize: 40,   //每页加载的数据量（使用的json数据就是40条，实际工作根据需求来）
    pageCount: 3,    //总页数(假设的，实际应该是根据后台返回的数据)
    scrollTop: 0
  },
  /**
     * 初始化数据
     */
  loadInitData() {
    var that = this
    var pageIndex = 1
    if (that.data.pageIndex === 1) {
      wx.showLoading({
        title: '加载中...',
      })
    }
    // 刷新时，清空listArr，防止新数据与原数据冲突
    that.setData({
      listArr: []
    })

    //发送请求
    wx.request({
      url: 'http://127.0.0.1:8888/wechat/userPublishBookRecord/getUserPublisedBooks?current=' + pageIndex + '&size=' + 10,
      header: {
        'content-type': 'application/json',
        'X-Token-Header': wx.getStorageSync(constant.cache_constant.userToken)
      },
      method: 'POST',
      success: function (res) {
        // var data = JSON.parse(Dec.Decrypt(res.data));
        var data = res.data.data;

        var tempList = res.data.data.records;
        that.setData({
          pageCount: Math.ceil(data.total / 10),
          pageIndex: 1,
          ['listArr[' + (pageIndex - 1) + ']']: tempList  //动态修改数组某一项的值，需要加中括号
        })
      },
      fail: function (res) {
        wx.showLoading({
          title: '加载失败...',
        })
      },
      complete: function (res) {
        wx.hideLoading();
      },
    })

  },
  //加载更多
  loadMore() {
    var that = this
    var pageIndex = that.data.pageIndex
    pageIndex += 1
    wx.showLoading({
      title: '加载第' + pageIndex + '页',
    })

    wx.request({
      url: 'http://127.0.0.1:8888/wechat/userPublishBookRecord/page?current=' + pageIndex + '&size=' + 10,
      data: {
        'title': that.data.query,
        'regionId': this.data.regionId
      },
      header: {
        'content-type': 'application/json',
        'X-Token-Header': wx.getStorageSync(constant.cache_constant.userToken)
      },
      method: 'POST',
      success: function (res) {
        var data = res.data.data;

        //将新一页的数据添加到原数据后面
        let newList = data.records;
        that.setData({
          pageIndex: pageIndex,
          ['listArr[' + (pageIndex - 1) + ']']: newList
        })

      },
      fail: function (res) { },
      complete: function (res) {
        wx.hideLoading()
      },
    })

  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    let that = this

    that.loadInitData()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this,
      pageIndex = that.data.pageIndex,
      pageCount = that.data.pageCount;
    //当页面小于总页数时加载下页面
    if (pageIndex < pageCount) {
      that.loadMore()
    } else {
      wx.showToast({
        title: '没有更多了',
      })
    }
  },

  onShow: function () {
    this.loadInitData();
  },
  onLoad: function (opions) {
    let currPages = getCurrentPages();

    let regionId1 = wx.getStorageSync(constant.cache_constant.userRegionId);
    let regionName1 = wx.getStorageSync(constant.cache_constant.userRegionName);
    let currPage = currPages[currPages.length - 1];

    currPage.setData({ 'regionId': regionId1 })
    currPage.setData({ 'regionName': regionName1 })
    this.loadInitData();
  },
  onReady: function (options) {
    this.data.regionId = wx.getStorageSync(constant.cache_constant.userRegionId);
    this.data.regionName = wx.getStorageSync(constant.cache_constant.userRegionName);
  },

  redirectToDetail: function (event) {
    let id = event.currentTarget.id;
    wx.navigateTo({
      url: '../bookDetail/bookDetail?id=' + id
    })
  },
  //头部固定
  scrollTopFun(e) {
    let _this = this;
    let scrollTop = e.detail.scrollTop;
    _this.setData({
      scrollTop: scrollTop
    })
  },
  //监听屏幕滚动 判断上下滚动
  onPageScroll: function (ev) {
    var _this = this;
    //当滚动的top值最大或最小时，为什么要做这一步是因为在手机实测小程序的时候会发生滚动条回弹，所以为了处理回弹，设置默认最大最小值
    if (ev.scrollTop <= 0) {
      // 滚动到最顶部
      ev.scrollTop = 0;
      this.setData({ tabIsTop: false });
    } else if (ev.scrollTop > wx.getSystemInfoSync().windowHeight) {
      // 滚动到最底部
      ev.scrollTop = wx.getSystemInfoSync().windowHeight;
    }
    //判断浏览器滚动条上下滚动
    if (ev.scrollTop > this.data.scrollTop || ev.scrollTop == wx.getSystemInfoSync().windowHeight) {
      //向下滚动
      this.setData({ tabIsTop: true });
    } else {
      //向上滚动
    }
    //给scrollTop重新赋值
    setTimeout(function () {
      _this.setData({
        scrollTop: ev.scrollTop
      })
    }, 0)
  },
  //删除用户发布的图书
  deleteMyPublishedBook(e) {
    console.log("deleted")
    var _id = e.currentTarget.dataset.id;
    Dialog.confirm({
      title: '删除',
      message: '确定删除该图书发布?',
    })
      .then(() => {
        // on confirm
        wx.request({
          url: 'http://127.0.0.1:8888/wechat/userPublishBookRecord/delete?id=' + _id,
          method: 'POST',
          header: {
            'content-type': 'application/json',
            'X-Token-Header': wx.getStorageSync(constant.cache_constant.userToken)
          },
          success: res => {
            this.onLoad()
          }
        });
      })
      .catch(() => {
        // on cancel
      });
  }
})