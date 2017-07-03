var w;
var h;
var snake;
var dx = [0, 1, 0, -1];
var dy = [-1, 0, 1, 0];
var dir;
var current;
var grow;
var death;
var food;
var speed;
var score;
var l_score;
var noWallMode;
var che;
function reset() {
  c = color(random(100, 200), random(100, 200), random(100, 200));
  cc = color(random(200, 255), random(200, 255), random(200, 255));
  fc = color(random(200, 255), random(200, 255), random(200, 255));
  size = 20;
  w = floor(width / size);
  h = floor(height / size);
  snake = [new Cell(0, 0), new Cell(0, 1), new Cell(0, 2), new Cell(0, 3)];
  speed = 5;
  dir = [1];
  grow = 0;
  death = false;
  score = 0;
  noWallMode = che.value();
  summonFood();
}

function setup() {
  createCanvas(800, 600);
  createP('');
  l_score = createElement('label', 'Score: ' + score);
  che = createCheckbox('No Wall Mode');
  reset();
}

function draw() {
  frameRate(speed);
  background(10);
  food.show();

  //console.log('draw');
  for(var v = snake.length - 1; v >= 0; v--) {
    snake[v].show();
  }

  if(death){
    gameover();
  }else{
    update();
  }
  l_score.html('Score: ' + score);
}

function update() {
  var prev = snake[0];
  if(grow>0) {
    grow--;
  }else{
    snake.pop();
  }

  if(dir.length > 1){
    dir.shift();
  }

  var x, y;
  x = prev.x + dx[dir[0]];
  y = prev.y + dy[dir[0]];
  if(noWallMode){
    x = (x + w) % w;
    y = (y + h) % h;
  }
  current = new Cell(x, y);

  if(!check()){
    death = true;
  }
  if(current.x === food.x && current.y === food.y){
    summonFood();
    grow += 3;
    score++;
  }
  snake.unshift(current);
  speed = 3 + snake.length/10;

  for(var v = 0; v < snake.length; v++){
    snake[v].resetEdges();
  }
  for(var v = 0; v < snake.length - 1; v++){
    removeEdges(snake[v],snake[v + 1]);
  }
}

function keyPressed() {
  var l = dir.length - 1;
  if(keyCode === UP_ARROW && dir[l] !== 2 && dir[l] !== 0) {
    dir.push(0);
  }else if(keyCode === RIGHT_ARROW && dir[l] !== 3 && dir[l] !== 1) {
    dir.push(1);
  }else if(keyCode === DOWN_ARROW && dir[l] !== 0 && dir[l] !== 2) {
    dir.push(2);
  }else if(keyCode === LEFT_ARROW && dir[l] !== 1 && dir[l] !== 3) {
    dir.push(3);
  }else if(keyCode === 32){
    reset();
  }
  console.log(dir);
}

function check() {
  if(current.x < 0 || current.x >= w || current.y < 0 || current.y >=h){
    return false;
  }

  return !isOverlap(current);
}

function isOverlap(cell) {
  for(var v in snake) {
    if(cell.x === snake[v].x && cell.y === snake[v].y){
      return true;
    }
  }
  return false;
}

function gameover() {
  console.log('gameover');
  noStroke();
  fill(255,0,0);
  textSize(72);
  text('GAME OVER', 200, height / 2);
  textSize(24);
  text('Press spacebar to restart', 300, height / 2 + 50);
}

function summonFood() {
  var x, y, c;
  while(!c || isOverlap(c)) {
    x = floor(random(w));
    y = floor(random(h));
    c = new Cell(x, y);
  }
  food = c;
}
