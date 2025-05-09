// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let starX, starY, starRadius = 50; // 星形的中心座標與半徑
let isDragging = false;
let trails = []; // 用於存儲滑落軌跡

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480); // 產生畫布
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // 初始化星形的位置
  starX = width / 2;
  starY = height / 2;

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  background(0); // 清除畫布，設為黑色背景
  image(video, 0, 0);

  // 繪製滑落軌跡
  for (let i = trails.length - 1; i >= 0; i--) {
    let trail = trails[i];
    fill(255, 255, 0, trail.alpha); // 使用透明度繪製
    noStroke();
    drawStar(trail.x, trail.y, starRadius, starRadius / 2, 5);
    trail.alpha -= 2; // 每次減少透明度
    if (trail.alpha <= 0) {
      trails.splice(i, 1); // 移除透明度為0的軌跡
    }
  }

  // 繪製星形
  fill(255, 255, 0);
  noStroke();
  drawStar(starX, starY, starRadius, starRadius / 2, 5);

  // 確保至少檢測到一隻手
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // 檢查食指是否觸碰星形
        let indexFinger = hand.keypoints[8]; // 食指的關鍵點
        let d = dist(indexFinger.x, indexFinger.y, starX, starY);
        if (d < starRadius) {
          isDragging = true; // 開始拖曳
        }

        // 如果正在拖曳，讓星形跟隨食指移動
        if (isDragging) {
          starX = indexFinger.x;
          starY = indexFinger.y;

          // 添加滑落軌跡
          trails.push({ x: starX, y: starY, alpha: 255 });
        }
      }
    }
  } else {
    isDragging = false; // 如果沒有檢測到手，停止拖曳
  }
}

// 繪製星形的函式
function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius1;
    let sy = y + sin(a) * radius1;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius2;
    sy = y + sin(a + halfAngle) * radius2;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
