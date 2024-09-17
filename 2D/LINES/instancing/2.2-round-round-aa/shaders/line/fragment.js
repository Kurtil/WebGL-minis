export default `
precision highp float;

in float v_distanceToLine;

uniform float width;

out vec4 outColor;

void main() {
  float d = abs(v_distanceToLine) - width / 2.0;
  
  const int aaType = 2; // 0: off, 1: smoothstep, 2: Gaussian

  if (d <= 0.0 || aaType == 0) {
    outColor = vec4(0, 0, 0, 1);
  } else if (aaType == 1) {
   // Smoothstep function
    float a = 1. - smoothstep(0.0, 1.0, d);
    outColor = vec4(0, 0, 0, a);
  } else if (aaType == 2) {   
    // Gaussian function
    // Define the standard deviation for the Gaussian function
    float sigma = .6; // You can adjust this value for smoother or sharper edges
    
    // Calculate the alpha value using the Gaussian function
    float a = exp(-0.5 * pow(d / sigma, 2.0));

    outColor = vec4(0, 0, 0, a);
  }
}
`;