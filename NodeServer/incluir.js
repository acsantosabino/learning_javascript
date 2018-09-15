const flow = require('./flow');
const lista = require('./lista');

flow.on('AcceptInclude', function(cand, res) {
    lista.incluirCandidatos(cand);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.write(JSON.stringify(lista.lerCandidatos()));
    res.end();
});