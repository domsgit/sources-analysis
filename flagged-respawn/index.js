var reorder = require('./lib/reorder');
var respawn = require('./lib/respawn');
var remover = require('./lib/remover');

var FORBID_RESPAWNING_FLAG = '--no-respawning';

module.exports = function(flags, argv, forcedFlags, execute) {
  if (!flags) {
    throw new Error('You must specify flags to respawn with.');
  }
  if (!argv) {
    throw new Error('You must specify an argv array.');
  }

  // 当 可选参数forcedFlags 未传入时
  if (typeof forcedFlags === 'function') {
    execute = forcedFlags;
    forcedFlags = [];
  }

  if (typeof forcedFlags === 'string') {
    forcedFlags = [forcedFlags];
  }

  if (!Array.isArray(forcedFlags)) {
    forcedFlags = [];
  }

  // 当不允许开启子进程时
  var index = argv.indexOf(FORBID_RESPAWNING_FLAG);
  if (index >= 0) {
    argv = argv.slice(0, index).concat(argv.slice(index + 1));
    argv = remover(flags, argv);
    execute(true, process, argv);
    return;
  }

  var proc = process;
  var reordered = reorder(flags, argv);
  var ready = JSON.stringify(argv) === JSON.stringify(reordered); // 是否未发生参数重排

  // 如果有forcedFlags，则插入到第二个
  if (forcedFlags.length) {
    reordered = reordered.slice(0, 1)
      .concat(forcedFlags)
      .concat(reordered.slice(1));
    ready = false;
  }

  if (!ready) { // 发生参数重排
    reordered.push(FORBID_RESPAWNING_FLAG);
    // 开启子进程
    proc = respawn(reordered);
  }
  execute(ready, proc, reordered);
};
