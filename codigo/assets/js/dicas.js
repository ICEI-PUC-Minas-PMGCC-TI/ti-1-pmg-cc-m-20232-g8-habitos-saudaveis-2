function adicionarDica() {
  var nome = document.getElementById('nome').value;
  var data = document.getElementById('data').value;
  var tema = document.getElementById('tema').value;
  var descricao = document.getElementById('descricao').value;

  if (nome && data && tema && descricao) {
    // Criar objeto para representar a nova dica
    var novaDica = {
      nome: nome,
      data: data,
      tema: tema,
      descricao: descricao
    };

    // Verificar se já existem dicas no armazenamento local
    var dicasSalvas = localStorage.getItem('dicas');
    var dicasArray = [];

    if (dicasSalvas) {
      // Se existir, converter as dicas para um array
      dicasArray = JSON.parse(dicasSalvas);
    }

    // Adicionar a nova dica ao array
    dicasArray.push(novaDica);

    // Salvar o array atualizado de dicas de volta no armazenamento local
    localStorage.setItem('dicas', JSON.stringify(dicasArray));

    // Atualizar a exibição das dicas na página
    exibirDicas();

    // Limpar o formulário
    document.getElementById('formDica').reset();
  } else {
    alert('Por favor, preencha todos os campos.');
  }
}

function exibirDicas() {
  var dicasContainer = document.getElementById('dicasContainer');
  dicasContainer.innerHTML = ''; // Limpar o conteúdo antes de exibir novamente

  var dicasSalvas = localStorage.getItem('dicas');
  if (dicasSalvas) {
    var dicasArray = JSON.parse(dicasSalvas);
    dicasArray.forEach(function(dica) {
      var novaDica = document.createElement('div');
      novaDica.classList.add('dica');
      novaDica.innerHTML = '<strong>Nome:</strong> ' + dica.nome +
                           '<br><strong>Data:</strong> ' + dica.data +
                           '<br><strong>Tema:</strong> ' + dica.tema +
                           '<br><strong>Dica:</strong> ' + dica.descricao;
      dicasContainer.appendChild(novaDica);
    });
  }
}

// Chamada inicial para exibir as dicas salvas ao carregar a página
exibirDicas();
