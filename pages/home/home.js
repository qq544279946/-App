//index.js
//获取应用实例

var app = getApp()
const DB = wx.cloud.database().collection('edit');
var utils = require('../../utils/util.js')
var flag = true;


var Category = ['所有', '校园卡', '雨伞', '钱包']
Page({
  data: {

    type_t: 'found',
    publish_data: [],
    listofitem: [],
    listfound: [{
      header: ' '
    }],
    listlost: [{
      header: ' '
    }, ],

    cur_type: '所有',
    actionSheetHidden: true,
    actionSheetItems: Category,

    activeIndex: 1,

    swiper_url: [
      '../../images/index/swiper/1.jpg',
      '../../images/index/swiper/2.jpg',
      '../../images/index/swiper/3.jpg',
      '../../images/index/swiper/4.jpg'
    ],
    duration: 2000,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,

    loading: false,
    refresh: 0,
    plain: false




  },

  edit:function(){
    if(app.globalData.loggin){
      wx.navigateTo({
        url: '../edit/edit',
      })
    }else{
      wx.showToast({
        title: '请先登录',
        icon:'none'
      })
    }
  },
  

  search: function(event, userid) {
    wx.navigateTo({
      url: "../search/search"
    })
  },
  bind所有: function(e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
      cur_type: '所有',
      listofitem: []
    })
    this.show_publish_infos(this.data.type_t, this.data.cur_type, this)
  },
  bind校园卡: function(e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
      cur_type: '校园卡',
      listofitem: []
    })
    this.show_publish_infos(this.data.type_t, this.data.cur_type, this)
  },
  bind钱包: function(e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
      cur_type: '钱包',
      listofitem: []
    })
    this.show_publish_infos(this.data.type_t, this.data.cur_type, this)
  },
  bind雨伞: function(e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
      cur_type: '雨伞',
      listofitem: []
    })
    this.show_publish_infos(this.data.type_t, this.data.cur_type, this)
  },
  actionSheetTap: function(e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  actionSheetChange: function(e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  //事件处理函数
  refresh: function(e) {
    while (this.data.listfound.length != 1)
      this.data.listfound.pop();
    console.log('refresh');
    console.log(this.data.listfound);
    while (this.data.listlost.length != 1)
      this.data.listlost.pop();
    console.log(this.data.listlost);
    var that = this;
    console.log(this.data.activeIndex);
    this.index = 1
    if (this.data.activeIndex == 1)
      this.setData({
        listofitem: this.data.listfound,
        cur_type: '所有'

      })
    else
      this.setData({
        listofitem: this.data.listlost,
        cur_type: '所有'
      })

    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   })
    // })
    this.show_publish_infos(this.data.type_t, '所有', this)
  },

  stateswitch: function(e) {
    console.log('states', e);
    var that = this;
    var type = e.target.dataset.index;
    if (type == 0) {
      this.setData({
        listofitem: this.data.listlost,
        activeIndex: type,
        type_t: 'lost',
        cur_type: '所有'
      })
      flag = false;

    } else {
      this.setData({
        listofitem: this.data.listfound,
        activeIndex: type,
        type_t: 'found',
        cur_type: '所有'
      })
      flag = true;
    }
    this.show_publish_infos(this.data.type_t, this.data.cur_type, this)
    //console.log(that.data.publish_data);
  },

  bindViewTap: function(e) {

  },

  loadMore: function(e) {},
  getNextDate: function() {
    var now = new Date()
    now.setDate(now.getDate() - this.index++)
    return now
  },
  Loadmsg: function() {
    var that = this;
    while (this.data.listfound.length != 1)
      this.data.listfound.pop();
    while (this.data.listlost.length != 1)
      this.data.listlost.pop();
    var i = 0;
    for (i = 0; i < that.data.publish_data.length; i++) {
      var nickName = that.data.publish_data[i].nickName;
      var Msg = that.data.publish_data[i].msg;
      var time = new Date(that.data.publish_data[i].submission_time);
      var Submission_time = time.toLocaleDateString() + "  " + time.toLocaleTimeString();
      var imageurl = '';
      var imageList = that.data.publish_data[i].fileIDs;
      var user_icon = that.data.publish_data[i].avatarUrl;
      // var nick_name = that.data.publish_data[i].nickName,
      // var avatarUrl = that.data.publish_data[i].avatarUrl,
      if (that.data.publish_data[i].fileIDs.length != 0)
        imageurl = that.data.publish_data[i].fileIDs[0];
      if (that.data.publish_data[i].type_t == 'found')
        this.data.listfound.push({
          username: nickName,
          text: Msg,
          imagelist: imageList,
          image: imageurl,
          usericon: user_icon,
          sub_time: Submission_time,
          time:time.getTime()
        })
      else
        this.data.listlost.push({
          username: nickName,
          text: Msg,
          imagelist: imageList,
          image: imageurl,
          usericon: user_icon,
          sub_time: Submission_time,
          time: time.getTime()
        });
    }
    if (this.data.activeIndex == 1)
      this.setData({
        listofitem: this.data.listfound.sort(this.compare("time"))
      })
    else this.setData({
      listofitem: this.data.listlost.sort(this.compare("time"))
    })

    
  },

  //对显示的列表对象进行排序（从大到小）
  compare: function (property) {

    return function (a, b) {

      var value1 = a[property];

      var value2 = b[property];

      return value2 - value1;

    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // this.onLoad
  },
  onPullDownRefresh: function() {
    this.onload;
    this.refresh();
  },
  photopreview: function(event) { //图片点击浏览
    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list; //获取data-list
    //console.log(imgList);
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  onLoad: function() {

    console.log('imgUrl', app.globalData.userInfo.avatarUrl);

    while (this.data.listfound.length != 1)
      this.data.listfound.pop();
    console.log('清空');
    console.log(this.data.listfound);
    while (this.data.listlost.length != 1)
      this.data.listlost.pop();
    console.log(this.data.listlost);
    var that = this;

    this.index = 1
    if (this.data.activeIndex == 1)
      this.setData({
        listofitem: this.data.listfound,
        cur_type: '所有'
      })
    else this.setData({
      listofitem: this.data.listlost,
      cur_type: '所有'
    })


    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   })
    // })
    this.show_publish_infos('found', '所有', this)
    console.log(this.data)
  },

  //获取发布信息的接口，传入分类数据
  show_publish_infos: function(type_t, category, obj) {
    console.log('type_t:' + type_t);
    console.log('category:' + category);
    var _data;
    if (category == '所有') {
      _data = {
        'type': type_t
      };

      DB.where({
        type_t: _data.type_t
      }).get({
        success: function(res) {
          console.log('1', res)
          obj.setData({
            publish_data: res.data
          })
          console.log('当前数据库返回的publish记录')
          console.log(obj.data.publish_data)
          obj.Loadmsg()
        }
      })

    } else {
      _data = {
        'type': type_t,
        'category': category
      }

      DB.where({
        category: _data.category,
        type_t: _data.type_t
      }).get({
        success: function(res) {
          console.log('2', res)
          obj.setData({
            publish_data: res.data
          })
          console.log('当前数据库返回的publish记录')
          console.log(obj.data.publish_data)
          obj.Loadmsg()
        }
      })
    }

    //

    //


  },
})