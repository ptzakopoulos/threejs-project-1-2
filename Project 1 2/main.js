import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import dat from "dat.gui";
import Planet from "./localModules/Planets.js";

const milkyWay = () => {
  const gui = new dat.GUI();

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

  //renderer
  const renderer = new THREE.WebGL1Renderer({ antialias: true, canvas });

  //Camera
  const fov = 75;
  const aspect = 2;
  const near = 0.001;
  const far = 400;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  const controls = new OrbitControls(camera, renderer.domElement);

  camera.position.z = 2;

  controls.update();

  //Textures
  const loader = new THREE.TextureLoader();
  const textures = {
    sky: loader.load("./textures/sky2.jpg"),
    earth: loader.load("./textures/earth.jpg"),
    jupiter: loader.load("./textures/jupiter.jpg"),
    mars: loader.load("./textures/mars.jpg"),
    mercury: loader.load("./textures/mercury.jpg"),
    neptune: loader.load("./textures/neptune.jpg"),
    saturn: loader.load("./textures/saturn.jpg"),
    uranus: loader.load("./textures/uranus.jpg"),
    venus: loader.load("./textures/venus.jpg"),
    sun: loader.load("./textures/sun.jpg"),
  };

  //scene
  const scene = new THREE.Scene();
  scene.background = textures.sky;

  //light
  {
    const color = 0xffffff; // Set the color of the light
    const intensity = 1; // Set the intensity of the light
    const distance = 10; // Set the distance of the light
    const decay = 5; // Set the decay of the light

    const lights = [];
    const lightHelper = [];
    let index = 0;

    //Lights
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (Math.abs(x + y + z) / 3 == 1 || Math.abs(x + y + z) / 3 == 0) {
            console.log("sks");
          } else {
          }
          lights[index] = new THREE.PointLight(
            color,
            intensity,
            distance,
            decay
          );
          lights[index].position.set(x, y, z);
          lightHelper[index] = new THREE.PointLightHelper(lights[index], 1);
          scene.add(lights[index]);
          // scene.add(, lightHelper[index]);

          index++;
        }
      }
    }
  }

  const createPlanet = new Planet(renderer, camera, scene, gui);
  createPlanet.create("earth", textures.earth);
  createPlanet.create("mars", textures.mars);
  createPlanet.create("jupiter", textures.jupiter);
  createPlanet.create("mercury", textures.mercury);
  createPlanet.create("neptune", textures.neptune);
  createPlanet.create("saturn", textures.saturn);
  createPlanet.create("uranus", textures.uranus);
  createPlanet.create("venus", textures.venus);
  createPlanet.create("sun", textures.sun);

  //Render
  renderer.render(scene, camera);
  responsive(renderer, camera);
};

milkyWay();
