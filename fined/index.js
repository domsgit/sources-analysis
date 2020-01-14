'use strict';

var fs = require('fs');
var path = require('path');

var isPlainObject = require('is-plain-object');
var pick = require('object.pick');
var defaults = require('object.defaults/immutable');
var expandTilde = require('expand-tilde');
var parsePath = require('parse-filepath');


function fined(pathObj, defaultObj) {
  var expandedPath = expandPath(pathObj, defaultObj);
  return expandedPath ? findWithExpandedPath(expandedPath) : null;
}

function expandPath(pathObj, defaultObj) {
  // 不是对象类型，则设为{}
  if (!isPlainObject(defaultObj)) {
    defaultObj = {};
  }

  // pathObj为字符串，则设为{path: pathObj}格式
  if (isString(pathObj)) {
    pathObj = { path: pathObj };
  }

  if (!isPlainObject(pathObj)) {
    pathObj = {};
  }

  pathObj = defaults(pathObj, defaultObj);

  var filePath;
  if (!isString(pathObj.path)) {
    return null;
  }
  // Execution of toString is for a String object.
  if (isString(pathObj.name) && pathObj.name) {
    if (pathObj.path) {
      filePath = expandTilde(pathObj.path.toString());
      filePath = path.join(filePath, pathObj.name.toString());
    } else {
      filePath = pathObj.name.toString();
    }
  } else {
    filePath = expandTilde(pathObj.path.toString());
  }

  var extArr = createExtensionArray(pathObj.extensions);
  var extMap = createExtensionMap(pathObj.extensions);

  var basedir = isString(pathObj.cwd) ? pathObj.cwd.toString() : '.';
  basedir = path.resolve(expandTilde(basedir));

  var findUp = !!pathObj.findUp;

  var parsed = parsePath(filePath);
  if (parsed.isAbsolute) {
    filePath = filePath.slice(parsed.root.length);
    findUp = false;
    basedir = parsed.root;
  /* istanbul ignore if */
  } else if (parsed.root) { // Expanded path has a drive letter on Windows.
    filePath = filePath.slice(parsed.root.length);
    basedir = path.resolve(parsed.root);
  }

  if (parsed.ext) {
    filePath = filePath.slice(0, -parsed.ext.length);
    // This ensures that only the original extension is matched.
    extArr = [parsed.ext];
  }

  return {
    path: filePath,
    basedir: basedir,
    findUp: findUp,
    extArr: extArr,
    extMap: extMap,
  };
}

// 根据 expanded.findUp 是否向上查找文件
function findWithExpandedPath(expanded) {
  var found = expanded.findUp ?
    findUpFile(expanded.basedir, expanded.path, expanded.extArr) :
    findFile(expanded.basedir, expanded.path, expanded.extArr);

  if (!found) {
    return null;
  }

  if (expanded.extMap) {
    found.extension = pick(expanded.extMap, found.extension);
  }
  return found;
}

// 查找文件
function findFile(basedir, relpath, extArr) {
  var noExtPath = path.resolve(basedir, relpath);
  for (var i = 0, n = extArr.length; i < n; i++) {
    var filepath = noExtPath + extArr[i];
    try {
      fs.statSync(filepath);
      return { path: filepath, extension: extArr[i] };
    } catch (e) {
      // Ignore error 忽略错误
    }
  }

  return null;
}

// 向上查找文件
function findUpFile(basedir, filepath, extArr) {
  var lastdir;
  do {
    var found = findFile(basedir, filepath, extArr);
    if (found) {
      return found;
    }

    lastdir = basedir;
    basedir = path.dirname(basedir);
  } while (lastdir !== basedir);

  return null;
}

// 创建扩展名数组
function createExtensionArray(exts) {
  if (isString(exts)) {
    return [exts];
  }

  if (Array.isArray(exts)) {
    exts = exts.filter(isString);
    return (exts.length > 0) ? exts : [''];
  }

  if (isPlainObject(exts)) {
    exts = Object.keys(exts);
    return (exts.length > 0) ? exts : [''];
  }

  return [''];
}

// 创建扩展名映射
function createExtensionMap(exts) {
  if (!isPlainObject(exts)) {
    return null;
  }

  if (isEmpty(exts)) {
    return { '': null };
  }

  return exts;
}

// 判断是否是空对象
function isEmpty(object) {
  return !Object.keys(object).length;
}

// 判断是否是字符串string类型
function isString(value) {
  if (typeof value === 'string') {
    return true;
  }
  // 用 new String() 实例化的字符串类型
  if (Object.prototype.toString.call(value) === '[object String]') {
    return true;
  }

  return false;
}

module.exports = fined;
