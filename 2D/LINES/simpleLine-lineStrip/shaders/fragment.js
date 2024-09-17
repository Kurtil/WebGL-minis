export default `
precision highp float;

flat in uint isDiscard;

out vec4 outColor;

void main() {
  if (isDiscard == 1u) {
    discard;
  }

  outColor = vec4(0, 0, 0, 1);
}
`;