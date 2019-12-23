<p align="center">
  <a href="http://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
</p>

# flagged-respawn

A tool for respawning node binaries when special flags are present.
存在特殊标志时重新生成节点二进制文件的工具。

## What is it? 是什么？

Say you wrote a command line tool that runs arbitrary javascript (e.g. task runner, test framework, etc). For the sake of discussion, let's pretend it's a testing harness you've named `testify`.
假设您编写了运行任意JavaScript的命令行工具（例如任务运行器，测试框架等）。 为了便于讨论，我们假设这是一个名为`testify`的测试工具。

Everything is going splendidly until one day you decide to test some code that relies on a feature behind a v8 flag in node (`--harmony`, for example).  Without much thought, you run `testify --harmony spec tests.js`.
一切顺利，直到有一天，您决定测试一些依赖于节点v8标记后面的功能的代码（例如-harmony）。 不用多想，您就可以运行`testify --harmony spec tests.js`。

It doesn't work. After digging around for a bit, you realize this produces a [`process.argv`](http://nodejs.org/docs/latest/api/process.html#process_process_argv) of:
但是这不能如期运行。经过深入，意识到这会使得 [`process.argv`](http://nodejs.org/docs/latest/api/process.html#process_process_argv) 结果为：

`['node', '/usr/local/bin/test', '--harmony', 'spec', 'tests.js']`

Crap. The `--harmony` flag is in the wrong place! It should be applied to the **node** command, not our binary. What we actually wanted was this:
糟糕。`--harmony`参数放在了错误的位置！它应该放在**node**命令后面，而不是我们的二进制文件后面。我们期望是这样的：

`['node', '--harmony', '/usr/local/bin/test', 'spec', 'tests.js']`

Flagged-respawn fixes this problem and handles all the edge cases respawning creates, such as:
Flagged-respawn帮你解决这个问题，同时也解决如下问题：
- Providing a method to determine if a respawn is needed.
- 提供一个方法决定是否需要子进程。
- Piping stderr/stdout from the child into the parent.
- 把子进程的 stderr/stdout 管道到父进程上。
- Making the parent process exit with the same code as the child.
- 父进程的错误退出码跟子进程一样。
- If the child is killed, making the parent exit with the same signal.
- 如果子进程退出，父进程也同样退出。

To see it in action, clone this repository and run `npm install` / `npm run respawn` / `npm run nospawn`.
想看看运行效果，克隆这个仓库然后运行 `npm install` / `npm run respawn` / `npm run nospawn`。

## Sample Usage 用法实例

```js
#!/usr/bin/env node

const flaggedRespawn = require('flagged-respawn');

// get a list of all possible v8 flags for the running version of node
const v8flags = require('v8flags').fetch();

flaggedRespawn(v8flags, process.argv, function (ready, child) {
  if (ready) {
    console.log('Running!');
    // your cli code here
  } else {
    console.log('Special flags found, respawning.');
  }
  if (process.pid !== child.pid) {
    console.log('Respawned to PID:', child.pid);
  }
});

```


## API

### <u>flaggedRespawn(flags, argv, [ forcedFlags, ] callback) : Void</u>

Respawns the script itself when *argv* has special flag contained in *flags* and/or *forcedFlags* is not empty. Because members of *flags* and *forcedFlags* are passed to `node` command, each of them needs to be a node flag or a V8 flag.

#### Forbid respawning

If `--no-respawning` flag is given in *argv*, this function does not respawned even if *argv* contains members of flags or *forcedFlags* is not empty. (This flag is also used internally to prevent from respawning more than once).

#### Parameter:

| Parameter     |  Type  | Description |
|:--------------|:------:|:----------------------------------------------------|
| *flags*       | Array  | An array of node flags and V8 flags which are available when present in *argv*. |
| *argv*        | Array  | Command line arguments to respawn.   |
| *forcedFlags* | Array or String  | An array of node flags or a string of a single flag and V8 flags for respawning forcely. |
| *callback*    | function | A called function when not respawning or after respawned. |

* **<u><i>callback</i>(ready, proc, argv) : Void</u>**

    *callback* function is called both when respawned or not, and it can be distinguished by callback's argument: *ready*. (*ready* indicates whether a process spawned its child process (false) or not (true), but it does not indicate whether a process is a spawned child process or not. *ready* for a spawned child process is true.)

    *argv* is an array of command line arguments which is respawned (when *ready* is false) or is passed current process except flags within *flags* and `--no-respawning` (when *ready* is true).

    **Parameter:**

    | Parameter |  Type   | Description               |
    |:----------|:-------:|:--------------------------|
    | *ready*   | boolean | True, if not respawning and is ready to execute main function. |
    | *proc*    | object  | Child process object if respawned, otherwise current process object. |
    | *argv*    | Array   | An array of command line arguments. |

