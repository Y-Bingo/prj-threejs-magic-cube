import { Mesh, MeshBasicMaterial, PlaneBufferGeometry, Texture, TextureLoader } from 'three';
import { Main } from '../main';

/**
 * @class TouchLine
 * @desc 分割线
 */
export class TouchLine {
	private main: Main;
	public plane: Mesh;

	// 实际尺寸
	public realWidth: number = 0;
	public realHeight: number = 60;

	// 逻辑尺寸
	public width: number = 0;
	public height: number = 0;

	// 屏幕尺寸
	public screenRect = {
		width: 0,
		height: 0,
		left: 0,
		top: 0,
	};

	// 可操作状态
	public isActive: boolean = false;

	constructor(main: Main) {
		this.main = main;

		this.realWidth = 750;
		this.realHeight = 64;

		this.width = this.main.originWidth;
		this.height = (this.realHeight * this.width) / this.realWidth;

		this.screenRect.width = this.main.width;
		this.screenRect.height = (this.realHeight * this.main.width) / this.realWidth;
		this.screenRect.left = 0;
		this.screenRect.top = this.main.height / 2 - this.screenRect.height / 2;

		// 加载图片
		let loader = new TextureLoader();
		loader.load(
			'resource/assets/touch-line.png',
			(texture: Texture) => {
				let geometry = new PlaneBufferGeometry(this.width, this.height);
				let materials = new MeshBasicMaterial({ map: texture, transparent: true });
				this.plane = new Mesh(geometry, materials);
				this.plane.position.set(0, 0, 0);
				this.main.scene.add(this.plane);
			},
			xhr => {
				console.log((xhr.loaded / xhr.total) * 100 + ' % loaded');
			},
			xhr => {
				console.log('An error happened');
			},
		);
	}

	public isHover(evt): boolean {
		let isHover = false;
		if (
			evt.clientY >= this.screenRect.top &&
			evt.clientY <= this.screenRect.top + this.screenRect.height &&
			evt.clientX >= this.screenRect.left &&
			evt.clientX < this.screenRect.left + this.screenRect.width
		) {
			isHover = true;
		}
		return isHover;
	}

	public enable(): void {
		this.isActive = true;
	}

	public disable(): void {
		this.isActive = false;
	}

	public move(y: number): void {
		if (this.isActive) {
			if (y < this.main.height * this.main.minPercent || y > this.main.height * (1 - this.main.minPercent)) {
				if (y < this.main.height * this.main.minPercent) {
					y = this.main.height * this.main.minPercent;
				} else {
					y = this.main.height * (1 - this.main.minPercent);
				}
			}

			let len = this.screenRect.top + this.screenRect.height / 2 - y; // 屏幕移动距离
			let percent = len / this.main.height;
			let len2 = this.main.originHeigh * percent;
			this.plane.position.y += len2;
			this.screenRect.top = y - this.screenRect.height / 2;
		}
	}
}
