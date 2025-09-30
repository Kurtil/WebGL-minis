const content = "Hello World!";
const style = {
  fontSize: 50,
  fontWeight: "normal",
  fontFamily: "serif",
  fontStyle: "normal",
  fill: 0x000000,
};

const offscreenCanvas = document.getElementById("c");

const ctx = offscreenCanvas.getContext("2d", {
  willReadFrequently: true,
});

// ctx.font = `${style.fontWeight} ${style.fontSize}px ${style.fontFamily} ${style.fontStyle}`;
ctx.font  = "50px serif";

const measure = ctx.measureText(content);

/** @type {number} */
const width = Math.ceil(measure.width * window.devicePixelRatio);
/** @type {number} */
const height = Math.ceil((measure.fontBoundingBoxAscent + measure.fontBoundingBoxDescent) * window.devicePixelRatio);


offscreenCanvas.width = width;
offscreenCanvas.height = height;

ctx.clearRect(0, 0, width, height);

ctx.font  = "50px serif";

ctx.fillStyle = `#${style.fill.toString(16).padStart(6, "0")}`;

ctx.fillText(content, 0, measure.fontBoundingBoxAscent);