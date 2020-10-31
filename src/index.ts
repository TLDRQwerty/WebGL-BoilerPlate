// @ts-ignore
import fsSource from './shader.frag'
// @ts-ignore
import vsSource from './shader.vert'

import { initShaderProgram, getWebGLContext } from './utils'

type BufferType = 'color' | 'position';

type Buffer = {
  itemSize: number,
  numberOfItems: number,
  buffer: WebGLBuffer,
}

type Buffers = Record<BufferType, Buffer>

type ProgramInfo = {
  program: WebGLProgram,
  attribLocations: {
    vertex: {
      position: number,
      color: number,
    }
  },
  buffers: Buffers,
}

function setup() {
  console.log('file loaded')

  const gl = getWebGLContext('#sketch');
  const shaderProgram = initShaderProgram(gl, [[gl.FRAGMENT_SHADER, fsSource], [gl.VERTEX_SHADER, vsSource]]);

  const buffers = initBuffers(gl);

  const programInfo: ProgramInfo = {
    program: shaderProgram,
    attribLocations: {
      vertex: {
        color: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
        position: gl.getAttribLocation(shaderProgram, 'aVertexPosition')
      }
    },
    buffers: {
      color: {
        buffer: buffers.color,
        numberOfItems: 3,
        itemSize: 4,
      },
      position: {
        buffer: buffers.position,
        numberOfItems: 3,
        itemSize: 3,
      }
    }
  };

  draw(gl, programInfo);

}

function initBuffers(gl: WebGLRenderingContext): Record<BufferType, WebGLBuffer> {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const triangleVertices = [
    0.0, 0.5, 0.0,
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  const colors = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  if (!colorBuffer || !positionBuffer) throw Error('Failed to create buffer');

  return {
    color: colorBuffer,
    position: positionBuffer 
  }
}

function draw(gl: WebGLRenderingContext, { program, buffers: { color, position }, attribLocations: { vertex } }: ProgramInfo): void {
  gl.enableVertexAttribArray(vertex.position);
  gl.enableVertexAttribArray(vertex.color);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  const { canvas } = gl;
  if (!(canvas instanceof HTMLCanvasElement)) throw Error('Not canvas element');

  const { clientWidth, clientHeight } = canvas;
  gl.viewport(0, 0, clientWidth, clientHeight);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.bindBuffer(gl.ARRAY_BUFFER, position.buffer);
  gl.vertexAttribPointer(vertex.position, position.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, color.buffer);
  gl.vertexAttribPointer(vertex.color, color.itemSize, gl.FLOAT, false, 0, 0);

  gl.useProgram(program);

  gl.drawArrays(gl.TRIANGLES, 0, position.numberOfItems);
}

window.onload = setup;
