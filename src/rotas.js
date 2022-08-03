const express = require('express');
const {
    consultarContas,
    cadastrarConta,
    atualizarConta,
    deletarConta,
    consultarSaldo,
    consultarExtrato
} = require('./controladores/contas');

const {
    depositar,
    sacar,
    transferir
} = require('./controladores/transações');

const {
    verificarCampos,
    verificarValor,
    verificarConta,
    verificarSenha,
    verificarSaldo,
    verificarContaESenhaQuery,
} = require('./intermediarios');

const rotaContas = express.Router();
const rotaTransacoes = express.Router();

rotaContas.get('/', consultarContas);
rotaContas.post('/', verificarCampos, cadastrarConta);
rotaContas.delete('/:numeroConta', deletarConta);
rotaContas.put('/:numeroConta/usuario', verificarCampos, atualizarConta);
rotaContas.get('/saldo', verificarContaESenhaQuery, consultarSaldo);
rotaContas.get('/extrato', verificarContaESenhaQuery, consultarExtrato);

rotaTransacoes.use(verificarValor)
rotaTransacoes.post('/depositar', verificarConta, depositar);
rotaTransacoes.post('/sacar', verificarConta, verificarSenha, verificarSaldo, sacar);
rotaTransacoes.post('/transferir', transferir);


module.exports = {
    rotaContas,
    rotaTransacoes
}