// Listen for import/export events and collect font element
var exportButton = document.getElementById("export_button");
exportButton.onclick = buildFont;
var importButton = document.getElementById("import_button");
importButton.onclick = importFont;
var fontArea = document.getElementById("font_area");

// Build data for individual glyph
function buildGlyph(curGlyph, encoding) {
    var glyphContents = "STARTCHAR " + curGlyph + "\n"
        + "ENCODING " + encoding + "\n"
        + "SWIDTH 1000 0\n"
        + "DWIDTH 16 0\n"
        + "BBX 16 16 0 -2\n"
        + "BITMAP\n";
    
    var bitmap = drawnGlyphs[curGlyph];
    var q;
    for (q=0; q<16; q++) {
        var byte1 = bitmap[q].slice(0,9).join("");
        byte1 = parseInt(byte1, 2).toString(16);
        var byte2 = bitmap[q].slice(9).join("");
        byte2 = parseInt(byte2, 2).toString(16);

        glyphContents += byte1 + byte2 + "\n"
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
        + "FONT_DESCEnT 4\n"
        + "ENDPROPERTIES\n"
        + "CHARS " + glyphsNum + "\n";
    
    var encodingNum = 0;
    for (const glyph in drawnGlyphs) {
        fileContents += buildGlyph(glyph, encodingNum);
        encodingNum++;
    }

    fileContents += "ENDFONT"

    fontArea.innerHTML = fileContents;
}

// Import bdf file
function importFont() {
    clearAllGlyphs();
    var importedContents = fontArea.value.split("\n");
    var t;
    var relevant = false;
    for (t=0; t<importedContents; t++) {
        var charName;
        var isBitmap = false;
        if (importedContents[t] === "ENDFONT") {
            relevant = false;
        }
        if (relevant) {
            if (importedContents[t] === "BITMAP") {
                var pixels = [];
                isBitmap = true;
            }
            if (isBitmap) {
                if (importedContents[t] === "ENDCHAR") {
                    isBitmap = false;
                    drawnGlyphs[charName] = pixels;
                }
                else {
                    var pixelRow = importedContents[t];
                    pixelRow = (parseInt(pixels, 16).toString(2)).padStart(16, '0');
                    pixels.push(pixelRow.split());
                }
            }
        }
        if (importedContents[t].split(" ")[0] === "STARTCHAR") {
            charName = importedContents[t].split(" ")[1];
            relevant = true;
        }
    }
}