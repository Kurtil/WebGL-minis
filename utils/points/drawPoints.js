import pointsVertexShaderSource from "./vertex.js";
import pointsFragmentShaderSource from "./fragment.js";

import { gl, makeProgram, makeBuffer } from "webglutils";

const pointsProgram = makeProgram(
  pointsVertexShaderSource,
  pointsFragmentShaderSource
);

const resolutionUniformLocation = gl.getUniformLocation(pointsProgram, "resolution");
const pointSizeUniformLocation = gl.getUniformLocation(pointsProgram, "pointSize");


export default function getDrawPoints(points) {
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  makeBuffer(points);
  const pointAttributeLocation = gl.getAttribLocation(pointsProgram, "point");
  gl.enableVertexAttribArray(pointAttributeLocation);
  gl.vertexAttribPointer(pointAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  gl.bindVertexArray(null);

  return () => {
    gl.bindVertexArray(vao);
    gl.useProgram(pointsProgram);

    gl.disable(gl.DEPTH_TEST);
  
    gl.uniform2f(resolutionUniformLocation, gl.canvas.clientWidth, gl.canvas.clientHeight);
    gl.uniform1f(pointSizeUniformLocation, 10);
  
    gl.drawArrays(gl.POINTS, 0, points.length / 2);

    gl.bindVertexArray(null);
  }

}