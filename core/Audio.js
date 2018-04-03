//TODO: 把素材找到然后天上
let ctx = null;

const AUDIO_SRC = {
    DIG: '/res/audio/dig.mp3',
    MARK: '/res/audio/mark.mp3',
    NEW_GAME: '/res/audio/newGame.mp3',
    DIG_AROUND: '/res/audio/digAround.mp3',
    FAILED: '/res/audio/failed.mp3',
    WIN: '/res/audio/win.mp3',
};

const audioHelper = {
    dig(){
        ctx = wx.createInnerAudioContext('audio');
        ctx.src = AUDIO_SRC.DIG;
        ctx.play();
    },
    mark(){ 
        ctx = wx.createInnerAudioContext('audio');
        ctx.src = AUDIO_SRC.MARK;
        ctx.play();    
    },
    newGame(){
        ctx = wx.createInnerAudioContext('audio');
        ctx.src = AUDIO_SRC.NEW_GAME;
        ctx.play();
    },
    digAround(){ 
        ctx = wx.createInnerAudioContext('audio');
        ctx.src = AUDIO_SRC.DIG_AROUND;
        ctx.play();
     },
    failed(){
        ctx = wx.createInnerAudioContext('audio');
        ctx.src = AUDIO_SRC.FAILED;
        ctx.play(); 
    },
    win(){
        ctx = wx.createInnerAudioContext('audio');
        ctx.src = AUDIO_SRC.WIN;
        ctx.play();
    },
}

export default audioHelper;