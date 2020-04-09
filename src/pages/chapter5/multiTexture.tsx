import React, { useEffect } from 'react';
import { initShaders } from '@/utils/webglUtils';

export default function() {
  const id = 'multiTexture';
  let g_texUnit0 = false,
    g_texUnit1 = false;

  useEffect(() => {
    const VSHADER_SOURCE = `
      attribute vec4 a_Position;
      attribute vec2 a_TexCoord;
      varying vec2 v_TexCoord;

      void main() {
        gl_Position = a_Position;
        v_TexCoord = a_TexCoord;
      }
    `;
    const FSHADER_SOURCE = `
      precision mediump float;
      uniform sampler2D u_Sampler0;
      uniform sampler2D u_Sampler1;
      varying vec2 v_TexCoord;

      void main() {
        vec4 color0 = texture2D(u_Sampler0, v_TexCoord);
        vec4 color1 = texture2D(u_Sampler1, v_TexCoord);
        gl_FragColor = color0 * color1;
      }
    `;
    const canvas = document.getElementById(id);
    if (!canvas) {
      console.log("can't found element canvas");
      return;
    }
    // @ts-ignore
    const gl = canvas.getContext('webgl');
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log('Failed to initialize shaders.');
      return;
    }

    const n = initVertexBuffer(gl);
    if (n < 0) {
      console.log('Failed to create buffer.');
      return;
    }

    gl.clearColor(0, 0, 0, 1);

    if (!initTextures(gl, n)) {
      console.log('Failed to initialize textures.');
      return;
    }
  });

  function initVertexBuffer(gl: WebGL2RenderingContext): number {
    const verticesTexCoords = new Float32Array([
      -0.5,
      0.5,
      0.0,
      1.0,
      -0.5,
      -0.5,
      0.0,
      0.0,
      0.5,
      0.5,
      1.0,
      1.0,
      0.5,
      -0.5,
      1.0,
      0.0,
    ]);
    const n = 4;

    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create Buffer.');
      return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

    const FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
    // @ts-ignore
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    // @ts-ignore
    const a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    if (a_Position < 0 || a_TexCoord < 0) {
      console.log('Failed to get attribute location.');
      return -1;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.vertexAttribPointer(
      a_TexCoord,
      2,
      gl.FLOAT,
      false,
      FSIZE * 4,
      FSIZE * 2,
    );
    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_TexCoord);

    return n;
  }

  function initTextures(gl: WebGL2RenderingContext, n: number): Boolean {
    const texture0: WebGLTexture | null = gl.createTexture();
    const texture1: WebGLTexture | null = gl.createTexture();
    if (!texture0 || !texture1) {
      console.log('Failed to create Texture.');
      return false;
    }
    // @ts-ignore
    const u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    // @ts-ignore
    const u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler0 || !u_Sampler1) {
      console.log('Failed to get u_Sampler location.');
      return false;
    }
    const image0: HTMLImageElement | null = new Image();
    const image1: HTMLImageElement | null = new Image();
    if (!image0 || !image1) {
      console.log('Failed to create Image element.');
      return false;
    }
    // 解决跨域
    image0.crossOrigin = '';
    image1.crossOrigin = '';
    image0.onload = function() {
      loadTexture(gl, n, texture0, u_Sampler0, image0, 0);
    };
    image1.onload = function() {
      loadTexture(gl, n, texture1, u_Sampler1, image1, 1);
    };

    image0.src = require('../../assets/yay.jpg');
    image1.src = require('../../assets/circle.gif');
    return true;
  }

  function loadTexture(
    gl: WebGL2RenderingContext,
    n: number,
    texture: WebGLTexture,
    u_Sampler: WebGLUniformLocation,
    image: HTMLImageElement,
    texUnit: 0 | 1,
  ) {
    // 处理图像，y轴翻转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    // 激活指定纹理单元，编号为texUnit的纹理单元
    if (texUnit === 0) {
      gl.activeTexture(gl.TEXTURE0);
      g_texUnit0 = true;
    } else {
      gl.activeTexture(gl.TEXTURE1);
      g_texUnit1 = true;
    }
    // 绑定纹理对象，本例为二维纹理
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // 配置纹理对象参数， 二维纹理，图像缩小，使用gl.LEAREA颜色加权平均
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // 纹理图像分配给纹理对象， 二维纹理， 非金字塔纹理，rgb， rgb， 无符号整型，图像对象
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    // 将编号为texUnit的纹理单元传给取样器变量
    gl.uniform1i(u_Sampler, texUnit);

    gl.clear(gl.COLOR_BUFFER_BIT);
    if (g_texUnit0 && g_texUnit1) {
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    }
  }

  return <canvas id={id} style={{ width: '100%', height: '100%' }} />;
}