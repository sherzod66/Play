import * as THREE from 'three'
import { OrbitControls } from 'https://unpkg.com/three@0.145.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.145.0/examples/jsm/loaders/GLTFLoader.js'

const grid = new URL('assets/gr.glb', import.meta.url);
const xx = new URL('assets/xx.glb', import.meta.url);
const ziro = new URL('assets/ziro.glb', import.meta.url);
const horizontalLine = new URL('assets/horizontal.glb', import.meta.url);
const verticalLine = new URL('assets/vertical.glb', import.meta.url);
//const leftLine = new URL('assets/leftLine.glb', import.meta.url);
//const rightLine = new URL('assets/rightLine.glb', import.meta.url);


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000)
camera.position.set(-2, 0, 5)

const orbit = new OrbitControls(camera, renderer.domElement)
orbit.update();

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight)

const mesh = new THREE.Mesh(
	new THREE.PlaneGeometry(3, 3, 3, 3),
	new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true, visible: false, side: THREE.DoubleSide })
)
mesh.name = 'ground';

scene.add(mesh);

const gltfLoader = new GLTFLoader;

gltfLoader.load(grid.href, gltf => {
	const model = gltf.scene;
	model.rotation.y = Math.PI
	scene.add(model)
}, undefined, (error) => console.log(error));



const planeMesh = new THREE.Mesh(
	new THREE.PlaneGeometry(1, 1),
	new THREE.MeshBasicMaterial({ color: 0x999999, visible: true, side: THREE.DoubleSide })
)

scene.add(planeMesh);


const mousePosition = new THREE.Vector2()
const raycaster = new THREE.Raycaster();
let intersects;

window.addEventListener('mousemove', event => {
	mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
	mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera(mousePosition, camera);
	intersects = raycaster.intersectObjects(scene.children);
	intersects.forEach(intersect => {
		if (intersect.object.name === 'ground') {
			const planeMeshPosition = new THREE.Vector3().copy(intersect.point).round();
			if (planeMeshPosition.x === '-0') {
				planeMeshPosition.x = 0;
			} else if (planeMeshPosition.y === '-0') {
				planeMeshPosition.y = 0;
			}
			planeMesh.position.set(planeMeshPosition.x, planeMeshPosition.y, 0);
		}
	});
})

const loaders = new THREE.TextureLoader();

//const texture = loaders.load('texture/v904-nunny-012.jpg');

const objectArray = [];
const objectArrayZiro = [];
const objectArray2 = [];
let game = true;

const arr1 = [[], [], []];
const arr2 = [[], [], []];

const arrZiro1 = [[], [], []];
const arrZiro2 = [[], [], []];
const arrcornerLeft = []
const arrcornerRight = []
const arrZiroLeft = []
const arrZiroRight = []

//let torusMesh;

window.addEventListener('click', (event) => {

	const result = objectArray.find((item) => {
		return item.position.x === planeMesh.position.x &&
			item.position.y === planeMesh.position.y
	})

	if (game) {
		if (!result) {
			intersects.forEach((intersect) => {
				if (intersect.object.name === 'ground') {
					let lastChild = objectArray[objectArray.length - 1]
					if (!lastChild) {
						let cross;
						gltfLoader.load(xx.href, gltf => {
							cross = gltf.scene;
							cross.name = 'ex';
							cross.position.copy(planeMesh.position);
							scene.add(cross)
							objectArray2.push(cross.position);
							objectArray.push(cross);
							getWinX()
							getWinY()
							leftGorizantal()
							RightGorizantal()
							if (arrcornerLeft.length === 3) {
								newModelLeftTop(1.3, 0.2, 0.64)
								game = false
							}
							if (arrcornerRight.length === 3) {
								newModelRightTop(1.3, 0.2, 0.64)
								game = false

							}
							examination()
							examination2()
						}, undefined, (error) => console.log(error));



					} else if (lastChild.name === 'ex') {
						let Ziromodel;
						gltfLoader.load(ziro.href, gltf => {
							Ziromodel = gltf.scene;
							Ziromodel.rotation.y = Math.PI
							Ziromodel.name = 'box';
							Ziromodel.position.copy(planeMesh.position);
							scene.add(Ziromodel)
							objectArray.push(Ziromodel);
							objectArrayZiro.push(Ziromodel.position)

							getWinZiroX()
							getWinZiroY()
							leftGorizantalZiro()
							RightGorizantalZiro()
							if (arrZiroLeft.length === 3) {
								newModelLeftTop(1.3, 0.2, 0.64)
								game = false
								getbutton()
							}
							if (arrZiroRight.length === 3) {
								newModelRightTop(1.3, 0.2, 0.64)
								game = false
								getbutton()
							}
							examinationZiro()
							examinationZiro2()

						}, undefined, (error) => console.log(error));

					} else {
						let cross;
						gltfLoader.load(xx.href, gltf => {
							cross = gltf.scene;
							cross.name = 'ex';
							cross.position.copy(planeMesh.position);
							scene.add(cross)
							objectArray.push(cross);
							objectArray2.push(cross.position)
							getWinX()
							getWinY()
							leftGorizantal()
							RightGorizantal()
							if (arrcornerLeft.length === 3) {
								newModelLeftTop(1.3, 0.2, 0.64)
								game = false
								getbutton()
							}
							if (arrcornerRight.length === 3) {
								newModelRightTop(1.3, 0.2, 0.64)
								game = false
								getbutton()
							}
							examination()
							examination2()
						}, undefined, (error) => console.log(error));





					}


				}
			})
		} else {
			console.log('Xз');

		}
	}
})
let num = 0.00;

function examination() {
	let lengthArr1 = arr1[0].length;
	let lengthArr2 = arr1[1].length;
	let lengthArr3 = arr1[2].length;
	if (lengthArr1 === 3) {
		newModelVertical(-1, 0, 0);
		getbutton()
		game = false
	} else if (lengthArr2 === 3) {
		newModelVertical(0, 0, 0);
		getbutton()
		game = false
	} else if (lengthArr3 === 3) {
		newModelVertical(1, 0, 0);
		getbutton()
		game = false
	}
}
function examination2() {
	let lengthArr1 = arr2[0].length;
	let lengthArr2 = arr2[1].length;
	let lengthArr3 = arr2[2].length;
	if (lengthArr1 === 3) {
		getbutton()
		newModelHorizontal(0, 1, 0)
		game = false
	} else if (lengthArr2 === 3) {
		newModelHorizontal(0, 0, 0)
		getbutton()
		game = false
	} else if (lengthArr3 === 3) {
		newModelHorizontal(0, -1, 0)
		getbutton()
		game = false
	}
}

function getWinX() {
	let objectPos = objectArray2[objectArray2.length - 1];
	if (objectPos.x === -1) {
		arr1[0].push(objectPos.x);
	} else if (objectPos.x === 0) {
		arr1[1].push(objectPos.x);

	} else if (objectPos.x === 1) {
		arr1[2].push(objectPos.x);
	} else {
		console.log("Что то пошло не так!")
	}
}
function getWinY() {
	let objectPos = objectArray2[objectArray2.length - 1];
	if (objectPos.y === 1) {
		arr2[0].push(objectPos.y);
	} else if (objectPos.y === 0) {
		arr2[1].push(objectPos.y);
	} else if (objectPos.y === -1) {
		arr2[2].push(objectPos.y);
	} else {
		console.log("Что то пошло не так!")
	}
}

function leftGorizantal() {
	let objectPos = objectArray2[objectArray2.length - 1];
	if (objectPos.x === -1 && objectPos.y === 1) {
		arrcornerLeft.push('1');
	} else if (objectPos.x === 0 && objectPos.y === 0) {
		arrcornerLeft.push('1');
	}
	else if (objectPos.x === 1 && objectPos.y === -1) {
		arrcornerLeft.push('1');
	}
}
function RightGorizantal() {
	let objectPos = objectArray2[objectArray2.length - 1];
	if (objectPos.x === 1 && objectPos.y === 1) {
		arrcornerRight.push('1');
	} else if (objectPos.x === 0 && objectPos.y === 0) {
		arrcornerRight.push('1');
	}
	else if (objectPos.x === -1 && objectPos.y === -1) {
		arrcornerRight.push('1');
	}
}




function getWinZiroX() {
	let objectPos = objectArrayZiro[objectArrayZiro.length - 1];
	console.log(objectPos.x)
	if (objectPos.x === -1) {
		arrZiro1[0].push(objectPos.x);
	} else if (objectPos.x === 0) {
		arrZiro1[1].push(objectPos.x);

	} else if (objectPos.x === 1) {
		arrZiro1[2].push(objectPos.x);
	} else {
		console.log("Что то пошло не так!")
	}
}
function getWinZiroY() {
	let objectPos = objectArrayZiro[objectArrayZiro.length - 1];
	if (objectPos.y === 1) {


		arrZiro2[0].push(objectPos.y);
	} else if (objectPos.y === 0) {
		arrZiro2[1].push(objectPos.y);
	} else if (objectPos.y === -1) {
		arrZiro2[2].push(objectPos.y);
	} else {
		console.log("Что то пошло не так!")
	}
}

function examinationZiro() {
	let lengthArr1 = arrZiro1[0].length;
	let lengthArr2 = arrZiro1[1].length;
	let lengthArr3 = arrZiro1[2].length;
	if (lengthArr1 === 3) {
		newModelVertical(-1, 0, 0);
		getbutton()
		game = false
	} else if (lengthArr2 === 3) {
		newModelVertical(0, 0, 0);
		getbutton()
		game = false
	} else if (lengthArr3 === 3) {
		newModelVertical(1, 0, 0);
		getbutton()
		game = false
	}
}
function examinationZiro2() {
	let lengthArr1 = arrZiro2[0].length;
	let lengthArr2 = arrZiro2[1].length;
	let lengthArr3 = arrZiro2[2].length;
	if (lengthArr1 === 3) {
		newModelHorizontal(0, 1, 0)
		getbutton()
		game = false
	} else if (lengthArr2 === 3) {
		newModelHorizontal(0, 0, 0)
		getbutton()
		game = false
	} else if (lengthArr3 === 3) {
		newModelHorizontal(0, -1, 0)
		getbutton()
		game = false
	}
}


function leftGorizantalZiro() {
	let objectPos = objectArrayZiro[objectArrayZiro.length - 1];
	if (objectPos.x === -1 && objectPos.y === 1) {
		arrZiroLeft.push('1');
	} else if (objectPos.x === 0 && objectPos.y === 0) {
		arrZiroLeft.push('1');
	}
	else if (objectPos.x === 1 && objectPos.y === -1) {
		arrZiroLeft.push('1');
	}
}
function RightGorizantalZiro() {
	let objectPos = objectArrayZiro[objectArrayZiro.length - 1];
	if (objectPos.x === 1 && objectPos.y === 1) {
		arrZiroRight.push('1');
	} else if (objectPos.x === 0 && objectPos.y === 0) {
		arrZiroRight.push('1');
	}
	else if (objectPos.x === -1 && objectPos.y === -1) {
		arrZiroRight.push('1');
	}
}


const newModelVertical = function (x, y, z) {
	let model;
	gltfLoader.load(verticalLine.href, gltf => {
		model = gltf.scene;

		model.rotation.y = Math.PI
		model.position.set(x, y, z);
		model.scale.set(0.2, 1.01, 0.6)
		scene.add(model)
	}, undefined, (error) => console.log(error));
}


const newModelHorizontal = function (x, y, z) {
	gltfLoader.load(horizontalLine.href, gltf => {
		let model = gltf.scene;
		model.name = 'line';
		model.rotation.y = Math.PI;
		model.position.set(x, y, z);
		model.scale.set(1.01, 0.2, 0.64)
		scene.add(model)
	}, undefined, (error) => console.log(error));
}

const newModelLeftTop = function (x, y, z) {
	gltfLoader.load(horizontalLine.href, gltf => {
		let model = gltf.scene;
		model.name = 'line'
		model.rotation.y = Math.PI;
		model.scale.set(x, y, z)
		model.rotation.z = Math.PI / 4
		scene.add(model)
	}, undefined, (error) => console.log(error));
}



const newModelRightTop = function (x, y, z) {
	gltfLoader.load(horizontalLine.href, gltf => {
		let model = gltf.scene;
		model.name = 'line'
		model.rotation.y = Math.PI;
		model.scale.set(x, y, z)
		model.rotation.z = -Math.PI / 4
		scene.add(model)
	}, undefined, (error) => console.log(error));
}


function getbutton() {
	const button = document.querySelector('button');
	button.classList.add('active')

	button.addEventListener('click', buttonClick);
}
function buttonClick(event) {
	let sceneChildren = scene.children
	sceneChildren.splice(4, sceneChildren.length - 1)
	objectArray.length = 0;
	objectArrayZiro.length = 0;
	objectArray2.length = 0;
	game = true;

	arr1[0].length = 0;
	arr1[1].length = 0;
	arr1[2].length = 0;

	arr2[0].length = 0;
	arr2[1].length = 0;
	arr2[2].length = 0;

	arrZiro1[0].length = 0;
	arrZiro1[1].length = 0;
	arrZiro1[2].length = 0;

	arrZiro2[0].length = 0;
	arrZiro2[1].length = 0;
	arrZiro2[2].length = 0;

	arrcornerLeft.length = 0;
	arrcornerRight.length = 0;
	arrZiroLeft.length = 0;
	arrZiroRight.length = 0;
}




function animate() {
	requestAnimationFrame(animate)
	renderer.render(scene, camera)
    /*console.log(arrZiro1)
    */console.log(scene.children.length)
	if (scene.children.length === 13) {
		getbutton()
	}
}
animate()



