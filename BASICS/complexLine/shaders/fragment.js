export default `
precision highp float;

flat in int v_index;
 
out vec4 outColor; 
 
void main() {
   outColor = vec4(float(v_index) / 4., 0, 0, 1);
}
`;