// Função para adicionar as avaliações ao quadro
function addReviewsToContainer() {
  const reviewsList = document.getElementById('reviews-list');

  // Carrega os dados do arquivo JSON
  fetch('/codigo/assets/js/reviewsdata.json')
    .then(response => response.json())
    .then(data => {
      data.reviews.forEach((review) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <h3>${review.name}</h3>
          <p><strong>Endereço:</strong> ${review.address}</p>
          <p><strong>Classificação:</strong> ${review.rating}</p>
          <p><strong>Avaliação:</strong> ${review.review}</p>
        `;
        reviewsList.appendChild(listItem);
      });
    });
}

// Chamando a função para adicionar as avaliações
addReviewsToContainer();

//SEPARAÇÃO

document.addEventListener("DOMContentLoaded", function () {
  // ...

  const points = [
    [-43.96742427237166, -19.898861977798433],
    [-43.93695437843579, -19.907174493562536],
    [-43.94399249478153, -19.900718208502024],
    [-43.95983903710389, -19.92501496502282],
    [-43.929232968158544, -19.912861031182103],
    [-43.9339889891568, -19.911093499053692],
    [-43.95023524964601, -19.913913914738504],
    [-43.96633305544307, -19.915411159194857],
    [-43.945610824349785, -19.934537609334235],
  ];

  // Inicialização do Mapa OpenLayers
  const map = new ol.Map({
    target: "map",
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([-43.9378, -19.9208]),
      zoom: 12,
    }),
  });

  // Adiciona pontos ao mapa
  points.forEach((point) => {
    const marker = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat(point)),
    });

    // Ícone personalizado usando a nova imagem
    const iconStyle = new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 1],
        src: "https://i.ibb.co/MGMczYq/vecteezy-map-pointer-icon-gps-location-symbol-maps-pin-location-16314852-814.png",
        scale: 0.1,  // Ajuste o valor conforme necessário para reduzir o tamanho
      }),
    });

    marker.setStyle(iconStyle);

    const vectorSource = new ol.source.Vector({
      features: [marker],
    });

    const vectorLayer = new ol.layer.Vector({
      source: vectorSource,
    });

    map.addLayer(vectorLayer);
  });

  // Seleciona o botão de busca pelo ID
  const searchButton = document.getElementById('search-button');

  // Adiciona um evento de clique ao botão de busca
  searchButton.addEventListener('click', function () {
    geocodeAndCenterMap(map);
  });

  // Lógica da Barra de Pesquisa
  const cityInput = document.getElementById("cityInput");
  const neighborhoodInput = document.getElementById("neighborhoodInput");
  const streetInput = document.getElementById("streetInput");
  const numberInput = document.getElementById("numberInput");

  // Adiciona um evento para responder à tecla "Enter"
  cityInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      geocodeAndCenterMap(map);
    }
  });

  neighborhoodInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      geocodeAndCenterMap(map);
    }
  });

  streetInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      geocodeAndCenterMap(map);
    }
  });

  numberInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      geocodeAndCenterMap(map);
    }
  });

  function geocodeAndCenterMap(map) {
    // Obtém os valores dos campos de endereço
    const city = cityInput.value;
    const neighborhood = neighborhoodInput.value;
    const street = streetInput.value;
    const number = numberInput.value;

    // Concatena os valores para formar o endereço completo
    const fullAddress = `${street}, ${number}, ${neighborhood}, ${city}`;

    // Constrói a URL para a API de geocodificação do OpenStreetMap Nominatim
    const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      fullAddress
    )}`;

    // Faz a requisição para obter as coordenadas geográficas
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          // Obtém as coordenadas da primeira correspondência encontrada
          const latitude = parseFloat(data[0].lat);
          const longitude = parseFloat(data[0].lon);

          // Centraliza o mapa nas novas coordenadas
          const center = ol.proj.fromLonLat([longitude, latitude]);
          map.getView().setCenter(center);
          map.getView().setZoom(15); // Ajuste o zoom conforme necessário
        } else {
          // Se não houver correspondências, exibe uma mensagem ou toma outra ação apropriada
          console.error('Endereço não encontrado.');
        }
      })
      .catch((error) => {
        console.error('Erro ao obter coordenadas:', error);
      });
  }
});
