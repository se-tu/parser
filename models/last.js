const db = require('./base_models')
const parser = require('../util/parser')

const getLastUpdateInTable = tableName => () => db[tableName].findAll({
    order: [['last_update', 'DESC']],
    limit: 1,
    raw: true
})
    .then(dataFromDb => dataFromDb[0] ? dataFromDb[0].last_update : new Date(0))
    .then(data => {
        console.log('last update from ', tableName, ' : ', data)
        return data
    })

const saveDataInTable = (tableName, logger) => data => db[tableName].create({
        text: data.text,
        date: data.date,
        last_update: Date.now(),
        rating: date.rating
    })
        .then(result => {
            logger(tableName)
            return result
        })

const last = {

    initDb: () => {
        const clearPosts = () => db.last.destroy({
            where: {},
            truncate: true
        })

        const saveMethod = params => {
            return db.last.create(params)
        }

        const grabAndSavePosts = () => parser.grabLast(saveMethod)

        const waitWhileSaved = savesPromises => Promise.all(savesPromises)

        return clearPosts()
            .then(grabAndSavePosts)
            .then(waitWhileSaved)

    },

    loadLast: () => {
        const getLastUpdate = getLastUpdateInTable('last')

        let count = 0

        const save = saveDataInTable('last', (tableName) => console.log(tableName, 'count: ', ++count))

        return getLastUpdate()
            .then(parser.grabLast)
            .then(items => Promise.all(items.map(save)))
            .then(saved => saved.length)
    },

    loadBest: () => {
        const getLastUpdate = getLastUpdateInTable('best')

        let count = 0

        const save = saveDataInTable('best', (tableName) => console.log(tableName, 'count: ', ++count))

        return getLastUpdate()
            .then(parser.grabBest)
            .then(items => Promise.all(items.map(save)))
            .then(items => items.length)
    }
}

module.exports = last