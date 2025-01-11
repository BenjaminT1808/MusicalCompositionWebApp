var quarterNote = document.getElementById("quarterNote");
quarterNote.onload =  function() {
    drawObject();
}
var redQuarterNote = document.getElementById("redQuarterNote");
redQuarterNote.onload = function() {
    drawObject();
}
var upsideDownQuarterNote = document.getElementById("upsideDownQuarterNote");
upsideDownQuarterNote.onload = function() {
    drawObject();
}
var redUpsideDownQuarterNote = document.getElementById("redUpsideDownQuarterNote");
redUpsideDownQuarterNote.onload = function() {
    drawObject();
}
var halfNote = document.getElementById("halfNote");
halfNote.onload = function() {
    drawObject();
}
var redHalfNote = document.getElementById("redHalfNote");
redHalfNote.onload = function() {
    drawObject();
}
var upsideDownHalfNote = document.getElementById("upsideDownHalfNote");
upsideDownHalfNote.onload = function() {
    drawObject();
}
var redUpsideDownHalfNote = document.getElementById("redUpsideDownHalfNote");
redUpsideDownHalfNote.onload = function() {
    drawObject();
}
var wholeNote = document.getElementById("wholeNote");
wholeNote.onload = function() {
    drawObject();
}
var redWholeNote = document.getElementById("redWholeNote");
redWholeNote.onload = function() {
    drawObject();
}

let timeSigTop = 1;
let timeSigBottom = 1;
let selectedVoice = 'treble';
let barNoteLength = (timeSigTop * (1/timeSigBottom));
let numOfBars = 6;
let space = 1320/numOfBars;
let barSpaceLength = (space - 20);
bars = []
bars.push(90);
let barDrawer = 75 + space
const canvas = document.getElementById("theCanvas");
const ctx = canvas.getContext("2d");
let trebleNotes = [];
let bassNotes = [];
let selectedNote = 0;
let measureFull = 0;
let currentMeasure = 0;
let place = 85;
const noteMap = new Map();
noteMap.set(157, 'A3');
noteMap.set(147, 'B3');
noteMap.set(137, 'C4');
noteMap.set(127, 'D4');
noteMap.set(117, 'E4');
noteMap.set(107, 'F4');
noteMap.set(97, 'G4');
noteMap.set(87, 'A4');
noteMap.set(77, 'B4');
noteMap.set(67, 'C5');
noteMap.set(57, 'D5');
noteMap.set(47, 'E5');
noteMap.set(37, 'F5');
noteMap.set(27, 'G5');
noteMap.set(17, 'A5');
noteMap.set(220, 'G3');
noteMap.set(210, 'A3');
noteMap.set(200, 'B3');
noteMap.set(190, 'C4');
noteMap.set(180, 'D4');
noteMap.set(170, 'E4');
noteMap.set(230, 'F3');
noteMap.set(240, 'E3');
noteMap.set(250, 'D3');
noteMap.set(260, 'C3');
noteMap.set(270, 'B2');
noteMap.set(280, 'A2');
noteMap.set(290, 'G2');
noteMap.set(300, 'F2');
noteMap.set(310, 'E2');

const mapObject = Object.fromEntries(noteMap);

fetch('http://127.0.0.1:5000/receive-hashmap', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',  // Set the content type to JSON
    },
    body: JSON.stringify(mapObject)  // Convert the hashmap to JSON and send it
})
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);  // Log the response from Flask
    })
    .catch(error => {
        console.error('Error:', error);  // Handle any errors
    });


function setUpNotes () {
    // treble lines 
    ctx.moveTo(0,100);
    ctx.lineTo(1420,100);
    ctx.stroke();
    ctx.moveTo(0,120);
    ctx.lineTo(1420,120);
    ctx.stroke();
    ctx.moveTo(0,140);
    ctx.lineTo(1420,140);
    ctx.stroke();
    ctx.moveTo(0,160);
    ctx.lineTo(1420,160);
    ctx.stroke();
    ctx.moveTo(0, 180);
    ctx.lineTo(1420, 180);
    ctx.stroke();
    // bass lines 
    ctx.moveTo(0,270);
    ctx.lineTo(1420,270);
    ctx.stroke();
    ctx.moveTo(0,290);
    ctx.lineTo(1420,290);
    ctx.stroke();
    ctx.moveTo(0,310);
    ctx.lineTo(1420,310);
    ctx.stroke();
    ctx.moveTo(0,330);
    ctx.lineTo(1420,330);
    ctx.stroke();
    ctx.moveTo(0, 350);
    ctx.lineTo(1420, 350);
    ctx.stroke();
    // draws the clefs
    var treble = document.getElementById("treble");
    var bass = document.getElementById("bass");
    ctx.drawImage(treble, -30, 80, 120, 120);
    ctx.drawImage(bass, -5, 260, 75, 95);
    //draws the time signature
    ctx.font = "60px Comic Sans";
    ctx.fillText(timeSigTop, 75, 140);
    ctx.fillText(timeSigBottom, 75, 180);
    ctx.fillText(timeSigTop, 75, 310);
    ctx.fillText(timeSigBottom, 75, 350);
    //draws the measures
    for (let i = 1; i <= numOfBars; i++) {
        if (i != numOfBars) {
            ctx.moveTo(barDrawer, 100);
            ctx.lineTo(barDrawer, 350);
            ctx.stroke();
            bars.push(barDrawer);
        }
        else {
            ctx.moveTo(barDrawer, 100);
            ctx.lineTo(barDrawer, 350);
            bars.push(barDrawer)
            ctx.stroke();
            ctx.moveTo(barDrawer + 10, 100);
            ctx.lineTo(barDrawer + 10, 350);
            ctx.stroke();
        }
        barDrawer += space
    }
}

setUpNotes();

function drawObject() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    setUpNotes();
    // treble notes
    for (let i = 0; i < trebleNotes.length; i++) {
        // THESE ARE RIGHT SIDE UP
        if (trebleNotes[i].length == 0.25 && trebleNotes[i].selected == false && trebleNotes[i].y > 77) {
            ctx.drawImage(quarterNote, trebleNotes[i].x, trebleNotes[i].y, trebleNotes[i].width, trebleNotes[i].height);
        }
        if (trebleNotes[i].length == 0.5 && trebleNotes[i].selected == false && trebleNotes[i].y > 77) {
            ctx.drawImage(halfNote, trebleNotes[i].x, trebleNotes[i].y, trebleNotes[i].width, trebleNotes[i].height);
        }
        if (trebleNotes[i].length == 1 && trebleNotes[i].selected == false) {
            ctx.drawImage(wholeNote, trebleNotes[i].x + 25, trebleNotes[i].y + 45, trebleNotes[i].width - 42, trebleNotes[i].height - 42);
        }
        if (trebleNotes[i].length == 0.25 && trebleNotes[i].selected == true && trebleNotes[i].y > 77) {
            ctx.drawImage(redQuarterNote, trebleNotes[i].x, trebleNotes[i].y, trebleNotes[i].width, trebleNotes[i].height);
        }
        if (trebleNotes[i].length == 0.5 && trebleNotes[i].selected == true && trebleNotes[i].y > 77) {
            ctx.drawImage(redHalfNote, trebleNotes[i].x, trebleNotes[i].y, trebleNotes[i].width, trebleNotes[i].height);
        }
        if (trebleNotes[i].length == 1 && trebleNotes[i].selected == true) {
            ctx.drawImage(redWholeNote, trebleNotes[i].x + 25, trebleNotes[i].y + 45, trebleNotes[i].width - 42, trebleNotes[i].height - 42);
        }
        //THESE ARE UPSIDE DOWN
        if (trebleNotes[i].length == 0.25 && trebleNotes[i].selected == false && trebleNotes[i].y <= 77) {
            ctx.drawImage(upsideDownQuarterNote, trebleNotes[i].x, trebleNotes[i].y + 50, trebleNotes[i].width, trebleNotes[i].height);
        }
        if (trebleNotes[i].length == 0.5 && trebleNotes[i].selected == false && trebleNotes[i].y <= 77) {
            ctx.drawImage(upsideDownHalfNote, trebleNotes[i].x, trebleNotes[i].y + 50, trebleNotes[i].width, trebleNotes[i].height);
        }
        if (trebleNotes[i].length == 0.25 && trebleNotes[i].selected == true && trebleNotes[i].y <= 77) {
            ctx.drawImage(redUpsideDownQuarterNote, trebleNotes[i].x, trebleNotes[i].y + 50, trebleNotes[i].width, trebleNotes[i].height);
        }
        if (trebleNotes[i].length == 0.5 && trebleNotes[i].selected == true && trebleNotes[i].y <= 77) {
            ctx.drawImage(redUpsideDownHalfNote, trebleNotes[i].x, trebleNotes[i].y + 50, trebleNotes[i].width, trebleNotes[i].height);
        }
    }
    // bass notes
    for (let i = 0; i < bassNotes.length; i++) {
        // THESE ARE RIGHT SIDE UP
        if (bassNotes[i].length == 0.25 && bassNotes[i].selected == false) {
            ctx.drawImage(quarterNote, bassNotes[i].x, bassNotes[i].y, bassNotes[i].width, bassNotes[i].height);
        }
        if (bassNotes[i].length == 0.5 && bassNotes[i].selected == false) {
            ctx.drawImage(halfNote, bassNotes[i].x, bassNotes[i].y, bassNotes[i].width, bassNotes[i].height);
        }
        if (bassNotes[i].length == 1 && bassNotes[i].selected == false) {
            ctx.drawImage(wholeNote, bassNotes[i].x + 25, bassNotes[i].y + 42, bassNotes[i].width - 42, bassNotes[i].height - 42);
        }
        if (bassNotes[i].length == 0.25 && bassNotes[i].selected == true) {
            ctx.drawImage(redQuarterNote, bassNotes[i].x, bassNotes[i].y, bassNotes[i].width, bassNotes[i].height);
        }
        if (bassNotes[i].length == 0.5 && bassNotes[i].selected == true) {
            ctx.drawImage(redHalfNote, bassNotes[i].x, bassNotes[i].y, bassNotes[i].width, bassNotes[i].height);
        }
        if (bassNotes[i].length == 1 && bassNotes[i].selected == true) {
            ctx.drawImage(redWholeNote, bassNotes[i].x + 25, bassNotes[i].y + 42, bassNotes[i].width - 42, bassNotes[i].height - 42);
        }
        // THESE ARE UPSIDE DOWN
    }
}

class Note {
    constructor(x, y, width, height, length, selected, measure, value) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.length = length;
        this.selected = selected;
        this.measure = measure;
        this.value = value;
    }
}

for (let i = 0; i < (numOfBars * timeSigTop); i ++) {
    let initTrebleNote = new Note(place, 117, 75, 75, (1/timeSigBottom), false, currentMeasure);
    let initBassNote = new Note(place, 220, 75, 75, (1/timeSigBottom), false, currentMeasure);
    measureFull += initTrebleNote.length;
    trebleNotes.push(initTrebleNote);
    bassNotes.push(initBassNote);
    if (measureFull == barNoteLength) {
        currentMeasure++;
        place = bars[currentMeasure];
        measureFull = 0;
    }   
    else {
        place += (barSpaceLength/timeSigTop);
    }
}
fetch('http://127.0.0.1:5000/receive-arrays', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ array1: trebleNotes, array2: bassNotes }) // Send the array as JSON
})
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data); // Log Flask's response
    })
    .catch(error => {
        console.error('Error:', error); // Handle any errors
    });
trebleNotes[selectedNote].selected = true;

function convertToHalfNote() {
    if (trebleNotes[selectedNote].length != 0.5) {
        trebleNotes[selectedNote].length = 0.5;
        trebleNotes[selectedNote + 1] = selectedNote;
        drawObject();
    } 
}

function convertToQuarterNote() {
    if (trebleNotes[selectedNote].length != 0.25) {
        trebleNotes[selectedNote].length = 0.25;
    }
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            moveObject('up');
            break;
        case 'ArrowDown':
            moveObject('down');
            break;
        case 'ArrowRight':
            selectNote('right');
            break;
        case 'ArrowLeft':
            selectNote('left');
            break;
        case '1':
            selectNote('treble');
            break;
        case '2':
            selectNote('bass');
            break;
    }  
});

function moveObject(direction) {
    switch (direction) {
        case 'up':
            if (selectedVoice == 'treble') {
                trebleNotes[selectedNote].y -= 10;
                fetch('http://127.0.0.1:5000/receive-arrays', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ array1: trebleNotes, array2: bassNotes }) // Send the updated array as JSON
                })
                    .then(response => response.json())
                    .then(data => {
                    console.log('Success:', data); // Log Flask's response
                    })
                    .catch(error => {
                        console.error('Error:', error); // Handle errors
                    });
            }
            if (selectedVoice == 'bass') {
                bassNotes[selectedNote].y -= 10;
                fetch('http://127.0.0.1:5000/receive-arrays', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ array1: trebleNotes, array2: bassNotes }) // Send the updated array as JSON
                })
                    .then(response => response.json())
                    .then(data => {
                    console.log('Success:', data); // Log Flask's response
                    })
                    .catch(error => {
                        console.error('Error:', error); // Handle errors
                    });
            }
            break;
        case 'down':
            if (selectedVoice == 'treble') {
                trebleNotes[selectedNote].y += 10;
                fetch('http://127.0.0.1:5000/receive-arrays', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ array1: trebleNotes, array2: bassNotes }) // Send the updated array as JSON
                })
                    .then(response => response.json())
                    .then(data => {
                    console.log('Success:', data); // Log Flask's response
                    })
                    .catch(error => {
                        console.error('Error:', error); // Handle errors
                    });
            }
            if (selectedVoice == 'bass') {
                bassNotes[selectedNote].y += 10;
                fetch('http://127.0.0.1:5000/receive-arrays', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ array1: trebleNotes, array2: bassNotes }) // Send the updated array as JSON
                })
                    .then(response => response.json())
                    .then(data => {
                    console.log('Success:', data); // Log Flask's response
                    })
                    .catch(error => {
                        console.error('Error:', error); // Handle errors
                    });
            }
            break;
    }
    drawObject(); // Redraw the object at its new position
}

function selectNote(direction) {
    switch (direction) {
        case 'left':
            if (selectedVoice == 'treble') {
                trebleNotes[selectedNote].selected = false;
                if (selectedNote != 0) {
                    selectedNote --;
                    while (trebleNotes[selectedNote] == 0) {
                        selectedNote --;
                    }
                }
                trebleNotes[selectedNote].selected = true;
            }
            if (selectedVoice == 'bass') {
                bassNotes[selectedNote].selected = false;
                if (selectedNote != 0) {
                    selectedNote --;
                    while (bassNotes[selectedNote] == 0) {
                        selectedNote --;
                    }
                }
                bassNotes[selectedNote].selected = true;
            }
            drawObject();
            break;
        case 'right':
            if (selectedVoice == 'treble') {
                trebleNotes[selectedNote].selected = false;
                if (selectedNote != trebleNotes.length - 1) {
                    selectedNote ++;
                    while (trebleNotes[selectedNote] == 0) {
                        selectedNote ++;
                    }
                }
                trebleNotes[selectedNote].selected = true;
            }
            if (selectedVoice == 'bass') {
                bassNotes[selectedNote].selected = false;
                if (selectedNote != bassNotes.length - 1) {
                    selectedNote ++;
                    while (bassNotes[selectedNote] == 0) {
                        selectedNote ++;
                    }
                }
                bassNotes[selectedNote].selected = true;
            }
            drawObject();
            break;
        case 'treble':
            if (selectedVoice != 'treble') {
                bassNotes[selectedNote].selected = false;
                trebleNotes[selectedNote].selected = true;
                selectedVoice = 'treble';
            }
            drawObject();
            break;
        case 'bass':
            if (selectedVoice != 'bass') {
                trebleNotes[selectedNote].selected = false;
                bassNotes[selectedNote].selected = true;
                selectedVoice = 'bass';
            }
            drawObject();
            break;
    }
}

drawObject();