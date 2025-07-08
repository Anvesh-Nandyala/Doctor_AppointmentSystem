import { NativeModules } from 'react-native';
const {
  TextRecognition
} = NativeModules;

async function recognize(imagePath, options) {
  return await TextRecognition.recognize(imagePath, options || {});
}

export default {
  recognize
};
//# sourceMappingURL=index.js.map