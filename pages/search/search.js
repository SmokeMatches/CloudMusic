import {request} from '../../utils/util'
var isSend = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '', // placeholder的内容
    hotList: [], // 热搜榜数据
    searchContent: '', // 用户输入的表单项数据
    searchList: [], // 关键字模糊匹配的数据
    historyList: [], // 搜索历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData()
    this.getSearchRecord()
  },
  // 获取初始化数据
  getInitData(){
    request('/search/hot/detail').then(res=>{
      this.setData({
        hotList:res.data
      })
    })
    request('/search/default').then(res=>{
      this.setData({
        placeholderContent:res.data.showKeyword
      })
    })
  },
  // 搜索
  handleInputChange(e){
    if(!e.detail.value.trim()){
      this.setData({
        searchList:[],
        searchContent:''
      })
      return
    }else{
      this.setData({
        searchContent:e.detail.value.trim()
      })
      if(isSend){
        setTimeout(() => {
          isSend = false
        }, 300);
        return 
      }
      isSend = true
      request('/search',{keywords:this.data.searchContent,limit:10}).then(res=>{
        this.setData({
          searchList:res.result.songs
        })
      })
    }
  },
  // 获取记录搜索
  getSearchRecord(){
    let {searchContent} = this.data
    if(searchContent){
      let searchRecord =wx.getStorageSync('searchRecord')
      searchRecord.unshift(searchContent)
      let historyList =  Array.from(new Set(searchRecord))
      this.setData({
        historyList
      })
      wx.setStorageSync('searchRecord', this.data.historyList)
    }else{
      let historyList =wx.getStorageSync('searchRecord')
      this.setData({
        historyList
      })
    }
  },
  // 删除搜索记录
  deleteSearchHistory(){
    let Clear = []
    wx.setStorageSync('searchRecord', Clear)
    this.setData({
      historyList:[]
    })
  },
  // 置空输入框
  clearSearchContent(){
    let historyList = wx.getStorageSync('searchRecord')
    this.setData({
      searchList:[],
      searchContent:'',
      historyList
    })
  },
  // 快捷搜索
  SearchWord(e){
    this.setData({
      searchContent:e.target.dataset.name,
      searchList:[]
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