const iconv = require('iconv-lite')
const cheerio = require('cheerio')

const request = require('request-promise-native')
const config = require('../config/config')

const loadPage = page => cheerio.load(
    iconv.decode(page, 'win1251'),
    {decodeEntities: false})

const parseItems = ($) => {
    let items = []

    $('.quote').each(function () {
        let text = $('.text', this).html()
        let date = $('.date', this).text()
        let rating = $('.rating', this).text()

        items.push({
            text,
            date: new Date(date),
            rating
        })
    })
    return items
}

const parseNextPageNumber = $ =>  $('a', $('.pager'))[0].attribs.href.split('/')[2]

const getItemsFromPage = (page) => parseItems(loadPage(page))

const getItemsWithPageNumberFromPage = (page) => {
    const $ = loadPage(page)
    const items = parseItems($)
    const nextPageNumber = parseNextPageNumber($)

    return {
        items,
        nextPageNumber
    }
}

let posts = []

const retrieveFirstPage = (lastUpdateData) =>
    request({
        url: config.mainUrl,
        encoding: null
    })
        .then(getItemsWithPageNumberFromPage)
        .then(data => {
            config.secondPage = data.nextPageNumber

            let items = data.items.filter(item => item.date > lastUpdateData)

            posts.push(...items)
            return items
        })

const recLoadFromTo = (url, firstPage, lastPage, pageChange, lastUpdateData) => {
    const recLoad = (page = firstPage) =>
        request({
            url: url + page,
            encoding: null
        })
            .then(getItemsFromPage)
            .then(items => {
                items = items.filter(item => item.date > lastUpdateData)

                console.log('page: ', page)

                if (items.length === 0 || page === lastPage)
                    return posts

                posts.push(...items)

                let changedPageNumber = pageChange(page)

                return recLoad(changedPageNumber)
            })

    return recLoad()
    }



const grabLast = (lastUpdate) => retrieveFirstPage(lastUpdate)
        .then(items => {
            if(items.length === 0) {
                return []
            }
            return recLoadFromTo(config.pagesUrl, config.secondPage, 0, page => --page, lastUpdate)
        })

const grabBest = lastUpdate => recLoadFromTo(config.bestUrl, 1, config.countOfPages, page => ++page, lastUpdate)

module.exports = parser = {
    grabLast,
    grabBest
}