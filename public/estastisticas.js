async function carregarEstatisticas() {
    try {
        const response = await fetch('http://localhost:3000/filmes');
        const filmes = await response.json();
        
        // Processar dados para gráficos
        const categorias = {};
        const anos = {};
        
        filmes.forEach(filme => {
            // Contar categorias
            if (filme.categoria) {
                filme.categoria.forEach(cat => {
                    categorias[cat] = (categorias[cat] || 0) + 1;
                });
            }
            
            // Contar por ano
            if (filme.data_lancamento) {
                const ano = filme.data_lancamento.split('-')[0];
                anos[ano] = (anos[ano] || 0) + 1;
            }
        });
        
        // Gerar gráficos
        gerarGraficoCategorias(categorias);
        gerarGraficoAnos(anos);
        
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

function gerarGraficoCategorias(dados) {
    const ctx = document.getElementById('categoriaChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(dados),
            datasets: [{
                data: Object.values(dados),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                    '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'white'
                    }
                }
            }
        }
    });
}

function gerarGraficoAnos(dados) {
    const ctx = document.getElementById('anoChart').getContext('2d');
    
    const anosOrdenados = Object.keys(dados).sort();
    const valoresOrdenados = anosOrdenados.map(ano => dados[ano]);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: anosOrdenados,
            datasets: [{
                label: 'Jogos Lançados',
                data: valoresOrdenados,
                backgroundColor: 'rgba(132, 0, 255, 0.8)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: 'white' }
                },
                x: {
                    ticks: { color: 'white' }
                }
            },
            plugins: {
                legend: {
                    labels: { color: 'white' }
                }
            }
        }
    });
}

// Carregar quando a página abrir
document.addEventListener('DOMContentLoaded', carregarEstatisticas);