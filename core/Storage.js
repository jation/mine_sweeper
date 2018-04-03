function k(key) {
    return `__MINE_SWEEPER_V_20180326_${key}__`
}

const KEY = {
    LEVEL: k('LEVEL'),
    BEST_TIME: k('BEST_TIME_EASY'),
    MARK_CORRECT: k('MARK_CORRECT_MINE'),
    MARK_WRONG: k('MARK_WRONG'),
    OPEN_RIGHT: k('OPEN_RIGHT'),
    FAILED: k('FAILED'),
    WIN: k('WIN'),
    FIRST_PLAY_TIME: k('FIRST_PLAY_TIME'),
    PLAY_COUNT: k('PLAY_COUNT'),
    MARK_ACTION_TYPE: k('MARK_ACTION_TYPE'),
    DOUBLE_CLICK_INTERVAL: k('DOUBLE_CLICK_INTERVAL'),
}

export class Storage {
    constructor() { }
    setLevel(value) {
        wx.setStorage({
            key: KEY.LEVEL,
            data: value
        })
    }
    getLevel() { return wx.getStorageSync(KEY.LEVEL) || 'EASY' }
    setBestTime(level, value) {
        let bestTime = this.getBestTime();
        if (bestTime[level] > value) {
            bestTime[level] = value;
            wx.setStorage({
                key: KEY.BEST_TIME,
                data: bestTime
            })
        }
    }
    getBestTime() {
        return wx.getStorageSync(KEY.BEST_TIME) || { EASY: 9999, MID:9999, HARD:9999 }
    }
    setMarkCorrect(){
        let markCorrectCount = this.getMarkCorrect();
        wx.setStorage({ key: KEY.MARK_CORRECT, data: ++markCorrectCount });
    }
    getMarkCorrect(){ return wx.getStorageSync(KEY.MARK_CORRECT) || 0 }
    setMarkWrong(){
        let markWrongCount = this.getMarkWrong();
        wx.setStorage({ key: KEY.MARK_WRONG, data: ++markWrongCount });
    }
    getMarkWrong(){ return wx.getStorageSync(KEY.MARK_WRONG) || 0 }
    setOpenRight(){
        let openRightCount = this.getOpenRight();
        wx.setStorage({ key: KEY.OPEN_RIGHT, data: ++openRightCount });
    }
    getOpenRight(){ return wx.getStorageSync(KEY.OPEN_RIGHT) || 0 }
    setFailed(){
        let failedCount = this.getFailed();
        wx.setStorage({ key: KEY.FAILED, data: ++failedCount });
    }
    getFailed(){ return wx.getStorageSync(KEY.FAILED) || 0 }
    
    setWin(){
        let winCount = this.getWin();
        wx.setStorage({ key: KEY.WIN, data: ++winCount });
    }
    getWin(){ return wx.getStorageSync(KEY.WIN) || 0 }

    setPlayCount(){
        let playCount = this.getPlayCount();
        wx.setStorage({ key: KEY.PLAY_COUNT, data: ++playCount });
    }
    getPlayCount(){ return wx.getStorageSync(KEY.PLAY_COUNT) || 0 }
    
    getFirstPlayTime(){
        let firstPlayTime = wx.getStorageSync(KEY.FIRST_PLAY_TIME);
        if(!firstPlayTime){
            firstPlayTime = new Date();
            wx.setStorage({key:KEY.FIRST_PLAY_TIME, data: firstPlayTime})
        }
        return firstPlayTime;
    }
    setMarkActionType(type){ wx.setStorage({ key: KEY.MARK_ACTION_TYPE, data: type }) }
    getMarkActionType(){ return wx.getStorageSync(KEY.MARK_ACTION_TYPE) || 'LONG_TAP'; }
    setDoubleClickInterval(time){ wx.setStorage({ key: KEY.DOUBLE_CLICK_INTERVAL, data: time }) }
    getDoubleClickInterval(){ return wx.getStorageSync(KEY.DOUBLE_CLICK_INTERVAL) || 300; }
}