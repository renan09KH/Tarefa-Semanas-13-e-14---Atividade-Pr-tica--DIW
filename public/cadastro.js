document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-jogo');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const novoJogo = {
      titulo: form.titulo.value,
      descricao: form.descricao.value,
      data_lancamento: form.data_lancamento.value,
      idade_recomendada: form.idade_recomendada.value,
      criador: form.criador.value,
      categoria: form.categoria.value.split(',').map(cat => cat.trim())
    };

    try {
      const res = await fetch('http://localhost:3000/filmes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoJogo)
      });

      if (res.ok) {
        alert('Jogo cadastrado com sucesso!');
        form.reset();
      } else {
        alert('Erro ao cadastrar jogo.');
      }
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao conectar com o servidor.');
    }
  });
});