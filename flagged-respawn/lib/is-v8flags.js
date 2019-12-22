// 判断是否是v8标识
function isV8flags(flag, v8flags) {
  return v8flags.indexOf(replaceSeparatorsFromDashesToUnderscores(flag)) >= 0;
}

// 把-替换成_
function replaceSeparatorsFromDashesToUnderscores(flag) {
  var arr = /^(-+)(.*)$/.exec(flag);
  if (!arr) {
    return flag;
  }
  return arr[1] + arr[2].replace(/\-/g, '_');
}

module.exports = isV8flags;
