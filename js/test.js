"use strict";
var Color;
(function (Color) {
    Color[Color["Red"] = 1] = "Red";
    Color[Color["Green"] = 4] = "Green";
    Color[Color["Blue"] = 5] = "Blue";
})(Color || (Color = {}));
var c = Color.Green;
var d = Color.Blue;
var colorName = Color[5];
// console.log(c, d);
// console.log(colorName); 
//# sourceMappingURL=test.js.map