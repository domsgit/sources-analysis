import _indexOf from './_indexOf';

// 判断list中是否包含了a
export default function _includes(a, list) {
  return _indexOf(list, a, 0) >= 0;
}
