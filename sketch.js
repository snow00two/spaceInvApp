/* perspective simulation---fleet of cubes invading the earth, 
 * version 0.2, 2026/02/18, snow00two,
 * \href{https://creativecommons.org/licenses/by-nc-nd/4.0/}{\ccbyncsa}
 */
let widthCanvas = 1080  ; // 720x3/2 
let heightCanvas = 607.5 ; // 405x3/2
let radiusLarge = widthCanvas ;
let centerY = widthCanvas/2 ;
let centerZ = heightCanvas/2 ;
const BACK_COLOR = [150, 200, 250] ;
const FLOOR_COLOR = [150, 200, 250] ;
const FLOOR_COLOR_DARK = [10, 10, 10] ;
const WHITE_COLOR = 250;
const EARTH_COLOR = [250, 200, 200];
const SEA_COLOR = [0, 123, 255];
const MAX_DISTANCE = 6000;

const J = 1000; // number of initial data

let octahedron ; 
function preload(){
  octahedron = loadModel('octahedron.stl'); 
  //https://www.printables.com/model/411768-octahedron-freecad/files
}

let randAngle = [];
let randX = [];
let randY = [];
let randL = [];

let selectMode ;
let autoMode ;

function setup() {
  widthCanvas = windowWidth ;
  if ( windowHeight > widthCanvas ) {
      heightCanvas = widthCanvas;
  } else {
      heightCanvas = windowHeight;
  };
  selectMode = createSelect() ;
  selectMode.option('automatic', 'auto') ;
  selectMode.option('warp', 'warp') ; /* backward in black space */
  selectMode.option('fleet', 'fleet') ;/* fleet of cubes leaving from warp */
  selectMode.option('interception', 'interception') ;/* fighters intercepting cubes */
  selectMode.option('landing','landing');/* fleet of cubes landing befor the great pylamid */
  selectMode.selected('auto') ;
  selectMode.position(widthCanvas - 140, 20) ;
  selectMode.changed( resetBackground ) ;
  
  for (let j=0 ; j < J ; j++){//randome initial angles
    randAngle[j] = random(0,2*PI);
  }
  for (let j=0 ; j < J ; j++){//randome initial X coordinates
    randX[j] = random(-1,1);
  }
  for (let j=0 ; j < J ; j++){//randome initial Y coordinates
    randY[j] = random(-1,1);
  }
  for (let j=0 ; j < J ; j++){//randome initial light intensities
    randL[j] = random(0,1);
  }
  autoMode = selectMode.value();
  createCanvas(widthCanvas, heightCanvas, WEBGL);
  background(BACK_COLOR);
}

let i = 0;//basic parameter for frames
let h = 0;//parameter controlling auto mode 
let k = 0;//k: number indicating line drawing process

function draw(){
  const LENGTH_LIGHT = 500 ;
  const I = 10000; // period of cycle
  const L = 100; // l = 0,...,L-1, number of lines
  const M = 10; // period of updating k
  const S = 20; // speed factor
  
  const WARP_LIMIT = 1000;
  const FLEET_LIMIT = 2000;
  const INTERCEPT_LIMIT = 3000;
  const LANDING_LIMIT = 11000;
  let currentMode;

  if (autoMode == 'auto'){
    if (h < WARP_LIMIT){
        currentMode = 'warp';
        h++; 
    } else if (h < FLEET_LIMIT){
        currentMode = 'fleet';
        h++; 
    } else if (h < INTERCEPT_LIMIT){
        currentMode = 'interception';
        h++; 
    } else if (h == INTERCEPT_LIMIT){
        currentMode = 'landing';
        i = 0;
        h++;
        i++;
    } else if (h < LANDING_LIMIT){
        currentMode = 'landing';
        h++;
    } else {
        h = 0;
        i = 0;
        k = 0;
        h++;
        i++;
    }
  } else {
    currentMode = autoMode;
  }

  if (currentMode == 'warp') {

    if (i<I) {
      if ( i % M == 0){
        k++; //k: number indicating line drawing process
      } 
    } else {
      i = 0;// reset basic parameter
      k = 0;
    }
 
    background(FLOOR_COLOR_DARK);

    camera(0,0, 100, 100, 3, 100, 0, 0, -1);
  // define the camera coordinates in the world coordinates : 
  
  //The world coordinates : 
    directionalLight(250, 200, 500, 0, -1, -1); //light from the sun 

    stroke(WHITE_COLOR);
    strokeWeight(8);
    for (let l = 0 ; l < L ; ++l){
      let n;
      if (k - l + L + 1 < 0){
        n = J + k - l + L + 1 ;//L-1
      } else if (k - l + L + 1 >= J) {
        n = k - l + L  + 1 -J;
      } else {
        n = k - l + L + 1 ;// l=0 => l+L-1, l=L-1 =>n = k
      }
      let coordX = MAX_DISTANCE - S * (i + ( l - k ) * M ) ;
      let coordZ = centerZ + radiusLarge * sin(randAngle[ n ]);
      let coordY = centerY + radiusLarge * cos(randAngle[ n ]) ;
      line(coordX,coordY,coordZ,coordX+LENGTH_LIGHT,coordY,coordZ);
    }
  } else if (currentMode == 'fleet'){
    if (i<I) {
      if ( i % M == 0){
        k++; //k: number indicating line drawing process
      } 
    } else {
      i = 0;// reset basic parameter
      k = 0;
    }
 
    camera(0,0, 100, 100, 3, 100, 0, 0, -1);
    // define the camera coordinates in the world coordinates : 
    
    //The world coordinates : 
    directionalLight(250, 200, 500, 0, -1, -1); //light from the sun 
    background(FLOOR_COLOR_DARK);

    let scaleU = 5000;
    let LightFacter = 3;
    for(let i=1; i< I; i++){
      strokeWeight(LightFacter * randL[i]);
      stroke('white'); 
      point(scaleU, scaleU * randX[i], scaleU * randY[i]);
    }

    ambientMaterial(125);
    ambientLight(100,100,100);
    shininess(100.0);
    stroke(0, 0, 0);
    strokeWeight(1);

    for (let l=0 ; l < L ; ++l){//l: line number
      let n;// number of initial data
      if (k - l + L + 1 < 0){
        n = J + k - l + L + 1 ;//L-1
      } else if (k - l + L + 1 >= J) {//=J => n=0 etc
        n = k - l + L  + 1 -J;
      } else {
        n = k - l + L + 1 ;// l=0 => l+L-1, l=L-1 =>n = k
      }
      let coordX = MAX_DISTANCE - S * (i + ( l - k + (n % 5)) * M ) ;
      /* n % 5 is used to line straight  */
      let coordZ = centerZ + radiusLarge * sin(-0.5);
      let coordY = centerY + 0.3*radiusLarge * ((n % 5) -3.6) ;
      /* change -3.6 to correct positions */
      translate(coordX,coordY,coordZ);
      box(100);
      translate(-coordX,-coordY,-coordZ);
    }
  
  } else if (currentMode == 'interception'){
    if (i<I) {
      if ( i % M == 0){
        k++; //k: number indicating line drawing process
      } 
    } else {
      i = 0;// reset basic parameter
      k = 0;
    }
 
    background(BACK_COLOR);

    camera(0,0, 100, 100, 3, 100, 0, 0, -1);
    // define the camera coordinates in the world coordinates : 
    
    //The world coordinates : 
    directionalLight(250, 200, 500, 0, -1, -1); //light from the sun 

    ambientLight(SEA_COLOR); // magenta light [0, 120, 255]
    ambientMaterial(160); // white material
    plane(10000,10000);

    stroke(WHITE_COLOR);//stroke(0, 0, 0);
    strokeWeight(8);
    for (let l=0 ; l < L ; ++l){//l: line number
      let n;// number of initial data
      if (k - l + L + 1 < 0){
        n = J + k - l + L + 1 ;//L-1
      } else if (k - l + L + 1 >= J) {//=J => n=0 etc
        n = k - l + L  + 1 -J;
      } else {
        n = k - l + L + 1 ;// l=0 => l+L-1, l=L-1 =>n = k
      }
      let coordX = S * (i + ( l - k ) * M ) ;
      let coordY = centerY + radiusLarge * cos(randAngle[ n ]) ;
      let coordZ = centerZ;
      //centerZ + radiusLarge * sin(randAngle[ n ]);
      line(coordX,coordY,coordZ,coordX+LENGTH_LIGHT,coordY,coordZ);
    }
  } else if (currentMode == 'landing') {
    let I = 9425; //change the priod condition to 3x2Pi/0.002=9424.7... 

    if (i<I) {
    } else {
      i = 0;// reset basic parameter
      k = 0;
    }
 
    // define the camera coordinates from a camera on the helicopter
    // of the following coordinates in the world coordinates : 
    let cameraX = cos(0.5 + i * 0.002)*250 ;
    let cameraY = sin(0.5 + i * 0.002)*250;
    let cameraZ = 200+sin(0.5 + i * 0.002)*30;
    camera(cameraX,cameraY, cameraZ, 100, 0, 100, 0, 0, -1);
    // the output images are in the projection coordinates.

    //The world coordinates : 
    background(BACK_COLOR);
    directionalLight(250, 200, 200, 0, -1, -1); //light from the sun 
    fill(EARTH_COLOR);
    plane(10000,10000);

    stroke(0);
    strokeWeight(2);
    fill(150,150, 150);
    pyramid(3);

    translate(-250,0,0);
    pyramid(3);

    translate(-250,0,0);
    pyramid(1.5);

    ambientMaterial(125);
    ambientLight(100,100,100);
    shininess(100.0);

    translate(700, 200, max(500 - i * 0.3, 67) );
    sCube(5);
    
    let M = 25;
    for(let m = 0 ; m < M ; m++){
      translate(140,140, max(650 + 150*m - i * 0.3, 0));
      sCube(5);
    }   
  }
  i++;
} 

// The modeling coordinates :
function pyramid(scaleN){
  push();
    rotateZ(QUARTER_PI);
    scale(scaleN);
    model(octahedron);
  pop();
}

function sCube(scaleN){
  push();
    rotateZ(QUARTER_PI);
    scale(scaleN);
    box(25);
  pop();
}

function resetBackground () {
  i = 0 ;
  h = 0 ;
  k = 0 ;
  autoMode = selectMode.value();
  background(BACK_COLOR) ;
}
