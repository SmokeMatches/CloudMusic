import {request} from '../../utils/util'
import PubSub from 'pubsub-js'
import moment from 'moment'
let globalInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,
    song:{},
    musicLink:'',
    PlayId:'',
    currentTime:'00:00', //歌曲当前时间
    durationTime:'',  //歌曲总时间
    currentWidth:'' , //进度条宽度
    playModel:0
  },

  /**1373168742
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMusicInfo(options.ids)
    let musId = parseInt(options.ids)
    if(globalInstance.globalData.IsMusicPlay&&globalInstance.globalData.musicId === musId){
      console.log(222);
      this.setData({
        isPlay:true
      })
    }
    // 初始化背景音乐实例
    this.bgm = wx.getBackgroundAudioManager()
    // 监听播放
    this.bgm.onPlay(()=>{
      this.musicStatus(true)
      globalInstance.globalData.musicId=this.data.PlayId
    })
    // 监听暂停
    this.bgm.onPause(()=>{
      this.musicStatus(false)
    })
    // 监听停止
    this.bgm.onStop(()=>{
      this.musicStatus(false)
    })
    // 监听时间变化
    this.bgm.onTimeUpdate(()=>{
      let currentTime = moment(this.bgm.currentTime*1000).format('mm:ss')
      let currentWidth =this.bgm.currentTime/this.bgm.duration *450
      this.setData({
        currentTime,
        currentWidth
      })
    })
    // 监听播放结束
    this.bgm.onEnded(()=>{
      PubSub.publish('switchSong','next')
      this.setData({
        currentWidth:0,
        currentTime:'00:00'
      })
    })
  },
  // 获取音乐详情
  getMusicInfo(ids){
    request('/song/detail',{ids}).then(res=>{
      let durationTime = moment(res.songs[0].dt).format('mm:ss')
      this.setData({
        song:res.songs[0],
        durationTime
      })
      wx.setNavigationBarTitle({
        title:this.data.song.name
      })
    })
  },
  // 播放暂停
  handleMusicPlay(){
    this.setData({
      isPlay:!this.data.isPlay
    })
    this.PalyPause(this.data.isPlay,this.data.song.id,this.data.musicLink)
  },
  // 监听音乐状态
  musicStatus(isPlay){
    this.setData({
      isPlay
    })
    globalInstance.globalData.IsMusicPlay=isPlay
  },
  // 控制音乐播放暂停
  PalyPause(isPlay,id,musicLink){
    if(isPlay){
      if(!musicLink){
        request('/song/url',{id}).then(res=>{
          this.bgm.src = res.data[0].url
          this.bgm.title = this.data.song.name
          this.setData({
            musicLink:res.data[0].url,
            PlayId:id
          })
        })
      }else{
        this.bgm.src = this.data.musicLink
        this.bgm.title = this.data.song.name
      }
    }else{
      this.bgm.pause()
    }
  },
  // 选择播放模式
  chooseModel(e){
    this.setData({
      playModel:e.currentTarget.dataset.id
    })
    globalInstance.globalData.model =e.currentTarget.dataset.id
  },
  // 切歌
  handleSwitch(e){
    this.bgm.stop()
    PubSub.subscribe('changeSong',(msg,id)=>{
      this.getMusicInfo(id)
      this.PalyPause(true,id)
      PubSub.unsubscribe('changeSong')
    })
    PubSub.publish('switchSong',{type:e.currentTarget.id,model:this.data.playModel})
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      playModel:globalInstance.globalData.model
    })
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