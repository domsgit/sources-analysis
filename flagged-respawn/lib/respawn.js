var spawn = require('child_process').spawn;

module.exports = function(argv) {
  // 开启子进程
  var child = spawn(argv[0], argv.slice(1), { stdio: 'inherit' });
  // 子进程退出，父进程也退出
  child.on('exit', function(code, signal) {
    process.on('exit', function() {
      /* istanbul ignore if */
      if (signal) {
        process.kill(process.pid, signal);
      } else {
        process.exit(code);
      }
    });
  });
  return child;
};
