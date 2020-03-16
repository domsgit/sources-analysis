'use strict';

var fs = require('fs');
var parse = require('parse-passwd');

function homedir() {
  // The following logic is from looking at logic used in the different platform
  // versions of the uv_os_homedir function found in https://github.com/libuv/libuv
  // This is the function used in modern versions of node.js
  // 下面的逻辑是从 https://github.com/libuv/libuv 找到的在不同平台可用的 uv_os_homedir 函数版本。
  // 这个函数可用于高版本的node.js

  if (process.platform === 'win32') { // windows平台
    // check the USERPROFILE first
    // 检测 USERPROFILE 是否存在
    if (process.env.USERPROFILE) {
      return process.env.USERPROFILE;
    }

    // check HOMEDRIVE and HOMEPATH
    // 检测 HOMEDRIVE 和 HOMEPATH
    if (process.env.HOMEDRIVE && process.env.HOMEPATH) {
      return process.env.HOMEDRIVE + process.env.HOMEPATH;
    }

    // fallback to HOME
    // 回退到 HOME
    if (process.env.HOME) {
      return process.env.HOME;
    }

    return null;
  }

  // check HOME environment variable first
  // 检测 环境变量中的 HOME
  if (process.env.HOME) {
    return process.env.HOME;
  }

  // on linux platforms (including OSX) find the current user and get their homedir from the /etc/passwd file
  // 在linux平台（包括OSX），找到当前用户并从/etc/passwd文件中得到他们的家目录
  var passwd = tryReadFileSync('/etc/passwd');
  var home = find(parse(passwd), getuid());
  if (home) {
    return home;
  }

  // fallback to using user environment variables
  // 回退到用用户环境变量
  var user = process.env.LOGNAME || process.env.USER || process.env.LNAME || process.env.USERNAME;

  if (!user) {
    return null;
  }

  if (process.platform === 'darwin') { // OSX 平台
    return '/Users/' + user;
  }

  return '/home/' + user; // 其他平台
}

// 从对象数组中匹配某项
function find(arr, uid) {
  var len = arr.length;
  for (var i = 0; i < len; i++) {
    if (+arr[i].uid === uid) {
      return arr[i].homedir;
    }
  }
}

// 取uid
function getuid() {
  if (typeof process.geteuid === 'function') {
    return process.geteuid();
  }
  return process.getuid();
}

// 同步读取文件
function tryReadFileSync(fp) {
  try {
    return fs.readFileSync(fp, 'utf8');
  } catch (err) {
    return '';
  }
}

module.exports = homedir;

