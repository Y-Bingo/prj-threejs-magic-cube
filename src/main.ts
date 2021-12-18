import { Vector3 } from 'three';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

/**
 * 入口类
 */
export class Main {
	public context: WebGLRenderingContext;
	public width: number;
	public height: number;
	public devicePixelRatio: number;
	public viewCenter: THREE.Vector; // 原点

	constructor() {
		this.context = canvas.getContext('webgl');
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.devicePixelRatio = window.devicePixelRatio;
		this.viewCenter = new Vector3();

		this.initRender();
		this.initCamera();
		this.initScene();
		this.initLight();
		this.initObject();
		this.render();
	}

	/**
	 * 初始化 renderer
	 */
	private initRender(): void {
		// ...
	}

	/**
	 * 初始化 摄像机
	 */
	private initCamera(): void {
		// ...
	}

	/**
	 * 初始化 场景
	 */
	private initScene(): void {
		// ...
	}

	/**
	 * 初始化 光照
	 */
	private initLight(): void {
		// ...
	}

	/**
	 * 初始化 对象
	 */
	private initObject(): void {
		// ...
	}

	/**
	 * 渲染
	 */
	private render(): void {
		// ...
	}
}
