// 不冒泡，不穿透
const EVENT_OPTION = { bubbles: false, composed: false };

Component({
  properties: {
    block: {
      type: Object
    },
    x: {
      type: Number,
      value: -1,
    },
    y: {
      type: Number,
      value: -1
    },
    doubleClickInterval:{ //触发双击事件的时间间隔，单位毫秒
      type: Number,
      value: 300
    },
    longTapToTriggerDoubleClick: {
      type: Boolean,
      value: false,
    }
  },
  data: {
    lastTapTime: 0, //上一次Tap时间
    tryToSendDoubleClickEvent : false,
    clickTimeout: null,
  },
  methods: {
    tap(){
      let t = this;
      
      if(t.data.longTapToTriggerDoubleClick){
        t.triggerEvent('click', {
          x: t.data.x,
          y: t.data.y,
        }, EVENT_OPTION);
        return 0;
      }

     
      t.data.clickTimeout && clearTimeout(t.data.clickTimeout);

      t.setData({
        clickTimeout: setTimeout(()=>{
          t.triggerEvent('click', {
            x: t.data.x,
            y: t.data.y,
          }, EVENT_OPTION);
        }, t.data.doubleClickInterval)
      })

      if(+new Date() - t.data.lastTapTime < t.data.doubleClickInterval){
        t.data.clickTimeout && clearTimeout(t.data.clickTimeout);
        t.triggerEvent('double-click', {
          x: t.data.x,
          y: t.data.y,
          tipsCount: t.data.block.tipsCount, //😈为什么这里要t.data.block.tipsCount而不是t.data.tipsCount呢？我在Block.wxml里传进来的明明是`data-count={{block.tipsCount}}`
        }, EVENT_OPTION);
      }
      
      t.setData({ lastTapTime: +new Date() });
    },
    longTap(){
      let t = this;
      if(t.data.longTapToTriggerDoubleClick){
        t.triggerEvent('double-click', {
          x: t.data.x,
          y: t.data.y,
          tipsCount: t.data.block.tipsCount, //😈为什么这里要t.data.block.tipsCount而不是t.data.tipsCount呢？我在Block.wxml里传进来的明明是`data-count={{block.tipsCount}}`
        }, EVENT_OPTION);
      }    
    },
  },
 
})
