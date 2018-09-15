const flow = require('./flow');
const lista = require('./lista');

flow.on('AcceptExclude', function(num, res) {
    lista.excluirCandidatos(num);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.write(JSON.stringify(lista.lerCandidatos()));
    res.end();
});