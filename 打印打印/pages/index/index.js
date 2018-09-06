//index.js
//获取应用实例
import {fetch,login} from '../../utils/util.js'
const app = getApp()

Page({
  data: {
    imgUrls: [],
    mainContent:[],
    indicatorDots: true,
    autoplay: false,
    interval: 3000,
    duration: 500,
    isLoading:false,
    pn:1,
    hasMore:true,
    loadDone:false
  },
  //事件处理函数
 
  onLoad: function () {
    login()
    Promise.all([this.getData()], [this.getContent()]).then
      (() => {
        this.setData({
          hasMore: true,
          pn: 1,
          loadDone:true
        })
      })
    
  },
  //获取轮播图
  getData(){ 
    return new Promise((resolve,reject)=>{
        this.setData({
          isLoading: true
        }
        )
        fetch.get('/swiper').then(res => {
          resolve()
          this.setData({
            imgUrls: res.data,
            isLoading: false
          })
        }).catch(err => {
          reject()
          this.setData({
            isLoading: false
          })
        })
    })  
  },
  //获取书籍列表
  getContent(){
    return new Promise((resolve,reject)=>{
      this.setData({
        isLoading:true
      })
      fetch.get('/category/books').then(res => {
        console.log(res),
        resolve()
          this.setData({
            mainContent: res.data,
            isLoading:false
          })
      })
    })  
  },
  
  jumpBook(event){
    const id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/details/details?id=${id}`,
    })   
  },
  getMoreContent(){
    return new Promise(resolve=>{
      fetch.get('/category/books', { pn: this.data.pn }).then(res => {
        let newArr = [...this.data.mainContent,...res.data]
          this.setData({
            mainContent: newArr,
          })
          resolve(res)
      })
    })
  },
  //下拉刷新
  onPullDownRefresh(){
    Promise.all([this.getData()],[this.getContent()]).then
    (()=>{
      this.setData({
        hasMore:true,
        pn:1
      })
      wx.stopPullDownRefresh();
    })
  },
  //上拉刷新
  onReachBottom(){
    if(this.data.hasMore){
      this.setData({
        pn:this.data.pn+1
      })
      this.getMoreContent().then(res => {
        if (res.data.length < 2) {
          this.setData({
            hasMore: false
          })
        }
      })
    } 
  }
})
