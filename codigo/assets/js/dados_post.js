function ledados() {
    let strDados = localStorage.getItem('post');
    let objDados = {};
  
    if (strDados) {
        objDados = JSON.parse(strDados);
    } else {
        objDados = [];
    }
  
    return objDados
  
  }
  function salvaDados(dados) {
  
    localStorage.setItem('post', JSON.stringify(dados));
  }
  
  function incluirDados() {
  
    let objDados = ledados();
  
    let strTitulo = document.getElementById('Titulo').value;
    let strTema = document.getElementById('Tema').value;
    let strDescricao = document.getElementById('Descricao').value;
  
    let novoPost = {
        id: getNextId(),
        nome: strTitulo,
        tema: strTema,
        descricao: strDescricao
    };
  
    objDados.push(novoPost);
    salvaDados(objDados);
  }
  function getNextId() {
    let objDados = ledados();
    let id = 0
  
    if (objDados.length > 0) {
  
        id = objDados[objDados.length - 1].id
        id = id + 1
    } else {
        id = 1
    }
  
    return id
  }
  function Delete(id) {
    let objDados = ledados();
    for (let i = 0; i < objDados.length; i++) {
        if (id == objDados[i].id) {
            indice = i;
        }
  
    }
    objDados.splice(indice, 1)
    salvaDados(objDados);
  }
  
  
  document.getElementById('btnInsert').addEventListener('click', incluirDados);