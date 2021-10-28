const PORT = process.env.PORT ||8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')

const app = express()

const newspapers = [
    {
        name: 'spiegel',
        address: 'https://www.spiegel.de/thema/klimawandel/',
        base: ''
    },
    {
        name: 'welt',
        address: 'https://www.welt.de/wissenschaft/umwelt/',
        base: 'https://www.welt.de'
    },
    {
        name: 'faz',
        address: 'https://www.faz.net/aktuell/wissen/erde-klima/',
        base: ''
    },
    {
        name: 'sueddeutsche',
        address: 'https://www.sueddeutsche.de/thema/Klimawandel',
        base: ''
    },
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $("a:contains('Klima')", html).each(function () {
                const title = $(this).text().replace(/\n/g, '').replace(/\s+/g, ' ').trim()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })
        })
})

app.get('/', (req, res) => {
    res.json('Welcome to germanclimatechangeAPI by Gilchus')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            specArticles = []

            $("a:contains('Klima')", html).each(function () {
                const title = $(this).text().replace(/\n/g, '').replace(/\s+/g, ' ').trim()
                const url = $(this).attr('href')

                specArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log('server running on PORT ' + PORT))