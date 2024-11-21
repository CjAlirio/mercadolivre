const searchForm = document.querySelector('.search-form');
const productsList = document.querySelector('.product-list');
const priceChart = document.querySelector('.price-chart');

let myChart = null;

searchForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const inputValue = event.target[0].value;

    try {
        const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${inputValue}`);
        const products = (await response.json()).results.slice(0, 10);

        displayItems(products);
        updatePriceChart(products);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
    }
});

function displayItems(products) {
    productsList.innerHTML = products.map((product) => `
        <div class="product-card">
            <img src="${product.thumbnail.replace(/w\.jpg/gi, 'W.jpg')}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            <p class="product-store">Loja: ${product.seller.nickname || 'Desconhecida'}</p>
        </div>
    `).join('');
}

function updatePriceChart(products) {
    const ctx = priceChart.getContext('2d');

    if (myChart) {
        myChart.destroy();
    }

    
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: products.map(product => product.title.substring(0, 20) + '...'),
            datasets: [{
                label: 'Preço (R$)',
                data: products.map(product => product.price),
                backgroundColor: 'rgba(46, 204, 113, 0.6)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return value.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            });
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: 'Comparador de Preços',
                    font: {
                        size: 18,
                    },
                },
            }
        }
    });
}

function displayItems(products) {
    productsList.innerHTML = products.map((product) => `
        <div class="product-card">
            <img src="${product.thumbnail.replace(/w\.jpg/gi, 'W.jpg')}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            <p class="product-store">Loja: ${product.seller.nickname || 'Desconhecida'}</p>
            <a href="${product.permalink}" target="_blank" rel="noopener noreferrer" class="buy-button">Comprar</a>
        </div>
    `).join('');
}

function updateDateTime() {
    const dateTimeElement = document.getElementById("date-time");

    const now = new Date();
    
    //
    const date = now.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const time = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    dateTimeElement.textContent = `Data: ${date}  Hora: ${time}`;;
}


setInterval(updateDateTime, 1000);


updateDateTime();

