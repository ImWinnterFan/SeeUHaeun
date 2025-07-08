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
      ["지금까지 감사했습니다!", "세상에서 가장 사랑했던!", "몇번이고 도와주었던!", "ありがとう!", "절대로 잊지 않을께요!","힘내세요!","분명 좋은 미래가 기다리고 있을거에요!","즐거웠던 추억 감사합니다!","많은 상냥함 감사합니다","지지해줘서 고마워요","사랑해줘서 고마워요!","건강히 잘지내요! 몸조심하세요!","하은이의 행복을 진심으로 바라고 있어요!","하은이라면 어떤 어려움도 이겨낼 수 있어요!","사랑해줘서 고마워요","서로의 인생을 열심히 살자!"];
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
    y: Math.random() * textCanvas.height * 0.4 + textCanvas.height * 0.1,
    alpha: 1,
    dy: 0.01 + Math.random() * 0.5,
    fontSize: 20 + Math.random() * 0.5
  };
}

function animateFloatingText() {
  textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);

  if (Math.random() < 0.01) {
    floatingTexts.push(createFloatingText());
  }

  floatingTexts.forEach((t, index) => {
    t.y -= t.dy;
    t.alpha -= 0.0005;

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

//animateFloatingText();

const lyrics = [
  ["君が僕の前に現れた日から", "네가 내 앞에 나타난 그날부터"],
  ["何もかもが違くみえたんだ", "모든 게 다르게 보였어"],
  ["朝も光も涙も、歌う声も", "아침도 빛도 눈물도, 노래하는 목소리도"],
  ["君が輝きをくれたんだ", "너는 나에게 빛을 주었어"],
  ["抑えきれない思いをこの声に乗せて", "참을 수 없는 마음을 이 목소리에 실어"],
  ["遠く君の街へ届けよう", "멀리 너의 도시로 전할게"],
  ["たとえばそれがこんな歌だったら", "그게 이런 노래라면"],
  ["ぼくらはどこにいたとしても繋がっていける", "우리는 어디에 있어도 이어질 수 있어"]
];

const timings = [4.5, 11, 18, 24, 31, 37, 44,50]; // 秒単位

const audio = document.getElementById("bgm");
const lyricsDiv = document.getElementById("lyrics");

let currentLine = -1;

function updateLyrics() {
  const time = audio.currentTime;

  // 現在のタイミングに合う行を探す
  for (let i = 0; i < timings.length; i++) {
    const start = timings[i];
    const end = timings[i + 1] || audio.duration;

    if (time >= start && time < end) {
      if (currentLine !== i) {
        const [jp, kr] = lyrics[i];
        lyricsDiv.innerHTML = `
          <div class="line">${jp}</div>
          <div class="line kr">${kr}</div>
        `;
        lyricsDiv.style.opacity = 1;
        currentLine = i;
      }
      break;
    } else if (time >= end && currentLine === i) {
      lyricsDiv.style.opacity = 0;
    }
  }

  requestAnimationFrame(updateLyrics);
}

audio.addEventListener("play", () => {
  currentLine = -1;
  lyricsDiv.innerHTML = "";
  lyricsDiv.style.opacity = 0;
  updateLyrics();
  animateFloatingText();
});