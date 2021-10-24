function canvas(selector, options){
    const canvas = document.querySelector(selector);
    canvas.classList.add('canvas')
    canvas.setAttribute('width', `${options.width || 400}px`)
    canvas.setAttribute('height', `${options.height || 300}px`) 
   
    const context = canvas.getContext('2d')
    context.strokeStyle = options.strokeColor
    context.lineWidth = options.strokeWidth
   
    const rect = canvas.getBoundingClientRect();
    let isPaint = false 
    let points = [] 
    
    const addPoint = (x, y, dragging) => {
       points.push({
           x: (x - rect.left),
           y: (y - rect.top),
           dragging: dragging
       })
    }

    const redraw = () => {
        context.lineJoin = "round";
        let prevPoint = null;
        for (let point of points){
            context.beginPath();
            if (point.dragging && prevPoint){
                context.moveTo(prevPoint.x, prevPoint.y)
            } else {
                context.moveTo(point.x - 1, point.y);
            }
            context.lineTo(point.x, point.y)
            context.closePath()
            context.stroke();
            prevPoint = point;
        }
     }

     const mouseDown = event => {
        isPaint = true
        addPoint(event.pageX, event.pageY);
        redraw();
     }
     
     const mouseMove = event => {
        if(isPaint){
            addPoint(event.pageX, event.pageY, true);
            redraw();
        }
     }
     
     canvas.addEventListener('mousemove', mouseMove)
     canvas.addEventListener('mousedown', mouseDown)
     canvas.addEventListener('mouseup',() => {
        isPaint = false;
     });
     canvas.addEventListener('mouseleave',() => {
        isPaint = false;
     });
    
     const toolBar = document.getElementById('toolbar')

    //clear button
    const clearBtn = document.createElement('button')
    clearBtn.classList.add('btn')
    clearBtn.innerHTML = '<i class="fas fa-broom"></i>'

    clearBtn.addEventListener('click', () => {
        points.length=0;
    const context = canvas.getContext("2d");
    context.clearRect(0,0, canvas.width, canvas.height);
    })
    toolBar.insertAdjacentElement('afterbegin', clearBtn)

    //download button
    const downloadBtn = document.createElement('button')
    downloadBtn.classList.add('btn')
    downloadBtn.innerHTML = '<i class="fas fa-download"></i>'

    downloadBtn.addEventListener('click', ()=>{
        const dataUrl = canvas.toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
        const newTab = window.open('about:blank','image from canvas');
        newTab.document.write("<img src='" + dataUrl + "' alt='from canvas'/>");
    })

    toolBar.insertAdjacentElement('beforeend', downloadBtn)

    //save button
    const saveBtn = document.createElement('button')
    saveBtn.classList.add('btn')
    saveBtn.innerHTML = '<i class="fas fa-cloud-download-alt"></i>'

    saveBtn.addEventListener('click', ()=>{
        localStorage.setItem('points', JSON.stringify(points));
    })

    toolBar.insertAdjacentElement('beforeend', saveBtn)

    //restore button
   const restoreBtn = document.createElement('button')
   restoreBtn.classList.add('btn')
   restoreBtn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i>'

   restoreBtn.addEventListener('click', ()=>{
    if (localStorage.getItem('points') != null){
        var load = localStorage.getItem('points');
        points = JSON.parse(load);
        localStorage.removeItem('points');
        redraw();
    }    
   })
   toolBar.insertAdjacentElement('beforeend', restoreBtn)

   //timestamp button
   const timeBtn = document.createElement('button')
   timeBtn.classList.add('btn')
   timeBtn.innerHTML = '<i class="far fa-calendar-alt"></i>'

   timeBtn.addEventListener('click', ()=>{
    context.clearRect(0,0, 490, 40);
    var date = new Date();
    var min = [date.getHours(), date.getMinutes(), date.getSeconds()]
    var max = [date.getDate(), date.getMonth()+1, date.getFullYear()]
    context.font = "40px serif";
    context.fillText(min[0]+":"+min[1]+":"+min[2] +" "+max[0]+"."+max[1]+"."+max[2], 0, 40, 490);
    redraw();
   })
   toolBar.insertAdjacentElement('beforeend', timeBtn)

   //color-picker
   const colorPicker = document.getElementById('color-picker')
   colorPicker.value = "#df4b26"
   colorPicker.classList.add('color-picker')
   colorPicker.addEventListener('change', (event)=>{
       context.strokeStyle=event.target.value;
       colorPicker.style.backgroundColor=event.target.value;
   })

   toolBar.insertAdjacentElement('beforeend', colorPicker);

   //brush size
  const brushSel = document.createElement('input')
  brushSel.setAttribute("type", "number")
  brushSel.classList.add('input')
  brushSel.value=5
  brushSel.min = 0
  brushSel.max = 50

  brushSel.addEventListener('change', (event)=>{
      context.lineWidth = event.target.value;
  })

  toolBar.insertAdjacentElement("beforeend", brushSel)


   //image input
   const imgInput = document.createElement('input')
   imgInput.classList.add('input')
   imgInput.value = 'Background image URL'

   var img = new Image;
   imgInput.addEventListener('change', (event)=>{
       img.src = event.target.value;
       img.onload = ()=>{context.drawImage(img, 0, 0)}
   })

   imgInput.addEventListener('click', ()=>{
       imgInput.value = ''
   })

   toolBar.insertAdjacentElement("beforeend", imgInput)
}   