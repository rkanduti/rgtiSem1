var canvas, engine, scene, camera, light, bee;
var pause = true;
var up = down = left = right = false;
var end = false; 
var objects = [];
start();
function start() {
  initScene();
  initCamera();
  initLight();
  initCity();
  initBee();
}

function initScene() {
  canvas = document.getElementById("renderCanvas");
  engine = new BABYLON.Engine(canvas, true);
  scene = new BABYLON.Scene(engine);
  scene.collisionsEnabled = true;

  scene.debugLayer.show(true);
  engine.runRenderLoop(function () {
    try {
      moveScene();    
    }
    catch(err) {}
    scene.render();
  });
}

function initCamera() {
  camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(-10,  1, 0), scene);
  camera.rotation.y = Math.PI/2;
  camera.attachControl(canvas);
  camera.checkCollisions = true;

  var animationPlane = new BABYLON.Animation('anim', 'position.z', 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  var keys = [];  
  keys.push({ frame: 0, value: camera.position.z });
  keys.push({ frame: 10, value: camera.position.z+0.5 });
  keys.push({ frame: 20, value: camera.position.z+0.5 });
  keys.push({ frame: 30, value: camera.position.z+0.5 });
  animationPlane.setKeys(keys);
  camera.animations.push(animationPlane);
}

function initLight() {
  light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 5, 0), scene);
}

function initCity() {
  var xPos = 0;
  for(var j = 0; j < 2; j++) {
    var rand = Math.random();
    var sc;
    if(rand > 0.5)
      sc = "all.babylon";
    else
      sc = "all2.babylon";

    BABYLON.SceneLoader.ImportMesh("", "assets/buildings/", sc, scene, function (buildingMesh) {
      for(var i in buildingMesh) {
        buildingMesh[i].isVisible = true;
        buildingMesh[i].checkCollisions = true;
        buildingMesh[i].scaling = new BABYLON.Vector3(4, 4, 5);
        buildingMesh[i].position.x *= 4;
        buildingMesh[i].position.x += xPos;
        buildingMesh[i].position.z *= 4;
        buildingMesh[i].checkCollisions = true;

        if(buildingMesh[i].id == 'Plane') {
          buildingMesh[i].scaling.x *= 5;
          buildingMesh[i].checkCollisions = false;
        }
      }
      xPos += 40;
    });
  }
}

function initBee() {
  BABYLON.SceneLoader.ImportMesh("", "assets/bee/", "bee.babylon", scene, function (beeMesh) {
    beeMesh[0].isVisible = true;
    beeMesh[0].checkCollisions = true;
    beeMesh[0].scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
    beeMesh[0].position = new BABYLON.Vector3(-7, 1.1, 0);
    beeMesh[0].rotation.y = -Math.PI/2; 
    bee = beeMesh[0];
    bee.checkCollisions = true;
    
    
  });
}

window.addEventListener("resize", function(){
  engine.resize();
})
window.addEventListener("keyup", onKeyUp, false);
window.addEventListener("keydown", onKeyDown, false);

function onKeyDown(event) {
  switch (event.keyCode) {
    case 87 : //'W'
      up = true;
      down = false;
      break;
    case 83 : //'S'
      up = false;
      down = true;
      break;
    case 65 : //'A'
      left = true;
      right = false;
      break;
    case 68 : //'D'
      left = false;
      right = true;
      break;
    case 32 : //'Space'
      if(pause)
        pause = false;
      else
        pause = true;
      break;
  }
}

function onKeyUp(event) {
  up = down = left = right = false;
}

function moveScene() {


  if(!pause && !end) {
    for (var obj in objects) {
      if (bee.intersectsMesh(objects[obj], true)) {
        scene.remove
        pause = true;
        return;
      }
    }
    bee.position.x += 0.1;
    camera.position.x += 0.1;
    if(up && bee.position.y < 1.7) {
      bee.position.y += 0.05;
      camera.position.y += -0.069 * Math.pow(camera.position.y,2) + 0.1518*camera.position.y- 0.03349; //0.05;
    }
    else if(down && bee.position.y > 0.15) {
      bee.position.y -= 0.05;
      camera.position.y -= -0.069 * Math.pow(camera.position.y,2) + 0.1518*camera.position.y- 0.03349; //0.05;
    }
    else if(left && bee.position.z < 0.75) {
      bee.position.z += 0.05;
      camera.position.z += -5/49*(Math.pow((camera.position.z+0.7),2))+1/7*(camera.position.z+0.7);//0.05; 
    }
    else if(right && bee.position.z > -0.75) {
      bee.position.z -= 0.05;
      camera.position.z -= -5/49*(Math.pow((camera.position.z+0.7),2))+1/7*(camera.position.z+0.7);//0.05; 
    }
  }
}