export declare type TextRecognitionOptions = {
    visionIgnoreThreshold?: number;
};
declare type TextRecognitionType = {
    recognize(imagePath: string, options?: TextRecognitionOptions): Promise<string[]>;
};
declare const _default: TextRecognitionType;
export default _default;
