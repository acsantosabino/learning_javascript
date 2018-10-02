const express = require('express')
const router = express.Router()
const dbManager = require('./myMongoDB')

router.get('/', (req, res) => {
  if ('cod' in req.query){
    dbManager.selecionarVenda(req.query.cod, res);
  }
  else dbManager.listarVendas(res);
});

router.get('/:cod', (req, res, next) => {
  console.log(req.params.cod);
  dbManager.selecionarVenda(req.params.cod, res);
});

router.post('/', (req, res) => {
  dbManager.incluirVenda(req.body);
  dbManager.listarVendas(res);
});

router.put('/', (req, res) => {
  dbManager.editaVenda(req.body);
  dbManager.selecionarVenda(req.body.codigo, res);
});

router.post('/produtos', (req, res) => {
  if ('cod' in req.query){
    dbManager.incluirProdutos(req.query.cod,req.body);
    dbManager.selecionarVenda(req.query.cod, res);
  } else {
    res.status(417).send("Parametro não informado. Favor adicionar o parametro 'cod' com o codigo da venda.");
  }
});

router.delete('/produtos', (req, res) => {
  if ('cod' in req.query){
    dbManager.excluirProdutos(req.query.cod,req.body);
    dbManager.selecionarVenda(req.query.cod, res);
  } else {
    res.status(417).send("Parametro não informado. Favor adicionar o parametro 'cod' com o codigo da venda.");
  }
});

router.delete('/', (req, res) => {
  dbManager.excluirVenda(req.body.codigo);
  dbManager.listarVendas(res);
});

module.exports = router
