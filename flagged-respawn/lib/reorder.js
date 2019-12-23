var isV8flags = require('./is-v8flags');

// 重排命令行参数，把v8标识的参数放到前面，把其他参数放到最后
module.exports = function(flags, argv) {
  if (!argv) {
    argv = process.argv;
  }
  var args = [argv[1]];
  argv.slice(2).forEach(function(arg) {
    var flag = arg.split('=')[0];
    if (isV8flags(flag, flags)) {
      args.unshift(arg);
    } else {
      args.push(arg);
    }
  });
  args.unshift(argv[0]);
  return args;
};
