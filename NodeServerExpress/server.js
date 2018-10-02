const express = require('express')
const server = express()
const bodyParser = require('body-parser');
const router = require('./routers')

server.use(bodyParser.json());


server.use('/', router)
server.listen(3000, () => console.log('Executando em http://localhost:3000'))
