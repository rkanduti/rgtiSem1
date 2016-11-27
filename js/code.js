var canvas, engine, scene, camera, light, bee, wingL, wingR;
var pause = true;
var up = down = left = right = false;
var end = false; 
var objects = [];
var buildings = [];
var points = [];
var fly = 0;
var score = 0;
var smer = 1;
var life = 3;
var speed = 0.1;

start();
function start() {
  initScene();
  initCamera();
  initLight();
  initCity();
  initCars();
  initTrash();
  initSign();
  initBillboard();
  initPoints();
  initBee();
}

function zacni(){
    document.getElementById('zacetni').style.visibility = 'hidden';
}

function initScene() {
  canvas = document.getElementById("renderCanvas");
  engine = new BABYLON.Engine(canvas, true);
  scene = new BABYLON.Scene(engine);
  scene.collisionsEnabled = true;
  scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);
  scene.clearColor = new BABYLON.Color3(0, 191/255, 1);
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
  camera.checkCollisions = true;

  minimap = new BABYLON.FreeCamera("minimap", new BABYLON.Vector3(-10,  1, 0), scene);
  minimap.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;

  minimap.orthoLeft = -2;
  minimap.orthoRight = 10;
  minimap.orthoTop =  3;
  minimap.orthoBottom = -3;
  minimap.rotation.x = Math.PI/2;
  var xstart = 0.8, ystart = 0.75; 
  var width = 0.99-xstart, height = 0.99-ystart;

  minimap.viewport = new BABYLON.Viewport(xstart, ystart, width, height);

  scene.activeCameras.push(camera);
  scene.activeCameras.push(minimap);
}

function initLight() {
  light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 5, 0), scene);
}

function initCity() {
  var xPos = 0;
  var maxB = 15;
  var sc = "all.babylon";
  for(var j = 0; j < 9; j++) {
  BABYLON.SceneLoader.ImportMesh("", "assets/buildings/", sc, scene, function (buildingMesh) {
    for(var i in buildingMesh) {
      buildingMesh[i].isVisible = true;
      buildingMesh[i].checkCollisions = true;
      buildingMesh[i].scaling = new BABYLON.Vector3(4, 4, 5);
      buildingMesh[i].position.x *= 4;
      buildingMesh[i].position.x += xPos;
      buildingMesh[i].position.z *= 4;
      buildingMesh[i].checkCollisions = true;
      buildings.push(buildingMesh[i]);
      if(buildingMesh[i].id == 'Plane') {
        buildingMesh[i].scaling.x *= 3;
        buildingMesh[i].scaling.z *= 0.4;
        buildingMesh[i].checkCollisions = false;
      }
    }
    xPos += 24;
  });
  }
}

var xCars = 0;
function initCars() {
  for(var j = 0; j < 15; j++){

    BABYLON.SceneLoader.ImportMesh("", "assets/car/", "car.babylon", scene, function (carMesh){
      var rand = Math.random();
      var xrand = rand*(6)+7;
      rand = Math.random();
      var zrand = (rand*0.56) - 0.28;

      carMesh[0].isVisible = true;
      carMesh[0].checkCollisions = true;
      carMesh[0].scaling = new BABYLON.Vector3(0.14, 0.14, 0.14);
      carMesh[0].position.x += (xCars + xrand);
      carMesh[0].position.y = 0.15;
      carMesh[0].position.z = zrand;
      carMesh[0].checkCollisions = true;
      carMesh[0].isActive = true;

      carMesh[0].rotation.x = Math.PI;
      carMesh[0].rotation.y = Math.PI/2;
      carMesh[0].rotation.z = Math.PI/2;

      objects.push(carMesh[0]);
      xCars = carMesh[0].position.x;
    });

  }
  
}

var xTrash = 0;
function initTrash() {
  for(var j = 0; j < 20; j++){

    BABYLON.SceneLoader.ImportMesh("", "assets/trash/", "trash.babylon", scene, function (trashMesh){
      var rand = Math.random();
      var xrand = rand*(4)+4;
      rand = Math.random();
      if(rand > 0.5) {
        var zrand = 0.7;
      }
      else
        var zrand = -0.7;

      trashMesh[0].isVisible = true;
      trashMesh[0].scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
      trashMesh[0].checkCollisions = true;
      trashMesh[0].position.x += (xTrash + xrand);
      trashMesh[0].position.y = 0.085;
      trashMesh[0].position.z = zrand;
      trashMesh[0].checkCollisions = true;
      trashMesh[0].isActive = true;

      objects.push(trashMesh[0]);
      xTrash = trashMesh[0].position.x;
    });

  }
  
}

var xSign = 0;
function initSign() {
  for(var j = 0; j < 24; j++){

    BABYLON.SceneLoader.ImportMesh("", "assets/sign/", "sign.babylon", scene, function (signMesh){
      var rand = Math.random();
      var xrand = rand*(4)+4;
      rand = Math.random();
      if(rand > 0.5) {
        var zrand = 0.75;
      }
      else
        var zrand = -0.75;

      signMesh[0].isVisible = true;
      signMesh[0].scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);
      signMesh[0].checkCollisions = true;
      signMesh[0].position.x += (xSign + xrand);
      signMesh[0].position.y = 0.8;
      signMesh[0].position.z = zrand;
      signMesh[0].checkCollisions = true;
      signMesh[0].isActive = true;

      objects.push(signMesh[0]);
      xSign = signMesh[0].position.x;
    });

  }
}

var xBoard = 0;
function initBillboard() {
  for(var j = 0; j < 15; j++){

    BABYLON.SceneLoader.ImportMesh("", "assets/sign/", "sign2.babylon", scene, function (boardMesh){
      var rand = Math.random();
      var xrand = rand*(2)+10;

      boardMesh[0].isVisible = true;
      boardMesh[0].scaling = new BABYLON.Vector3(0.4, 0.8, 0.9);
      boardMesh[0].checkCollisions = true;
      boardMesh[0].position.x += (xBoard + xrand);
      boardMesh[0].position.y = 1.2;
      //boardMesh[0].position.z = zrand;
      boardMesh[0].checkCollisions = true;
      boardMesh[0].isActive = true;

      objects.push(boardMesh[0]);
      xBoard = boardMesh[0].position.x;
    });

  }
}

var xpoints=0;
function initPoints() {
  for(var j = 0; j < 34; j++){

    BABYLON.SceneLoader.ImportMesh("", "assets/points/", "point.babylon", scene, function (pointMesh){
      var rand = Math.random();
      var xrand = rand*10;
      rand = Math.random();
      var yrand = (rand*1.90) - (rand*0.2);
      rand = Math.random();
      var zrand = (rand*1.6) - (rand*0.8);

      pointMesh[0].isVisible = true;
      pointMesh[0].checkCollisions = true;
      pointMesh[0].scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
      pointMesh[0].position.x += (xpoints + xrand);
      pointMesh[0].position.y = yrand;
      pointMesh[0].position.z = zrand;
      pointMesh[0].checkCollisions = true;
      xpoints = pointMesh[0].position.x;
      pointMesh[0].isActive = true;
      

      points.push(pointMesh[0]);
    });

  }
  
}

function initBee() {
  BABYLON.SceneLoader.ImportMesh("", "assets/bee/", "bee.babylon", scene, function (beeMesh) {
    beeMesh[0].isVisible = true;
    beeMesh[0].checkCollisions = true;
    beeMesh[0].scaling = new BABYLON.Vector3(0.06, 0.06, 0.06);
    beeMesh[0].position = new BABYLON.Vector3(-7, 1.1, 0);
    beeMesh[0].rotation.y = -Math.PI/2; 
    bee = beeMesh[0];
    bee.checkCollisions = true;

    wingL = beeMesh[1];
    wingL.parent = bee;
    wingL.position.x = -0.2;
    wingL.position.y = 0.3;

    var animationWingL = new BABYLON.Animation("animationWingL", "rotation.z", 50, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                                                BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                                  
    animationWingL.enableBlending = true;
    animationWingL.blendingSpeed = 1;

    var keys = [];
    keys.push({
        frame: 10,
        value: -Math.PI/8
    });

    keys.push({
        frame: 30,
        value: -Math.PI/2
    });

    keys.push({
        frame: 50,
        value: -Math.PI/8
    });
    animationWingL.setKeys(keys);
    wingL.animations.push(animationWingL);
    scene.beginAnimation(wingL, 0, 50, true, 2);

    wingR = beeMesh[2];
    wingR.parent = bee;
    wingR.position.x = 0.2;
    wingR.position.y = 0.3;

    var animationWingR = new BABYLON.Animation("animationWingR", "rotation.z", 50, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                                                BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                                  
    animationWingR.enableBlending = true;
    animationWingR.blendingSpeed = 1;
    var keys = [];

    keys.push({
        frame: 10,
        value: Math.PI/8
    });

    keys.push({
        frame: 30,
        value: Math.PI/2
    });

    keys.push({
        frame: 50,
        value: Math.PI/8
    });
    animationWingR.setKeys(keys);
    wingR.animations.push(animationWingR);
    scene.beginAnimation(wingR, 0, 50, true, 2);
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
    case 70:
      if(speed < 0.3) //'F'
      speed += 0.1;
      break;
    case 71:
    if(speed>0.2) // 'G'
      speed -= 0.1;
      break;
  }
}

function onKeyUp(event) {
  up = down = left = right = false;
}

function moveScene() {
  var flyUpMax = 0.1
  var flyDownMax = -0.1;

  if(bee.position.x > xpoints + 15) {
      window.location.reload();
  }

  if(fly < flyUpMax && smer == 1){
    fly += 0.005;
    bee.position.y += 0.001;
  }
  else if(fly >= flyUpMax){
    smer = 0;
    fly = 0;
    fly -= 0.01;
  }
  else if(fly > flyDownMax && smer == 0){
    fly -= 0.005;
    bee.position.y -= 0.001;
  }
  else if(fly <= flyDownMax){
    smer = 1;
    fly = 0;
    fly += 0.01;
  }

  if(!pause && !end) {
    for (var obj in objects) {
      if (!pause && bee.intersectsMesh(objects[obj], true)) {
        pause = true;

        camera.position = new BABYLON.Vector3(camera.position.x, 0.8, 0);
        bee.position = new BABYLON.Vector3(bee.position.x, 0.8, 0);

        life--;
        /*if(life == 2)
          life3.dispose();
        if(life == 1)
          life2.dispose();*/

        document.getElementById("life").innerHTML = "Life: " + life;
        if(life == 0){
          end = true;
          setTimeout(function() {window.location.reload();}, 2000);
        }
        return;
      }
    }
    for (var i in points) {
      if (bee.intersectsMesh(points[i], true)) {
        if(points[i].isActive) {
          var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
          particleSystem.particleTexture = new BABYLON.Texture("assets/textures/Flare.png", scene);

          particleSystem.emitter = points[i].position;
          particleSystem.minEmitBox = new BABYLON.Vector3(0, 0, 0);
          particleSystem.maxEmitBox = new BABYLON.Vector3(0, 0, 0);

          particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
          particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
          particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

          particleSystem.minSize = 0.1;
          particleSystem.maxSize = 0.3;

          particleSystem.minLifeTime = 0.2;
          particleSystem.maxLifeTime = 0.3;

          particleSystem.emitRate = 50;

          particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

          particleSystem.gravity = new BABYLON.Vector3(10, -1, 10);

          particleSystem.direction1 = new BABYLON.Vector3(-2, 2, 1);
          particleSystem.direction2 = new BABYLON.Vector3(2, 2, -1);

          particleSystem.minAngularSpeed = 0;
          particleSystem.maxAngularSpeed = Math.PI;

          particleSystem.minEmitPower = 1;
          particleSystem.maxEmitPower = 3;
          particleSystem.updateSpeed = 0.005;

          particleSystem.start();
          setTimeout(function(){ particleSystem.stop(); }, 500);
          
          points[i].isActive = false;
        }
        points[i].dispose();
        points.splice(i, 1);
        score += 5;
        document.getElementById("score").innerHTML = "Points: " + score;
      }
    }
    bee.position.x += speed;
    camera.position.x += speed;

    minimap.orthoLeft += speed;
    minimap.orthoRight += speed;

    if(up && bee.position.y < 1.7) {
      bee.position.y += 0.05;
/*
      if(bee.rotation.x < Math.PI/30)
        bee.rotation.x += Math.PI/100;
*/
      camera.position.y += -0.069 * Math.pow(camera.position.y,2) + 0.1518*camera.position.y- 0.03349; //0.05;
    }
    else if(down && bee.position.y > 0.2) {
      bee.position.y -= 0.05;
/*
      if(bee.rotation.x > -Math.PI/30)
        bee.rotation.x -= Math.PI/100;
*/
      camera.position.y -= -0.069 * Math.pow(camera.position.y,2) + 0.1518*camera.position.y- 0.03349; //0.05;
    }
    else if(left && bee.position.z < 0.8) {
      bee.position.z += 0.05;
/*
      if(bee.rotation.z > -Math.PI/10)
        bee.rotation.z -= Math.PI/100;
  */   
      if(camera.position.z < 0.65 && bee.position.z > -0.65)
        camera.position.z += 0.05; // += -5/49*(Math.pow((camera.position.z+0.7),2))+1/7*(camera.position.z+0.7);//0.05; 
    }
    else if(right && bee.position.z > -0.8) {
      bee.position.z -= 0.05;
/*
      if(bee.rotation.z < Math.PI/10)
        bee.rotation.z += Math.PI/100;
*/
      if(camera.position.z > -0.65 && bee.position.z < 0.65)
        camera.position.z -= 0.05; // -= -5/49*(Math.pow((camera.position.z+0.7),2))+1/7*(camera.position.z+0.7);//0.05; 
    }
    /*if(!up && !down){
      bee.rotation.x = 0;
    }
    if(!right && !left){
      bee.rotation.z = 0;
    }*/
    
  }
}