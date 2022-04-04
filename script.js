document.addEventListener('DOMContentLoaded', function () {

  let automato = {
    estados: [
      {
        id: 0,
        name: "1",
        label: '1',
        links: [1],
        x: 20,
        y: 20,
        acceptanceState: false,
        selected: false,
      },
      {
        id: 1,
        name: "2",
        label: '2',
        links: [],
        x: 350,
        y: 350,
        acceptanceState: false,
        selected: false,
      }
    ]
  }

  const btnDownload = document.getElementById('btnDownload');
  const canva = document.querySelector('canvas');
  const ctx = canva.getContext('2d');
  ctx.font = "40px Arial";

  canva.width = 700;
  canva.height = 500;

  radius = 20;

  var createLinkState = -1;

  const createState = (x, y) => {
    automato.estados.push({
      id: automato.estados.length,
      name: "",
      label: '',
      links: [],
      x: x,
      y: y,
      acceptanceState: false,
      selected: false,
      createLink: false,
      clicked: false,
    })
  }

  canva.addEventListener('dblclick', function (e) {
    const stateClicked = automato.estados.findIndex(state => {
      if (Math.abs(state.x - e.offsetX) < radius && Math.abs(state.y - e.offsetY) < radius) {
        return true;
      }
    })

    if (stateClicked == -1)
      createState(e.offsetX, e.offsetY);
    else
      automato.estados[stateClicked].acceptanceState = automato.estados[stateClicked].acceptanceState ? false : true;

  }, false);

  canva.addEventListener('mousedown', function (e) {
    const stateClicked = automato.estados.findIndex(state => {
      if (Math.abs(state.x - e.offsetX) < radius && Math.abs(state.y - e.offsetY) < radius) {
        return true;
      }
    })

    if (stateClicked == -1) return;

    if (e.shiftKey) {
      automato.estados[stateClicked].createLink = true;
      createLinkState = stateClicked;
    } else
      automato.estados[stateClicked].selected = true;
  }, false);

  canva.addEventListener('mouseup', function (e) {
    const finalState = automato.estados.findIndex(state => {
      if (Math.abs(state.x - e.offsetX) < radius && Math.abs(state.y - e.offsetY) < radius) {
        return true;
      }
    })
    automato.estados.forEach(state => {
      state.selected = false;
      state.createLink = false;
    })

    if (finalState == -1) return;

    if (createLinkState != -1) {
      automato.estados[createLinkState].links.push(finalState);
      createLinkState = -1;
    }
  }, false);

  canva.addEventListener('mousemove', function (e) {
    const stateSelect = automato.estados.findIndex(state => {
      if (state.selected)
        return true;
    })

    if (stateSelect == -1) return;

    automato.estados[stateSelect].x = e.offsetX;
    automato.estados[stateSelect].y = e.offsetY;
  }, false)

  canva.addEventListener('click', function (e) {
    automato.estados.forEach(state => {
      state.clicked = false;
    })
    const stateClicked = automato.estados.findIndex(state => {
      if (Math.abs(state.x - e.offsetX) < radius && Math.abs(state.y - e.offsetY) < radius) {
        state.clicked = true;
        return true;
      }
    })

    if (stateClicked == -1) return;
  }, false)

  window.addEventListener('keydown', function (e) {
    const stateClicked = automato.estados.findIndex(state => {
      if (state.clicked)
        return true;
    })

    if (stateClicked == -1) return;

    console.log(automato.estados[stateClicked])
    console.log(automato.estados[stateClicked])
    console.log(e.key);
    if (e.key == 'Backspace')
      automato.estados[stateClicked].label = automato.estados[stateClicked].label.slice(0, -1);
    else if (e.key == 'Enter')
      automato.estados[stateClicked].clicked = false;
    else
      automato.estados[stateClicked].label += e.key;

  })

  const drawLine = (line) => {
    ctx.beginPath();
    ctx.moveTo(line.init.x, line.init.y);
    ctx.lineTo(line.end.x, line.end.y);
    ctx.closePath();

    ctx.stroke();
  }

  const drawCircle = (circle, offset) => {
    rad = offset ? radius - 5 : radius;
    ctx.beginPath();
    ctx.arc(circle.center.x, circle.center.y, rad, 0, 2 * Math.PI);
    ctx.stroke();
  }

  const cleanCanvas = () => {
    ctx.clearRect(0, 0, canva.width, canva.height);
  }

  function loop() {
    requestAnimationFrame(loop, canva);
    render()
  }

  function render() {
    cleanCanvas();
    automato.estados.forEach(estado => {
      drawCircle({ center: { x: estado.x, y: estado.y } });

      ctx.fillText(estado.label, estado.x - 5, estado.y + 5);

      // Desenha as arestas
      estado.links.forEach(link => {
        const dX = estado.x - automato.estados[link].x;
        const tan = (estado.y - automato.estados[link].y) / dX;

        let ang = Math.atan(tan);

        dX < 0 ? ang : ang += Math.PI;


        const dx = (radius * Math.cos(ang));
        const dy = (radius * Math.sin(ang));


        const line = {
          init: { x: estado.x + dx, y: estado.y + dy },
          end: { x: automato.estados[link].x - dx, y: automato.estados[link].y - dy }
        }
        drawLine(line);
      })

      if (estado.acceptanceState)
        drawCircle({ center: { x: estado.x, y: estado.y } }, true);
    })
  }

  btnDownload.onclick = () => {
    download(canva, 'automato.png');
  }

  loop();
})

function download(canvas, filename) {
  /// create an "off-screen" anchor tag
  var lnk = document.createElement('a'), e;

  /// the key here is to set the download attribute of the a tag
  lnk.download = filename;

  /// convert canvas content to data-uri for link. When download
  /// attribute is set the content pointed to by link will be
  /// pushed as "download" in HTML5 capable browsers
  lnk.href = canvas.toDataURL("image/png;base64");

  /// create a "fake" click-event to trigger the download
  if (document.createEvent) {
    e = document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window,
      0, 0, 0, 0, 0, false, false, false,
      false, 0, null);

    lnk.dispatchEvent(e);
  } else if (lnk.fireEvent) {
    lnk.fireEvent("onclick");
  }
}