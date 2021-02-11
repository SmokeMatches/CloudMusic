import {request} from '../../utils/util'
let startY=0
let moveY =0
let leaveY=0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform:'translateY(0)',
    coveTransition:'transform 1s linear',
    userinfo:'',
    recentPlayList:''
  },
  // 前往登录页面
  toLogin(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  // 获取用户登录信息
  getuserInfo(){
    let userinfo=wx.getStorageSync('userinfo')
    this.setData({
      userinfo:JSON.parse(userinfo)
    })
    this.getreCord(this.data.userinfo.userId)
  },
  // 获取用户播放记录
  getreCord(userid){
    request('/user/record',{uid:userid,type:0}).then(res=>{
      this.setData({
        recentPlayList:res.allData.slice(0,10)
      })
    }).catch(err=>{
      console.log(err);
    })
  },
  // 滑动处理函数
  handleTouchStart(e){
    this.setData({
      coveTransition:''
    })
    startY=e.touches[0].clientY
  },
  handleTouchMove(e){
    moveY=e.touches[0].clientY
    leaveY =moveY-startY
    if(leaveY<0){
      return
    }else if(leaveY>=80){
      leaveY=80
    }
    this.setData({
      coverTransform:`translateY(${leaveY}rpx)`
    })
  },
  handleTouchEnd(){
    this.setData({
      coverTransform:`translateY(0rpx)`,
      coveTransition:`transform 1s linear`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getuserInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})