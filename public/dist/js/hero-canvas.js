/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/*!*********************************************!*\
  !*** ./resources/js/plugins/hero-canvas.js ***!
  \*********************************************/
eval("var ClassicalNoise = function ClassicalNoise(r) {\n  // Classic Perlin noise in 3D, for comparison \n  if (r === undefined) r = Math;\n  this.grad3 = [[1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0], [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1], [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]];\n  this.p = [];\n\n  for (var i = 0; i < 256; i++) {\n    this.p[i] = Math.floor(r.random() * 256);\n  } // To remove the need for index wrapping, double the permutation table length \n\n\n  this.perm = [];\n\n  for (var i = 0; i < 512; i++) {\n    this.perm[i] = this.p[i & 255];\n  }\n};\n\nClassicalNoise.prototype.dot = function (g, x, y, z) {\n  return g[0] * x + g[1] * y + g[2] * z;\n};\n\nClassicalNoise.prototype.mix = function (a, b, t) {\n  return (1.0 - t) * a + t * b;\n};\n\nClassicalNoise.prototype.fade = function (t) {\n  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);\n}; // Classic Perlin noise, 3D version \n\n\nClassicalNoise.prototype.noise = function (x, y, z) {\n  // Find unit grid cell containing point \n  var X = Math.floor(x);\n  var Y = Math.floor(y);\n  var Z = Math.floor(z); // Get relative xyz coordinates of point within that cell \n\n  x = x - X;\n  y = y - Y;\n  z = z - Z; // Wrap the integer cells at 255 (smaller integer period can be introduced here) \n\n  X = X & 255;\n  Y = Y & 255;\n  Z = Z & 255; // Calculate a set of eight hashed gradient indices \n\n  var gi000 = this.perm[X + this.perm[Y + this.perm[Z]]] % 12;\n  var gi001 = this.perm[X + this.perm[Y + this.perm[Z + 1]]] % 12;\n  var gi010 = this.perm[X + this.perm[Y + 1 + this.perm[Z]]] % 12;\n  var gi011 = this.perm[X + this.perm[Y + 1 + this.perm[Z + 1]]] % 12;\n  var gi100 = this.perm[X + 1 + this.perm[Y + this.perm[Z]]] % 12;\n  var gi101 = this.perm[X + 1 + this.perm[Y + this.perm[Z + 1]]] % 12;\n  var gi110 = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z]]] % 12;\n  var gi111 = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z + 1]]] % 12; // The gradients of each corner are now: \n  // g000 = grad3[gi000]; \n  // g001 = grad3[gi001]; \n  // g010 = grad3[gi010]; \n  // g011 = grad3[gi011]; \n  // g100 = grad3[gi100]; \n  // g101 = grad3[gi101]; \n  // g110 = grad3[gi110]; \n  // g111 = grad3[gi111]; \n  // Calculate noise contributions from each of the eight corners \n\n  var n000 = this.dot(this.grad3[gi000], x, y, z);\n  var n100 = this.dot(this.grad3[gi100], x - 1, y, z);\n  var n010 = this.dot(this.grad3[gi010], x, y - 1, z);\n  var n110 = this.dot(this.grad3[gi110], x - 1, y - 1, z);\n  var n001 = this.dot(this.grad3[gi001], x, y, z - 1);\n  var n101 = this.dot(this.grad3[gi101], x - 1, y, z - 1);\n  var n011 = this.dot(this.grad3[gi011], x, y - 1, z - 1);\n  var n111 = this.dot(this.grad3[gi111], x - 1, y - 1, z - 1); // Compute the fade curve value for each of x, y, z \n\n  var u = this.fade(x);\n  var v = this.fade(y);\n  var w = this.fade(z); // Interpolate along x the contributions from each of the corners \n\n  var nx00 = this.mix(n000, n100, u);\n  var nx01 = this.mix(n001, n101, u);\n  var nx10 = this.mix(n010, n110, u);\n  var nx11 = this.mix(n011, n111, u); // Interpolate the four results along y \n\n  var nxy0 = this.mix(nx00, nx10, v);\n  var nxy1 = this.mix(nx01, nx11, v); // Interpolate the two last results along z \n\n  var nxyz = this.mix(nxy0, nxy1, w);\n  return nxyz;\n};\n\nvar canvas = document.getElementById('waves');\n\nif (canvas) {\n  var draw = function draw() {\n    ctx.shadowColor = \"rgba(195,204,224)\";\n    ctx.shadowBlur = 0;\n\n    for (var i = 0; i <= maxLines; i++) {\n      ctx.beginPath();\n      ctx.moveTo(0, startY);\n\n      for (var x = 0; x <= canvasWidth; x++) {\n        var y = perlin.noise(x * variation + variators[i], x * variation, 0);\n        ctx.lineTo(x, startY + amp * y);\n      }\n\n      var color = Math.floor(150 * Math.abs(y));\n      var alpha = Math.min(Math.abs(y), .7) + .1;\n      ctx.strokeStyle = \"rgba(3,164,194,\" + alpha + \")\";\n      ctx.stroke();\n      ctx.closePath();\n      variators[i] += .002;\n    }\n  };\n\n  var animate = function animate() {\n    ctx.clearRect(0, 0, canvasWidth, canvasHeight);\n    draw();\n    requestAnimationFrame(animate);\n  };\n\n  var resizeCanvas = function resizeCanvas() {\n    canvasWidth = document.documentElement.clientWidth;\n    canvasHeight = document.documentElement.clientHeight;\n    canvas.setAttribute(\"width\", canvasWidth);\n    canvas.setAttribute(\"height\", canvasHeight);\n    startY = canvasHeight / 2;\n  };\n\n  var ctx = canvas.getContext('2d'),\n      perlin = new ClassicalNoise(),\n      variation = .001,\n      amp = 800,\n      maxLines = 52,\n      variators = [],\n      canvasWidth,\n      canvasHeight,\n      startY;\n\n  for (var i = 0, u = 0; i < maxLines; i++, u += .02) {\n    variators[i] = u;\n  }\n\n  (function init() {\n    resizeCanvas();\n    animate();\n    window.addEventListener('resize', resizeCanvas);\n  })();\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AbHV4L2xhcmF2ZWwtc3RhcnRlci8uL3Jlc291cmNlcy9qcy9wbHVnaW5zL2hlcm8tY2FudmFzLmpzP2EyZjYiXSwibmFtZXMiOlsiQ2xhc3NpY2FsTm9pc2UiLCJyIiwidW5kZWZpbmVkIiwiTWF0aCIsImdyYWQzIiwicCIsImkiLCJmbG9vciIsInJhbmRvbSIsInBlcm0iLCJwcm90b3R5cGUiLCJkb3QiLCJnIiwieCIsInkiLCJ6IiwibWl4IiwiYSIsImIiLCJ0IiwiZmFkZSIsIm5vaXNlIiwiWCIsIlkiLCJaIiwiZ2kwMDAiLCJnaTAwMSIsImdpMDEwIiwiZ2kwMTEiLCJnaTEwMCIsImdpMTAxIiwiZ2kxMTAiLCJnaTExMSIsIm4wMDAiLCJuMTAwIiwibjAxMCIsIm4xMTAiLCJuMDAxIiwibjEwMSIsIm4wMTEiLCJuMTExIiwidSIsInYiLCJ3IiwibngwMCIsIm54MDEiLCJueDEwIiwibngxMSIsIm54eTAiLCJueHkxIiwibnh5eiIsImNhbnZhcyIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJkcmF3IiwiY3R4Iiwic2hhZG93Q29sb3IiLCJzaGFkb3dCbHVyIiwibWF4TGluZXMiLCJiZWdpblBhdGgiLCJtb3ZlVG8iLCJzdGFydFkiLCJjYW52YXNXaWR0aCIsInBlcmxpbiIsInZhcmlhdGlvbiIsInZhcmlhdG9ycyIsImxpbmVUbyIsImFtcCIsImNvbG9yIiwiYWJzIiwiYWxwaGEiLCJtaW4iLCJzdHJva2VTdHlsZSIsInN0cm9rZSIsImNsb3NlUGF0aCIsImFuaW1hdGUiLCJjbGVhclJlY3QiLCJjYW52YXNIZWlnaHQiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJyZXNpemVDYW52YXMiLCJkb2N1bWVudEVsZW1lbnQiLCJjbGllbnRXaWR0aCIsImNsaWVudEhlaWdodCIsInNldEF0dHJpYnV0ZSIsImdldENvbnRleHQiLCJpbml0Iiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciJdLCJtYXBwaW5ncyI6IkFBQUEsSUFB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c2ljYWxOb2lzZSA9IGZ1bmN0aW9uKHIpIHsgLy8gQ2xhc3NpYyBQZXJsaW4gbm9pc2UgaW4gM0QsIGZvciBjb21wYXJpc29uIFxuICAgIGlmIChyID09PSB1bmRlZmluZWQpIHIgPSBNYXRoO1xuICAgIHRoaXMuZ3JhZDMgPSBbWzEsMSwwXSxbLTEsMSwwXSxbMSwtMSwwXSxbLTEsLTEsMF0sWzEsMCwxXSxbLTEsMCwxXSxbMSwwLC0xXSxbLTEsMCwtMV0sWzAsMSwxXSxbMCwtMSwxXSxbMCwxLC0xXSxbMCwtMSwtMV1dOyBcbiAgICB0aGlzLnAgPSBbXTtcbiAgICBmb3IgKHZhciBpPTA7IGk8MjU2OyBpKyspIHtcbiAgICAgICAgdGhpcy5wW2ldID0gTWF0aC5mbG9vcihyLnJhbmRvbSgpKjI1Nik7XG4gICAgfVxuICAgIC8vIFRvIHJlbW92ZSB0aGUgbmVlZCBmb3IgaW5kZXggd3JhcHBpbmcsIGRvdWJsZSB0aGUgcGVybXV0YXRpb24gdGFibGUgbGVuZ3RoIFxuICAgIHRoaXMucGVybSA9IFtdOyBcbiAgICBmb3IodmFyIGk9MDsgaTw1MTI7IGkrKykge1xuICAgICAgICB0aGlzLnBlcm1baV09dGhpcy5wW2kgJiAyNTVdO1xuICAgIH1cbn07XG4gIFxuQ2xhc3NpY2FsTm9pc2UucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uKGcsIHgsIHksIHopIHsgXG4gICAgcmV0dXJuIGdbMF0qeCArIGdbMV0qeSArIGdbMl0qejsgXG59O1xuICBcbkNsYXNzaWNhbE5vaXNlLnByb3RvdHlwZS5taXggPSBmdW5jdGlvbihhLCBiLCB0KSB7IFxuICAgIHJldHVybiAoMS4wLXQpKmEgKyB0KmI7IFxufTtcbiAgXG5DbGFzc2ljYWxOb2lzZS5wcm90b3R5cGUuZmFkZSA9IGZ1bmN0aW9uKHQpIHsgXG4gICAgcmV0dXJuIHQqdCp0Kih0Kih0KjYuMC0xNS4wKSsxMC4wKTsgXG59O1xuICBcbi8vIENsYXNzaWMgUGVybGluIG5vaXNlLCAzRCB2ZXJzaW9uIFxuQ2xhc3NpY2FsTm9pc2UucHJvdG90eXBlLm5vaXNlID0gZnVuY3Rpb24oeCwgeSwgeikgeyBcbiAgICAvLyBGaW5kIHVuaXQgZ3JpZCBjZWxsIGNvbnRhaW5pbmcgcG9pbnQgXG4gICAgdmFyIFggPSBNYXRoLmZsb29yKHgpOyBcbiAgICB2YXIgWSA9IE1hdGguZmxvb3IoeSk7IFxuICAgIHZhciBaID0gTWF0aC5mbG9vcih6KTsgXG4gICAgXG4gICAgLy8gR2V0IHJlbGF0aXZlIHh5eiBjb29yZGluYXRlcyBvZiBwb2ludCB3aXRoaW4gdGhhdCBjZWxsIFxuICAgIHggPSB4IC0gWDsgXG4gICAgeSA9IHkgLSBZOyBcbiAgICB6ID0geiAtIFo7IFxuICAgIFxuICAgIC8vIFdyYXAgdGhlIGludGVnZXIgY2VsbHMgYXQgMjU1IChzbWFsbGVyIGludGVnZXIgcGVyaW9kIGNhbiBiZSBpbnRyb2R1Y2VkIGhlcmUpIFxuICAgIFggPSBYICYgMjU1OyBcbiAgICBZID0gWSAmIDI1NTsgXG4gICAgWiA9IFogJiAyNTU7XG4gICAgXG4gICAgLy8gQ2FsY3VsYXRlIGEgc2V0IG9mIGVpZ2h0IGhhc2hlZCBncmFkaWVudCBpbmRpY2VzIFxuICAgIHZhciBnaTAwMCA9IHRoaXMucGVybVtYK3RoaXMucGVybVtZK3RoaXMucGVybVtaXV1dICUgMTI7IFxuICAgIHZhciBnaTAwMSA9IHRoaXMucGVybVtYK3RoaXMucGVybVtZK3RoaXMucGVybVtaKzFdXV0gJSAxMjsgXG4gICAgdmFyIGdpMDEwID0gdGhpcy5wZXJtW1grdGhpcy5wZXJtW1krMSt0aGlzLnBlcm1bWl1dXSAlIDEyOyBcbiAgICB2YXIgZ2kwMTEgPSB0aGlzLnBlcm1bWCt0aGlzLnBlcm1bWSsxK3RoaXMucGVybVtaKzFdXV0gJSAxMjsgXG4gICAgdmFyIGdpMTAwID0gdGhpcy5wZXJtW1grMSt0aGlzLnBlcm1bWSt0aGlzLnBlcm1bWl1dXSAlIDEyOyBcbiAgICB2YXIgZ2kxMDEgPSB0aGlzLnBlcm1bWCsxK3RoaXMucGVybVtZK3RoaXMucGVybVtaKzFdXV0gJSAxMjsgXG4gICAgdmFyIGdpMTEwID0gdGhpcy5wZXJtW1grMSt0aGlzLnBlcm1bWSsxK3RoaXMucGVybVtaXV1dICUgMTI7IFxuICAgIHZhciBnaTExMSA9IHRoaXMucGVybVtYKzErdGhpcy5wZXJtW1krMSt0aGlzLnBlcm1bWisxXV1dICUgMTI7IFxuICAgIFxuICAgIC8vIFRoZSBncmFkaWVudHMgb2YgZWFjaCBjb3JuZXIgYXJlIG5vdzogXG4gICAgLy8gZzAwMCA9IGdyYWQzW2dpMDAwXTsgXG4gICAgLy8gZzAwMSA9IGdyYWQzW2dpMDAxXTsgXG4gICAgLy8gZzAxMCA9IGdyYWQzW2dpMDEwXTsgXG4gICAgLy8gZzAxMSA9IGdyYWQzW2dpMDExXTsgXG4gICAgLy8gZzEwMCA9IGdyYWQzW2dpMTAwXTsgXG4gICAgLy8gZzEwMSA9IGdyYWQzW2dpMTAxXTsgXG4gICAgLy8gZzExMCA9IGdyYWQzW2dpMTEwXTsgXG4gICAgLy8gZzExMSA9IGdyYWQzW2dpMTExXTsgXG4gICAgLy8gQ2FsY3VsYXRlIG5vaXNlIGNvbnRyaWJ1dGlvbnMgZnJvbSBlYWNoIG9mIHRoZSBlaWdodCBjb3JuZXJzIFxuICAgIHZhciBuMDAwPSB0aGlzLmRvdCh0aGlzLmdyYWQzW2dpMDAwXSwgeCwgeSwgeik7IFxuICAgIHZhciBuMTAwPSB0aGlzLmRvdCh0aGlzLmdyYWQzW2dpMTAwXSwgeC0xLCB5LCB6KTsgXG4gICAgdmFyIG4wMTA9IHRoaXMuZG90KHRoaXMuZ3JhZDNbZ2kwMTBdLCB4LCB5LTEsIHopOyBcbiAgICB2YXIgbjExMD0gdGhpcy5kb3QodGhpcy5ncmFkM1tnaTExMF0sIHgtMSwgeS0xLCB6KTsgXG4gICAgdmFyIG4wMDE9IHRoaXMuZG90KHRoaXMuZ3JhZDNbZ2kwMDFdLCB4LCB5LCB6LTEpOyBcbiAgICB2YXIgbjEwMT0gdGhpcy5kb3QodGhpcy5ncmFkM1tnaTEwMV0sIHgtMSwgeSwgei0xKTsgXG4gICAgdmFyIG4wMTE9IHRoaXMuZG90KHRoaXMuZ3JhZDNbZ2kwMTFdLCB4LCB5LTEsIHotMSk7IFxuICAgIHZhciBuMTExPSB0aGlzLmRvdCh0aGlzLmdyYWQzW2dpMTExXSwgeC0xLCB5LTEsIHotMSk7IFxuICAgIC8vIENvbXB1dGUgdGhlIGZhZGUgY3VydmUgdmFsdWUgZm9yIGVhY2ggb2YgeCwgeSwgeiBcbiAgICB2YXIgdSA9IHRoaXMuZmFkZSh4KTsgXG4gICAgdmFyIHYgPSB0aGlzLmZhZGUoeSk7IFxuICAgIHZhciB3ID0gdGhpcy5mYWRlKHopOyBcbiAgICAgLy8gSW50ZXJwb2xhdGUgYWxvbmcgeCB0aGUgY29udHJpYnV0aW9ucyBmcm9tIGVhY2ggb2YgdGhlIGNvcm5lcnMgXG4gICAgdmFyIG54MDAgPSB0aGlzLm1peChuMDAwLCBuMTAwLCB1KTsgXG4gICAgdmFyIG54MDEgPSB0aGlzLm1peChuMDAxLCBuMTAxLCB1KTsgXG4gICAgdmFyIG54MTAgPSB0aGlzLm1peChuMDEwLCBuMTEwLCB1KTsgXG4gICAgdmFyIG54MTEgPSB0aGlzLm1peChuMDExLCBuMTExLCB1KTsgXG4gICAgLy8gSW50ZXJwb2xhdGUgdGhlIGZvdXIgcmVzdWx0cyBhbG9uZyB5IFxuICAgIHZhciBueHkwID0gdGhpcy5taXgobngwMCwgbngxMCwgdik7IFxuICAgIHZhciBueHkxID0gdGhpcy5taXgobngwMSwgbngxMSwgdik7IFxuICAgIC8vIEludGVycG9sYXRlIHRoZSB0d28gbGFzdCByZXN1bHRzIGFsb25nIHogXG4gICAgdmFyIG54eXogPSB0aGlzLm1peChueHkwLCBueHkxLCB3KTsgXG4gIFxuICAgIHJldHVybiBueHl6OyBcbn07XG5cbnZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2F2ZXMnKTtcblxuaWYgKGNhbnZhcykge1xuICAgIHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSxcbiAgICBwZXJsaW4gPSBuZXcgQ2xhc3NpY2FsTm9pc2UoKSxcbiAgICB2YXJpYXRpb24gPSAuMDAxLFxuICAgIGFtcCA9IDgwMCxcbiAgICBtYXhMaW5lcyA9IDUyLFxuICAgIHZhcmlhdG9ycyA9IFtdLFxuICAgIGNhbnZhc1dpZHRoLFxuICAgIGNhbnZhc0hlaWdodCxcbiAgICBzdGFydFk7XG4gICAgXG4gICAgZm9yICh2YXIgaSA9IDAsIHUgPSAwOyBpIDwgbWF4TGluZXM7IGkrKywgdSArPSAuMDIpIHtcbiAgICAgICAgdmFyaWF0b3JzW2ldID0gdTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gZHJhdygpIHtcbiAgICAgICAgY3R4LnNoYWRvd0NvbG9yID0gXCJyZ2JhKDE5NSwyMDQsMjI0KVwiO1xuICAgICAgICBjdHguc2hhZG93Qmx1ciA9IDA7XG4gICAgXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IG1heExpbmVzOyBpKyspIHtcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oMCwgc3RhcnRZKTtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDw9IGNhbnZhc1dpZHRoOyB4KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgeSA9IHBlcmxpbi5ub2lzZSh4ICogdmFyaWF0aW9uICsgdmFyaWF0b3JzW2ldLCB4ICogdmFyaWF0aW9uLCAwKTtcbiAgICAgICAgICAgICAgICBjdHgubGluZVRvKHgsIHN0YXJ0WSArIGFtcCAqIHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGNvbG9yID0gTWF0aC5mbG9vcigxNTAgKiBNYXRoLmFicyh5KSk7XG4gICAgICAgICAgICB2YXIgYWxwaGEgPSBNYXRoLm1pbihNYXRoLmFicyh5KSwgLjcpICsgLjE7XG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBcInJnYmEoMywxNjQsMTk0LFwiICsgYWxwaGEgKyBcIilcIjtcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgICAgIHZhcmlhdG9yc1tpXSArPSAuMDAyO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIChmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICByZXNpemVDYW52YXMoKTtcbiAgICAgICAgYW5pbWF0ZSgpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplQ2FudmFzKTtcbiAgICB9KSgpO1xuICAgIFxuICAgIGZ1bmN0aW9uIGFuaW1hdGUoKSB7XG4gICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCk7XG4gICAgICAgIGRyYXcoKTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiByZXNpemVDYW52YXMoKSB7XG4gICAgICAgIGNhbnZhc1dpZHRoID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoO1xuICAgICAgICBjYW52YXNIZWlnaHQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0OyBcbiAgICAgICAgY2FudmFzLnNldEF0dHJpYnV0ZShcIndpZHRoXCIsIGNhbnZhc1dpZHRoKTtcbiAgICAgICAgY2FudmFzLnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCBjYW52YXNIZWlnaHQpO1xuICAgICAgICBzdGFydFkgPSBjYW52YXNIZWlnaHQvMjtcbiAgICB9XG59Il0sImZpbGUiOiIuL3Jlc291cmNlcy9qcy9wbHVnaW5zL2hlcm8tY2FudmFzLmpzLmpzIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./resources/js/plugins/hero-canvas.js\n");
/******/ })()
;