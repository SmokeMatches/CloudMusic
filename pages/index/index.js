// pages/index/index.js
import {request} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],
    recommendList:[],
    topList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   this.getSwiper()
   this.getRecommenMusic()
   this.getTopList()
  },

  getSwiper(){
     request('/banner',{type:1}).then(res=>{
      this.setData({
        bannerList:res.banners
      })
    }).catch(err=>{
      console.log(err);
    })
  },
  getRecommenMusic(){
    request('/personalized',{limit:10}).then(res=>{
      this.setData({
        recommendList:res.result
      })
    }).catch(err=>{
      console.log(err);
    })
  },
  // 获取排行榜数据
  getTopList(){
    let index =0
    let resultArr=[]
    while(index<5){
      request('/top/list',{idx:index++}).then(res=>{
        let topListItem = {name:res.playlist.name,tracks:res.playlist.tracks.slice(0,3)}
        resultArr.push(topListItem)
        this.setData({
          topList:resultArr
        })
      }).catch(err=>{
        console.log(err);
      })
    }
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