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
// Create a Three.js scene
const scene = new THREE.Scene();

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

// Create a particle system to replace the sphere
const particleThing = () => {
  // Add a 3D object to the scene, such as a sphere
  const geometry = new THREE.SphereGeometry(5, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Create a particle system to replace the sphere
  const particleGeometry = new THREE.BufferGeometry();
  const positions = [];
  const velocities = [];
  geometry.attributes.position.array.forEach((value, index) => {
    if (index % 3 === 0) {
      // This is an x coordinate
      positions.push(value);
      velocities.push(Math.random() * 2 - 1);
    } else if (index % 3 === 1) {
      // This is a y coordinate
      positions.push(value);
      velocities.push(Math.random() * 2 - 1);
    } else if (index % 3 === 2) {
      // This is a z coordinate
      positions.push(value);
      velocities.push(Math.random() * 2 - 1);
    }
  });
  particleGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  particleGeometry.setAttribute(
    "velocity",
    new THREE.Float32BufferAttribute(velocities, 1)
  );
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // Remove the original sphere from the scene
  scene.remove(mesh);

  // Animate the particles
  function animateParticles() {
    requestAnimationFrame(animateParticles);
    const positionAttribute = particleGeometry.getAttribute("position");
    const velocityAttribute = particleGeometry.getAttribute("velocity");
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      const z = positionAttribute.getZ(i);
      const vx = velocityAttribute.getX(i);
      const vy = velocityAttribute.getY(i);
      const vz = velocityAttribute.getZ(i);
      positionAttribute.setXYZ(i, x + vx, y + vy, z + vz);
    }
    positionAttribute.needsUpdate = true;
  }
  animateParticles();

  renderer.render(scene, camera);
  responsive(renderer, camera);
};
particleThing();
