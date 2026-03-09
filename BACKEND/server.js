const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// Serve os arquivos da pasta /public (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Dados dos produtos
let db_products = [
    { photo: "img/big-mac.png", name: "Big Mac", price: 13.99, prepTime: 10 },
    { photo: "img/mc-chicken.png", name: "Mc Chicken", price: 8.99, prepTime: 12 },
    { photo: "img/fries.png", name: "Batata frita", price: 6.00, prepTime: 5 },
    { photo: "img/cola.png", name: "Coca-Cola", price: 12.00, prepTime: 2 }
];

// Rota para buscar produtos
app.get('/api/products', (req, res) => {
    res.json(db_products);
});

// Rota ÚNICA para finalizar pedido com lógica de pagamento
app.post('/api/orders', (req, res) => {
    const { pagamento, total, itens } = req.body; // Pega os dados do frontend

    console.log("--- NOVO PEDIDO RECEBIDO ---");
    console.log(`Valor Total: R$ ${total}`);
    console.log(`Método de Pagamento: ${pagamento}`);
    console.log(`Itens:`, itens);

    // Simulação da resposta do Gateway de Pagamento
    if (pagamento === 'cartao_app') {
        res.json({ 
            message: "Pagamento aprovado pelo Gateway! Pedido enviado para a Hot Zone.", 
            status: "Produção Liberada" 
        });
    } else if (pagamento === 'pix') {
        res.json({ 
            message: "Aguardando confirmação do Pix... Seu pedido entrará em produção após o pagamento.", 
            status: "Pendente" 
        });
    } else {
        res.json({ 
            message: "Pedido confirmado! Prepare o dinheiro para a entrega.", 
            status: "Aguardando o Motoboy" 
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor FlashFood rodando em http://localhost:${PORT}`);
});