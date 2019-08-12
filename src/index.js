#!/usr/bin/env node
let chalk = require('chalk')
let deploy = require('@architect/deploy/cli')
let env = require('@architect/env')
let hydrate = require('@architect/hydrate/cli')
let init = require('@architect/utils/init')
let logs = require('@architect/logs/cli')
let pkg = require('@architect/package/cli')
let repl = require('@architect/repl')
let sandbox = require('@architect/sandbox/src/cli/old')

let before = require('./before')
let help = require('./help')
let version = require('./version')

let cmds = {
  deploy,
  env,
  help,
  hydrate,
  init,
  logs,
  package: pkg,
  repl,
  sandbox,
  version
}

let red = chalk.bgRed.bold.white
let yel = chalk.yellow
let dim = chalk.grey
let pretty = {
  fail(cmd, err) {
    console.log(red(`${cmd} failed!`), yel(err.message))
    console.log(dim(err.stack))
  },
  notFound(cmd) {
    console.log(dim(`Sorry, ${chalk.green.bold('arc ' +cmd)} command not found!`))
  }
}

let args = process.argv.slice(2)

before()

;(async function main() {
  if (args.length === 0) {
    help(args)
  }
  else {
    let cmd = args.shift()
    let opts = args.slice(0)
    if (cmds[cmd]) {
      try {
        await cmds[cmd](opts)
      }
      catch(e) {
        pretty.fail(cmd, e)
        process.exit(1)
      }
    }
    else {
      pretty.notFound(cmd)
      process.exit(1)
    }
  }
})()