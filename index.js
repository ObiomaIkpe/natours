const fs = require('fs');
const express = require('express');
const { stringify } = require('querystring');

const app = express();
app.use(express.json())

// app.get('/', (req, res) => {
//     res.status(200).send('hello')
// })





const tours = JSON.parse(fs.readFileSync(`${__dirname}/json-simple.json`))

app.get('/api/v1/tours', (req,res) => {
res.status(200).json({
    status:'success',
    results: tours.length,
        tours: tours
    
})
})

app.post('/api/v1/tours', (req,res) => {

    const newId = tours[tours.length - 1].id + 1;
const newTour = Object.assign({id : newId}, req.body)
tours.push(newTour)

    fs.writeFile(`${__dirname}/json-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            data:{
                tour: newTour
            }
        })
    })
})

app.get('/api/v1/tours/:id', (req,res) => {
    console.log(req.params)
    res.status(200).json({
        status:'success'
    })
})


//const port = 7000;

app.listen(port, () => { console.log('listening on port 7000')
})