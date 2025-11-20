// Função para carregar todos os filmes da API
function carregarFilmes() {
  fetch('http://localhost:3000/filmes')
    .then(res => res.json())
    .then(filmes => {
      const container = document.getElementById('lista-filmes');
      container.innerHTML = '';

      filmes.forEach(filme => {
        const card = document.createElement('div');
        card.classList.add('filme-card');
        card.innerHTML = `
          <h2>${filme.titulo}</h2>
          <p>${filme.descricao}</p>
          <p><strong>Lançamento:</strong> ${filme.data_lancamento}</p>
          <p><strong>Idade:</strong> ${filme.idade_recomendada}</p>
          <p><strong>Criador:</strong> ${filme.criador}</p>
          <p><strong>Categoria:</strong> ${filme.categoria.join(', ')}</p>
          <a href="detalhes.html?id=${filme.id}">Ver detalhes</a>
        `;
        container.appendChild(card);
      });
    })
    .catch(err => console.error('Erro ao carregar filmes:', err));
}

// Função para carregar detalhes de um filme específico
function carregarDetalhes() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  fetch(`http://localhost:3000/filmes/${id}`)
    .then(res => res.json())
    .then(filme => {
      document.getElementById('titulo').textContent = filme.titulo;
      document.getElementById('descricao').textContent = filme.descricao;
      document.getElementById('data').textContent = filme.data_lancamento;
      document.getElementById('idade').textContent = filme.idade_recomendada;
      document.getElementById('criador').textContent = filme.criador;
      document.getElementById('categoria').textContent = filme.categoria.join(', ');
    })
    .catch(err => console.error('Erro ao carregar detalhes:', err));
}

// Função para cadastrar novo filme
function configurarFormulario() {
  const form = document.getElementById('form-filme');
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const novoFilme = {
      titulo: form.titulo.value,
      descricao: form.descricao.value,
      data_lancamento: form.data_lancamento.value,
      idade_recomendada: form.idade_recomendada.value,
      criador: form.criador.value,
      categoria: form.categoria.value.split(',').map(cat => cat.trim())
    };

    fetch('http://localhost:3000/filmes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoFilme)
    })
    .then(() => {
      alert('Filme cadastrado com sucesso!');
      form.reset();
    })
    .catch(err => console.error('Erro ao cadastrar filme:', err));
  });
}