// Build 2D array for storing pixel data
let pixels = [];
var i;
for (i=0; i<16; i++) {
    var j;
    pixels.push([]);
    for (j=0; j<16; j++) {
        pixels[i].push("0");
    }
}

// Translate pixel ID into array coordinate
function toCoordinate(id_num) {
    id_num = parseInt(id_num);
    var x = Math.floor(id_num/16);
    var y = id_num-(16*x);
    return [x, y-1];
}

// Translate array coordinate into pixel ID.
function toID(x, y) {
    return (16*x)+(y+1);
}

// Set listening events for pixels
var pixelCells = document.getElementsByClassName("grid");
for (k=0; k<pixelCells.length; k++) {
    pixelCells[k].onmousedown = togglePixel;
    pixelCells[k].onmouseover = togglePixel;
}

// Select or deselect pixel and update pixel array
function togglePixel(e) {
    var pixelID = this.id;
    var pixelCoordinate = toCoordinate(pixelID);
    var pixelCell = document.getElementById(pixelID);

    if (e.buttons === 1) {
        if (pixelCell.style.backgroundColor === "black") {
            pixels[pixelCoordinate[0]][pixelCoordinate[1]] = "0";
            pixelCell.style.backgroundColor = "white";
        }
        else {
            pixels[pixelCoordinate[0]][pixelCoordinate[1]] = "1";
            pixelCell.style.backgroundColor = "black";
        }
    }
}