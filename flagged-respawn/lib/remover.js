var isV8flags = require('./is-v8flags');

module.exports = function(flags, argv) {
  var args = argv.slice(0, 1);
  for (var i = 1, n = argv.length; i < n; i++) {
    var arg = argv[i];
    var flag = arg.split('=')[0];
    if (!isV8flags(flag, flags)) { // 移除掉v8标识参数
      args.push(arg);
    }
  }
  return args;
};
