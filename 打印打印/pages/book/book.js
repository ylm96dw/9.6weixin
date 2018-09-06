// pages/book/book.js
import {fetch} from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    article:{},
    titleId:"",
    title:"",
    bookId:"",
    catalog:[],
    isShow:false,
    font:40,
    index:"",
    isLoading:false
  },
  onLoad: function(options){
    this.setData({
      titleId:options.id,
      bookId:options.bookId
    })  
    this.getData()
    this.getCatalog()  
  },
  getData(){
    this.setData({
      isLoading:true,
      isShow:false
    })
    fetch.get(`/article/${this.data.titleId}`).then(res=>{
      this.setData({
        article:res.data.article.content, 
        title:res.data.title,
        isLoading:false,
        index:res.data.article.index
      })
    })
  },
  getCatalog(){
    fetch.get(`/titles/${this.data.bookId}`).then(res=>{
      console.log(res)
      this.setData({
        catalog: res.data
      })
    }).catch(err=>{
      this.setData({
        isLoading:false
      })
    }) 
  },
  toggleCatalog(){
    let isShow = !this.data.isShow
    this.setData({
      isShow
    })
  },
  handleGet(event){
    const id = event.currentTarget.dataset.id
    this.setData({
      titleId:id
    })
    this.getData();
  },
  handleAdd(){
    this.setData({
      font:this.data.font+2
    })
  },
  handleRuduce(){
    if(this.data.font<=24){
      wx.showModal({
        title: '提示',
        content: '字体过小',
        showCancel:false
      })
    }else{
      this.setData({
        font: this.data.font - 2
      })
    }
  },
  handleNext(){
    let catalog = this.data.catalog
    if(catalog[this.data.index + 1]){
      this.setData({
        titleId: catalog[this.data.index + 1]._id
      })
      this.getData()
    } else{
      wx.showToast({
        title: '最后一章了',
      })
    }
  },
  handlePrev(){
    let catalog = this.data.catalog
    if(this.data.index-1<=0){
      wx.showToast({
        title: '这是首页',
      })
    }else{
      this.setData({
        titleId:catalog[this.data.index-1]._id
      })
      this.getData()
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})