// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY, circleRadius = 50; // 圓心座標與半徑
let isDragging = false;

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

  // 初始化圓的位置
  circleX = width / 2;
  circleY = height / 2;

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // 繪製圓
  fill(0, 0, 255);
  noStroke();
  circle(circleX, circleY, circleRadius * 2);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Loop through keypoints and draw circles
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }

        // Draw lines connecting keypoints
        drawLines(hand.keypoints, [0, 1, 2, 3, 4]);  // Thumb
        drawLines(hand.keypoints, [5, 6, 7, 8]);     // Index finger
        drawLines(hand.keypoints, [9, 10, 11, 12]);  // Middle finger
        drawLines(hand.keypoints, [13, 14, 15, 16]); // Ring finger
        drawLines(hand.keypoints, [17, 18, 19, 20]); // Pinky finger

        // 檢查食指是否觸碰圓
        let indexFinger = hand.keypoints[8]; // 食指的關鍵點
        let d = dist(indexFinger.x, indexFinger.y, circleX, circleY);
        if (d < circleRadius) {
          isDragging = true; // 開始拖曳
        }

        // 如果正在拖曳，讓圓跟隨食指移動
        if (isDragging) {
          circleX = indexFinger.x;
          circleY = indexFinger.y;
        }
      }
    }
  } else {
    isDragging = false; // 如果沒有檢測到手，停止拖曳
  }
}

function drawLines(keypoints, indices) {
  for (let i = 0; i < indices.length - 1; i++) {
    let start = keypoints[indices[i]];
    let end = keypoints[indices[i + 1]];
    stroke(0, 255, 0); // 設定線條顏色
    strokeWeight(2);   // 設定線條粗細
    line(start.x, start.y, end.x, end.y);
  }
}
