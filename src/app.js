const path = require('path')
const express = require('express')
const hbs = require('hbs')
const app = express()
const geocode = require('./utils/Geocode.js')
const weather = require('./utils/Weatherstack.js')
const request = require('postman-request')

const publicDirectoryPath = path.join(__dirname,'../public')
const viewspath = path.join(__dirname,'../customviews/views')
const partialspath = path.join(__dirname,'../customviews/partials')
console.log(publicDirectoryPath)

app.use(express.static(publicDirectoryPath))
app.set('view engine', 'hbs')
app.set('views', viewspath)    //sets to look for custom made path.by default it looks in views folder.currently looking in customviews folder
hbs.registerPartials(partialspath)
// app.get('',(req, res)=>{
//     res.send('<h1>Hello express</h1>')
// })
// app.get('/help',(req, res)=>{
//     res.send('Help page')
// })
// app.get('/about',(req, res)=>{
//     res.send([{
//         name: 'Sonu',
//     },{
//         name: 'Monu'
//     }])
// })
// app.get('/weather',(req, res)=>{
//     res.send({
//         climate: 'winter',
//         location: 'Mumbai'
//     })
// })
app.get('',(req, res)=>{
    res.render('index',{
        title: 'Weather app',
        name: 'Sonu'
    })
})
app.get('/about',(req, res)=>{
    res.render('about',{
        title: 'About Me',
        name: 'Sonu'
    })
})
app.get('/help',(req, res)=>{
    res.render('help',{
        helptext: 'This is some helpful text',
        title: 'help',
        name: 'Sonu'
    })
})
app.get('/help/*', (req, res)=>{
    res.render('error', {
        title: 'My 404 error page',
        name: 'Sonu',
        errorMessage: 'Help page not found'
    })
})
app.get('/weather',(req, res)=>{
    if(!req.query.address){
        return res.send({
            error: 'You must provide an address'
        })
    }
    geocode(req.query.address,(error, {latitude, longitude,location}={})=>{
        if(error){
            return res.send({error})
        }
        weather(latitude, longitude,(error, data)=>{
            if(error){
                return res.send({error})
            }
            res.send({
                forecast: data,
                location,
                address: req.query.address
            })
        })
    })
    // res.send({
    //     forecast: 'It is sunny day',
    //     location: 'Mumbai',
    //     address: req.query.address
    // })
})
app.get('/products',(req, res)=>{
    if(!req.query.search){
        return res.send({
            error: 'You must enter a search'
        })
    }
    res.send({
        product:[]
    })
})
app.get('*', (req, res)=>{
    res.render('error',{
        title: 'My 404 error page',
        name: 'Sonu',
        errorMessage: 'Page not found'
    })
})
app.listen(3000, ()=>{
    console.log('server is running on port 3000')
})