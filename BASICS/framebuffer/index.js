// WebGL2 context
const gl = document.querySelector('canvas').getContext('webgl2');

// Create a framebuffer
const framebuffer = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

// Create a texture to render to
const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 512, 512, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

// Attach the texture to the framebuffer
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

// Check if the framebuffer is complete
if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
  console.error('Framebuffer is not complete');
}

// Now you can render to the framebuffer
gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
// ... render your scene ...

// And then render the texture to the screen
gl.bindFramebuffer(gl.FRAMEBUFFER, null);
// ... render a screen-aligned quad with the texture ...