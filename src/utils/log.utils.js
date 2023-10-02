const chalk = require('chalk')

exports.info = (msg) => {
    console.error(chalk.blue("info : " + msg))
}

exports.error = (msg) => {
    console.error(chalk.red("error : " + msg))
}