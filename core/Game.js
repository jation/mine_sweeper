import { Block, TYPE } from './Block';

export const GAME_STAUTS = {
    INITED: 'INITED',
    CONTINUE: 'CONTINUE',
    FAILED: 'FAILED',
    WIN: 'WIN'
}

export class Game {
    constructor(opts) {
        this.width = opts.width;
        this.height = opts.height;
        this.mineCount = opts.mineCount;
        this.markCount = 0;
        this.gameStatus = GAME_STAUTS.INITED;
        this.blocks = [];
        const width = opts.width;
        const height = opts.height;
        const mineCount = opts.mineCount;
        //埋雷
        let blockTypes = [];
        for (let i = 0; i < width * height; i++) {
            if (i < width * height - mineCount) { blockTypes[i] = 0 }
            else { blockTypes[i] = 1 }
        }
        blockTypes.shuffle();

        for (let i = 0; i < width; i++) {
            let row = [];
            for (let j = 0; j < height; j++) {
                row.push(new Block(
                    i,
                    j,
                    blockTypes[i * height + j] ? TYPE.MINE : TYPE.EMPTY
                )
                )
            }
            this.blocks.push(row);
        }

        //算数值提示
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) { //i,j循环是遍历所有的雷
                let block = this.blocks[i][j];
                if (block.type !== TYPE.MINE) { //不是雷，才有可能要填数值
                    let otherEight = this._findOtherEightBlock(i, j);//找出周围八个的坐标
                    let _mineCount = 0;
                    for (let h = 0; h < 8; h++) {//周围八个格子进行遍历，算出雷的数量
                        if (otherEight[h]) {
                            let _block = this.blocks[otherEight[h][0]][otherEight[h][1]];
                            if (_block.type === TYPE.MINE) {
                                _mineCount++;
                            }
                        }
                    }
                    block.tipsCount = _mineCount;
                }
            }
        }
        //随机展开一片连续的区域 提升用户体验 idea by Soffiaa
        let allEmptyBlocksCoordinate = [];
        for(let i = 0; i < width; i++ ){
            for (let j = 0; j < height; j++) {
                if(this.blocks[i][j].tipsCount === 0){
                    allEmptyBlocksCoordinate.push([i,j]);
                }
            }
        }
        let pos = Math.round(allEmptyBlocksCoordinate.length/6);// 这里是为了尽量让点开的位置靠上
        this.open(allEmptyBlocksCoordinate[pos][0],allEmptyBlocksCoordinate[pos][1], true);
    }

    //打开
    open(x, y, firstClick = false) {
        let block = this.blocks[x][y];
        block.open = true;
        if (block !== TYPE.MINE && block.tipsCount === 0) {
            let arrCoordinate = [];
            this._findConstanctlyArea(block.x, block.y, arrCoordinate);
            //批量打开
            for (let i = 0; i < arrCoordinate.length; i++) {
                let _x = arrCoordinate[i][0], _y = arrCoordinate[i][1];
                let _block = this.blocks[_x][_y];
                if (!_block.marked) {
                    _block.open = true;
                }
            }
        }
        return this._judgeResult(firstClick);
    }

    openAround(x, y, tipsCount){
        let arrCoordinate = this._findOtherEightBlock(x, y);
        //统计出标记有多少个
        let flagCount = 0;
        for(let i =0; i< arrCoordinate.length; i++){
            if(arrCoordinate[i]){
                let _x = arrCoordinate[i][0];
                let _y = arrCoordinate[i][1];
                if(this.blocks[_x][_y].marked){
                    flagCount++;
                }
            }
        }

        //检查周围标记数量是否等于传入的数值数量，如果一致，则打开周围的非标记的格子
        if(flagCount=== tipsCount){
            for(let i =0; i< arrCoordinate.length; i++){
                if(arrCoordinate[i]){
                    let _x = arrCoordinate[i][0];
                    let _y = arrCoordinate[i][1];
                    if(!this.blocks[_x][_y].marked){
                        this.blocks[_x][_y].open = true;
                    }
                }
            }
        }
        return this._judgeResult();
    }

    mark(x, y) {
        this.blocks[x][y].marked = true;
        this.markCount++;
        this.gameStatus = GAME_STAUTS.CONTINUE;
    }
    unMark(x, y) {
        this.blocks[x][y].marked = false;
        this.markCount--;
    }
    /*
        找出周围八个格子，如果越界则是null
        +-------------+-------------+-------------+
        |             |             |             |
        |  x-1,y-1    |    x,y-1    |   x+1,y-1   |
        |             |             |             |
        +-----------------------------------------+
        |             |             |             |
        |   x-1,y     |     x,y     |    x+1,y    |
        |             |             |             |
        +-----------------------------------------+
        |             |             |             |
        |  x-1,y+1    |     x,y+1   |   x+1,y+1   |
        |             |             |             |
        +-------------+-------------+-------------+
    */
    _findOtherEightBlock(x, y) {
        let result = [
            [x - 1, y - 1],
            [x, y - 1],
            [x + 1, y - 1],
            [x + 1, y],
            [x + 1, y + 1],
            [x, y + 1],
            [x - 1, y + 1],
            [x - 1, y]
        ];
        for (let i = 0; i < 8; i++) {
            if (result[i][0] < 0 || result[i][1] < 0 || result[i][0] >= this.width || result[i][1] >= this.height) {
                result[i] = null;
            }
        }
        return result;
    }
    //如果这个东西是0，找出连续的0，连续指的是上下左右严格相连的
    // 外部保证 x,y tipsCount === 0 才进入这个函数
    _findConstanctlyArea(x, y, arrBlocks = []) {
        let arrConstanct = this._findOtherEightBlock(x, y);
        for (let i = 0; i < arrConstanct.length; i++) {
            if (arrConstanct[i]) {//经过_findConstanctFour选出来的有可能是空的，要先判空
                let _x = arrConstanct[i][0], _y = arrConstanct[i][1];
                let targetBlock = this.blocks[_x][_y];
                if (!targetBlock.explored && !targetBlock.marked) {//没有勘探过的并且用户没有标记的，才进入
                    targetBlock.explored = true;
                    if (targetBlock.tipsCount === 0) {
                        this._findConstanctlyArea(_x, _y, arrBlocks);
                    }
                    arrBlocks.push([targetBlock.x, targetBlock.y]);
                }
            }
        }
    }

    _judgeResult(firstClick = false) {
        let blocks = this.blocks;
        let openCount = 0;
        for (let i = 0; i < blocks.length; i++) {
            for (let j = 0; j < blocks[i].length; j++) {
                let block = blocks[i][j];
                if (block.open) {
                    openCount++;
                    if (block.type === TYPE.MINE) {//存在一个打开的是雷，直接GG
                        this.gameStatus = GAME_STAUTS.FAILED;
                        this.blocks[i][j].exploded = true;
                        this._showAllMine();
                        return { result: GAME_STAUTS.FAILED };
                    }
                }
            }
        }
        if (openCount === this.width * this.height - this.mineCount) { //所有打开数等于非雷数赢得比赛
            this.gameStatus = GAME_STAUTS.WIN;
            return { result: GAME_STAUTS.WIN };
        }
        if(!firstClick){
            this.gameStatus = GAME_STAUTS.CONTINUE;
            return { result: GAME_STAUTS.CONTINUE }
        }else{
            return { result: GAME_STAUTS.INITED }
        }
    }

    //死亡之后展示所有雷
    _showAllMine(){
        for(let i = 0; i< this.width; i++){
            for(let j = 0; j< this.height; j++){
                if(this.blocks[i][j].type === TYPE.MINE){
                    this.blocks[i][j].open = true;
                }
            }
        }
    }

   

}