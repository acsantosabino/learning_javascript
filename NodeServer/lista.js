const path = require('path');
const fs = require('fs');

var listaPath = path.resolve(__dirname,'candidatos.json');

function lerCandidatos(){
    var candidatos = {};
    candidatos = JSON.parse(fs.readFileSync(listaPath,{flag: 'r+', encoding: 'utf-8'}));
    return candidatos;
}

function incluirCandidatos(cand){
    var candidatos = lerCandidatos();
    var count = 0;
    for (ind in candidatos){
        if (candidatos[ind].num == cand.num){
            count+=1;
        }
    }
    if(count==0){
        candidatos.push(cand);
    }
    fs.writeFileSync(listaPath, JSON.stringify(candidatos));
}
function excluirCandidatos(num){
    var candidatos = lerCandidatos();
    for (ind in candidatos){
        if (candidatos[ind].num == num){
            candidatos.splice(ind,1);
        }
    }
    fs.writeFileSync(listaPath, JSON.stringify(candidatos));
}
function votar(num){
    var candidatos = lerCandidatos();
    for (ind in candidatos){
        if (candidatos[ind].num == num){
            candidatos[ind].votos += 1;
        }
    }
    fs.writeFileSync(listaPath, JSON.stringify(candidatos));
}
// console.log(JSON.stringify(lerCandidatos()));
// incluirCandidatos({"nome":"Lula", "num":13, "votos":0});
// console.log(JSON.stringify(lerCandidatos()));
// votar(13);
// console.log(JSON.stringify(lerCandidatos()));
// excluirCandidatos(13);
// console.log(JSON.stringify(lerCandidatos()));

module.exports = {
    lerCandidatos,
    incluirCandidatos,
    excluirCandidatos,
    votar
}