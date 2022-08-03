const contas = require('../bancodedados');
const { encontrarContaPeloNumero } = require('./contas');

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    const contaEncontrada = encontrarContaPeloNumero(numero_conta);
    contaEncontrada.saldo += valor;

    const momentoAtual = new Date().toString();
    contas.depositos.push({
        data: momentoAtual,
        numero_conta,
        valor
    });
    return res.status(201).json();
};

const sacar = (req, res) => {
    const { numero_conta, valor } = req.body;

    const contaEncontrada = encontrarContaPeloNumero(numero_conta);
    contaEncontrada.saldo -= valor;

    const momentoAtual = new Date().toString();
    contas.saques.push({
        data: momentoAtual,
        numero_conta,
        valor
    });

    return res.status(201).json();
};

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_destino || !numero_conta_origem || !senha)
        return res.status(400).json({ mensagem: 'O número da conta de origem, da conta de destino e a senha são obrigatórios!' });

    const contaOrigem = encontrarContaPeloNumero(numero_conta_origem);
    if (!contaOrigem)
        return res.status(404).json({ mensagem: 'Conta de origem não encontrada!' });

    const contaDestino = encontrarContaPeloNumero(numero_conta_destino);
    if (!contaDestino)
        return res.status(404).json({ mensagem: 'Conta de destino não encontrada!' });

    if (contaOrigem.usuario.senha !== senha)
        return res.status(403).json({ mensagem: 'Senha inválida!' });

    if (contaOrigem.saldo < valor)
        return res.status(403).json({ mensagem: 'Saldo insuficiente!' });

    contaOrigem.saldo -= valor;
    contaDestino.saldo += valor;

    const momentoAtual = new Date().toString();
    contas.transferencias.push({
        data: momentoAtual,
        numero_conta_origem,
        numero_conta_destino,
        valor
    });

    return res.status(201).json(contas);
};

module.exports = {
    depositar,
    sacar,
    transferir
}