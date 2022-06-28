/**
 * 纹理创建工具
 */

/**
 * 创建魔方表面的纹理
 * @param rgbaColor 颜色
 * @returns 返回对应纹理的 canvas 对象
 */
export function createFaceTexture(rgbaColor: string): HTMLCanvasElement {
	const canvas = document.createElement('canvas') as HTMLCanvasElement;
	canvas.width = 256;
	canvas.height = 256;
	const context = canvas.getContext('2d') as CanvasRenderingContext2D;
	//画一个宽高都是256的黑色正方形
	context.fillStyle = 'rgba(0,0,0,1)';
	context.fillRect(0, 0, 256, 256);
	//在内部用某颜色的16px宽的线再画一个宽高为224的圆角正方形并用改颜色填充
	context.fillStyle = rgbaColor;
	context.rect(16, 16, 224, 224);
	context.lineJoin = 'round';
	context.lineWidth = 16;
	context.strokeStyle = rgbaColor;
	context.stroke();
	context.fill();
	return canvas;
}
