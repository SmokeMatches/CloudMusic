import PubSub from 'pubsub-js'
import {request} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',
    month:'',
    eDRecommendList:'',
    index:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      day:new Date().getDate(),
      month:new Date().getMonth()+1
    })
    this.getEDRecommend()
    // 订阅上下一曲
    PubSub.subscribe('switchSong',(msg,config)=>{
      let idx =0
      if(config.model===0){
        if(config.type==='pre'){
          if(this.data.index===0){
             idx = this.data.eDRecommendList.length-1
          }else{
             idx = this.data.index -1
          }
          this.setData({
            index:idx
          })
          let song = this.data.eDRecommendList[idx].id
          PubSub.publish('changeSong',song)
        }else if(config.type==='next'){
          let idx =0
          if(this.data.index===this.data.eDRecommendList.length-1){
             idx = 0
          }else{
             idx = this.data.index +1
          }
          this.setData({
            index:idx
          })
          let song = this.data.eDRecommendList[idx].id
          PubSub.publish('changeSong',song)
        }
      }else if(config.model===1){
        let idx =this.data.index
        let song = this.data.eDRecommendList[idx].id
          PubSub.publish('changeSong',song)
      }else{
        let {index,eDRecommendList} = this.data
        let len =eDRecommendList.length
        let num = Math.floor(Math.random()*len)
        if(num===index){
          PubSub.publish('switchSong',{type:config.type,model:config.model})
        }else{
          let song = eDRecommendList[num].id
          PubSub.publish('changeSong',song)
        }
      }
    })
  },
  // 获取每日推荐歌曲
  getEDRecommend(){
    let userinfo = wx.getStorageSync('userinfo')
    if(!userinfo){
      wx.showToast({
        title: '请先登录',
        icon:'none',
        success(){
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }else{
      request('/recommend/songs').then(res=>{
        this.setData({
          eDRecommendList:res.recommend
        })
      })
    }
  },
  // 跳转音乐详情(播放)
  toSongDetail(e){
    let {index,song} = e.currentTarget.dataset
    this.setData({
      index
    })
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?ids='+song,
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