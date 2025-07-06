// 星用
const starCanvas = document.getElementById("stars");
const starCtx = starCanvas.getContext("2d");
starCanvas.width = window.innerWidth;
starCanvas.height = window.innerHeight;

// 芝生用
const groundCanvas = document.getElementById("ground");
const groundCtx = groundCanvas.getContext("2d");
const grassBlades = [];
groundCanvas.width = window.innerWidth;
groundCanvas.height = 150;

// ホタル用
const fireflyCanvas = document.getElementById("fireflies");
const fireflyCtx = fireflyCanvas.getContext("2d");
fireflyCanvas.width = window.innerWidth;
fireflyCanvas.height = window.innerHeight;
//文字用
const textCanvas = document.getElementById("floatingText");
const textCtx = textCanvas.getContext("2d");
textCanvas.width = window.innerWidth;
textCanvas.height = window.innerHeight;

const messages = 
      ["지금까지 감사했습니다", "세상에서 가장 사랑했던", "몇번이고 도와주었던", "ありがとう", "절대로 잊지 않을께요","힘내세요","분명 좋은 미래가 기다리고 있을거에요",];
let floatingTexts = [];
let shootingStars = [];

function createStar() {
  return {
    x: Math.random() * starCanvas.width,
    y: Math.random() * starCanvas.height / 2,
    length: 80 + Math.random() * 50,
    speed: 4 + Math.random() * 2,
    opacity: 1
  };
}
//Star
function drawStar(star) {
  starCtx.beginPath();
  starCtx.moveTo(star.x, star.y);
  starCtx.lineTo(star.x - star.length, star.y + star.length);
  starCtx.strokeStyle = `rgba(255, 255, 255, ${star.opacity})`;
  starCtx.lineWidth = 2;
  starCtx.stroke();
}

function animateStars() {
  starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
  if (Math.random() < 0.05) shootingStars.push(createStar());
  shootingStars.forEach((star, index) => {
    star.x -= star.speed;
    star.y += star.speed;
    star.opacity -= 0.04;
    drawStar(star);
    if (star.opacity <= 0) shootingStars.splice(index, 1);
  });
  requestAnimationFrame(animateStars);
}
animateStars();
//Firefly
class Firefly {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * fireflyCanvas.width;
    this.y = Math.random() * fireflyCanvas.height * 0.6 + fireflyCanvas.height * 0.3;
    this.radius = Math.random() * 2 + 1;
    this.alpha = Math.random();
    this.alphaChange = 0.01 * (Math.random() > 0.5 ? 1 : -1);
    this.dx = Math.random() * 0.6 - 0.3;
    this.dy = Math.random() * 0.6 - 0.3;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.alpha += this.alphaChange;
    if (this.alpha <= 0 || this.alpha >= 1) this.alphaChange *= -1;
    if (this.x < 0 || this.x > fireflyCanvas.width || this.y < 0 || this.y > fireflyCanvas.height) {
      this.reset();
    }
  }

  draw() {
    fireflyCtx.beginPath();
    fireflyCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    fireflyCtx.fillStyle = `rgba(255, 255, 150, ${this.alpha})`;
    fireflyCtx.fill();
  }
}

const fireflies = Array.from({ length: 50 }, () => new Firefly());

function animateFireflies() {
  fireflyCtx.clearRect(0, 0, fireflyCanvas.width, fireflyCanvas.height);
  fireflies.forEach(f => {
    f.update();
    f.draw();
  });
  requestAnimationFrame(animateFireflies);
}
animateFireflies();

for (let i = 0; i < 500; i++) {
  grassBlades.push({
    x: Math.random() * groundCanvas.width,
    y: Math.random() * groundCanvas.height,
    length: 5 + Math.random() * 10,
    phase: Math.random() * Math.PI * 2,       // 揺れの位相
    amplitude: 2 + Math.random() * 2,         // 揺れの幅
    speed: 0.02 + Math.random() * 0.02        // 揺れの速さ
  });
}


function getGroundHeight(x) {
  const base = groundCanvas.height ;
  const wave = Math.sin(x * 0.005) * 10 + Math.cos(x * 0.01) * 5;
  return base + wave;
}

// 🌱 草の初期化（地面の波に沿って配置）
for (let i = 0; i < 500; i++) {
  const x = Math.random() * groundCanvas.width;
  const y = getGroundHeight(x);

  grassBlades.push({
    x: x,
    y: y,
    length: 5 + Math.random() * 10,
    phase: Math.random() * Math.PI * 2,
    amplitude: 2 + Math.random() * 2,
    speed: 0.02 + Math.random() * 0.02
  });
}

// 🌊 地面の上端を波打たせる関数（上端に見せる）
function getGroundTop(x) {
  const base = groundCanvas.height * 0.2; // 上端に近い位置
  const wave = Math.sin(x * 0.005) * 10 + Math.cos(x * 0.01) * 5;
  return base + wave;
}

// 🌱 草の初期化（上端ラインに沿って配置）
for (let i = 0; i < 500; i++) {
  const x = Math.random() * groundCanvas.width;
  const y = getGroundTop(x);

  grassBlades.push({
    x: x,
    y: y,
    length: 5 + Math.random() * 10,
    phase: Math.random() * Math.PI * 2,
    amplitude: 2 + Math.random() * 2,
    speed: 0.02 + Math.random() * 0.02
  });
}

function drawGrassBlades(time) {
  groundCtx.clearRect(0, 0, groundCanvas.width, groundCanvas.height);

  // 地面の形（波打つ上端だけを描画）
  groundCtx.beginPath();
  groundCtx.moveTo(0, groundCanvas.height); // 左下からスタート
  for (let x = 0; x <= groundCanvas.width; x++) {
    groundCtx.lineTo(x, getGroundTop(x)); // 上端の波
  }
  groundCtx.lineTo(groundCanvas.width, groundCanvas.height); // 右下へ
  groundCtx.closePath();
  groundCtx.fillStyle = "#0A1225";
  groundCtx.fill();

  // 草を描画
  grassBlades.forEach(blade => {
    const sway = Math.sin(time * blade.speed + blade.phase) * blade.amplitude;
    groundCtx.beginPath();
    groundCtx.moveTo(blade.x, blade.y);
    groundCtx.lineTo(blade.x + sway, blade.y - blade.length);
    groundCtx.strokeStyle = `rgba(32, 60, 58, 0.8)`;
    groundCtx.lineWidth = 1;
    groundCtx.stroke();
  });
}

// 🌿 アニメーションループ
function animateGrass(time) {
  drawGrassBlades(time / 10);
  requestAnimationFrame(animateGrass);
}
animateGrass(0);
//Text
function createFloatingText() {
  const text = messages[Math.floor(Math.random() * messages.length)];
  return {
    text: text,
    x: Math.random() * textCanvas.width,
    y: Math.random() * textCanvas.height * 0.5 + textCanvas.height * 0.4,
    alpha: 1,
    dy: 0.1 + Math.random() * 0.3,
    fontSize: 20 + Math.random() * 10
  };
}

function animateFloatingText() {
  textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);

  if (Math.random() < 0.01) {
    floatingTexts.push(createFloatingText());
  }

  floatingTexts.forEach((t, index) => {
    t.y -= t.dy;
    t.alpha -= 0.005;

    textCtx.font = `${t.fontSize}px 'Single Day', cursive`;
    textCtx.fillStyle = `rgba(255, 255, 150, ${t.alpha})`;
    textCtx.textAlign = "center";
    textCtx.fillText(t.text, t.x, t.y);

    if (t.alpha <= 0) {
      floatingTexts.splice(index, 1);
    }
  });

  requestAnimationFrame(animateFloatingText);
}

animateFloatingText();