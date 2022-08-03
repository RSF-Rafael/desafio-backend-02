const express = require('express');
const { rotaContas, rotaTransacoes } = require('./rotas');

const app = express();

app.use(express.json());
app.use('/contas', rotaContas);
app.use('/transacoes', rotaTransacoes);

app.listen(3000);