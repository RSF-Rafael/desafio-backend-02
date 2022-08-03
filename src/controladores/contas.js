const contas = require('../bancodedados');
let listaDeContas = contas.contas;
let numeroDaConta = 0;

const encontrarContaEmailOuCpf = (email, cpf) => {
    const contaEncontrada = listaDeContas.find(conta => {
        return conta.usuario.email === email || conta.usuario.cpf === cpf
    })
    return contaEncontrada;
}

const encontrarContaPeloNumero = (numero) => {
    const contaEncontrada = listaDeContas.find(conta => conta.numero === numero);
    return contaEncontrada;
};

const consultarContas = (req, res) => {
    const { senha_banco } = req.query;

    if (senha_banco !== contas.banco.senha)
        res.status(400).json({ mensagem: "A senha do banco informada é inválida!" });

    return res.json(listaDeContas);
};

const cadastrarConta = (req, res) => {
    numeroDaConta++;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (encontrarContaEmailOuCpf(email, cpf))
        return res.status(400).json({ mensagem: 'Já existe uma conta com o cpf ou e-mail informado!' });

    const conta = {
        numero: numeroDaConta.toString(),
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }

    listaDeContas.push(conta);

    return res.status(201).json();
};

const atualizarConta = (req, res) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!encontrarContaPeloNumero(numeroConta))
        return res.status(404).json({ mensagem: 'Conta não encontrada!' });

    if (encontrarContaEmailOuCpf(email, cpf))
        return res.status(400).json({ mensagem: 'Já existe uma conta com o cpf ou e-mail informado!' });

    const contaEncontrada = listaDeContas.find(conta => {
        return conta.numero === numeroConta;
    });

    contaEncontrada.usuario.nome = nome;
    contaEncontrada.usuario.cpf = cpf;
    contaEncontrada.usuario.data_nascimento = data_nascimento;
    contaEncontrada.usuario.telefone = telefone;
    contaEncontrada.usuario.email = email;
    contaEncontrada.usuario.senha = senha;

    return res.status(204).json();
}

const deletarConta = (req, res) => {
    const { numeroConta } = req.params;

    if (!encontrarContaPeloNumero(numeroConta))
        return res.status(404).json({ mensagem: 'Conta não encontrada!' });

    const indexConta = listaDeContas.findIndex(conta => conta.numero === numeroConta);

    if (listaDeContas[indexConta].saldo !== 0)
        return res.status(400).json({ mensagem: 'A conta só pode ser removida se o saldo for zero!' });

    listaDeContas = listaDeContas.filter(conta => {
        return conta.numero !== numeroConta;
    });

    return res.status(204).json();

};

const consultarSaldo = (req, res) => {
    const { numero_conta } = req.query;
    const contaEncontrada = encontrarContaPeloNumero(numero_conta);
    return res.status(200).json({ saldo: contaEncontrada.saldo })
}

const consultarExtrato = (req, res) => {
    const { numero_conta } = req.query;

    const depositos = contas.depositos.filter(deposito => deposito.numero_conta === numero_conta);
    const saques = contas.saques.filter(saque => saque.numero_conta === numero_conta);
    const transferenciasEnviadas = contas.transferencias.filter(transferencia => transferencia.numero_conta_origem === numero_conta);
    const transferenciasRecebidas = contas.transferencias.filter(transferencia => transferencia.numero_conta_destino === numero_conta);

    const extrato = {
        depositos,
        saques,
        transferenciasEnviadas,
        transferenciasRecebidas
    }

    return res.json(extrato)
};

module.exports = {
    consultarContas,
    cadastrarConta,
    atualizarConta,
    deletarConta,
    encontrarContaPeloNumero,
    consultarSaldo,
    consultarExtrato
}