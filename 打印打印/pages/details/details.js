import {fetch} from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookId:"",
    bookdata:{},
    isLoading:false,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      bookId:options.id
    })
    this.getData()
  },
  getData(){
    this.setData({
      isLoading:true
    })
    fetch.get(`/book/${this.data.bookId}`).then(res=>{
      console.log(res);
      this.setData({
        bookData:res,
        isLoading:false
      })
    }).catch(err=>{
      this.setData({
        isLoading:false
      })
    })
  },
  jumpCatalog(id){
    console.log(id);
    wx.navigateTo({
      url: `/pages/catelog/catelog?id=${this.data.bookId}`,
    })
  },
  handleCollect(){
    fetch.post('/collection',{
      bookId:this.data.bookId
    }).then(res=>{
      if(res.code ==200){
        wx.showToast({
          title: '收藏成功',
          type:'success',
          duration:1000
        })
        let bookData = {...this.data.bookData}
        console.log(bookData)
        bookData.isCollect =1
        this.setData({
          bookData:bookData
        })
      }else{
        wx.showToast({
          title: '取消收藏',
          type: 'fail',
          duration: 404
        })
        let bookData = { ...this.data.bookData }
        console.log(bookData)
        bookData.isCollect = !bookData.isCollect
        this.setData({
          bookData: bookData
        })
        
      }
    })
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title:this.data.bookData.data.title,
      path:`pages/details/details?id=${this.data.bookId}`,
      imageUrl:this.data.bookData.data.img
    }
  
  }
})