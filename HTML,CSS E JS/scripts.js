var products = [
        {
            "photo": "img/big-mac.png",
            "name": "Big Mac",
            "price": 13.99,
            "active": false,
            "quantity": 1
        },
        {
            "photo": "img/mc-chicken.png",
            "name": "Mc Chicken",
            "price": 8.99,
            "active": false,
            "quantity": 1
        },
        {
            "photo": "img/double-cb.png",
            "name": "Cheese Burger Duplo",
            "price": 8.99,
            "active": false,
            "quantity": 1
        },
        {
            "photo": "img/fries.png",
            "name": "Batata frita",
            "price": 6.00,
            "active": false,
            "quantity": 1
        },
        {
            "photo": "img/nuggets.png",
            "name": "Mc Nuggets",
            "price": 7.49,
            "active": false,
            "quantity": 1
        },
        {
            "photo": "img/salad.png",
            "name": "Salada",
            "price": 10.79,
            "active": false,
            "quantity": 1
        },
        {
            "photo": "img/cola.png",
            "name": "Coca-Cola",
            "price": 12.00,
            "active": false,
            "quantity": 1
        },
        {
            "photo": "img/lipton.png",
            "name": "Chá gelado",
            "price": 8.49,
            "active": false,
            "quantity": 1
        },
        {
            "photo": "img/water.png",
            "name": "Água sem gás",
            "price": 4.49,
            "active": false,
            "quantity": 1
        }
];

const SelfServiceMachine = {
    data() {
        return {
            products: [], 
            loading: true,
            paymentMethod: 'cartao_app',
            isUltraFast: false 
        }
    },
    methods: {
        // Remover produtos
        removeProduct(product){
            product.active = false;
            product.quantity = 1;
        },
        //Cancelar o pedido
        cancelOrder(){
            if(confirm("Deseja realmente limpar todo o seu pedido?")){
                this.products.forEach(p => {
                    p.active = false;
                    p.quantity = 1;
                });
            }
        },
        async loadProducts() {
            try {
                const response = await fetch('/api/products');
                const data = await response.json();
                // Prepara os produtos
                this.products = data.map(p => ({ ...p, active: false, quantity: 1 }));
            } catch (e) { 
                console.error("Erro ao carregar cardápio do servidor"); 
            } finally {
                this.loading = false;
            }
        },
        toggleActive(item) {
            item.active = !item.active;
        },
        // Botao Filtro Ultra-Rápido
        toggleUltraFast() {
            this.isUltraFast = !this.isUltraFast;
        },
        filteredProducts() {
            if (!this.isUltraFast) return this.products;
            return this.products.filter(p => p.prepTime <= 10);
        },
        total() {
            let total = 0;
            this.products.forEach(item => {
                if (item.active) total += item.price * item.quantity;
            });
            return total.toFixed(2);
        },
        async finishOrder() {
    // 1. Verifica se há itens no carrinho
    const itensSelecionados = this.products.filter(p => p.active);
    
    if (itensSelecionados.length === 0) {
        alert("O seu carrinho está vazio!");
        return;
    }

    // 2. Opção de Desistência
    const confirmar = confirm(`Confirma o pedido no valor de R$ ${this.total()}?\nAo clicar em OK, o pedido será enviado para a cozinha.`);
    
    if (!confirmar) {
        // Se o cliente clicar em "Cancelar", Ele desiste da compra
        console.log("O cliente desistiu da compra antes de finalizar.");
        return;
    }

    // 3. Se ele confirmou, prossegue com o envio para o servidor 
    const pedido = {
        itens: itensSelecionados,
        valorTotal: this.total(),
        pagamento: this.paymentMethod
    };

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedido)
        });
        
        const result = await response.json();
        
        alert(`🚀 ${result.message}\nTempo estimado: ${result.eta || '15-20 min'}`);
        
        //  Limpar o carrinho automaticamente 
        this.products.forEach(p => { p.active = false; p.quantity = 1; });

    } catch (e) {
        alert("Erro de conexão. O servidor está ligado?");
    }
}
    },
    mounted() {
        this.loadProducts();
    }
};

Vue.createApp(SelfServiceMachine).mount('#app');

