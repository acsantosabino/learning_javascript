var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.close();
});


function listarVendas() {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("comercio");
        dbo.collection("vendas").find({}).toArray(function (err, result) {
            if (err) throw err;
            console.log(JSON.stringify(result));
            db.close();
        });
    });
}

function incluirVenda(venda) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("comercio");
        dbo.collection("vendas").insertOne(venda, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
}
function excluirVenda(cod) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("comercio");
        var myquery = { codigo: cod };
        dbo.collection("vendas").deleteOne(myquery, function (err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            db.close();
        });
    });
}
function incluirProdutos(vendaCod, newProdutos) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("comercio");
        var myquery = { codigo: vendaCod };
        var newvalues = { produtos: { $concat : newProdutos} };
        dbo.collection("vendas").updateMany(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
            db.close();
        });
    });
}
listarVendas();
incluirVenda({ "codigo": "C2V002", "vendedor": "Josias", "valor": 11 });
listarVendas();
excluirVenda("C2V002");
listarVendas();
incluirProdutos("C2V001",[{"nome":"arroz", "preco":11.50, "qnt":2},{"nome":"feijão","preco":3.80,"qnt":3},{"nome":"almondega","preco":1.30,"qnt":10}]);
incluirProdutos("C2V001",[{"nome":"microondas", "preco":150, "qnt":1}]);
// console.log(JSON.stringify(listarVendas()));
// votar(13);
// console.log(JSON.stringify(listarVendas()));
// console.log(JSON.stringify(listarVendas()));
/*
module.exports = {
    listarVendas,
    incluirVenda,
    excluirVenda,
    votar
}*/