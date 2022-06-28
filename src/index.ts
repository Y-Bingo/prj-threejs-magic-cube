import { Main } from './main';

/**
 * 入口文件
 */


const canvas = document.getElementById('canvas') as HTMLCanvasElement;
new Main(canvas).render();
