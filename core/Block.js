export const TYPE = {
    MINE: 'MINE', // 雷
    FLAG: 'FLAG', // 用户标记
    EMPTY: 'EMPTY', //空区域
};

export class Block{
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.marked = false; // 用户标记了
        this.tipsCount = -1; // 提示数值
        this.explored = false; // 是否被勘探连续区域的算法勘探过
        this.exploded = false; //爆炸
        this.open = false; //被打开
    }
}