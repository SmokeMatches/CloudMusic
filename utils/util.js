
import config from './api'
exports.formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
// 封装请求函数
exports.request=(url,data={},method="get")=>{
  return new Promise((resolve,reject)=>{
    wx.request({
      url:config.netHost+url,
      data,
      method,
      header:{
        cookie:wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item=>item.includes('MUSIC_U=a')):''
      },
      success:(res)=>{
        if(data.isLogin){
          wx.setStorageSync('cookies', res.cookies)
        }
        resolve(res.data)
      },
      fail:(err)=>{
        reject(err)
      }
    })
  })
}
