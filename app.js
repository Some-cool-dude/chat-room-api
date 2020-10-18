const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');

const message = require('./models/message');
const swaggerDocument = require('./swagger.json');


if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const port =  process.env.PORT || 8080;

const app = express();

const url = process.env.MONGODB_URI;
const connectOptions = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true };

mongoose.connect(url, connectOptions)
    .then(() => console.log('Mongo database connected'))
    .catch(err => console.log(err));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/api/messages/list/:page', (req, res) => {
    const page = parseInt(req.params.page);
    const quantityOnPage = 10;
    if(isNaN(page) || page < 0) {
        res.sendStatus(404);
    }
    else {
        message.getPaged(page, quantityOnPage)
        .then(data => {
            if (data.length === 0) return res.sendStatus(404);
            res.json(data);
        })
        .catch(err => {
            res.status(500).json(err);
       });
    }
});

app.get('/api/messages/single/:id', (req, res) => {
    message.findById(req.params.id)
    .then(data => {
        if (!data) return res.sendStatus(404);
        res.json(data);
    })
    .catch(err => {
        if (err.name === "CastError") return res.sendStatus(404);
        res.status(500).json(err);
   });
});

app.post('/api/messages/new', (req, res) => {
    if (!req.body) return res.sendStatus(400);
    message.insert(req.body)
    .then(data => {
        res.status(201).json(data);
    })
    .catch(err => {
        if (err._message === "Message validation failed") return res.status(400).json(err);
        res.status(500).json(err);
    });
});

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});