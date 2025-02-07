
const canvas = document.getElementById('c1');
const ctx = canvas.getContext('2d');

const canvas2 = document.getElementById('c2');
const ctx2 = canvas2.getContext('2d');

const aReallyLongString = 'This is a really long string that will be split into multiple lines when drawn on the canvas using the fillText method.';
const str = aReallyLongString.repeat(1);

const { width, height } = canvas;

ctx.font = '48px serif';

function draw() {
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < 20; i++) {
    ctx.fillText(str, width / 2, height / 2);
    ctx.translate(width / 2, height / 2);
    ctx.rotate(Math.PI / 180);
    ctx.translate(-width / 2, -height / 2);
  }
}

async function loop() {
  draw();
  requestAnimationFrame(loop);
  const bm = await window.createImageBitmap(canvas);
  ctx2.clearRect(0, 0, width, height);
  ctx2.drawImage(bm, 0, 0);
  const nbm = await window.createImageBitmap(canvas2);
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(nbm, 0, 0);
}

loop();
