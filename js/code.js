// Get the canvas element from our HTML above
var canvas = document.getElementById("renderCanvas");
var sphere;
var camera;
var pause = true;
var objects = [];
// Load the BABYLON 3D engine
var engine = new BABYLON.Engine(canvas, true);

// This begins the creation of a function that we will 'call' just after it's built
  var createScene = function () {

    // Now create a basic Babylon Scene object 
    var scene = new BABYLON.Scene(engine);

    // Change the scene background color to green.
    scene.clearColor = new BABYLON.Color3(0, 1, 0);

    // This creates and positions a free camera
    camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, -150), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky.
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Dim the light a small amount
    light.intensity = .5;

    var plane = BABYLON.Mesh.CreatePlane("plane", 1, scene);
    plane.position.x = 0;
    plane.position.y = -25;
    plane.position.z = 60;
    plane.rotation.x = Math.PI / 2;
    plane.rotation.z = Math.PI / 2;
    plane.scaling = new BABYLON.Vector3(360, 86, 1);


    var box1 = BABYLON.Mesh.CreateBox("box", 1.0, scene);
    box1.position = new BABYLON.Vector3(-42, 25, 60);
    box1.scaling = new BABYLON.Vector3(1, 100, 360);


    var box2 = BABYLON.Mesh.CreateBox("box", 1.0, scene);
    box2.position = new BABYLON.Vector3(42, 25, 60);
    box2.scaling = new BABYLON.Vector3(1, 100, 360);

    sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 3, scene);
    sphere.position.z = -110;
    sphere.scaling = new BABYLON.Vector3(1, 1, 3);

    var box3 = BABYLON.Mesh.CreateBox("box", 1.0, scene);
    box3.position = new BABYLON.Vector3(20, -19, 0);
    box3.scaling = new BABYLON.Vector3(15, 10, 20);

    objects.push(box3);
    // Leave this function
    return scene;

  };  // End of createScene function

    // Now, call the createScene function that you just finished creating
  var scene = createScene();
    // Register a render loop to repeatedly render the scene
  engine.runRenderLoop(function () {
    scene.render();
  });
    // Watch for browser/canvas resize events
  window.addEventListener("resize", function () {
    engine.resize();
  });

  engine.runRenderLoop(function () {
    for (var obj in objects) {
      if (sphere.intersectsMesh(objects[obj], true)) {
        pause = true;
        return;
      }
    }

    scene.render();
    if(!pause && sphere.position.z != 150) {
      sphere.position.z += 1;
      camera.position.z += 1;
    }
  });
window.addEventListener("keydown", onKeyDown);

function onKeyDown(evt) {
  switch (evt.keyCode) {
    case 87 : //'W'
      sphere.position.y += 1;
      camera.position.y += 1;
      break;
    case 83 : //'S'
      sphere.position.y -= 1;
      camera.position.y -= 1;
      break;
    case 65 : //'A'
      sphere.position.x -= 1;
      camera.position.x -= 1;
      break;
    case 68 : //'D'
      sphere.position.x += 1;
      camera.position.x += 1;
      break;
    case 32 : //'Space'
      if(pause)
        pause = false;
      else
        pause = true;
      break;
  }
}