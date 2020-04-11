import React, { useEffect } from 'react';
import { initShaders } from '@/utils/webglUtils';
import { Matrix4 } from '@/utils/matrix4';

export default function() {
  const id = 'perspectiveView';

  useEffect(() => {
    const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    // uniform mat4 u_ModelMatrix; // 模型矩阵
    // uniform mat4 u_ViewMatrix; // 视图矩阵
    // uniform mat4 u_ProjMatrix; // 投影矩阵
    uniform mat4 u_MvpMatrix; // 计算后的矩阵
    varying vec4 v_Color;

    void main() {
      // gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
      gl_Position = u_MvpMatrix * a_Position;
      v_Color = a_Color;
    }
    `;
    const FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;

    void main() {
      gl_FragColor = v_Color;
    }
    `;
    const canvas: HTMLElement | null = document.getElementById(id);
    if (!canvas) return;
    // @ts-ignore
    const gl: WebGLRenderingContext = canvas.getContext('webgl');
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log('Failed to initialize shaders.');
      return;
    }

    const n: number = initVertexBuffer(gl);
    if (n < 0) {
      console.log('Failed to set the positions of the vertices.');
      return;
    }

    // const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    // const u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    // const u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
    // if (!u_ViewMatrix || !u_ProjMatrix || !u_ModelMatrix) {
    //   console.log("Failed to get uniform location.");
    //   return;
    // }

    // @ts-ignore
    const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    if (!u_MvpMatrix) {
      console.log('Failed to get u_MvpMatrix location.');
      return;
    }

    const modelMatrix = new Matrix4();
    const viewMatrix = new Matrix4();
    const projMatrix = new Matrix4();
    modelMatrix.setTranslate(0.75, 0.0, 0.0);
    viewMatrix.setLookAt(0.0, 0.0, 5.0, 0.0, 0.0, -100.0, 0.0, 1.0, 0.0);
    projMatrix.setPerspective(
      30,
      canvas.clientWidth / canvas.clientHeight,
      1,
      100,
    );

    // gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    // gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    // gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

    const mvpMatrix = new Matrix4();
    mvpMatrix
      .set(projMatrix)
      ?.multiply(viewMatrix)
      .multiply(modelMatrix);

    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    gl.clearColor(0, 0, 0, 1.0);
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // 开启隐藏面消除
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);

    modelMatrix.setTranslate(-0.75, 0.0, 0.0);
    mvpMatrix
      .set(projMatrix)
      ?.multiply(viewMatrix)
      .multiply(modelMatrix);
    // gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, n);
  }, []);

  function initVertexBuffer(gl: WebGLRenderingContext): number {
    const verticesColors = new Float32Array([
      0.0,
      1.0,
      0.0,
      0.4,
      0.4,
      1.0,
      -0.5,
      -1.0,
      0.0,
      0.4,
      0.4,
      1.0,
      0.5,
      -1.0,
      0.0,
      1.0,
      0.4,
      0.4,

      0,
      1.0,
      -4.0,
      0.4,
      1.0,
      0.4,
      -0.5,
      -1.0,
      -4.0,
      0.4,
      1.0,
      0.4,
      0.5,
      -1.0,
      -4.0,
      1.0,
      0.4,
      0.4,

      0.0,
      1.0,
      -2.0,
      1.0,
      1.0,
      0.4,
      -0.5,
      -1.0,
      -2.0,
      0.4,
      1.0,
      0.4,
      0.5,
      -1.0,
      -2.0,
      1.0,
      0.4,
      0.4,

      // 0.0, 1.0, 0.0, 0.4, 0.4, 1.0,
      // -0.5, -1.0, 0.0, 0.4, 0.4, 1.0,
      // 0.5, -1.0, 0.0, 1.0, 0.4, 0.4,
    ]);
    const n = verticesColors.length / 6;
    const VERTICESCOLORS = verticesColors.BYTES_PER_ELEMENT;

    const vertexBuffer: WebGLBuffer | null = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object.');
      return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
    // @ts-ignore
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    // @ts-ignore
    const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Position < 0 || a_Color < 0) {
      console.log('Failed to get location.');
      return -1;
    }

    gl.vertexAttribPointer(
      a_Position,
      3,
      gl.FLOAT,
      false,
      VERTICESCOLORS * 6,
      0,
    );
    gl.vertexAttribPointer(
      a_Color,
      3,
      gl.FLOAT,
      false,
      VERTICESCOLORS * 6,
      VERTICESCOLORS * 2,
    );
    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_Color);
    return n;
  }

  return <canvas id={id} style={{ width: '100%', height: '100%' }} />;
}
