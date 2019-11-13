const fs = require('fs')
const chalk = require('chalk')

// 构建目标
const targets = (exports.targets = fs.readdirSync('packages').filter(f => { // 查找packages目录下的目录及文件
  if (!fs.statSync(`packages/${f}`).isDirectory()) { // 排除掉不是目录的文件
    return false
  }
  // 排除掉目录下的package.json中private的包和没有buildOptions的包
  const pkg = require(`../packages/${f}/package.json`)
  if (pkg.private && !pkg.buildOptions) {
    return false
  }
  return true
}))

/**
 * 模糊匹配目标，可选需要构建的目标对象，单个目标或是所有匹配到的多个目标
 * @param {Array} partialTargets 部门目标
 * @param {Boolean} includeAllMatching 是否包含所有匹配
 */
exports.fuzzyMatchTarget = (partialTargets, includeAllMatching) => {
  const matched = []
  partialTargets.forEach(partialTarget => {
    for (const target of targets) {
      if (target.match(partialTarget)) {
        matched.push(target)
        if (!includeAllMatching) {
          break
        }
      }
    }
  })
  if (matched.length) {
    return matched
  } else { // 未匹配到构建目标报错退出
    console.log()
    console.error(
      `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(
        `Target ${chalk.underline(partialTargets)} not found!`
      )}`
    )
    console.log()

    process.exit(1)
  }
}
