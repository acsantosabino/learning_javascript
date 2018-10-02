var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/comercio";

/* Cria base de dados se ela não existir */
MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.close();
});

/* Lista todas as vendas registradas na base de dados */
function listarVendas(res) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("comercio");
        var vendas = dbo.collection("vendas").find({}).toArray(function (err, obj) {
            if (err) throw err;
            res.send(obj);
            db.close();
        });
    });
}

/* Busca venda na base de dados pelo codigo */
function selecionarVenda(vendaCod, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("comercio");
        var myquery = { codigo: vendaCod };
        dbo.collection("vendas").find(myquery).toArray(function (err, obj) {
            if (err) throw err;
            res.send(obj);
            db.close();
        });
    });
}

/* Adiciona nova venda à base de dados */
function incluirVenda(venda) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("comercio");
        dbo.collection("vendas").insertOne(venda, function (err, obj) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
}

/* Remove venda da base de dados */
function excluirVenda(vendaCod) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("comercio");
        var myquery = { codigo: vendaCod };
        dbo.collection("vendas").deleteOne(myquery, function (err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            db.close();
        });
    });
}

/* Edita venda da base de dados */
function editaVenda(venda){
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("comercio");
        var myquery = { codigo: venda.codigo };
        var newvalues = { $set: venda };
        if( 'produtos' in venda){ delete venda['produtos']}
        dbo.collection("vendas").updateMany(myquery, newvalues, function (err, obj) {
            if (err) throw err;
            calcValorVenda(venda.codigo);
            db.close();
        });
    });
}

/* Adiciona novos produtos a uma venda ja registrada na base de dados */
function incluirProdutos(vendaCod, newProdutos) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("comercio");
        var myquery = { codigo: vendaCod };
        var newvalues = { $addToSet: { produtos : { $each: newProdutos} }};
        dbo.collection("vendas").updateMany(myquery, newvalues, function (err, obj) {
            if (err) throw err;
            calcValorVenda(vendaCod);
            db.close();
        });
    });
}

/* Remove produtos de uma venda ja registrada na base de dados */
function excluirProdutos(vendaCod, newProdutos) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("comercio");
        var myquery = { codigo: vendaCod };
        var newvalues = { $pullAll: { produtos : newProdutos }};
        dbo.collection("vendas").updateMany(myquery, newvalues, function (err, obj) {
            if (err) throw err;
            calcValorVenda(vendaCod);
            db.close();
        });
    });
}

/* Recalcula valor total de uma venda ja registrada na base de dados */
function calcValorVenda(vendaCod) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("comercio");
        var myquery = { $match : { codigo: vendaCod }};
        dbo.collection("vendas").aggregate(
            [{ $match : { codigo: vendaCod }},
            {$unwind:"$produtos"},
            { $group : {
                _id : "$_id",
                codigo : { $last : "$codigo"},
                valor : { $sum : { $multiply : ['$produtos.qnt','$produtos.preco']}}
            }}]
            ).toArray(function(err, obj) {
                if (err) throw err;
                editaVenda(obj[0]);
                db.close();
        });
    });
}

module.exports = {
    listarVendas,
    selecionarVenda,
    incluirVenda,
    excluirVenda,
    editaVenda,
    incluirProdutos,
    excluirProdutos,
    calcValorVenda
}