# bdf-pixel-editor
This is a visual pixel editor for .bdf files. It will let you create fonts where each glyph (character or symbol) is built pixel by pixel.<br>
See the system running [here](https://marcusg.me/bdf-pixel-editor/).

## .bdf Format
The Glyph Bitmap Distribution format is an older font format that is largely unsupported now, replaced mainly by OpenType and TrueType. 
Because this format is rarely used now, very few tools are still available to develop such fonts. However, this font format (and thus these tools) still has some use in low-level embedded systems, or any system that cannot support a high computational load. This project offers one such tool
for a limited 16pt font, with a 16x16 bounding box. The global properties of the font this system creates are as follows.<br>

STARTFONT 2.1<br>
FONT -gnu-unifont-medium-r-normal--16-160-75-75-c-80-iso10646-1<br>
SIZE 16 75 75<br>
FONTBOUNDINGBOX 16 16 0 -2<br>
STARTPROPERTIES 2<br>
FONT_ASCENT 14<br>
FONT_DESCENT 2<br>
ENDPROPERTIES<br>
CHARS 91<br>

Each glyph has a preamble like the following (with STARTCHAR and ENCODING different for each glyph).<br>

STARTCHAR !<br>
ENCODING 33<br>
SWIDTH 1000 0<br>
DWIDTH 16 0<br>
BBX 16 16 0 -2<br>
BITMAP<br>

Each line after BITMAP and before ENDCHAR is a hexadecimal representation of two bytes that repreesnt each line of pixels. Each of the 16 bits is either 
a 0 or 1 which represents whether the pixel is filled in or not. The font is then ended by ENDFONT. To read more about the font format, and to see what 
each line means, visit its [wikipedia page](https://en.wikipedia.org/wiki/Glyph_Bitmap_Distribution_Format).

## System Requirements and Compatibility
- The editor is written entirely in Javascript, so can be opened and used with most modern web browsers. It has been tested with Chrome v94.0.4606.71 and
Firefox v92.0.1.
- In order to use the fonts provided by the system, you will need a system that can load these font files. The system's exported fonts have been tested with 
the [font loader](https://github.com/hzeller/rpi-rgb-led-matrix/blob/master/lib/bdf-font.cc) in [this repository](https://github.com/hzeller/rpi-rgb-led-matrix).
- In order to use the system to import a font, you will need a correctly written font. The system specifically throws an error if the hex in each BITMAP line 
doesn't return 2 bytes of binary or if there aren't 16 lines of hex per BITMAP.

## System Features
- Allows fonts to be designed pixel by pixel and exported
- Fonts cas be cleared and copied to your clipboard
- Outside fonts can be imported
- Glyphs can be completely cleared, remvoed one at a time, or added

## Future Features
- Customizable bounding box
- Automatically customized bounding box per glyph
- Full unicode support

## Credits
- [rpi-rgb-led-matrix](https://github.com/hzeller/rpi-rgb-led-matrix) was used to test exported fonts.
- [This tutorial](https://exarhouleasjohn.medium.com/how-to-easily-manually-make-an-html-and-css-4x4-grid-50bcf6106410) 
was a great starting point for creatign the pixel grid.
- Credit to [Ethan Jennings](https://github.com/ethanhjennings) for his help in beta testing and debugging.
