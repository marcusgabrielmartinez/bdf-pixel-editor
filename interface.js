// Build 2D array for storing pixel data
function buildPixels() {
    let pixels = [];
    var i;
    for (i=0; i<16; i++) {
        var j;
        pixels.push([]);
        for (j=0; j<16; j++) {
            pixels[i].push("0");
        }
    }
    return pixels;
}

// Make existig pixels non-draggable
for (u=1; u<=256; u++) {
    var curPixelCell = document.getElementById(u.toString());
    curPixelCell.draggable = false;
}

// Translate pixel ID into array coordinate
function toCoordinate(id_num) {
    // Math doesnn't work properly for last cell
    if (id_num === "256") {
        return [15, 15];
    }
    else {
        id_num = parseInt(id_num);
        var x = Math.floor(id_num/16);
        var y = id_num-(16*x);
        return [x, y-1];
    }
}

// Translate array coordinate into pixel ID.
function toID(x, y) {
    // Math doesn't work properly for last cell
    if (x === "15" && y === "15") {
        return 256;
    }
    else {
        return (16*x)+(y+1);
    }
}

// Listen for glyph assignment and create/update glyphs
// Create array to store font bitmaps
var glyphs = document.getElementsByClassName("glyph");
var drawnGlyphs = {};
var l;
for (l=0; l<glyphs.length; l++) {
    var glyph = glyphs[l];
    drawnGlyphs[glyph.id] = buildPixels();
}
let glyphBox = document.getElementById("font_list");
glyphBox.onchange = loadGlyph;

// Load glyph data to pixel grid
let selectedGlyph;
function loadGlyph(e) {
    selectedGlyph = e.target.options[e.target.selectedIndex];
    var glyphID = e.target.options[e.target.selectedIndex].id;
    var curPixels = drawnGlyphs[glyphID];
    var m;
    for (m=0; m<16; m++) {
        var n;
        for (n=0; n<16; n++) {
            var curPixelID = toID(m, n);
            var curPixelCell = document.getElementById(curPixelID);
            if (curPixels[m][n] === "1") {
                curPixelCell.style.backgroundColor = "black";
            }
            else {
                curPixelCell.style.backgroundColor = "white";
            }
        }
    }
    // Set listening events for pixels
    var pixelCells = document.getElementsByClassName("grid");
    for (k=0; k<pixelCells.length; k++) {
        pixelCells[k].onmousedown = togglePixel;
        pixelCells[k].onmouseover = togglePixel;
    }
}

// Select or deselect pixel and update pixel array
var selected = false;
function togglePixel(e) {
    var pixelID = this.id;
    var pixelCoordinate = toCoordinate(pixelID);
    var pixelCell = document.getElementById(pixelID);
    var pixels = drawnGlyphs[selectedGlyph.id]
    if (e.type === "mouseover") {
        if (e.buttons === 1) {
            if (selected) {
                pixels[pixelCoordinate[0]][pixelCoordinate[1]] = "1";
                pixelCell.style.backgroundColor = "black";
            }
            else {
                pixels[pixelCoordinate[0]][pixelCoordinate[1]] = "0";
                pixelCell.style.backgroundColor = "white";
            }
        }
    }
    else {
        if (pixelCell.style.backgroundColor === "black") {
            pixels[pixelCoordinate[0]][pixelCoordinate[1]] = "0";
            pixelCell.style.backgroundColor = "white";
            selected = false;
        }
        else {
            pixels[pixelCoordinate[0]][pixelCoordinate[1]] = "1";
            pixelCell.style.backgroundColor = "black";
            selected = true;
        }
    }
}

// Add glyph
var addButton = document.getElementById("add_button");
var newGlyph = document.getElementById("new_glyph");
addButton.onclick = addGlyph;
function addGlyph() {
    // Add glyph option to select box
    if (isNaN(parseInt(newGlyph.value))) {
        var newID = newGlyph.value;
    }
    else {
        var newID = "font_" + newGlyph.value;
    }
    if (drawnGlyphs[newID] === undefined) {
        var newOption = document.createElement("option");
        newOption.id = newID;
        newOption.innerHTML = newGlyph.value;
        glyphBox.appendChild(newOption);
        newGlyph.value = "";

        // Add glyph to list of pixels
        drawnGlyphs[newID] = buildPixels();
    }
}

// Remove glyph
var removeButton = document.getElementById("remove_button");
removeButton.onclick = removeGlyph;
function removeGlyph() {
    // Remove glyph option from select box
    glyphBox.remove(glyphBox.selectedIndex);

    // Remove glyph from list of pixels
    delete drawnGlyphs[selectedGlyph.id];

    // Reset pixels to white
    var o;
    for (o=1; o<=256; o++) {
        var curPixelCell = document.getElementById(o.toString());
        curPixelCell.style.backgroundColor = "white";
    }
}

// Remove all glyphs
var clearButton = document.getElementById("clear_all");
clearButton.onclick = function () {fontArea.innerHTML=""; clearAllGlyphs();};
function clearAllGlyphs() {
    var r;
    for (r=glyphBox.length-1; r>=0; r--) {
        // Remove glyph option from select box
        glyphBox.remove(r);
    }

    // Reset glyphs array and font area
    drawnGlyphs = {};

    // Reset pixels to white
    var s;
    for (s=1; s<=256; s++) {
        var curPixelCell = document.getElementById(s.toString());
        curPixelCell.style.backgroundColor = "white";
    }
}

// Automatically selecting first glyph on load
glyphBox.value = "!";
glyphBox.dispatchEvent(new Event("change"));

