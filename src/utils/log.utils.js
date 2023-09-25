const chalk = require('chalk')

exports.error = (msg) => {
    console.error(chalk.red("error : " + msg))
}