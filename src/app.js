const express = require('express')
const path = require('path')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

//define paths for Express config
const publicDir = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//setup handlebars and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use(express.static(publicDir))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Jesutofunmi'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Jesutofunmi'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        help: 'Happy to provide you some help as always',
        name: 'Jesutofunmi'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.status(400).send({ // Use 400 status code for bad requests
            error: 'You must provide an address'
        });
    }

    geocode(req.query.address, (error, data) => {
        if (error) {
            return res.status(500).send({ error }); // Send the actual error message and 500 status
        }

        if (!data) { // Check if data is defined
            return res.status(500).send({ error: 'Geocoding failed: No data returned' });
        }

        forecast(data.latitude, data.longitude, (error, forecastData) => { // Correct order: latitude, longitude
            if (error) {
                return res.status(500).send({ error }); // Send the actual error and 500 status
            }

            if (!forecastData) {
              return res.status(500).send({ error: 'Forecast failed: No data returned' });
            }
            res.send({
                forecast: forecastData,
                location: data.location,
                address: req.query.address
            });
        });
    });
});

// app.get('/weather', (req, res) => {
//     if (!req.query.address) {
//         return res.send({
//             error: 'You must provide an address'
//         })
//     }

//     geocode(req.query.address, (error, data) => {
//         if (error) {
//             return res.send({ error: 'error with geocode' })
//         }

//         forecast(data.longitude, data.latitude, (error, forecastData) => {
//             if (error) {
                
//                 return res.send({ error: 'error with forecast' })
//             }

//             res.send({
//                 forecast: forecastData,
//                 location: data.location,
//                 address: req.query.address

            
//             })

            
//         })
//     })
   
// })

app.get('/help/*', (req, res) => {
    res.render('error', {
        title: '404',
        error: 'Help article not found',
        name: 'Jesutofunmi'
    })
})

app.get('*', (req, res) => {
    res.render('error', {
        title: '404',
        error: 'Page not found',
        name: 'Jesutofunmi'
    })
})

app.listen(port, () => {
    console.log('App is running on port ' + port)
})