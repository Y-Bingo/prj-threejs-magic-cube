import { AmbientLight, AxesHelper, Mesh, PerspectiveCamera, PointLight, Scene, Vector3, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { BasicRubik } from './view/rubik';

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
		this.camera.position.set(300 , 300 , 300);
		this.camera.up.set(0, 1, 0); //正方向
		this.camera.lookAt(this.viewCenter);

		this.orbitControls = new OrbitControls(this.camera, this.canvas);
		this.orbitControls.enableZoom = false; // 禁止缩放
		this.orbitControls.rotateSpeed = 2; // 旋转速度
		this.orbitControls.target = this.viewCenter; // 环绕中心
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
	private cube: Mesh;
	private initObject(): void {
		let rubik = new BasicRubik();
		for (let i = 0; i < rubik.cubes.length; i++) {
			this.scene.add(rubik.cubes[i]);
		}

		// let rubik = new Rubik(this);
		// rubik.model();

		// let geometry = new BoxGeometry(100, 100, 100);
		// let canvas = createFaceTexture('#ff6b02');
		// document.body.append(canvas);
		// let texture = new Texture(createFaceTexture('#ff6b02'));
		// texture.needsUpdate = true;
		// let material = new MeshBasicMaterial({ map: texture });
		// let cube = new Mesh(geometry, material);
		// cube.position.set(0, 0, 0);

		// this.cube = cube;
		// this.scene.add(cube);
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

	/**
	 * 初始化 Debug
	 */
	private initDebug(): void {
		const aseHelper = new AxesHelper(100);
		this.scene.add(aseHelper);
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
