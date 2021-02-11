// pages/login/login.js
import {request} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    password:''
  },
  // 获取表单数据
  handleInput:function(e) {
    let type = e.target.id
    this.setData({
      [type]:e.detail.value.replace(/\s+/g, '')
    })
  },
  // 登录函数验证
  login(){
    let {phone,password} = this.data
    let CheckePhone = /^1(3|5|6|7|8|9)\d{9}/
    if(!phone){
      wx.showToast({
        title: '手机号码不能为空',
        icon:'none'
      })
    }else if(!CheckePhone.test(phone)){
      wx.showToast({
        title: '手机号码格式错误，请检查',
        icon:'none'
      })
    }else{
      if(!password){
        wx.showToast({
          title: '密码不能为空',
          icon:'none'
        })
      }else{
        // 后端验证
        // 15172908441
        // abc19980625XL
        request('/login/cellphone',{phone,password,isLogin:true}).then(res=>{
          if(res.code===200){
            wx.setStorageSync('userinfo', JSON.stringify(res.profile))
            wx.reLaunch({
              url: '/pages/profile/profile',
            })
          }else{
            wx.showToast({
              title: res.message,
              icon:'none'
            })
          }
        })
      }
    }
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