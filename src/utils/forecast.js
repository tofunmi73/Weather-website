const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'https://my.meteoblue.com/packages/current?apikey=zB0XOglGHI4pYuRb&lat=' + latitude + '&lon=' + longitude + '&asl=320&format=json'

    request({ url: url, json: true }, (error, response) => {
        if (error) { //network error
            callback('Unable to connect to location services!', undefined)

        } else if (response.body.error) { //api error
            callback(response.body.error.message, undefined) //Use API's error message

        } else if (!response.body.data_current || response.body.data_current.length === 0) {
            callback('Unable to find location. Try another search.', undefined)

        } else {
            callback(undefined, 'It is currently ' + response.body.data_current.temperature + ' degrees out. With winds of about ' + response.body.data_current.windspeed)
        }
    })
}

module.exports = forecast