export const CLOCK_STAUTS = {
    RUNNING: 'RUNNING', // 正在运行中
    STOPED: 'STOP', //停止
};

export class Clock{
    constructor(){
        this.startTime = 0;     
        this.time = 0;
        this.tick = null;
        this.status = CLOCK_STAUTS.STOPED;
    }
    start(){
        let _this = this;
        this.startTime = +new Date();
        this.tick = setInterval(()=>{
            _this.time = (+new Date()) - _this.startTime;
        },16);
        this.status = CLOCK_STAUTS.RUNNING;
    }
    reset(){
        clearInterval(this.tick);
        this.tick = null;
        this.startTime = 0;
        this.time = 0;
        this.status = CLOCK_STAUTS.STOPED;
    }
    pause(){
        clearInterval(this.tick);
        this.tick = null;
        this.status = CLOCK_STAUTS.STOPED;
    }
    continue(){
        let _this = this; 
        this.tick = setInterval(()=>{
            _this.time = (+new Date()) - _this.startTime;
        }, 16);
        this.status = CLOCK_STAUTS.RUNNING;
    }
}