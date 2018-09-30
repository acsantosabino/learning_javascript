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
        dbo.collection("vendas").find({}).toArray(function (err, res) {
            if (err) throw err;
            console.log(JSON.stringify(res));
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
function excluirVenda(vendaCod) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("comercio");
        var myquery = { codigo: vendaCod };
        dbo.collection("vendas").deleteOne(myquery, function (err, res) {
            if (err) throw err;
            console.log("1 document deleted");
            db.close();
        });
    });
}
function editaVenda(venda){
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("comercio");
        var myquery = { codigo: venda.codigo };
        var newvalues = { $set: venda };
        dbo.collection("vendas").updateMany(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
            db.close();
        });
    });
}
function incluirProdutos(vendaCod, newProdutos) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("comercio");
        var myquery = { codigo: vendaCod };
        var newvalues = { $addToSet: { produtos : { $each: newProdutos} }};
        dbo.collection("vendas").updateMany(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
            db.close();
        });
    });
}
function excluirProdutos(vendaCod, newProdutos) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("comercio");
        var myquery = { codigo: vendaCod };
        var newvalues = { $pullAll: { produtos : newProdutos }};
        dbo.collection("vendas").updateMany(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
            db.close();
        });
    });
}
function calcValorVenda(vendaCod) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("comercio");
        var myquery = { $match : { codigo: vendaCod }};
        // var newvalues = { $pullAll: { produtos : newProdutos }};
        dbo.collection("vendas").aggregate(
            [{ $match : { codigo: vendaCod }},
            {$unwind:"$produtos"},
            { $group : {
                _id : "$_id",
                codigo : { $last : "$codigo"},
                valor : { $sum : { $multiply : ['$produtos.qnt','$produtos.preco']}}
            }}]
            ).toArray(function(err, res) {
                if (err) throw err;
                console.log(JSON.stringify(res));
                editaVenda(res[0]);
                db.close();
        });
    });
}
// listarVendas();
// incluirVenda({ "codigo": "C2V002", "vendedor": "Josias", "valor": 11 });
// listarVendas();
// excluirVenda("C2V002");
// listarVendas();
// incluirProdutos("C2V001",[{"nome":"arroz","preco":11.5,"qnt":2},{"nome":"feijão","preco":3.8,"qnt":3},{"nome":"almondega","preco":1.3,"qnt":10}]);
// listarVendas();
// excluirProdutos("C2V001",[{"nome":"arroz","preco":11.5,"qnt":2},{"nome":"feijão","preco":3.8,"qnt":3},{"nome":"almondega","preco":1.3,"qnt":10}]);
// calcValorVenda("C2V001");
// editaVenda({"codigo":"C2V001","valor":10,"produtos":[{"nome":"arroz","preco":11.5,"qnt":2},{"nome":"feijão","preco":3.8,"qnt":3},{"nome":"almondega","preco":1.3,"qnt":10}]})
// listarVendas();
// editaVenda({"codigo":"C2V001","valor":11,"produtos":[{"nome":"microondas","preco":150,"qnt":1}]})
// listarVendas();

module.exports = {
    listarVendas,
    incluirVenda,
    excluirVenda,
    editaVenda,
    incluirProdutos,
    excluirProdutos,
    calcValorVenda
}