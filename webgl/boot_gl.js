// Minimal WebGL boot animation used as a pleasing boot visual.
// This is intentionally small and avoids external libs.

window.startWebGLBoot = function(canvas){
  if(!canvas.getContext) return;
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if(!gl) return;
  function resize(){
    const ratio = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = Math.floor(w*ratio);
    canvas.height = Math.floor(h*ratio);
    gl.viewport(0,0,canvas.width,canvas.height);
  }
  resize(); window.addEventListener('resize', resize);

  const vs = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}';
  const fs = 'precision mediump float;uniform vec2 u_res;uniform float u_t;void main(){vec2 p=(gl_FragCoord.xy/u_res)*2.0-1.0; p.x*=u_res.x/u_res.y; float v = abs(p.x) + p.y*1.2; float band = 0.18 + 0.06*sin(u_t*2.0); float alpha = smoothstep(band+0.02, band, v); vec3 col = mix(vec3(0.02,0.05,0.12), vec3(0.09,0.6,1.0), 1.0-alpha); gl_FragColor = vec4(col,1.0);}';
  function compile(src,type){ const s = gl.createShader(type); gl.shaderSource(s,src); gl.compileShader(s); if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){console.warn(gl.getShaderInfoLog(s)); return null;} return s; }
  const s1 = compile(vs,gl.VERTEX_SHADER), s2 = compile(fs,gl.FRAGMENT_SHADER);
  const prog = gl.createProgram(); gl.attachShader(prog,s1); gl.attachShader(prog,s2); gl.linkProgram(prog);
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
  const aLoc = gl.getAttribLocation(prog,'a'); gl.enableVertexAttribArray(aLoc); gl.vertexAttribPointer(aLoc,2,gl.FLOAT,false,0,0);
  const u_res = gl.getUniformLocation(prog,'u_res'); const u_t = gl.getUniformLocation(prog,'u_t');
  let start = performance.now();
  function frame(now){
    const t = (now-start)/1000;
    gl.viewport(0,0,canvas.width,canvas.height);
    gl.clearColor(0.01,0.02,0.03,1); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(u_res, canvas.width, canvas.height);
    gl.uniform1f(u_t, t);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    if(t < 4.8) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
};