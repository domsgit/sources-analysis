// 是否是transformer
export default function _isTransformer(obj) {
  return obj != null && typeof obj['@@transducer/step'] === 'function';
}
