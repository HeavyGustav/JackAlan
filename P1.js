// UBC CPSC 314 (2015W2) -- P1
// HAVE FUN!!! :)

// ASSIGNMENT-SPECIFIC API EXTENSION
THREE.Object3D.prototype.setMatrix = function(a) {
  this.matrix=a;
  this.matrix.decompose(this.position,this.quaternion,this.scale);
}

// SETUP RENDERER & SCENE
var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xFFFFFF); // white background colour
canvas.appendChild(renderer.domElement);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30,1,0.1,1000); // view angle, aspect ratio, near, far
camera.position.set(45,20,40);
camera.lookAt(scene.position);
scene.add(camera);

// SETUP ORBIT CONTROLS OF THE CAMERA
var controls = new THREE.OrbitControls(camera);

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}

// EVENT LISTENER RESIZE
window.addEventListener('resize',resize);
resize();

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
     window.scrollTo(0,0);
   }

// SETUP HELPER GRID
// Note: Press Z to show/hide
var gridGeometry = new THREE.Geometry();
var i;
for(i=-50;i<51;i+=2) {
    gridGeometry.vertices.push( new THREE.Vector3(i,0,-50));
    gridGeometry.vertices.push( new THREE.Vector3(i,0,50));
    gridGeometry.vertices.push( new THREE.Vector3(-50,0,i));
    gridGeometry.vertices.push( new THREE.Vector3(50,0,i));
}

var gridMaterial = new THREE.LineBasicMaterial({color:0xBBBBBB});
var grid = new THREE.Line(gridGeometry,gridMaterial,THREE.LinePieces);

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////

// MATERIALS
// Note: Feel free to be creative with this! 
var normalMaterial = new THREE.MeshNormalMaterial();

// function drawCube()
// Draws a unit cube centered about the origin.
// Note: You will be using this for all of your geometry
function makeCube() {
  var unitCube = new THREE.BoxGeometry(1,1,1);
  return unitCube;
}

// GEOMETRY
var torsoGeometry = makeCube();
// var non_uniform_scale = new THREE.Matrix4().set(5,0,0,0, 0,5,0,0, 0,0,8,0, 0,0,0,1);
var non_uniform_scale = new THREE.Matrix4().set(5,0,0,0, 0,5,0,0, 0,0,8,0, 0,0,0,1);
torsoGeometry.applyMatrix(non_uniform_scale);

// TO-DO: SPECIFY THE REST OF YOUR STAR-NOSE MOLE'S GEOMETRY. 
// Note: You will be using transformation matrices to set the shape. 
// Note: You are not allowed to use the tools Three.js provides for 
//       rotation, translation and scaling.
// Note: The torso has been done for you (but feel free to modify it!)  
// Hint: Explicity declare new matrices using Matrix4().set
var limb_scale = new THREE.Matrix4().set(2,0,0,0, 0,5,0,0, 0,0,1,0, 0,0,0,1);
var l_hand_geo = makeCube();
l_hand_geo.applyMatrix(limb_scale);  

var tail_scale = new THREE.Matrix4().set(0.5,0,0,0, 0,0.5,0,0, 0,0,8,0, 0,0,0,1);
var tail_geo = makeCube();
tail_geo.applyMatrix(tail_scale); 

var head_scale = new THREE.Matrix4().set(3,0,0,0, 0,3,0,0, 0,0,6,0, 0,0,0,1);
var head_geo = makeCube();
head_geo.applyMatrix(head_scale);


// MATRICES
// var torsoMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,2.5, 0,0,1,0, 0,0,0,1);
var torsoMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,2.5, 0,0,1,0, 0,0,0,1);

// TO-DO: INITIALIZE THE REST OF YOUR MATRICES 
// Note: Use of parent attribute is not allowed.
// Hint: Keep hierarchies in mind!   
// Hint: Play around with the headTorsoMatrix values, what changes in the render? Why? 
var l_hand_pos = new THREE.Matrix4().set(1,0,0,2.5, 0,1,0,-2, 0,0,1,3, 0,0,0,1);  
var l_hand_pos_abs = new THREE.Matrix4().multiplyMatrices(torsoMatrix,l_hand_pos); 

var r_hand_pos = new THREE.Matrix4().set(1,0,0,-2.5, 0,1,0,-2, 0,0,1,3, 0,0,0,1);
var r_hand_pos_abs = new THREE.Matrix4().multiplyMatrices(torsoMatrix,r_hand_pos);

var l_foot_pos = new THREE.Matrix4().set(1,0,0,2.5, 0,1,0,-2, 0,0,1,-3, 0,0,0,1);
var l_foot_pos_abs = new THREE.Matrix4().multiplyMatrices(torsoMatrix,l_foot_pos);


var r_foot_pos = new THREE.Matrix4().set(1,0,0,-2.5, 0,1,0,-2, 0,0,1,-3, 0,0,0,1);
var r_foot_pos_abs = new THREE.Matrix4().multiplyMatrices(torsoMatrix,r_foot_pos);  

var tail_pos = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,-8, 0,0,0,1);
var tail_pos_abs = new THREE.Matrix4().multiplyMatrices(torsoMatrix,tail_pos);  

var head_pos = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,4, 0,0,0,1);
var head_pos_abs = new THREE.Matrix4().multiplyMatrices(torsoMatrix,head_pos); 


// CREATE BODY
var torso = new THREE.Mesh(torsoGeometry,normalMaterial);
torso.setMatrix(torsoMatrix)
scene.add(torso);

// TO-DO: PUT TOGETHER THE REST OF YOUR STAR-NOSED MOLE AND ADD TO THE SCENE!
// Hint: Hint: Add one piece of geometry at a time, then implement the motion for that part. 
//             Then you can make sure your hierarchy still works properly after each step.
var l_hand = new THREE.Mesh(l_hand_geo,normalMaterial);
l_hand.setMatrix(l_hand_pos_abs);
scene.add(l_hand);

var l_foot = new THREE.Mesh(l_hand_geo,normalMaterial);
l_foot.setMatrix(l_foot_pos_abs);
scene.add(l_foot);

var r_hand = new THREE.Mesh(l_hand_geo,normalMaterial);
r_hand.setMatrix(r_hand_pos_abs);
scene.add(r_hand);

var r_foot = new THREE.Mesh(l_hand_geo,normalMaterial);
r_foot.setMatrix(r_foot_pos_abs);
scene.add(r_foot);

var tail = new THREE.Mesh(tail_geo,normalMaterial);
tail.setMatrix(tail_pos_abs);
scene.add(tail);

var head = new THREE.Mesh(head_geo,normalMaterial);
head.setMatrix(head_pos_abs);
scene.add(head);

// APPLY DIFFERENT JUMP CUTS/ANIMATIONS TO DIFFERNET KEYS
// Note: The start of "U" animation has been done for you, you must implement the hiearchy and jumpcut.
// Hint: There are other ways to manipulate and grab clock values!!
// Hint: Check THREE.js clock documenation for ideas.
// Hint: It may help to start with a jumpcut and implement the animation after.
// Hint: Where is updateBody() called?
var clock = new THREE.Clock(true);

var p0; // start position or angle
var p1; // end position or angle
var time_length; // total time of animation
var time_start; // start time of animation
var time_end; // end time of animation
var p; // current frame
var animate = false; // animate?
var smooth = true;

// function init_animation()
// Initializes parameters and sets animate flag to true.
// Input: start position or angle, end position or angle, and total time of animation.
function init_animation(p_start,p_end,t_length){
  p0 = p_start;
  p1 = p_end;
  time_length = t_length;
  time_start = clock.getElapsedTime();
  time_end = time_start + time_length;
  animate = true; // flag for animation
  return;
}

function updateBody() {
  switch(true)
  {
      case(key == "U" && animate):
      var time = clock.getElapsedTime(); // t seconds passed since the clock started.

      if (time > time_end){
        p = p1;
        animate = false;
        break;
      }

      if (smooth){
        p = (p1 - p0)*((time-time_start)/time_length) + p0; // current frame 
      }
      else{p = p1;
      }
      


      var rotateZ = new THREE.Matrix4().set(1,        0,         0,        0, 
                                            0, Math.cos(-p),-Math.sin(-p), 0, 
                                            0, Math.sin(-p), Math.cos(-p), 0,
                                            0,        0,         0,        1);

      var torsoRotMatrix = new THREE.Matrix4().multiplyMatrices(torsoMatrix,rotateZ);
      torso.setMatrix(torsoRotMatrix);

      var l_hand_rot = new THREE.Matrix4().multiplyMatrices(torsoRotMatrix,l_hand_pos);
      l_hand.setMatrix(l_hand_rot); 

      var r_hand_rot = new THREE.Matrix4().multiplyMatrices(torsoRotMatrix,r_hand_pos);
      r_hand.setMatrix(r_hand_rot); 
      
      var l_foot_rot = new THREE.Matrix4().multiplyMatrices(torsoRotMatrix,l_foot_pos);
      l_foot.setMatrix(l_foot_rot); 
      
      var r_foot_rot = new THREE.Matrix4().multiplyMatrices(torsoRotMatrix,r_foot_pos);
      r_foot.setMatrix(r_foot_rot); 

      var tail_rot = new THREE.Matrix4().multiplyMatrices(torsoRotMatrix,tail_pos);
      tail.setMatrix(tail_rot);

      var head_rot = new THREE.Matrix4().multiplyMatrices(torsoRotMatrix,head_pos);
      head.setMatrix(head_rot);
      break;



      // TO-DO: IMPLEMENT JUMPCUT/ANIMATION FOR EACH KEY!
      // Note: Remember spacebar sets jumpcut/animate!

      


    default:
      break;
  }
}

// LISTEN TO KEYBOARD
// Hint: Pay careful attention to how the keys already specified work!
var keyboard = new THREEx.KeyboardState();
var grid_state = false;
var key;
keyboard.domElement.addEventListener('keydown',function(event){
  if (event.repeat)
    return;
  if(keyboard.eventMatches(event,"Z")){  // Z: Reveal/Hide helper grid
    grid_state = !grid_state;
    grid_state? scene.add(grid) : scene.remove(grid);}   
  else if(keyboard.eventMatches(event,"0")){    // 0: Set camera to neutral position, view reset
    camera.position.set(45,0,0);
    camera.lookAt(scene.position);}
  else if(keyboard.eventMatches(event,"U")){ 
    (key == "U")? init_animation(p1,p0,time_length) : (init_animation(0,Math.PI/4,1), key = "U")}
  else if(keyboard.eventMatches(event," ")){
     smooth = !smooth;
  }


  // TO-DO: BIND KEYS TO YOUR JUMP CUTS AND ANIMATIONS
  // Note: Remember spacebar sets jumpcut/animate! 
  // Hint: Look up "threex.keyboardstate by Jerome Tienne" for more info.



    });

// SETUP UPDATE CALL-BACK
// Hint: It is useful to understand what is being updated here, the effect, and why.
function update() {
  updateBody();

  requestAnimationFrame(update);
  renderer.render(scene,camera);
}

update();
