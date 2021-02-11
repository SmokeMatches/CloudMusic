// pages/video/video.js
import {request} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:{},
    navId:'',
    videoList:{},
    videoId:'',
    videoRecordTime:[],
    isTriggered:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNavGroupList()
  },
  toSearch(){
    console.log(1);
  },
  // 获取导航栏数据
  getNavGroupList(e){
    request('/video/group/list').then(res=>{
      this.setData({
        videoGroupList:res.data.slice(0,12),
        navId:res.data[0].id
      })
      this.getNavContent(this.data.navId)
    }).catch(err=>{
      console.log(err);
    })
  },
  // 切换导航
  changeNav(e){
    this.setData({
      navId:e.currentTarget.id>>>0,
      videoList:[]
    })
    wx.showLoading({
      title: '正在加载',
    })
    this.getNavContent(this.data.navId)
  },
  // 获取导航内容
  getNavContent(id){
    request('/video/group',{id}).then(res=>{
      wx.hideLoading()
      this.setData({
        videoList:res.datas,
        isTriggered:false
      })
    })
  },
  // 播放/继续播放
  handlePlay(e){
    let vid = e.currentTarget.id
    this.setData({
      videoId:vid
    })
    
    this.vid!=vid && this.videoContext && this.videoContext.stop()
    this.vid = vid
    this.videoContext = wx.createVideoContext(vid)
    let {videoRecordTime} =this.data
    let index = videoRecordTime.find(item=>item.vid===e.currentTarget.id)
    if(index){
      this.videoContext.seek(index.currentTime)
    }else{
      this.videoContext.play()
    }
    
  },
  // 自动播放到上一次的位置
  handleTimeUpdate(e){
    let videoTimeObj = {vid:e.currentTarget.id,currentTime:e.detail.currentTime}
    let {videoRecordTime} = this.data
    let IsCord = videoRecordTime.find(item=>item.vid===videoTimeObj.vid)
    
    if(IsCord){
      IsCord.currentTime = e.detail.currentTime
    }else{
      videoRecordTime.push(videoTimeObj)
    }
    this.setData({
      videoRecordTime
    })
  },
  // 播放结束后重置
  handleEnded(e){
    let {videoRecordTime} = this.data
    let index = videoRecordTime.findIndex(item=>item.vid===e.currentTarget.id)
    videoRecordTime.splice(index,1)
    this.setData({
      videoRecordTime
    })
  },
  // 下拉刷新数据
  handleRefresher(){
    this.getNavContent(this.data.navId)
  },
  // 上拉刷新数据
  handleToLower(){
    let NewVideolist = []
    request('/video/group',{id:this.data.navId}).then(res=>{
      NewVideolist = res.datas
      let videoList =this.data.videoList
      videoList.push(...NewVideolist)
      this.setData({
        videoList
      })
    })
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