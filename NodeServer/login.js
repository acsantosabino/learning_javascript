const flow = require('./flow');
require('./incluir');
require('./excluir');

function testLogin(auth, res){
    var ans = false

    var tmp = auth.split(' ');   // Split on a space, the original auth looks like  "Basic Y2hhcmxlczoxMjM0NQ==" and we need the 2nd part

    var buf = new Buffer(tmp[1], 'base64'); // create a buffer and tell it the data coming in is base64
    var plain_auth = buf.toString();        // read it back out as a string

    // At this point plain_auth = "username:password"

    var creds = plain_auth.split(':');      // split on a ':'
    var usuario = creds[0];
    var senha = creds[1];

    if(usuario != "admin") {
        flow.emit('ErrorLogin','Usuario nao registrado', res);
    }
    else if(senha != "123") {
        flow.emit('ErrorLogin','Senha incorreta', res);
    }
    else {
        ans = true;
    }
    return ans;
}

flow.on('IncludeLogin', function(login,candidato, res) {
    if(testLogin(login, res)){
        flow.emit('AcceptInclude',candidato, res);
    }
});

flow.on('ExcludeLogin', function(login,num, res) {
    if(testLogin(login, res)){
        flow.emit('AcceptExclude', num, res);
    }
});

flow.on('ErrorLogin', function(err, res) {
    console.log('Erro: '+err);
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
    res.write('Erro: '+err);
    res.end();
});