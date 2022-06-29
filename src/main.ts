import { AmbientLight, AxesHelper, PerspectiveCamera, PointLight, Scene, Vector3, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { BasicRubik } from './view/rubik';
import { TouchLine } from './view/touchLine';

/**
 * 入口类
 */
export class Main {
	public canvas: HTMLCanvasElement;
	public context: WebGLRenderingContext;
	public width: number;
	public height: number;
	public devicePixelRatio: number;

	public scene: Scene; // 场景
	public viewCenter: Vector3; // 原点
	public renderer: WebGLRenderer; // 渲染器
	public camera: PerspectiveCamera; // 摄像机
	public orbitControls: OrbitControls; // 控制器

	public minPercent = 0.25; // 正方视图至少占 25 % 区域
	public originWidth: number = 0; // 裁切面宽度
	public originHeigh: number = 0; // 裁切面高度

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.context = canvas.getContext('webgl');
		this.width = canvas.width;
		this.height = canvas.height;
		// this.width = window.innerWidth;
		// this.height = window.innerHeight;
		this.devicePixelRatio = window.devicePixelRatio;
		this.viewCenter = new Vector3(0, 0, 0);

		this.initRender();
		this.initScene();
		this.initCamera();
		this.initLight();
		this.initObject();
		this.initControl();
		this.initEvent();
		this.initDebug();
		// this.render();
	}

	/**
	 * 初始化 renderer
	 */
	private initRender(): void {
		const renderer = new WebGLRenderer({
			antialias: true, // 抗锯齿
			context: this.context,
		});
		renderer.setSize(this.width, this.height); // 设置渲染器的宽度和高度
		renderer.setClearColor('#000000', 1.0); // 设置背景颜色
		renderer.setPixelRatio(this.devicePixelRatio);
		// canvas.width = this.width * this.devicePixelRatio;
		// canvas.height = this.height * this.devicePixelRatio;

		this.renderer = renderer;
	}

	/**
	 * 初始化 摄像机
	 */
	private initCamera(): void {
		this.camera = new PerspectiveCamera(45, this.width / this.height, 100);
		this.camera.position.set(0, 0, 300);
		this.camera.up.set(0, 1, 0); //正方向
		this.camera.lookAt(this.viewCenter);

		// this.orbitControls = new OrbitControls(this.camera, this.canvas);
		// this.orbitControls.enableZoom = false; // 禁止缩放
		// this.orbitControls.rotateSpeed = 2; // 旋转速度
		// this.orbitControls.target = this.viewCenter; // 环绕中心

		this.originHeigh = Math.tan((22.5 / 180) * Math.PI) * this.camera.position.z * 2;
		this.originWidth = this.originHeigh * this.camera.aspect;
	}

	/**
	 * 初始化 光照
	 */
	private pointLight: THREE.PointLight;
	private ambientLight: THREE.AmbientLight;
	private initLight(): void {
		// 点光源
		this.pointLight = new PointLight(0xffffff, 1, 1000);
		this.pointLight.position.set(70, 112, 98);
		// 环境光
		this.ambientLight = new AmbientLight(0xffffff);

		this.scene.add(this.pointLight);
		this.scene.add(this.ambientLight);
	}

	/**
	 * 初始化 对象
	 */
	private frontRubik: BasicRubik;
	private endRubik: BasicRubik;
	private touchLine: TouchLine;
	private initObject(): void {
		this.frontRubik = new BasicRubik(this);
		this.frontRubik.model('front-rubik');
		this.frontRubik.resizeHeight(0.5, 1);

		this.endRubik = new BasicRubik(this);
		this.endRubik.model('end-rubik');
		this.endRubik.resizeHeight(0.5, -1);

		this.touchLine = new TouchLine(this);
	}

	/**
	 * 初始化 场景
	 */
	private initScene(): void {
		const scene = new Scene();
		this.scene = scene;
	}

	/**
	 * 初始化控制器
	 */
	private initControl(): void {}

	private initEvent(): void {
		this.canvas.addEventListener('mousedown', this.onTouchStart.bind(this));
		this.canvas.addEventListener('mouseup', this.onTouchEnd.bind(this));
		this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
	}

	/**
	 * 初始化 Debug
	 */
	private initDebug(): void {
		const aseHelper = new AxesHelper(100);
		this.scene.add(aseHelper);
	}

	private touchStartX: number;
	private touchStartY: number;
	private onTouchStart(evt): void {
		this.touchStartX = evt.clientX;
		this.touchStartY = evt.clientY;
		if (this.touchLine?.isHover(evt)) {
			this.touchLine.enable();
		}
	}

	private onTouchEnd(evt): void {
		this.touchLine.disable();
	}

	private onMouseMove(evt): void {
		if (this.touchLine.isActive) {
			this.touchLine.move(evt.clientY);
			let frontPercent = evt.clientY / this.canvas.height;
			let endPercent = 1 - frontPercent;
			this.resizeRubik(frontPercent, endPercent);
		}
	}

	private resizeRubik(frontPercent: number, endPercent: number): void {
		this.frontRubik.resizeHeight(frontPercent, 1);
		this.endRubik.resizeHeight(endPercent, -1);
	}

	/**
	 * 渲染
	 */
	public render(): void {
		// render
		this.renderer.clear();
		this.renderer.render(this.scene, this.camera);
		this.update();
		this.orbitControls.update();
	}

	public update(): void {
		requestAnimationFrame(this.render.bind(this));
	}
}
