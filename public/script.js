async function getFilmeById(id) {
  try {
    const resp = await fetch(`http://localhost:3000/filmes/${id}`);
    if (!resp.ok) throw new Error('Filme não encontrado');
    const filme = await resp.json();
    return filme;
  } catch (err) {
    console.error('Erro ao buscar filme:', err.message);
    return undefined;
  }
}

function mostrarDetalhes(filme) {
  const painel = document.getElementById('detalhes-filme');
  if (!filme) return;

  painel.querySelector('.detalhe-titulo').textContent = filme.titulo || '-';
  painel.querySelector('.detalhe-descricao').textContent = filme.descricao || '-';
  painel.querySelector('.detalhe-lancamento').textContent = `Lançamento: ${filme.data_lancamento || '-'}`;
  painel.querySelector('.detalhe-idade').textContent = `Idade recomendada: ${filme.idade_recomendada || '-'}`;
  painel.querySelector('.detalhe-criador').textContent = `Criador: ${filme.criador || '-'}`;
  painel.querySelector('.detalhe-categorias').textContent = `Categorias: ${filme.categoria ? filme.categoria.join(', ') : '-'}`;

  painel.setAttribute('aria-hidden', 'false');
  painel.style.display = 'block';
  painel.focus();

  const btnExcluir = document.getElementById('excluir-jogo');
  if (btnExcluir) {
    btnExcluir.onclick = async () => {
      const confirmacao = confirm(`Tem certeza que deseja excluir "${filme.titulo}"?`);
      if (confirmacao) {
        await fetch(`http://localhost:3000/filmes/${filme.id}`, {
          method: 'DELETE'
        });
        alert('Jogo excluído com sucesso!');
        fecharDetalhes();
        carregarGaleria();
      }
    };
  }
}

function fecharDetalhes() {
  const painel = document.getElementById('detalhes-filme');
  painel.setAttribute('aria-hidden', 'true');
  painel.style.display = 'none';
}

async function carregarGaleria() {
  try {
    const res = await fetch('http://localhost:3000/filmes');
    const filmes = await res.json();

    const galeria = document.getElementById('galeria');
    galeria.innerHTML = '';

    filmes.forEach(filme => {
      const card = document.createElement('div');
      card.classList.add('filme-card');
      card.setAttribute('data-id', filme.id);
      card.style.cursor = 'pointer';

      card.innerHTML = `
        <img src="./Imagens Jogos/${filme.id}.jpeg" alt="${filme.titulo}">
        <h1>${filme.titulo}</h1>
      `;

      card.addEventListener('click', async () => {
        const detalhes = await getFilmeById(filme.id);
        if (detalhes) mostrarDetalhes(detalhes);
      });

      galeria.appendChild(card);
    });
  } catch (err) {
    console.error('Erro ao carregar galeria:', err);
  }
}

// ==================== FUNÇÕES DE ESTATÍSTICAS ====================

async function mostrarEstatisticas() {
  try {
    const response = await fetch('http://localhost:3000/filmes');
    const filmes = await response.json();
    
    // Processar dados
    const categorias = processarCategorias(filmes);
    const anos = processarAnos(filmes);
    
    // Gerar gráficos
    gerarGraficoCategorias(categorias);
    gerarGraficoAnos(anos);
    
    // Mostrar painel
    const painel = document.getElementById('estatisticas-painel');
    painel.setAttribute('aria-hidden', 'false');
    painel.style.display = 'block';
    painel.focus();
    
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error);
    alert('Erro ao carregar estatísticas');
  }
}

function fecharEstatisticas() {
  const painel = document.getElementById('estatisticas-painel');
  painel.setAttribute('aria-hidden', 'true');
  painel.style.display = 'none';
}

function processarCategorias(filmes) {
  const categorias = {};
  filmes.forEach(filme => {
    if (filme.categoria && Array.isArray(filme.categoria)) {
      filme.categoria.forEach(cat => {
        categorias[cat] = (categorias[cat] || 0) + 1;
      });
    }
  });
  return categorias;
}

function processarAnos(filmes) {
  const anos = {};
  filmes.forEach(filme => {
    if (filme.data_lancamento) {
      const ano = filme.data_lancamento.split('-')[0];
      anos[ano] = (anos[ano] || 0) + 1;
    }
  });
  return anos;
}

function gerarGraficoCategorias(dados) {
  const ctx = document.getElementById('categoriaChart');
  if (!ctx) return;
  
  if (window.categoriaChartInstance) {
    window.categoriaChartInstance.destroy();
  }
  
  window.categoriaChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(dados),
      datasets: [{
        data: Object.values(dados),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
        ],
        borderColor: '#000',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: 'white',
            font: { size: 12 }
          }
        }
      }
    }
  });
}

function gerarGraficoAnos(dados) {
  const ctx = document.getElementById('anoChart');
  if (!ctx) return;
  
  const anosOrdenados = Object.keys(dados).sort();
  const valoresOrdenados = anosOrdenados.map(ano => dados[ano]);
  
  if (window.anoChartInstance) {
    window.anoChartInstance.destroy();
  }
  
  window.anoChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: anosOrdenados,
      datasets: [{
        label: 'Jogos Lançados',
        data: valoresOrdenados,
        backgroundColor: 'rgba(132, 0, 255, 0.8)',
        borderColor: 'rgba(132, 0, 255, 1)',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: 'white' },
          grid: { color: 'rgba(255,255,255,0.1)' }
        },
        x: {
          ticks: { color: 'white' },
          grid: { color: 'rgba(255,255,255,0.1)' }
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

function init() {
  carregarGaleria();

  const btnFechar = document.getElementById('fechar-detalhes');
  if (btnFechar) btnFechar.addEventListener('click', fecharDetalhes);

  const btnFecharEstatisticas = document.getElementById('fechar-estatisticas');
  if (btnFecharEstatisticas) btnFecharEstatisticas.addEventListener('click', fecharEstatisticas);

  const btnEstatisticas = document.getElementById('btn-estatisticas');
  if (btnEstatisticas) {
    btnEstatisticas.addEventListener('click', (e) => {
      e.preventDefault();
      mostrarEstatisticas();
    });
  }

  document.addEventListener('click', (e) => {
    const painelDetalhes = document.getElementById('detalhes-filme');
    const painelEstatisticas = document.getElementById('estatisticas-painel');
    
    if (painelDetalhes.getAttribute('aria-hidden') === 'false') {
      if (!painelDetalhes.contains(e.target) && !e.target.closest('[data-id]')) {
        fecharDetalhes();
      }
    }
    
    if (painelEstatisticas.getAttribute('aria-hidden') === 'false') {
      if (!painelEstatisticas.contains(e.target) && !e.target.closest('#btn-estatisticas')) {
        fecharEstatisticas();
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const painelDetalhes = document.getElementById('detalhes-filme');
      const painelEstatisticas = document.getElementById('estatisticas-painel');
      
      if (painelDetalhes.getAttribute('aria-hidden') === 'false') fecharDetalhes();
      if (painelEstatisticas.getAttribute('aria-hidden') === 'false') fecharEstatisticas();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}