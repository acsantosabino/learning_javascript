const flow = require('./flow');
const http = require('http');
const lista = require('./lista');
const url = require('url');
var qs = require('querystring');

require('./votar');
require('./login');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  let body = [];
  let auth = req.headers['authorization'];
  if(req.url == '/'){
    switch (req.method) {
      //on get
      case 'GET':
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.write(JSON.stringify(lista.lerCandidatos()));
        res.end();
        break;
      //on post
      case 'POST':
        if(auth){
          req.on('error', (err) => {
            console.error(err);
          }).on('data', (chunk) => {
            body.push(chunk);
          }).on('end', () => {
            let json = JSON.parse(Buffer.concat(body).toString());
            flow.emit('IncludeLogin', auth,json,res);
          });
        } else flow.emit('ErrorLogin','Você precisa de um usuario.', res);
        break;
      //on deleteSenha
      case 'DELETE':
        if(auth){
          req.on('error', (err) => {
            console.error(err);
          }).on('data', (chunk) => {
            body.push(chunk);
          }).on('end', () => {
            let json = JSON.parse(Buffer.concat(body).toString());
            flow.emit('ExcludeLogin', auth,json.num,res);
          });
        } else flow.emit('ErrorLogin','Você precisa de um usuario.', res);
        break;

      default:
        break;
    }
  } else if(url.parse(req.url).pathname == '/votar') {
    flow.emit('VotoSolicitado',url.parse(req.url, true).query.num,res);
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});