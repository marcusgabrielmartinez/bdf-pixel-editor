// Listen for import/export events and collect font element
var exportButton = document.getElementById("export_button");
exportButton.onclick = buildFont;
var importButton = document.getElementById("import_button");
importButton.onclick = importFont;
var copyButton = document.getElementById("copy_button");
copyButton.onclick = copyFont;
var clearButton = document.getElementById("clear_button");
clearButton.onclick = clearFont;
var fontArea = document.getElementById("font_area");

// Build data for individual glyph
function buildGlyph(curGlyph) {
    var glyphContents = "STARTCHAR " + curGlyph.slice(-1) + "\n"
        + "ENCODING " + curGlyph.slice(-1).charCodeAt(0) + "\n"
        + "SWIDTH 1000 0\n"
        + "DWIDTH 16 0\n"
        + "BBX 16 16 0 -2\n"
        + "BITMAP\n";
    
    var bitmap = drawnGlyphs[curGlyph];
    var q;
    for (q=0; q<16; q++) {
        var byte1 = bitmap[q].slice(0,8).join("");
        byte1 = parseInt(byte1, 2).toString(16);
        var byte2 = bitmap[q].slice(9).join("");
        byte2 = parseInt(byte2, 2).toString(16);
        var hex = byte1.padStart(2, "0")+byte2.padStart(2, "0");

        glyphContents += hex + "\n"
    }
    
    glyphContents += "ENDCHAR\n"

    return glyphContents
}

// Build bdf file
let fileContents;
function buildFont() {
    var glyphsNum = glyphBox.length;
    fileContents = "STARTFONT 2.1\n"
        + "FONT -gnu-unifont-medium-r-normal--16-160-75-75-c-80-iso10646-1\n"
        + "SIZE 16 75 75\n"
        + "FONTBOUNDINGBOX 16 16 0 -2\n"
        + "STARTPROPERTIES 2\n"
        + "FONT_ASCENT 12\n"
        + "FONT_DESCENT 4\n"
        + "ENDPROPERTIES\n"
        + "CHARS " + glyphsNum + "\n";
    
    for (const glyph in drawnGlyphs) {
        fileContents += buildGlyph(glyph);
    }

    fileContents += "ENDFONT"

    fontArea.innerHTML = fileContents;
}

// Check if font loaded correctly
function checkFont() {
    for (glyph in drawnGlyphs) {
        if (drawnGlyphs[glyph].length === 16) {
            var t;
            for (t=0; t<16; t++) {
                if (drawnGlyphs[glyph][t].length === 16) {
                    continue;
                }
                else {
                    alert("Font not loaded correctly!");
                    return false;
                }
            }
        }
        else {
            alert("Font not loaded correctly!");
            return false;
        }
    }
    return true;
}

// Import bdf file
function importFont() {
    clearAllGlyphs();
    var importedContents = fontArea.value.split("\n");
    var t;
    var relevant = false;
    var isBitmap = false;
    for (t=0; t<importedContents.length; t++) {
        var charName;
        if (importedContents[t] === "ENDFONT") {
            relevant = false;
        }
        if (relevant) {
            if (importedContents[t] === "BITMAP") {
                var pixels = [];
                isBitmap = true;
                continue;
            }
            if (isBitmap) {
                if (importedContents[t] === "ENDCHAR") {
                    isBitmap = false;
                    drawnGlyphs[charName] = pixels;
                    var newOption = document.createElement("option");
                    newOption.id = charName;
                    newOption.innerHTML = charName;
                    glyphBox.appendChild(newOption);
                }
                else {
                    var pixelRow = importedContents[t].split("");
                    var s;
                    for (s=0; s<pixelRow.length; s++) {
                        pixelRow[s] = parseInt(pixelRow[s], 16).toString(2).padStart(4, "0");
                    }
                    pixelRow = pixelRow.join("");
                    pixels.push(pixelRow.split(""));
                }
            }
        }
        if (importedContents[t].split(" ")[0] === "STARTCHAR") {
            charName = importedContents[t].split(" ")[1].slice(-1);
            relevant = true;
        }
    }
    if (!checkFont()){
        clearAllGlyphs();
    }
}

// Copy text of font file
function copyFont() {
    navigator.clipboard.writeText(fontArea.value);
}

// Clear font from text field
function clearFont() {
    fontArea.innerHTML = "";
}