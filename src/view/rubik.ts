import { BoxGeometry, Mesh, MeshLambertMaterial, Texture } from 'three';
import { BasicParams } from '../model/constant';
import { createFaceTexture } from '../utils/texture';

/**
 * 魔方对象
 */

/**
 *
 * @param x 魔方中心点 x
 * @param y 魔方中心点 y
 * @param z 魔方中心点 z
 * @param num 魔方阶数
 * @param len 小方块宽高
 * @param colors 魔方六个面的颜色
 */
function SimpleCube(x: number, y: number, z: number, num: number, len: number, colors: string[]): Mesh[] {
	// 创建方格纹理
	let myFaces = [];
	for (let k = 0; k < 6; k++) {
		myFaces[k] = createFaceTexture(colors[k]);
	}

	//魔方左上角坐标
	let leftUpX = x - (num / 2) * len;
	let leftUpY = y - (num / 2) * len;
	let leftUpZ = z - (num / 2) * len;

	let cubes = [];
	for (let i = 0; i < num; i++) {
		for (let j = 0; j < num * num; j++) {
			// console.log('create face texture:', i, j);
			// 创建方格材质
			let materials = [];
			for (let k = 0; k < 6; k++) {
				let texture = new Texture(myFaces[k]);
				texture.needsUpdate = true;
				materials.push(new MeshLambertMaterial({ map: texture }));
			}
			// console.log('create face mesh:', i, j);
			let cubeGeometry = new BoxGeometry(len, len, len);
			let cube = new Mesh(cubeGeometry, materials);

			// 依次计算每个小方块的中心点坐标
			cube.position.x = leftUpX + len / 2 + (j % num) * len;
			cube.position.y = leftUpY + len / 2 + Math.floor(j / num) * len;
			cube.position.z = leftUpZ + len / 2 + i * len;
			cubes.push(cube);
		}
	}
	return cubes;
}

export class BasicRubik {
	public cubes: Mesh[];

	constructor() {
		this.cubes = SimpleCube(BasicParams.x, BasicParams.y, BasicParams.z, BasicParams.num, BasicParams.len, BasicParams.colors); //生成魔方小正方体
	}

	public model(): void {}
}
