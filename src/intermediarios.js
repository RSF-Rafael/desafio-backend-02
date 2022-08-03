const contas = require('./bancodedados');
const { encontrarContaPeloNumero } = require('./controladores/contas')

const verificarCampos = (req, res, next) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha)
        return res.status(400).json({ mensagem: 'Informe todos os campos obrigatórios!' })

    next()
};

const verificarValor = (req, res, next) => {
    const { valor } = req.body;

    if (valor <= 0)
        return res.status(400).json({ mensagem: 'O valor do depósito precisa ser maior que 0!' });

    if (!valor)
        return res.status(400).json({ mensagem: 'O valor é obrigatório!' });

    next();
}

const verificarConta = (req, res, next) => {
    const { numero_conta } = req.body;

    if (!numero_conta)
        return res.status(400).json({ mensagem: 'O número da conta é obrigatório!' });

    const contaEncontrada = encontrarContaPeloNumero(numero_conta);
    if (!contaEncontrada)
        return res.status(404).json({ mensagem: 'Conta não encontrada!' });

    next();
}

const verificarSenha = (req, res, next) => {
    const { senha, numero_conta } = req.body;

    if (!senha)
        return res.status(400).json({ mensagem: 'A senha é obrigatória!' });

    const contaEncontrada = encontrarContaPeloNumero(numero_conta);

    if (contaEncontrada.usuario.senha !== senha)
        return res.status(403).json({ mensagem: 'Senha inválida!' });

    next();
};

const verificarSaldo = (req, res, next) => {
    const { valor, numero_conta } = req.body;

    const contaEncontrada = encontrarContaPeloNumero(numero_conta);
    if (contaEncontrada.saldo < valor)
        return res.status(403).json({ mensagem: 'Saldo insuficiente!' });

    next();
};

const verificarContaESenhaQuery = (req, res, next) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha)
        return res.status(400).json({ mensagem: 'A senha e o número da conta são obrigatórios' });

    const contaEncontrada = encontrarContaPeloNumero(numero_conta);
    if (!contaEncontrada)
        return res.status(404).json({ mensagem: 'Conta não encontrada!' });

    if (contaEncontrada.usuario.senha !== senha)
        return res.status(403).json({ mensagem: 'Senha inválida!' });

    next();
};

module.exports = {
    verificarCampos,
    verificarValor,
    verificarConta,
    verificarSenha,
    verificarSaldo,
    verificarContaESenhaQuery
}