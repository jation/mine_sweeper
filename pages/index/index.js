import { TYPE } from '../../core/Block';
import { GAME_STAUTS, Game } from '../../core/Game';
import { CLOCK_STAUTS, Clock } from '../../core/Clock';
import { Storage } from '../../core/Storage';
import audio from '../../core/Audio';
const app = getApp()

const GAME_LEVEL = {
  EASY: { width: 10, height: 9, mineCount: 10 },
  MID: { width: 12, height: 9, mineCount: 20 },
  HARD: { width: 50, height: 9, mineCount: 64 },
}

let game = null;
let clock = new Clock();
let storage = new Storage();
let pageHasHide = false;

Page({
  data: {
    game,
    clock,
    level: 'EASY',
    firstPlayTime: '',
    openCorrectCount: 0,
    markCorrectCount: 0,
    markWrongCount: 0,
    failedCount: 0,
    winCount: 0,
    playCount: 0,
    bestTime: { EASY: 9999, MID: 9999, HARD: 9999 },
    markActionType: storage.getMarkActionType(),
    doubleClickInterval: storage.getDoubleClickInterval(),
    showBlackboard: false,
    showConfig: false,
  },
  onLoad() {
    let _this = this;
    this.setData({ level: storage.getLevel() });
    this.resetGame();
    this._updateStorageUI();
    let _lastUpdateTime = 0;
    this._tickClock();
  },
  onHide() { pageHasHide = true },
  onShow() { pageHasHide = false; this._tickClock(); },
  onShareAppMessage(){
    return {
      title: '这年头还有人会玩扫雷？',
      path: '/pages/index/index',
    }
  },
  dig(e) {
    let gameStatus = this.data.game.gameStatus;
    if (gameStatus == GAME_STAUTS.FAILED || gameStatus == GAME_STAUTS.WIN) {
      return -1
    }
    let data = e.detail;
    let x = parseInt(data.x, 10);
    let y = parseInt(data.y, 10);
    if (game.blocks[x][y].marked) { return -1 }
    
    if (gameStatus == GAME_STAUTS.INITED) {
      clock.start();
      storage.setPlayCount();
      this._updateStorageUI();
    }
    
    gameStatus = game.open(x, y).result;
    
    
    //[[判断游戏是否结束 重复的代码，TODO: 封装成一个函数
    if (gameStatus === GAME_STAUTS.WIN || gameStatus === GAME_STAUTS.FAILED) {
      if(gameStatus === GAME_STAUTS.FAILED) {
        audio.failed();
        storage.setFailed();
      }
      if (gameStatus === GAME_STAUTS.WIN) {
        audio.win();
        storage.setWin(); 
        storage.setBestTime(this.data.level, clock.time / 1000);
      }
      this._updateStorageUI();
      clock.pause();
    }
    if (gameStatus === GAME_STAUTS.CONTINUE) {
      audio.dig();
      storage.setOpenRight();
    }
    //]]判断游戏是否结束 重复的代码，TODO: 封装成一个函数

    this._updateGameUI();
  },
  markOrOpenAround(e) {
    let x = e.detail.x;
    let y = e.detail.y;
    let tipsCount = e.detail.tipsCount;
    if (game.blocks[x][y].open && game.blocks[x][y].tipsCount > 0) {
      game.openAround(x, y, tipsCount);
      //[[判断游戏是否结束 重复的代码，TODO: 封装成一个函数
      let gameStatus = this.data.game.gameStatus;
      if (gameStatus === GAME_STAUTS.WIN || gameStatus === GAME_STAUTS.FAILED) {
        if(gameStatus === GAME_STAUTS.FAILED) {
          audio.failed();
          storage.setFailed();
        }
        if (gameStatus === GAME_STAUTS.WIN) {
          audio.win();
          storage.setWin(); 
          storage.setBestTime(this.data.level, clock.time / 1000);
        }
        this._updateStorageUI();
        clock.pause();
      }
      if (gameStatus === GAME_STAUTS.CONTINUE) {
        audio.digAround();        
        storage.setOpenRight();
      }
      //]]判断游戏是否结束 重复的代码，TODO: 封装成一个函数

    } else {
      let gameStatus = this.data.game.gameStatus;
      if (gameStatus == GAME_STAUTS.FAILED || gameStatus == GAME_STAUTS.WIN) {
        return -1
      }
      if (gameStatus == GAME_STAUTS.INITED) {
        clock.start();
        storage.setPlayCount();
        this._updateStorageUI();
      }

      if (game.blocks[x][y].open) {//打开过就不能mark
        return -1;
      }
      if (!game.blocks[x][y].marked) {
        game.mark(x, y);
        game.blocks[x][y].type === TYPE.MINE ? storage.setMarkCorrect() : storage.setMarkWrong();
        this._updateStorageUI();
      } else {
        game.unMark(x, y);
      }
      audio.mark();
    }
    this._updateGameUI();
  },
  resetGame() {
    game = new Game(GAME_LEVEL[this.data.level]);
    clock.reset();
    this._updateClockUI();
    this._updateGameUI();
    audio.newGame();
  },
  _updateGameUI() {
    this.setData({ game })
  },
  _updateClockUI() {
    this.setData({ clock })
  },
  _updateStorageUI() {
    let firstPlayTime = storage.getFirstPlayTime();
    this.setData({
      firstPlayTime: `${firstPlayTime.getFullYear()}-${firstPlayTime.getMonth() + 1}-${firstPlayTime.getDate()}`,
      openCorrectCount: storage.getOpenRight(),
      markCorrectCount: storage.getMarkCorrect(),
      markWrongCount: storage.getMarkWrong(),
      failedCount: storage.getFailed(),
      winCount: storage.getWin(),
      bestTime: storage.getBestTime(),
      playCount: storage.getPlayCount(),
    });
  },
  _tickClock() {
    let _this = this;
    if (clock.status === CLOCK_STAUTS.RUNNING) {
      _this._updateClockUI();
    }
    !pageHasHide && requestAnimationFrame(_this._tickClock);//恰当的时间后tick一下
  },
  hideBlackboard() {
    let _this = this;
    setTimeout(() => {
      _this.setData({ showBlackboard: false })
    }, 100);
  },
  showBlackboard() {
    this.setData({ showBlackboard: true })
  },
  toggleConfig(){
    this.setData({ showConfig: !this.data.showConfig })
  },
  setLevel(e){
    let level = e.currentTarget.dataset.level;
    this.setData({ level });
    storage.setLevel(level);
    this.resetGame();
  },
  setMarkActionType(e){
    let type = e.currentTarget.dataset.type;
    this.setData({ markActionType: type });
    storage.setMarkActionType(type);
  },
})


//小程序没有 requestAnimationFrame 用setTimeout模仿一个
function requestAnimationFrame(callback) {
  setTimeout(callback, 1000 / 60);
}