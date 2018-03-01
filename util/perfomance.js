const { performance } = require('perf_hooks')

const checkTime = (func) => {

    let startTime

    return Promise.resolve()
        .then(() => {startTime = performance.now() })
        .then(func)
        .then(funcResults => {
            let endTime = performance.now()
            let time = endTime - startTime

            console.log('Время выполнения = ', time, 'ms')

            console.log('funcResults: ', funcResults)
            return funcResults
        })
}
module.exports = checkTime