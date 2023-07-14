import * as THREE from "three";
import dat from "dat.gui";

export default class Planet {
  constructor(renderer, camera, scene, gui) {
    this.create = (name, map) => {
      //Name
      let planetInfo = {};

      const shapeCreation = (allPlanets) => {
        //Shape Creation and Append
        const scale = 1 / 1000000;
        //   const scaledRadius = radius * scale;
        const scaledRadius = planetInfo[name].radius * scale;

        const geometry = new THREE.SphereGeometry(scaledRadius, 64, 64);
        const material = new THREE.MeshPhysicalMaterial({ map: map });
        let planets = {};
        allPlanets.forEach((e) => {
          planets[e] = new THREE.Mesh(geometry, material);
        });
        const planet = planets[name];

        const distanceScale =
          name == "sun"
            ? 0
            : planetInfo[name].distanceFromSun *
                planetInfo.scale.distanceFromSun +
              1;
        planet.position.x = distanceScale;
        planet.position.y = 0;
        planet.position.z = 0;

        scene.add(planet);

        //GUI
        const planetFolder = gui.addFolder(name);
        planetFolder.close();
        planetFolder
          .add(planet.position, "x", -10, 10, 0.01)
          .name("Position X");
        planetFolder
          .add(planet.position, "y", -10, 10, 0.01)
          .name("Position Y");
        planetFolder
          .add(planet.position, "z", -10, 10, 0.01)
          .name("Position Z");
        planetFolder.add(planet.scale, "x", 0, 5, 0.01).name("Scale X");
        planetFolder.add(planet.scale, "y", 0, 5, 0.01).name("Scale Y");
        planetFolder.add(planet.scale, "z", 0, 5, 0.01).name("Scale Z");
        planetFolder
          .add(planet.rotation, "x", 0, Math.PI, 0.01)
          .name("Rotate X");
        planetFolder
          .add(planet.rotation, "y", 0, Math.PI, 0.01)
          .name("Rotate Y");
        planetFolder
          .add(planet.rotation, "z", 0, Math.PI, 0.01)
          .name("Rotate Z");

        const target = new THREE.Vector3(0, 0, 0);

        // Set the initial position of the camera
        camera.position.set(0, 0, 3.5);
        camera.lookAt(0, 0, 0);

        // Define the radius of the circular path and the rotation speed
        const radius = distanceScale;
        const rotationSpeed = 0.0001 / planetInfo[name].orbitalPeriod;

        console.log(planets.earth.position.x);

        // Update the position of the camera in the render loop
        function render() {
          const zoom = document.getElementById("z").value;
          // Calculate the new position of the camera based on the rotation angle
          const angle = rotationSpeed * Date.now();
          const x = target.x + radius * Math.sin(angle);
          const y = target.y;
          const z = target.z + radius * Math.cos(angle);
          planetInfo[name].name !== "sun"
            ? planet.position.set(x, y, z)
            : "sun";
          planet.rotation.y += 0.01;

          //Camera
          const buttons = [
            ...document.getElementsByClassName("planet-buttons"),
          ];
          let chosenPlanet;
          let valueList = [];
          buttons.forEach((button, index) => {
            valueList[index] = button.attributes[1].value;
          });

          if (valueList.indexOf("true") >= 0) {
            chosenPlanet = buttons[valueList.indexOf("true")].id;
          }

          if (chosenPlanet !== undefined) {
            if (
              planets[chosenPlanet].position.x !== 0 &&
              planets[chosenPlanet].position.z !== 0
            ) {
              camera.position.set(
                planets[chosenPlanet].position.x * zoom,
                0,
                planets[chosenPlanet].position.z * zoom
              );
              camera.lookAt(
                planets.sun.position.x,
                planets.sun.position.y,
                planets.sun.position.z
              );
            }
          }

          renderer.render(scene, camera);
          requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

        renderer.render(scene, camera);
      };
      //End of ShapeCreation()

      fetch("./localModules/planet.json")
        .then((response) => response.json())
        .then((data) => {
          planetInfo = { ...data };

          const planetNames = [...planetInfo.all];

          planetNames.forEach((e) => {
            if (document.getElementById(e)) {
            } else {
              const a = document.createElement("a");
              a.setAttribute("id", e);
              a.setAttribute("active", false);
              a.classList.add("planet-buttons");
              a.textContent = e;
              const div = document.getElementById("app");
              div.appendChild(a);
              a.addEventListener("click", (event) => {
                const allBts = [
                  ...document.getElementsByClassName("planet-buttons"),
                ];
                allBts.forEach((bt) => {
                  bt.attributes[1].value = false;
                  bt.classList.remove("active");
                });
                event.target.attributes[1].value = true;
                event.target.classList.toggle("active");
              });
            }
          });

          shapeCreation(planetNames);
        });
    };
    //End of This.Create
  }
  //End of Costructior
}
//End of Planet Class
