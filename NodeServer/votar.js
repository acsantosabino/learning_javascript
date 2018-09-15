const flow = require('./flow');
const lista = require('./lista');

const hostname = '127.0.0.1';
const port = 3000;

flow.on('VotoSolicitado', function(num, res) {
    lista.votar(num);
    res.setHeader('Cache-Control', 'no-cache'); 
    res.setHeader('Cache-Control', 'no-store');
    res.writeHead(301,
      {Location:'http://'+hostname+':'+port+'/'}
    );
    res.end();
});