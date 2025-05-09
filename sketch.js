// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let starX, starY, starRadius = 50; // 星形的中心座標與半徑
let isDragging = false;
let trails = []; // 用於存儲滑落軌跡

function preload() {
  try {
    // Initialize HandPose model with flipped video input
    handPose = ml5.handPose({ flipped: true }, () => {
      console.log("HandPose model loaded successfully.");
    });
  } catch (error) {
    console.error("Error loading HandPose model:", error);
  }
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  console.log("Hand detection results:", results);
  hands = results;
}

function setup() {
  createCanvas(640, 480); // 產生畫布
  video = createCapture(VIDEO, () => {
    console.log("Video capture started.");
  });
  video.hide();

  // 初始化星形的位置
  starX = width / 2;
  starY = height / 2;

  // Start detecting hands
  try {
    handPose.detectStart(video, gotHands);
    console.log("Hand detection started.");
  } catch (error) {
    console.error("Error starting hand detection:", error);
  }
}

function draw() {
  background(0);
  image(video, 0, 0);

  if (hands.length > 0) {
    console.log("Hands detected:", hands);
  }
}
