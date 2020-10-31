export function getWebGLContext(query: string): WebGLRenderingContext {
  const canvas = document.querySelector(query);

  if (!(canvas instanceof HTMLCanvasElement)) throw Error('Could not find a canvas element');

  const gl = canvas.getContext('webgl');
  if (!gl) throw Error('Failed to get context');

  return gl;
}

export function loadShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw Error(`Failed to create shader: ${type}`);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw Error(`An error occured while compiling the shader: ${log}`);
  }

  return shader;
}

export function initShaderProgram(gl: WebGLRenderingContext, shaders: [number, string][]): WebGLProgram {
  const shaderProgram = gl.createProgram();
  if (!shaderProgram) throw Error('Failed to create shader program');

  for (const shader of shaders) {
    const loadedShader = loadShader(gl, ...shader);
    gl.attachShader(shaderProgram, loadedShader);
  }
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    throw Error(`Failed to initialize shader program ${gl.getShaderInfoLog(shaderProgram)}`);
  }

  return shaderProgram
}
