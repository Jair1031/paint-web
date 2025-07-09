const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let painting = false;
let tool = 'brush';
let color = 'black';
let startX = 0, startY = 0;
let snapshot = null;

// Herramientas
const buttons = document.querySelectorAll('.toolbar button');
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    tool = btn.id;
  });
});

// Colores
const colorElements = document.querySelectorAll('.color');
colorElements.forEach(c => {
  c.addEventListener('click', () => {
    colorElements.forEach(co => co.classList.remove('selected'));
    c.classList.add('selected');
    color = c.dataset.color;
  });
});

// Evento mousedown
canvas.addEventListener('mousedown', (e) => {
  painting = true;
  startX = e.offsetX;
  startY = e.offsetY;
  setColorAndTool();
  ctx.beginPath();
  ctx.moveTo(startX, startY);

  if (tool !== 'brush' && tool !== 'eraser') {
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
});

// Evento mousemove
canvas.addEventListener('mousemove', (e) => {
  if (!painting) return;
  const x = e.offsetX;
  const y = e.offsetY;

  setColorAndTool();

  if (tool === 'brush' || tool === 'eraser') {
    ctx.lineTo(x, y);
    ctx.stroke();
  } else {
    ctx.putImageData(snapshot, 0, 0);
    drawShape(tool, startX, startY, x, y);
  }
});

// Evento mouseup
canvas.addEventListener('mouseup', (e) => {
  if (!painting) return;
  painting = false;
  const x = e.offsetX;
  const y = e.offsetY;

  setColorAndTool();

  if (tool !== 'brush' && tool !== 'eraser') {
    ctx.putImageData(snapshot, 0, 0);
    drawShape(tool, startX, startY, x, y);
  }

  ctx.beginPath();
});

// Dibujo de figuras
function drawShape(tool, x1, y1, x2, y2) {
  switch (tool) {
    case 'line':
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      break;
    case 'rect':
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
      break;
    case 'circle':
      const radius = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      ctx.beginPath();
      ctx.arc(x1, y1, radius, 0, Math.PI * 2);
      ctx.stroke();
      break;
  }
}

// Aplicar color y grosor según herramienta
function setColorAndTool() {
  ctx.strokeStyle = tool === 'eraser' ? 'white' : color;
  ctx.fillStyle = ctx.strokeStyle;
  ctx.lineWidth = tool === 'eraser' ? 20 : 2;
}

// Limpiar canvas
document.getElementById('clear').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

// Guardar como imagen
document.getElementById('save').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'dibujo.png';
  link.href = canvas.toDataURL();
  link.click();
});
