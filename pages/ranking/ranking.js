import api from '../../service/index.js'
Page({
  data: {
    datas:[],
    currentTab:0,
    datachild:[],
    currentchild:0,
    listbox:[],
    flag:'match'
  },
  onLoad: function () {
    api.league({
      success:(res)=>{
        if(res.data.important==-1){
          let narr = res.data.league.filter((ele)=>{
            return ele.type == 'zuqiu'&&ele.name!=="转会"&&ele.name!=="联合会杯"
          })

          this.setData({
            datas:narr,
            datachild:narr[0].list.slice().splice(0,4)
          })
          this.showlist(0,0)
        }
      }
    })
  },
  onPullDownRefresh: function () {
  
  },
  onReachBottom: function () {
  
  },
  handleClick(e){
    let current = e.target.dataset.current;
    if( this.data.currentTab === current ) {  
      return false;  
    } else {  

      this.setData({  
        currentTab: current,
        datachild: this.data.datas[current].list.slice().splice(0,4)
      })
      this.showlist(current,this.data.currentchild)
    }  
  },
  showlist(current,currentchild){
    let nDatas = this.data.datas[current].list.slice().splice(0,4);
    let url = nDatas[currentchild].url;
    api.purl({
      url:url,
      success:(res)=>{
        if(url.indexOf("match")>0){
          this.setData({
            flag:"match"
          })
          let nData = res.data.data;
          nData.forEach((ele)=>{
            ele.list.forEach((nele)=>{
              nele["日期"] = nele["日期"].substr(2);
              nele.zimg = nele["主队图标"];
              nele.kimg = nele["客队图标"]
            })
          })
          this.setData({
            listbox:nData
          })
        }else if (url.indexOf("jifen")>0) {
          this.setData({
            flag:"jifen"
          })
          let nArr = {};
          nArr.title = ["场次", "胜", "平", "负", "进/失球", "积分"];
          let nData = res.data.data;
          nData.forEach((ele)=>{
            ele.timg = ele["球队图标"]
          })
          nArr.items = res.data.data;
          this.setData({
            listbox:nArr
          })
        }else if (url.indexOf("goal")>0) {
          this.setData({
            flag:"goal"
          })
          let nArr = {};
          nArr.title = res.data.items;
          let nData = res.data.data;
          nData.forEach((ele)=>{
            ele.timg = ele["球队图标"];
          })
          nArr.items = nData;
          this.setData({
            listbox:nArr
          })
        }else if (url.indexOf("assist")>0) {
          this.setData({
            flag:"assist"
          })
          let nArr = {};
          nArr.title = ["排名", "球员", "球队", "总助攻"];
          let nData = res.data.data;
          nData.forEach((ele)=>{
            ele.timg = ele["球队图标"];
          })
          nArr.items = nData;
          this.setData({
            listbox:nArr
          })
        }
      }
    })
  },
  childClick(e){
    let currentchild = e.target.dataset.current;
    if( this.data.currentchild === currentchild ) {  
      return false;  
    } else {
      this.setData({
        currentchild:currentchild
      })
      this.showlist(this.data.currentTab,currentchild)
    } 
  }
})