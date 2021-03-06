"use strict";
class Utils {
    // public self: Utils;
    constructor() {
        this.North = "N";
        this.East = "E";
        this.South = "S";
        this.West = "W";
        this.Up = "U";
        this.Down = "D";
        this.Directions = [
            this.North,
            this.South,
            this.West,
            this.East,
            this.Up,
            this.Down,
        ];
        this.Back = "B";
        // this.self = new Utils();
    }
    getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
        // The maximum is inclusive and the minimum is inclusive
    }
    getRandomDirections() {
        return this.shuffle(this.Directions);
    }
    /**
     * Given a decompressed template, return a path, start, and end
     * @param template the decompressed template to break apart
     */
    uncompressTemplate(template) {
        const decompressed = LZString.decompressFromEncodedURIComponent(template);
        // console.log(decompressed);
        let decompressedObject = JSON.parse(decompressed);
        // let decompressedObject = JSON.parse(template);
        decompressedObject["StartLocation"] = JSON.parse(decompressedObject["StartLocation"]);
        decompressedObject["EndLocation"] = JSON.parse(decompressedObject["EndLocation"]);
        decompressedObject["MazeDifficulty"] = parseInt(decompressedObject["MazeDifficulty"], 10);
        decompressedObject["GridWidth"] = parseInt(decompressedObject["GridWidth"], 10);
        decompressedObject["GridHeight"] = parseInt(decompressedObject["GridHeight"], 10);
        decompressedObject["GridLayers"] = parseInt(decompressedObject["GridLayers"], 10);
        return decompressedObject;
    }
    compressionTest(MyMaze) {
        console.log("BASE64:");
        console.log(this.b64EncodeUnicode(JSON.stringify(this.compressTemplate(MyMaze))));
        console.log("LZ String:");
        console.log(LZString.compressToEncodedURIComponent(JSON.stringify(this.compressTemplate(MyMaze))));
    }
    b64EncodeUnicode(str) {
        // first we use encodeURIComponent to get percent-encoded UTF-8,
        // then we convert the percent encodings into raw bytes which
        // can be fed into btoa.
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
            // @ts-ignore
            return String.fromCharCode('0x' + p1);
        }));
    }
    compressTemplate(myMaze) {
        const template = {
            MazePath: myMaze.MazePath,
            StartLocation: JSON.stringify(myMaze.StartLocation),
            EndLocation: JSON.stringify(myMaze.EndLocation),
            BestPath: myMaze.BestPath,
            MazeDifficulty: myMaze.MazeDifficulty,
            GridWidth: myMaze.GridWidth,
            GridHeight: myMaze.GridHeight,
            GridLayers: myMaze.GridLayers,
        };
        // console.log(template);
        return LZString.compressToEncodedURIComponent(JSON.stringify(template));
        // return JSON.stringify(template);
    }
    /**
     * Shuffles array in place.
     * @param {Array} array items An array containing the items.
     */
    shuffle(array) {
        let j;
        let x;
        let i;
        for (i = array.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = array[i];
            array[i] = array[j];
            array[j] = x;
        }
        return array;
    }
}
// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.4
var LZString = (function () {
    var f = String.fromCharCode;
    var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
    var baseReverseDic = {};
    function getBaseValue(alphabet, character) {
        if (!baseReverseDic[alphabet]) {
            baseReverseDic[alphabet] = {};
            for (var i = 0; i < alphabet.length; i++) {
                baseReverseDic[alphabet][alphabet.charAt(i)] = i;
            }
        }
        return baseReverseDic[alphabet][character];
    }
    var LZString = {
        // compressToBase64: function (input) {
        //	 if (input == null) return "";
        //	 var res = LZString._compress(input, 6, function (a) { return keyStrBase64.charAt(a); });
        //	 switch (res.length % 4) { // To produce valid Base64
        //		 default: // When could this happen ?
        //		 case 0: return res;
        //		 case 1: return res + "===";
        //		 case 2: return res + "==";
        //		 case 3: return res + "=";
        //	 }
        // },
        // decompressFromBase64: function (input) {
        //	 if (input == null) return "";
        //	 if (input == "") return null;
        //	 return LZString._decompress(input.length, 32, function (index) { return getBaseValue(keyStrBase64, input.charAt(index)); });
        // },
        // compressToUTF16: function (input) {
        //	 if (input == null) return "";
        //	 return LZString._compress(input, 15, function (a) { return f(a + 32); }) + " ";
        // },
        // decompressFromUTF16: function (compressed) {
        //	 if (compressed == null) return "";
        //	 if (compressed == "") return null;
        //	 return LZString._decompress(compressed.length, 16384, function (index) { return compressed.charCodeAt(index) - 32; });
        // },
        // //compress into uint8array (UCS-2 big endian format)
        // compressToUint8Array: function (uncompressed) {
        //	 var compressed = LZString.compress(uncompressed);
        //	 var buf = new Uint8Array(compressed.length * 2); // 2 bytes per character
        //	 for (var i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
        //		 var current_value = compressed.charCodeAt(i);
        //		 buf[i * 2] = current_value >>> 8;
        //		 buf[i * 2 + 1] = current_value % 256;
        //	 }
        //	 return buf;
        // },
        // //decompress from uint8array (UCS-2 big endian format)
        // decompressFromUint8Array: function (compressed) {
        //	 if (compressed === null || compressed === undefined) {
        //		 return LZString.decompress(compressed);
        //	 } else {
        //		 var buf = new Array(compressed.length / 2); // 2 bytes per character
        //		 for (var i = 0, TotalLen = buf.length; i < TotalLen; i++) {
        //			 buf[i] = compressed[i * 2] * 256 + compressed[i * 2 + 1];
        //		 }
        //		 var result = [];
        //		 buf.forEach(function (c) {
        //			 result.push(f(c));
        //		 });
        //		 return LZString.decompress(result.join(''));
        //	 }
        // },
        //compress into a string that is already URI encoded
        compressToEncodedURIComponent: function (input) {
            if (input == null)
                return "";
            return LZString._compress(input, 6, function (a) { return keyStrUriSafe.charAt(a); });
        },
        //decompress from an output of compressToEncodedURIComponent
        decompressFromEncodedURIComponent: function (input) {
            input = input.replace(/ /g, "+");
            let output = "";
            if (input != null) {
                // if (input == "") return null;
                output = LZString._decompress(input.length, 32, function (index) { return getBaseValue(keyStrUriSafe, input.charAt(index)); });
                if (output != null) {
                    return output;
                }
            }
            return "";
        },
        compress: function (uncompressed) {
            return LZString._compress(uncompressed, 16, function (a) { return f(a); });
        },
        _compress: function (uncompressed, bitsPerChar, getCharFromInt) {
            if (uncompressed == null)
                return "";
            var i, value, context_dictionary = {}, context_dictionaryToCreate = {}, context_c = "", context_wc = "", context_w = "", context_enlargeIn = 2, // Compensate for the first entry which should not count
            context_dictSize = 3, context_numBits = 2, context_data = [], context_data_val = 0, context_data_position = 0, ii;
            for (ii = 0; ii < uncompressed.length; ii += 1) {
                context_c = uncompressed.charAt(ii);
                if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
                    context_dictionary[context_c] = context_dictSize++;
                    context_dictionaryToCreate[context_c] = true;
                }
                context_wc = context_w + context_c;
                if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
                    context_w = context_wc;
                }
                else {
                    if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                        if (context_w.charCodeAt(0) < 256) {
                            for (i = 0; i < context_numBits; i++) {
                                context_data_val = (context_data_val << 1);
                                if (context_data_position == bitsPerChar - 1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                }
                                else {
                                    context_data_position++;
                                }
                            }
                            value = context_w.charCodeAt(0);
                            for (i = 0; i < 8; i++) {
                                context_data_val = (context_data_val << 1) | (value & 1);
                                if (context_data_position == bitsPerChar - 1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                }
                                else {
                                    context_data_position++;
                                }
                                value = value >> 1;
                            }
                        }
                        else {
                            value = 1;
                            for (i = 0; i < context_numBits; i++) {
                                context_data_val = (context_data_val << 1) | value;
                                if (context_data_position == bitsPerChar - 1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                }
                                else {
                                    context_data_position++;
                                }
                                value = 0;
                            }
                            value = context_w.charCodeAt(0);
                            for (i = 0; i < 16; i++) {
                                context_data_val = (context_data_val << 1) | (value & 1);
                                if (context_data_position == bitsPerChar - 1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                }
                                else {
                                    context_data_position++;
                                }
                                value = value >> 1;
                            }
                        }
                        context_enlargeIn--;
                        if (context_enlargeIn == 0) {
                            context_enlargeIn = Math.pow(2, context_numBits);
                            context_numBits++;
                        }
                        delete context_dictionaryToCreate[context_w];
                    }
                    else {
                        value = context_dictionary[context_w];
                        for (i = 0; i < context_numBits; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }
                    }
                    context_enlargeIn--;
                    if (context_enlargeIn == 0) {
                        context_enlargeIn = Math.pow(2, context_numBits);
                        context_numBits++;
                    }
                    // Add wc to the dictionary.
                    context_dictionary[context_wc] = context_dictSize++;
                    context_w = String(context_c);
                }
            }
            // Output the code for w.
            if (context_w !== "") {
                if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                    if (context_w.charCodeAt(0) < 256) {
                        for (i = 0; i < context_numBits; i++) {
                            context_data_val = (context_data_val << 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                        }
                        value = context_w.charCodeAt(0);
                        for (i = 0; i < 8; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }
                    }
                    else {
                        value = 1;
                        for (i = 0; i < context_numBits; i++) {
                            context_data_val = (context_data_val << 1) | value;
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                            value = 0;
                        }
                        value = context_w.charCodeAt(0);
                        for (i = 0; i < 16; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }
                    }
                    context_enlargeIn--;
                    if (context_enlargeIn == 0) {
                        context_enlargeIn = Math.pow(2, context_numBits);
                        context_numBits++;
                    }
                    delete context_dictionaryToCreate[context_w];
                }
                else {
                    value = context_dictionary[context_w];
                    for (i = 0; i < context_numBits; i++) {
                        context_data_val = (context_data_val << 1) | (value & 1);
                        if (context_data_position == bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        }
                        else {
                            context_data_position++;
                        }
                        value = value >> 1;
                    }
                }
                context_enlargeIn--;
                if (context_enlargeIn == 0) {
                    context_enlargeIn = Math.pow(2, context_numBits);
                    context_numBits++;
                }
            }
            // Mark the end of the stream
            value = 2;
            for (i = 0; i < context_numBits; i++) {
                context_data_val = (context_data_val << 1) | (value & 1);
                if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                }
                else {
                    context_data_position++;
                }
                value = value >> 1;
            }
            // Flush the last char
            while (true) {
                context_data_val = (context_data_val << 1);
                if (context_data_position == bitsPerChar - 1) {
                    context_data.push(getCharFromInt(context_data_val));
                    break;
                }
                else
                    context_data_position++;
            }
            return context_data.join('');
        },
        decompress: function (compressed) {
            if (compressed == null)
                return "";
            if (compressed == "")
                return null;
            return LZString._decompress(compressed.length, 32768, function (index) { return compressed.charCodeAt(index); });
        },
        _decompress: function (length, resetValue, getNextValue) {
            var dictionary = [], next, enlargeIn = 4, dictSize = 4, numBits = 3, entry = "", result = [], i, w, bits, resb, maxpower, power, c, data = { val: getNextValue(0), position: resetValue, index: 1 };
            for (i = 0; i < 3; i += 1) {
                dictionary[i] = i;
            }
            bits = 0;
            maxpower = Math.pow(2, 2);
            power = 1;
            while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                    data.position = resetValue;
                    data.val = getNextValue(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
            }
            switch (next = bits) {
                case 0:
                    bits = 0;
                    maxpower = Math.pow(2, 8);
                    power = 1;
                    while (power != maxpower) {
                        resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position == 0) {
                            data.position = resetValue;
                            data.val = getNextValue(data.index++);
                        }
                        bits |= (resb > 0 ? 1 : 0) * power;
                        power <<= 1;
                    }
                    c = f(bits);
                    break;
                case 1:
                    bits = 0;
                    maxpower = Math.pow(2, 16);
                    power = 1;
                    while (power != maxpower) {
                        resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position == 0) {
                            data.position = resetValue;
                            data.val = getNextValue(data.index++);
                        }
                        bits |= (resb > 0 ? 1 : 0) * power;
                        power <<= 1;
                    }
                    c = f(bits);
                    break;
                case 2:
                    return "";
            }
            dictionary[3] = c;
            w = c;
            result.push(c);
            while (true) {
                if (data.index > length) {
                    return "";
                }
                bits = 0;
                maxpower = Math.pow(2, numBits);
                power = 1;
                while (power != maxpower) {
                    resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                        data.position = resetValue;
                        data.val = getNextValue(data.index++);
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                }
                switch (c = bits) {
                    case 0:
                        bits = 0;
                        maxpower = Math.pow(2, 8);
                        power = 1;
                        while (power != maxpower) {
                            resb = data.val & data.position;
                            data.position >>= 1;
                            if (data.position == 0) {
                                data.position = resetValue;
                                data.val = getNextValue(data.index++);
                            }
                            bits |= (resb > 0 ? 1 : 0) * power;
                            power <<= 1;
                        }
                        dictionary[dictSize++] = f(bits);
                        c = dictSize - 1;
                        enlargeIn--;
                        break;
                    case 1:
                        bits = 0;
                        maxpower = Math.pow(2, 16);
                        power = 1;
                        while (power != maxpower) {
                            resb = data.val & data.position;
                            data.position >>= 1;
                            if (data.position == 0) {
                                data.position = resetValue;
                                data.val = getNextValue(data.index++);
                            }
                            bits |= (resb > 0 ? 1 : 0) * power;
                            power <<= 1;
                        }
                        dictionary[dictSize++] = f(bits);
                        c = dictSize - 1;
                        enlargeIn--;
                        break;
                    case 2:
                        return result.join('');
                }
                if (enlargeIn == 0) {
                    enlargeIn = Math.pow(2, numBits);
                    numBits++;
                }
                if (dictionary[c]) {
                    entry = dictionary[c];
                }
                else {
                    if (c === dictSize) {
                        entry = w + w.charAt(0);
                    }
                    else {
                        return null;
                    }
                }
                result.push(entry);
                // Add w+entry[0] to the dictionary.
                dictionary[dictSize++] = w + entry.charAt(0);
                enlargeIn--;
                w = entry;
                if (enlargeIn == 0) {
                    enlargeIn = Math.pow(2, numBits);
                    numBits++;
                }
            }
        }
    };
    return LZString;
})();
// if (typeof define === 'function' && define.amd) {
//	 define(function () { return LZString; });
// } else if (typeof module !== 'undefined' && module != null) {
//	 module.exports = LZString
// } else if (typeof angular !== 'undefined' && angular != null) {
//	 angular.module('LZString', [])
//		 .factory('LZString', function () {
//			 return LZString;
//		 });
// }
class Cell {
    constructor(z, y, x) {
        this.North = false;
        this.East = false;
        this.South = false;
        this.West = false;
        this.Up = false;
        this.Down = false;
        this.Z = z;
        this.Y = y;
        this.X = x;
    }
}
class Character {
    constructor(name, myMaze) {
        this.Utilities = new Utils();
        this.Name = name;
        this.ThisMaze = myMaze;
        this.CurrentLocation = JSON.parse(JSON.stringify(this.ThisMaze.StartLocation));
        this.move("");
    }
    /**
     * If the direction parameter is valid, change the current location to that cell
     * @param direction Direction to move the character
     */
    move(direction) {
        // Make a clean copy (not a reference)
        this.PreviousLocation = JSON.parse(JSON.stringify(this.CurrentLocation));
        if (this.CanMoveDirection(direction)) {
            switch (direction) {
                case this.Utilities.North:
                    this.SetRelativeLocation(0, -1, 0);
                    break;
                case this.Utilities.East:
                    this.SetRelativeLocation(0, 0, 1);
                    break;
                case this.Utilities.South:
                    this.SetRelativeLocation(0, 1, 0);
                    break;
                case this.Utilities.West:
                    this.SetRelativeLocation(0, 0, -1);
                    break;
                case this.Utilities.Up:
                    if (this.CurrentLocation.Z === this.ThisMaze.GridLayers - 1) {
                        this.SetExactLocation(0, null, null);
                    }
                    else {
                        this.SetRelativeLocation(1, 0, 0);
                    }
                    break;
                case this.Utilities.Down:
                    if (this.CurrentLocation.Z === 0) {
                        this.SetExactLocation(this.ThisMaze.GridLayers - 1, null, null);
                    }
                    else {
                        this.SetRelativeLocation(-1, 0, 0);
                    }
                    break;
            }
            return true;
        }
        return false;
    }
    ResetCharacter() {
        this.ThisMaze.SetMazeSolvedToFalse();
        this.CurrentLocation = JSON.parse(JSON.stringify(this.ThisMaze.StartLocation));
    }
    /**
     * Moves the character to an *exact* location within the grid
     * @param z Z-Axis
     * @param y Y-Axis
     * @param x X-Axis
     */
    SetExactLocation(z, y, x) {
        if (z !== null) {
            this.CurrentLocation.Z = z;
        }
        if (y !== null) {
            this.CurrentLocation.Y = y;
        }
        if (x !== null) {
            this.CurrentLocation.X = x;
        }
    }
    /**
     * Moves the character to a location relative to the current location within the grid
     * @param z Z-Axis
     * @param y Y-Axis
     * @param x X-Axis
     */
    SetRelativeLocation(z, y, x) {
        this.CurrentLocation.Z += z;
        this.CurrentLocation.Y += y;
        this.CurrentLocation.X += x;
    }
    /**
     * Checks to see if a character can move a direction
     * @param direction The direction the character wants to move
     */
    CanMoveDirection(direction) {
        if (direction === this.Utilities.Up || direction === this.Utilities.Down) {
            return true;
        }
        switch (direction) {
            case this.Utilities.North:
                return this.ThisMaze.MazeGrid[this.CurrentLocation.Z][this.CurrentLocation.Y][this.CurrentLocation.X].North;
                break;
            case this.Utilities.East:
                return this.ThisMaze.MazeGrid[this.CurrentLocation.Z][this.CurrentLocation.Y][this.CurrentLocation.X].East;
                break;
            case this.Utilities.South:
                return this.ThisMaze.MazeGrid[this.CurrentLocation.Z][this.CurrentLocation.Y][this.CurrentLocation.X].South;
                break;
            case this.Utilities.West:
                return this.ThisMaze.MazeGrid[this.CurrentLocation.Z][this.CurrentLocation.Y][this.CurrentLocation.X].West;
                break;
        }
    }
}
class HTMLCharacterView {
    constructor(myCharacter, characterIcon, solvedCharacterEndIcon, mazeEndIcon, solvedMazeEndIcon) {
        this.MyCharacter = myCharacter;
        this.CharacterIcon = characterIcon;
        this.SolvedCharacterIcon = solvedCharacterEndIcon;
        this.EndIcon = mazeEndIcon;
        this.SolvedEndIcon = solvedMazeEndIcon;
        this.CurrentCharacterIcon = characterIcon;
        this.CurrentEndIcon = mazeEndIcon;
        this.move();
    }
    move() {
        // Move the character on *every* level, not just the current level
        let selectedCells = document.querySelectorAll(`.y${this.MyCharacter.PreviousLocation.Y}x${this.MyCharacter.PreviousLocation.X}`);
        for (let i = 0; i < selectedCells.length; i++) {
            selectedCells[i].innerHTML = "";
        }
        const playAgain = document.querySelector("#play-again");
        if (this.IsSolved()) {
            playAgain.style.display = "block";
            this.CurrentCharacterIcon = this.SolvedCharacterIcon;
            this.CurrentEndIcon = this.SolvedEndIcon;
        }
        else {
            playAgain.style.display = "none";
            this.CurrentCharacterIcon = this.CharacterIcon;
            this.CurrentEndIcon = this.EndIcon;
        }
        const end = document.querySelector(`.winter.y${this.MyCharacter.ThisMaze.EndLocation.Y}x${this.MyCharacter.ThisMaze.EndLocation.X}`);
        end.innerHTML = this.CurrentEndIcon;
        selectedCells = document.querySelectorAll(`.y${this.MyCharacter.CurrentLocation.Y}x${this.MyCharacter.CurrentLocation.X}`);
        for (let i = 0; i < selectedCells.length; i++) {
            selectedCells[i].innerHTML = this.CurrentCharacterIcon;
        }
    }
    IsSolved() {
        return this.MyCharacter.ThisMaze.IsMazeSolved(this.MyCharacter.CurrentLocation);
    }
}
class Maze {
    constructor(gridLayers, gridWidth, gridHeight, mazeTemplateCompressed, startLocation, endLocation) {
        this.MazeDifficulty = 0;
        this.BestPath = "";
        this.Utilities = new Utils();
        this.MazeSolved = false;
        this.GridLayers = gridLayers;
        this.GridWidth = gridWidth;
        this.GridHeight = gridHeight;
        // generate the grid
        this.MazeGrid = this.generateGrid();
        if (mazeTemplateCompressed !== undefined) {
            // Procedural generated path
            this.MazeTemplateCompressed = mazeTemplateCompressed;
            this.MazePath = this.fillMazeProcedural(this.MazeTemplateCompressed);
        }
        else {
            // Random generated path
            if (startLocation === undefined) {
                this.StartLocation = {
                    Z: 0,
                    Y: 0,
                    X: 0,
                };
            }
            else {
                this.StartLocation = startLocation;
            }
            if (endLocation === undefined) {
                this.EndLocation = {
                    Z: 0,
                    Y: this.Utilities.getRandomIntInclusive(1, this.GridHeight - 1),
                    X: this.Utilities.getRandomIntInclusive(1, this.GridWidth - 1),
                };
            }
            else {
                this.EndLocation = endLocation;
            }
            this.MazePath = this.fillMazeRandom();
            this.MazeTemplateCompressed = this.Utilities.compressTemplate(this);
        }
    }
    SetMazeSolvedToFalse() {
        this.MazeSolved = false;
    }
    IsMazeSolved(currentLocation) {
        // If the maze has already been solved, don't change that fact
        if (this.MazeSolved) {
            return true;
        }
        else {
            return this.MazeSolved = (currentLocation.Z === this.EndLocation.Z
                && currentLocation.Y === this.EndLocation.Y
                && currentLocation.X === this.EndLocation.X);
        }
    }
    determineMazeDifficulty(attempts = 3000) {
        let lowest = Number.MAX_VALUE;
        let path = "";
        for (let i = 0; i < attempts; i++) {
            const MyNavigator = new MazeNavigator(this);
            MyNavigator.Navigate();
            if (MyNavigator.moves < lowest) {
                lowest = MyNavigator.moves;
                path = MyNavigator.path;
            }
        }
        this.MazeDifficulty = lowest;
        this.BestPath = path;
        // let t0 = performance.now();
        // let t1 = performance.now();
        // let tTotal = t1-t0;
        // console.log("Total time in seconds: " + tTotal / 1000);
    }
    generateGrid() {
        const tempGrid = new Array(this.GridLayers);
        for (let i = 0; i < this.GridLayers; i++) {
            tempGrid[i] = new Array(this.GridHeight);
            for (let j = 0; j < this.GridHeight; j++) {
                tempGrid[i][j] = new Array(this.GridWidth);
                tempGrid[i][j].fill();
            }
        }
        return tempGrid;
    }
    /**
     * Given a decompressed path, returns a maze path for a procedural maze
     * @param mazeTemplateCompressed given decompressed string of directions (a path)
     */
    fillMazeProcedural(mazeTemplateCompressed) {
        const template = this.Utilities.uncompressTemplate(mazeTemplateCompressed);
        // tslint:disable-next-line:prefer-const
        let path = template.MazePath.split("");
        this.StartLocation = template.StartLocation;
        this.EndLocation = template.EndLocation;
        this.BestPath = template.BestPath;
        this.MazeDifficulty = template.MazeDifficulty;
        this.GridWidth = template.GridWidth;
        this.GridHeight = template.GridHeight;
        this.GridLayers = template.GridLayers;
        this.MazeGrid = this.generateGrid();
        // MazePath: myMaze.MazePath,
        // Start: JSON.stringify(myMaze.StartLocation),
        // End: JSON.stringify(myMaze.EndLocation),
        // BestPath: myMaze.BestPath,
        // Difficulty: myMaze.MazeDifficulty,
        // tslint:disable-next-line:prefer-const
        let cellsList = [new Cell(0, 0, 0)];
        let next;
        let mazePath = "";
        let index = -1;
        while (cellsList.length > 0) {
            // index is the newest
            index = cellsList.length - 1;
            const currentCell = cellsList[index];
            next = path.shift();
            if (next === "" || next === undefined) {
                break;
            }
            else if (next === this.Utilities.Back) {
                cellsList.splice(index, 1);
            }
            else {
                const nextCell = this.directionModifier(cellsList[index], next);
                // const result2: any = 
                this.carvePathBetweenCells(currentCell, nextCell, next);
                this.MazeGrid[currentCell.Z][currentCell.Y][currentCell.X] = currentCell;
                this.MazeGrid[nextCell.Z][nextCell.Y][nextCell.X] = nextCell;
                cellsList.push(nextCell);
                index = -1;
            }
            if (index !== -1) {
                cellsList.splice(index, 1);
            }
            mazePath += next;
        }
        return mazePath;
    }
    /**
     * Returns a maze path for a random maze
     */
    fillMazeRandom() {
        let index = -1;
        let output = "";
        // tslint:disable-next-line:prefer-const
        let cellsList = [new Cell(this.StartLocation.Z, this.StartLocation.Y, this.StartLocation.X)];
        while (cellsList.length > 0) {
            // index is the newest
            index = cellsList.length - 1;
            const currentCell = cellsList[index];
            const directions = this.Utilities.getRandomDirections();
            for (let i = 0; i < directions.length; i++) {
                const nextCell = this.directionModifier(cellsList[index], directions[i]);
                if (this.isEmptyCell(nextCell.Z, nextCell.Y, nextCell.X)) {
                    // we found a workable direction
                    this.carvePathBetweenCells(currentCell, nextCell, directions[i]);
                    this.MazeGrid[currentCell.Z][currentCell.Y][currentCell.X] = currentCell;
                    this.MazeGrid[nextCell.Z][nextCell.Y][nextCell.X] = nextCell;
                    cellsList.push(nextCell);
                    output += directions[i];
                    index = -1;
                    break;
                }
            }
            if (index !== -1) {
                cellsList.splice(index, 1);
                output += this.Utilities.Back;
            }
        }
        return output;
    }
    carvePathBetweenCells(currentCell, nextCell, direction) {
        switch (direction) {
            case this.Utilities.North:
                currentCell.North = true;
                nextCell.South = true;
                break;
            case this.Utilities.East:
                currentCell.East = true;
                nextCell.West = true;
                break;
            case this.Utilities.South:
                currentCell.South = true;
                nextCell.North = true;
                break;
            case this.Utilities.West:
                currentCell.West = true;
                nextCell.East = true;
                break;
            case this.Utilities.Up:
                currentCell.Up = true;
                nextCell.Down = true;
                break;
            case this.Utilities.Down:
                currentCell.Down = true;
                nextCell.Up = true;
                break;
        }
        // return { current: currentCell, next: nextCell };
    }
    isEmptyCell(z, y, x) {
        if (this.isValidCell(z, y, x)
            && (this.MazeGrid[z][y][x] === null || this.MazeGrid[z][y][x] === undefined))
            return true;
        return false;
    }
    isValidCell(z, y, x) {
        if (z >= 0 && z < this.GridLayers
            && y >= 0 && y < this.GridHeight
            && x >= 0 && x < this.GridWidth)
            return true;
        return false;
    }
    directionModifier(cell, direction) {
        switch (direction) {
            case this.Utilities.North:
                // TODO: This has to be a bug, right?
                // you would think it'd be cell.Y + 1, but I can't get that to work...
                // it has to be a problem with isEmptyCell, but I don't see any issues there
                return new Cell(cell.Z, cell.Y - 1, cell.X);
            case this.Utilities.East:
                return new Cell(cell.Z, cell.Y, cell.X + 1);
            case this.Utilities.South:
                return new Cell(cell.Z, cell.Y + 1, cell.X);
            case this.Utilities.West:
                return new Cell(cell.Z, cell.Y, cell.X - 1);
            case this.Utilities.Up:
                // if we're at the top layer, loop around
                if (cell.Z === this.GridLayers - 1)
                    return new Cell(0, cell.Y, cell.X);
                else
                    return new Cell(cell.Z + 1, cell.Y, cell.X);
            case this.Utilities.Down:
                // if we're at the bottom layer, loop around
                if (cell.Z === 0)
                    return new Cell(this.GridLayers - 1, cell.Y, cell.X);
                else
                    return new Cell(cell.Z - 1, cell.Y, cell.X);
        }
        return new Cell(cell.Z, cell.Y, cell.Z);
    }
}
class MazeView {
    constructor(myMaze) {
        this.myMaze = myMaze;
        this.MyMaze = myMaze;
    }
    displayMaze() {
        // $(`#play-again`).hide();
        let html = "";
        for (let layer = 0; layer < this.MyMaze.MazeGrid.length; layer++) {
            const layerName = this.getNameFromLayer(layer);
            html += `<div id="layer${layer}" class="${layerName}">`;
            html += `<h3 class="${layerName} maze-header">`
                + `<button onclick="goDown()" class="down-button" aria-label="Move Back">&nbsp;</button>`
                + `<span class="${layerName} layer-name">${layerName}</span>`
                + `<button onclick="goUp()" class="up-button" aria-label="Move Forward">&nbsp;</button>`
                + `</h3>`;
            html += `<table id="layer${layer}-table" class="maze-table ${layerName}">`;
            for (let row = 0; row < this.MyMaze.MazeGrid[layer].length; row++) {
                html += "<tr class='r'>";
                for (let column = 0; column < this.MyMaze.GridWidth; column++) {
                    const classes = this.getClassesFromCell(this.MyMaze.MazeGrid[layer][row][column]);
                    html += `<td class="cell ${classes} ${layerName} y${row}x${column}">&nbsp;`;
                    html += "</td>";
                }
                html += "</tr> <!-- end row -->\n";
            }
            html += "</table>";
            html += "</div>";
        }
        document.body.querySelector("#maze-game").innerHTML = html;
    }
    getClassesFromCell(cell) {
        let classes = "";
        if (!cell.North)
            classes += " top ";
        if (!cell.East)
            classes += " right ";
        if (!cell.South)
            classes += " bottom ";
        if (!cell.West)
            classes += " left ";
        if (!cell.Up)
            classes += " up ";
        if (!cell.Down)
            classes += " down ";
        if ({ Z: cell.Z, Y: cell.Y, X: cell.X } === this.MyMaze.EndLocation)
            classes += " end ";
        return classes;
    }
    getNameFromLayer(layer) {
        switch (layer) {
            case 0:
                return "winter";
            case 1:
                return "spring";
            case 2:
                return "summer";
            case 3:
                return "fall";
            default:
                return "";
        }
    }
}
let currentLayer;
let GridLayers;
let GridHeight;
let GridWidth;
let MyCharacter;
let MyCharacterView;
let Utilities;
let MyMaze;
// let MyNavigator: MazeNavigator;
function main() {
    Utilities = new Utils();
    currentLayer = 0;
    GridLayers = 4;
    GridHeight = 8;
    GridWidth = 8;
    // Random Maze
    // MyMaze = new Maze(GridLayers, GridHeight, GridWidth);
    // Procedural Maze
    MyMaze = new Maze(0, 0, 0, "N4IgsghgXgpgChALgCxALhAEWwZUwUQDlMcB1HAVQp3yNIvMuqp0qKuM0KPws7tKFqPCrXwk8ZEuVG96wkh3LZi+MoNIESXenmykD3YoU1qCxAzgBCQ7gxpXNV5zaFqaZUXk2spRXAamNhRWXC4unOHBvFRWPCaC4ia+IeK8hJwyIRmYgqIETKp4hFaSzCwhziVRGobh+FHhpI3OzS3tpR1d3TXVNfTErT3dbe0NwxOTU9MzkyAANCA4iBAATogAMgD2AMZIAJZbAHboIMAAOiAAWpdoAAzzlwCatw+XABqvAL4LIPhHABNtntEIcThgLtdXo8QC90ABWGGfdAANh+iysMAAzogEChTr9ILBMPsAGak-Y7ACuABtEABPdAPEAAcVW+wBpA5+LQAA5FmyOQAJGD7ADmyEQ6H5rPZQIg9Jgqyx6AALF8gA");
    const mazeViewer = new MazeView(MyMaze);
    mazeViewer.displayMaze();
    showLayerHideOthers(currentLayer);
    MyCharacter = new Character("happyemoji", MyMaze);
    MyCharacterView = new HTMLCharacterView(MyCharacter, String.fromCharCode(0xD83D, 0xDE00), // 😀
    String.fromCharCode(0xD83D, 0xDE0E), // 😎
    String.fromCharCode(0xD83C, 0xDFC1), // 🏁
    String.fromCharCode(0xD83C, 0xDF89)); // 🎉
}
function testBestPath() {
    let path = MyMaze.BestPath.split("");
    path.forEach(direction => {
        switch (direction) {
            case "N":
                goNorth();
                break;
            case "S":
                goSouth();
                break;
            case "E":
                goEast();
                break;
            case "W":
                goWest();
                break;
            case "U":
                goUp();
                break;
            case "D":
                goDown();
                break;
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    // https://stackoverflow.com/questions/1402698/binding-arrow-keys-in-js-jquery
    document.addEventListener("keydown", function (e) {
        e = e || window.event;
        switch (e.which || e.keyCode) {
            case 65: // a
            case 37: // left
                goWest();
                break;
            case 87: // w
            case 38: // up
                goNorth();
                break;
            case 68: // d
            case 39: // right
                goEast();
                break;
            case 83: // s
            case 40: // down
                goSouth();
                break;
            case 81: // 1
                goDown();
                break;
            case 69: // 1
                goUp();
                break;
            default: return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });
});
function showLayerHideOthers(layerChoice) {
    if (GridLayers > 1) {
        for (let layer = 0; layer < GridLayers; layer++) {
            const layerId = `#layer${layer}`;
            if (layer === layerChoice)
                document.body.querySelector(layerId).style.display = "block";
            else
                document.body.querySelector(layerId).style.display = "none";
        }
    }
}
function goNorth() {
    MyCharacter.move(Utilities.North);
    MyCharacterView.move();
}
function goEast() {
    MyCharacter.move(Utilities.East);
    MyCharacterView.move();
}
function goSouth() {
    MyCharacter.move(Utilities.South);
    MyCharacterView.move();
}
function goWest() {
    MyCharacter.move(Utilities.West);
    MyCharacterView.move();
}
function goUp() {
    if (currentLayer < GridLayers - 1)
        currentLayer++;
    else
        currentLayer = 0;
    showLayerHideOthers(currentLayer);
    MyCharacter.move(Utilities.Up);
    MyCharacterView.move();
}
function goDown() {
    if (currentLayer === 0)
        currentLayer = GridLayers - 1;
    else
        currentLayer--;
    showLayerHideOthers(currentLayer);
    MyCharacter.move(Utilities.Down);
    MyCharacterView.move();
}
class MazeNavigator {
    constructor(myMaze) {
        /*
            Use the Character class to move completely randomly through the maze
            from the given starting point to the given ending point.
        
            It's given a generated maze grid with starting and ending points
            It will keep going any random direction until it finds the end.
            Like any other character, it can't move through walls
            Another posibility - make it a little smarter, have it navigate the way
            that the maze generating algorithm works: keep moving until you can't,
            then back up until you get to where you want to go.
        
        */
        this.moves = 0;
        this.path = "";
        this.MyMaze = myMaze;
        this.Utilities = new Utils();
        this.Character = new Character("navigator" + this.Utilities.getRandomIntInclusive(0, 1000), myMaze);
    }
    Navigate() {
        // let moved = false;
        while (!this.MyMaze.IsMazeSolved(this.Character.CurrentLocation)) {
            const directions = this.Utilities.getRandomDirections();
            for (let i = 0; i < directions.length; i++) {
                if (this.Character.CanMoveDirection(directions[i])) {
                    this.Character.move(directions[i]);
                    this.path += directions[i];
                    this.moves++;
                    // moved = true;
                    break;
                }
            }
            // if (!moved) {
            // 	this.Character.CurrentLocation = this.Character.PreviousLocation;
            // }
            // moved = false;
        }
        console.log("IsNavigatablePath: " + this.isNavigatablePath(this.path));
        this.Character.ResetCharacter();
    }
    isNavigatablePath(possiblePath) {
        let isValidPath = false;
        let path = possiblePath.split("");
        for (let i = 0; i < path.length; i++) {
            let next = path.shift();
            if (next === undefined) {
                next = "";
            }
            if (this.Character.CanMoveDirection(next)) {
                this.Character.move(next);
                this.moves++;
            }
        }
        return this.MyMaze.IsMazeSolved(this.Character.CurrentLocation);
    }
}
