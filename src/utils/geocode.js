const request = require('request')

const geocode = (address, callback) => {
    const url = 'https://api.positionstack.com/v1/forward?access_key=af4d83230f0ee84ffcd256d97913d588&query=' + address + '&limit=1'

    request({ url: url, json: true }, (error, response) => {
        if (error) { //network error
            callback('Unable to connect to location services!', undefined)

        } else if (response.body.error) { //API error
            callback(response.body.error.message, undefined) //Use API's error message
        
        } else if (!response.body.data || response.body.data.length === 0) {
            callback('Unable to find location. Try another search.', undefined)

        } else {
            
            callback(undefined, {
                longitude: response.body.data[0].longitude,
                latitude: response.body.data[0].latitude,
                location: response.body.data[0].label
            })
        }
    })

   
}

module.exports = geocode