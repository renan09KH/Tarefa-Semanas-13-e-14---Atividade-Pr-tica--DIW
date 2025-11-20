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

function init() {
  carregarGaleria();

  const btnFechar = document.getElementById('fechar-detalhes');
  if (btnFechar) btnFechar.addEventListener('click', fecharDetalhes);

  document.addEventListener('click', (e) => {
    const painel = document.getElementById('detalhes-filme');
    if (painel.getAttribute('aria-hidden') === 'false') {
      if (!painel.contains(e.target) && !e.target.closest('[data-id]')) {
        fecharDetalhes();
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const painel = document.getElementById('detalhes-filme');
      if (painel.getAttribute('aria-hidden') === 'false') fecharDetalhes();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}