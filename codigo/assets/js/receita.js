async function popularDiv() {
  let dados = await buscarDados();
  dados.forEach((dado) => {
    var data = new Date();
    var dia = data.getDate();
    var mes = data.getMonth() + 1;
    var ano = data.getFullYear();
    let novaDiv = `<div id="teste" class="d-fluid p-3 border border-success">
    <h4 class="receita-title">${dado.nomerec}</h4>
    <div class="row">
        <div class="col-4">
            <img src="../assets/images/${dado.id}.jpg" class="imagemDaReceita" data-receita-id=${dado.id}>
        </div>
        <div class="col-7" id="corpo">
            Nome: ${dado.nome}<br>
            Data: ${dia}/${mes}/${ano}<br>
            Descrição: ${dado.descricao}
        </div>
    </div>
</div>`;
    document.getElementById("perfis").innerHTML += novaDiv;
  });
}

async function mostarModalDeIngredientes(id) {
  let dados = await buscarDados();
  dados.forEach((dado) => {
    if (dado.id == id) {
      let ingredientesFormatados = dado.ingredientes
        .split(",")
        .map((ingrediente) => `<li>${ingrediente.trim()}</li>`)
        .join("");
      let preparoFormatado = dado.preparo
        .split(/\d+\-/)
        .filter((item) => item.trim() !== "")
        .map((passo) => `<li>${passo.trim()}</li>`)
        .join("");

      document.getElementById("ingredientesConteudo").innerHTML = `
                <div>
                    <h3>Receita: ${dado.nomerec}</h3>
                    <h4>Ingredientes</h4>
                    <ul>${ingredientesFormatados}</ul>
                    <h4>Modo de preparo</h4>
                    <ol>${preparoFormatado}</ol>
                </div>`;

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
