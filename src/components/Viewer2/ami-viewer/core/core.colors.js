"use strict";
exports.__esModule = true;
var COLORS;
(function (COLORS) {
    COLORS["blue"] = "#00B0FF";
    COLORS["yellow"] = "#FFEB3B";
    COLORS["red"] = "#F50057";
    COLORS["green"] = "#76FF03";
    COLORS["white"] = "#FFF";
    COLORS["lightRed"] = "#F77";
})(COLORS = exports.COLORS || (exports.COLORS = {}));
/**
 * Colors utility functions
 */
var Colors = /** @class */ (function () {
    function Colors() {
    }
    /**
     * Convert LAB to XYZ
     * http://www.easyrgb.com/index.php?X=MATH&H=08#text8
     *
     * @param {*} l
     * @param {*} a
     * @param {*} b
     *
     * @return {*}
     */
    Colors.cielab2XYZ = function (l, a, b) {
        // https://www.mathworks.com/help/images/ref/whitepoint.html
        // d65: 0.9504, 1, 1.0888
        var refX = 95.047;
        var refY = 100.0;
        var refZ = 108.883;
        var y = (l + 16) / 116;
        var x = a / 500 + y;
        var z = y - b / 200;
        if (Math.pow(y, 3) > 0.008856) {
            y = Math.pow(y, 3);
        }
        else {
            y = (y - 16 / 116) / 7.787;
        }
        if (Math.pow(x, 3) > 0.008856) {
            x = Math.pow(x, 3);
        }
        else {
            x = (x - 16 / 116) / 7.787;
        }
        if (Math.pow(z, 3) > 0.008856) {
            z = Math.pow(z, 3);
        }
        else {
            z = (z - 16 / 116) / 7.787;
        }
        return [refX * x, refY * y, refZ * z];
    };
    /**
     * Convert XYZ to RGB space
     *
     * @param {*} x
     * @param {*} y
     * @param {*} z
     *
     * @return {*}
     */
    Colors.xyz2RGB = function (x, y, z) {
        x /= 100;
        y /= 100;
        z /= 100;
        var r = x * 3.2406 + y * -1.5372 + z * -0.4986;
        var g = x * -0.9689 + y * 1.8758 + z * 0.0415;
        var b = x * 0.0557 + y * -0.204 + z * 1.057;
        if (r > 0.0031308) {
            r = 1.055 * Math.pow(r, 1 / 2.4) - 0.055;
        }
        else {
            r = 12.92 * r;
        }
        if (g > 0.0031308) {
            g = 1.055 * Math.pow(g, 1 / 2.4) - 0.055;
        }
        else {
            g = 12.92 * g;
        }
        if (b > 0.0031308) {
            b = 1.055 * Math.pow(b, 1 / 2.4) - 0.055;
        }
        else {
            b = 12.92 * b;
        }
        r = r * 255;
        g = g * 255;
        b = b * 255;
        return [r, g, b];
    };
    /**
     * Convert LAB to RGB
     *
     * @param {*} l
     * @param {*} a
     * @param {*} b
     *
     * @return {*}
     */
    Colors.cielab2RGB = function (l, a, b) {
        if (l === void 0) { l = 50; }
        if (a === void 0) { a = 0; }
        if (b === void 0) { b = 0; }
        if (!(l >= 0 && l <= 100)) {
            return null;
        }
        var _a = this.cielab2XYZ(l, a, b), x = _a[0], y = _a[1], z = _a[2];
        return this.xyz2RGB(x, y, z);
    };
    return Colors;
}());
exports["default"] = Colors;
