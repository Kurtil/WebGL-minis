

export default function bind(func) {
  const label = document.getElementById('rangeLabel');
  document.getElementById('rangeInput').addEventListener('input', () => {
    func(document.getElementById('rangeInput').value);
    label.innerText = `Line width : ${document.getElementById('rangeInput').value}`;
  });
}