import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { AnaglyphEffect } from "three/examples/jsm/effects/AnaglyphEffect";
import { Sprite } from "three";

//Responsive
const responsive = (renderer, camera) => {
  const render = () => {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    const width = canvas.clientHeight;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
};

const canvas = document.querySelector("#canvas");

//Renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
  alpha: true,
});

//scene
const scene = new THREE.Scene();

//Camera
const fov = 75;
const aspect = 2;
const near = 0.1;
const far = 100;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
const controls = new OrbitControls(camera, renderer.domElement);

const cameraExtraControls = (e) => {
  switch (true) {
    case e.key == "w":
      camera.position.y += 0.1;
      break;
    case e.key == "s":
      camera.position.y -= 0.1;
      break;
    case e.key == "a":
      camera.position.x -= 0.1;
      break;
    case e.key == "d":
      camera.position.x += 0.1;
      break;
    case e.key == "q":
      camera.position.z -= 0.1;
      break;
    case e.key == "e":
      camera.position.z += 0.1;
      break;
  }
};

window.addEventListener("keydown", cameraExtraControls);

camera.position.set(0, 0, 10);
controls.update();
scene.add(camera);

//Objects
//Cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({ color: 0x142f74 });
const geometry2 = new THREE.BoxGeometry(1.2, 1.2, 1.2);
const material2 = new THREE.MeshPhongMaterial({ color: 0x188f74 });

const cube1 = new THREE.Mesh(geometry, material);
cube1.name = "cube1";

const cube2 = new THREE.Mesh(geometry2, material2);
cube2.name = "cube2";
cube2.position.set(2, 2, 2);

// scene.add(cube2);

// scene.add(cube1);

const ManyCubes = (x, y, z) => {
  const geometries = [];
  const materials = [];
  const cubes = [];
  for (let i = 0; i <= 65; i++) {
    for (let j = 0; j <= 60; j++) {
      geometries[(i, j)] = new THREE.BoxGeometry(1, 1, 1);
      materials[(i, j)] = new THREE.MeshPhongMaterial({ color: 0x87f653 });

      cubes[(i, j)] = new THREE.Mesh(geometries[(i, j)], materials[(i, j)]);
      cubes[(i, j)].position.set(i - 26, j - 20, 0);

      scene.add(cubes[(i, j)]);
    }
  }
};
ManyCubes(1, 1, 1);

// create a new anaglyph effect
var effect = new AnaglyphEffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

//light
const directional = {
  color: 0xffffff,
  intensity: 1,
};
const pointlight = {
  color: 0xffffff,
  intensity: 1,
  distance: 100,
  decay: 0,
};
const light = new THREE.PointLight(
  pointlight.color,
  pointlight.intensity,
  pointlight.distance,
  pointlight.color.decay
);
light.position.set(0, 0, 4);
light.lookAt(0, 0, 0);

scene.add(light);

//Raycaster

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let objectColor;
let isRunning = false;

function onPointerMove(event) {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  //RGB to HEX
  const rgb = {
    r: Math.round((255 * event.clientX) / window.innerWidth),
    g: Math.round((255 * event.clientY) / window.innerHeight),
    b: Math.round(
      (Math.round((255 * event.clientX) / window.innerWidth) +
        Math.round(255 * event.clientY) / window.innerHeight) /
        2
    ),
  };

  //RGB to HEX
  const hex = (rgb) => {
    const allParameters = [];
    allParameters[0] = rgb.r;
    allParameters[1] = rgb.g;
    allParameters[2] = rgb.b;

    let finalHex = [];
    let j = 0;
    for (let parameter of allParameters) {
      const firstDigit = parameter / 16 - ((parameter / 16) % 1);
      const secondDigit = parameter % 16;
      const hex = [firstDigit, secondDigit];
      let i = 0;
      for (let digit of hex) {
        switch (digit) {
          case 10:
            digit = "a";
            break;
          case 11:
            digit = "b";
            break;
          case 12:
            digit = "c";
            break;
          case 13:
            digit = "d";
            break;
          case 14:
            digit = "e";
            break;
          case 15:
            digit = "f";
            break;
        }
        hex[i] = digit;
        i++;
      }
      finalHex[j] = hex.join("");
      j++;
    }

    // finalHex = `0x${finalHex.join("")}` * 1;
    finalHex.unshift("0x");
    finalHex = Number(finalHex.join(""));

    return finalHex;
  };

  objectColor = hex({ r: rgb.r, g: rgb.g, b: rgb.b });
  window.requestAnimationFrame(render);
}

function render(e) {
  //Camera rotation
  camera.lookAt(pointer.x * 1.5, pointer.y * 1.5, 0);
  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(pointer, camera);

  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children);

  let objectName;
  let object;

  const animation = () => {
    for (let i = 0; i < scene.children.length; i++) {
      if (
        (scene.children[i].type == "Mesh" ||
          scene.children[i].type == "Sprite") &&
        scene.children[i].position.z > 0
      ) {
        scene.children[i].position.z -= 0.01;
      }
    }
    requestAnimationFrame(animation);
  };
  const sceneObjects = [...scene.children];
  // scene.children[1].material.color.set(0x9f9f9f);

  for (let i = 0; i < scene.children.length; i++) {
    if (
      scene.children[i].type == "Mesh" ||
      scene.children[i].type == "Sprite"
    ) {
      scene.children[i].material.color.set(objectColor);
      scene.children[i].rotation.set(pointer.x, pointer.y, 0);
    }
  }
  if (isRunning == false) {
    requestAnimationFrame(animation);
    isRunning = true;
  }

  if (intersects.length > 0) {
    //Checks
    objectName = intersects[0].object.name;
    object = intersects[0].object;
    object.position.z += 1;
  }

  renderer.render(scene, camera);
}

window.addEventListener("mousemove", onPointerMove);

responsive(renderer, camera);
renderer.render(scene, camera);
