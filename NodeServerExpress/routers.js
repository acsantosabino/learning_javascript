const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send('Lista de Clientes')
});

router.post('/', (req, res) => res.send('Novo Cliente\n'+JSON.stringify(req.body)));
router.put('/', (req, res) => res.send('Altera Cliente'));
router.delete('/', (req, res) => res.send('Remove Cliente'));

module.exports = router
