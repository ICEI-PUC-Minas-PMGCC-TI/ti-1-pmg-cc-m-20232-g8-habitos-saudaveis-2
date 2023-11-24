async function popularDiv() {
  let dados = await buscarDados();
  dados.forEach((dado) => {
    var data = new Date();
    var dia = data.getDate();
    var mes = data.getMonth() + 1;
    var ano = data.getFullYear();
    let novaDiv = `<div id="teste" class:"d-fluid"><h4>${dado.nomerec}</h4><div class="row"><div class="col-4"><img src="https://source.unsplash.com/220x100/?healthfood" class="imagemDaReceita" data-receita-id=${dado.id}></div><div class="col-7" id:"corpo"> Nome : ${dado.nome} <br>Data:${dia}/${mes}/${ano}
        <br>Descrição:${dado.descricao}</div></div></div>`;
    document.getElementById("perfis").innerHTML += novaDiv;
  });
}

async function mostarModalDeIngredientes(id) {
  let dados = await buscarDados();
  dados.forEach((dado) => {
    if (dado.id == id) {
      document.getElementById("ingredientesConteudo").innerHTML =
        dado.ingredientes;

      // Use a função modal do Bootstrap para mostrar o modal
      var myModal = new bootstrap.Modal(
        document.getElementById("exampleModal")
      );
      myModal.show();
    }
  });
}

async function buscarDados() {
  let response = await fetch("/codigo/assets/js/dados.json");
  let dados = await response.json();
  return dados;
}

async function siteInit() {
  await popularDiv();
  let imagens = document.querySelectorAll(".imagemDaReceita");
  imagens.forEach((img) => {
    img.addEventListener("click", () => {
      mostarModalDeIngredientes(img.getAttribute("data-receita-id"));
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  siteInit();
});
