import { BoxGeometry, Group, Mesh, MeshLambertMaterial, Texture, Vector3 } from 'three';
import { Main } from '../main';
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
	public type: string; // 魔方类型
	public cubes: Mesh[];
	public contain: Group;
	private main: Main;
	constructor(main: Main) {
		this.main = main;
	}

	public model(type: string): void {
		this.contain = new Group();
		this.contain.name = type;
		//生成魔方小正方体
		this.cubes = SimpleCube(BasicParams.x, BasicParams.y, BasicParams.z, BasicParams.num, BasicParams.len, BasicParams.colors);
		// 分组
		for (let i = 0; i < this.cubes.length; i++) {
			let item = this.cubes[i];
			this.contain.add(item);
		}
		this.main.scene.add(this.contain);

		if (type === 'front-rubik') {
			this.contain.rotateY((45 / 180) * Math.PI);
		} else {
			this.contain.rotateY(((270 - 45) / 180) * Math.PI);
		}
		this.contain.rotateOnAxis(new Vector3(1, 0, 1), (25 / 180) * Math.PI);
	}

	public resizeHeight(percent: number, transformTag: number) {
		if (percent < this.main.minPercent) {
			percent = this.main.minPercent;
		}
		if (percent > 1 - this.main.minPercent) {
			percent = 1 - this.main.minPercent;
		}
		this.contain.scale.set(percent, percent, percent);
		this.contain.position.y = this.main.originHeigh * (0.5 - percent / 2) * transformTag;
	}
}
