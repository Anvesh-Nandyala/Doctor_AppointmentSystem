"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactNative = require("react-native");

const {
  TextRecognition
} = _reactNative.NativeModules;

async function recognize(imagePath, options) {
  return await TextRecognition.recognize(imagePath, options || {});
}

var _default = {
  recognize
};
exports.default = _default;
//# sourceMappingURL=index.js.map