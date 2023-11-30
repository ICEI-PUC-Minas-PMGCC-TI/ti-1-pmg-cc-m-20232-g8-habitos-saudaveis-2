  document.addEventListener("DOMContentLoaded", function() {
    mapboxgl.accessToken = 'pk.eyJ1IjoicGhsb3BlczAzMSIsImEiOiJjbHBoaHp4aGowMm9hMmtxc3EwdmRjcjBiIn0.h5Eyj8hMxyQHJ1IvSs-YgA';
    let userMarker;

    const map = new mapboxgl.Map({
      container: 'mapaRestaurantes',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-43.9298, -19.9208],
      zoom: 12
    });

    function geocodeAddress(addressDetails) {
      const { city, neighborhood, street, number } = addressDetails;
      const query = `${number} ${street}, ${neighborhood}, ${city}`;
      const geocodingApiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}`;

      return fetch(geocodingApiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Falha na solicitação de geocodificação: ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          if (data.features && data.features.length > 0) {
            const coordinates = data.features[0].center;
            return {
              longitude: coordinates[0],
              latitude: coordinates[1]
            };
          } else {
            const fallbackQuery = `${neighborhood}, ${city}`;
            const fallbackGeocodingApiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(fallbackQuery)}.json?access_token=${mapboxgl.accessToken}`;
            return fetch(fallbackGeocodingApiUrl)
              .then(response => {
                if (!response.ok) {
                  throw new Error(`Falha na solicitação de geocodificação genérica: ${response.statusText}`);
                }
                return response.json();
              })
              .then(fallbackData => {
                if (fallbackData.features && fallbackData.features.length > 0) {
                  const fallbackCoordinates = fallbackData.features[0].center;
                  return {
                    longitude: fallbackCoordinates[0],
                    latitude: fallbackCoordinates[1]
                  };
                } else {
                  throw new Error("Nenhum resultado de geocodificação encontrado para o endereço fornecido.");
                }
              });
          }
        })
        .catch(error => {
          throw new Error(`Erro ao geocodificar o endereço: ${error.message}`);
        });
    }

    function addCurrentUserLocationMarker(lngLat) {
      if (userMarker) {
        userMarker.remove();
      }

      const markerElement = document.createElement('div');
      markerElement.className = 'user-marker';

      userMarker = new mapboxgl.Marker(markerElement)
        .setLngLat(lngLat)
        .addTo(map);
    }

    const btnBusca = document.getElementById("btnBusca");
    btnBusca.addEventListener("click", function() {
      const cityInput = document.getElementById("cityInput").value;
      const neighborhoodInput = document.getElementById("neighborhoodInput").value;
      const streetInput = document.getElementById("streetInput").value;
      const numberInput = document.getElementById("numberInput").value;

      if (cityInput && neighborhoodInput && streetInput && numberInput) {
        const addressDetails = {
          city: cityInput,
          neighborhood: neighborhoodInput,
          street: streetInput,
          number: numberInput,
        };

        geocodeAddress(addressDetails)
          .then(location => {
            map.flyTo({
              center: [location.longitude, location.latitude],
              zoom: 15
            });

            addCurrentUserLocationMarker([location.longitude, location.latitude]);
          })
          .catch(error => {
            console.error("Erro ao geocodificar o endereço:", error);
          });
      } else {
        alert("Por favor, preencha todos os campos de pesquisa.");
      }
    });

    function showReviews(reviews) {
      const sortedReviews = reviews.slice().sort((a, b) => b.Rating - a.Rating);

      const ratingList = document.getElementById("rating-list");
      ratingList.innerHTML = ""; // Limpa a lista antes de adicionar novos itens

      sortedReviews.forEach(review => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
          <strong>Nome:</strong> ${review.Name}<br>
          <strong>Endereço:</strong> ${review.Adress}<br>
          <strong>Avaliação:</strong> ${review.Rating}<br><br>
        `;
        ratingList.appendChild(listItem);
      });
    }

    function addLocationsToMap(locations, reviews) {
      locations.forEach(location => {
        const { nome, latitude, longitude } = location;
    
        // Encontrar a avaliação correspondente à academia
        const academia = reviews.find(avaliacao => avaliacao.Name === nome);
        
        // Verifica se a academia foi encontrada e se possui o campo de endereço
        const endereco = academia && academia.Adress ? academia.Adress : 'Endereço não disponível';
    
        const marker = new mapboxgl.Marker({
          color: "#FF0000"
        })
          .setLngLat([longitude, latitude])
          .setPopup(new mapboxgl.Popup().setHTML(`
            <h4><strong>${nome}</strong></h4>
            <strong>Endereço:</strong> ${endereco}<br>
            <strong>Avaliação:</strong> ${academia ? academia.Rating : 'Sem avaliação'}<br>
          `))
          .addTo(map);
    
        // Adiciona um evento de clique ao marcador para exibir os detalhes
        marker.getElement().addEventListener('click', () => {
          // Se desejar, aqui você pode implementar a lógica para exibir informações detalhadas
          // com base na marcação clicada
          console.log(`Informações detalhadas para: ${nome}`);
          console.log(`Endereço: ${endereco}`);
          console.log(`Avaliação: ${academia ? academia.Rating : 'Sem avaliação'}`);
        });
      });
    }
    

    function fetchReviews() {
      return fetch('/codigo/assets/js/ratingData.json')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .catch(error => {
          console.error("Erro ao buscar os dados:", error);
        });
    }

    fetchReviews().then(data => {
      const avaliacoes = data.avaliacoes;
      const locais = data.locais;

      showReviews(avaliacoes);
      addLocationsToMap(locais, avaliacoes);
    });

    function organizeReviewsByNeighborhood(reviews) {
      const reviewsByNeighborhood = {};

      reviews.forEach(review => {
        const neighborhood = review.Neighborhood;
        if (!reviewsByNeighborhood[neighborhood]) {
          reviewsByNeighborhood[neighborhood] = [];
        }
        reviewsByNeighborhood[neighborhood].push(review);
      });

      for (const neighborhood in reviewsByNeighborhood) {
        reviewsByNeighborhood[neighborhood].sort((a, b) => b.Rating - a.Rating);
      }

      return reviewsByNeighborhood;
    }

    const reviews = [
      { Name: "Restaurante A", Neighborhood: "Bairro X", Rating: 4 },
      { Name: "Restaurante B", Neighborhood: "Bairro Y", Rating: 3 },
      // Mais avaliações...
    ];

    const reviewsByNeighborhood = organizeReviewsByNeighborhood(reviews);
    console.log(reviewsByNeighborhood);

  });
