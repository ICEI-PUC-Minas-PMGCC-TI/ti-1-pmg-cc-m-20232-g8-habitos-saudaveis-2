document.addEventListener("DOMContentLoaded", function() {
  const jsonFile = "/codigo/assets/js/ratingdata.json";
  let map;

  const ZOOM = 17;

  function geocodeAddress(addressDetails) {
    let queryString = "";
    if (addressDetails.city) queryString += `${encodeURIComponent(addressDetails.city)},`;
    if (addressDetails.neighborhood) queryString += `${encodeURIComponent(addressDetails.neighborhood)},`;
    if (addressDetails.street) queryString += `${encodeURIComponent(addressDetails.street)},`;
    if (addressDetails.number) queryString += `${encodeURIComponent(addressDetails.number)},`;

    const geocodingApiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${queryString}`;

    return fetch(geocodingApiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          const firstResult = data[0];
          const location = {
            latitude: parseFloat(firstResult.lat),
            longitude: parseFloat(firstResult.lon),
            zoom: ZOOM,
          };
          return location;
        } else {
          throw new Error("Nenhum resultado de geocodificação encontrado para o endereço fornecido.");
        }
      });
  }

  function getUserLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            resolve(null);
            console.error(`Erro ao obter a localização: ${error.message}`);
          }
        );
      } else {
        console.error("Geolocalização não é suportada neste navegador.");
        resolve(null);
      }
    });
  }

  function addReviewsToPage(reviews) {
    const reviewsByNeighborhood = {};

    reviews.forEach(review => {
      const address = review.Adress;
      const addressParts = address.split(', ');

      if (addressParts.length >= 3) {
        const neighborhood = addressParts[2];

        if (!reviewsByNeighborhood[neighborhood]) {
          reviewsByNeighborhood[neighborhood] = [];
        }
        reviewsByNeighborhood[neighborhood].push(review);
      }
    });

    const ratingList = document.getElementById("rating-list");
    const sortedNeighborhoods = Object.keys(reviewsByNeighborhood).sort();
    sortedNeighborhoods.forEach(neighborhood => {
      const reviewsForNeighborhood = reviewsByNeighborhood[neighborhood];
      reviewsForNeighborhood.sort((a, b) => b.Rating - a.Rating);

      reviewsForNeighborhood.forEach(review => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>Nome:</strong> ${review.Name}<br>
            <strong>Endereço:</strong> ${review.Adress}<br>
            <strong>Avaliação:</strong> ${review.Rating}<br><br>
          `;
        ratingList.appendChild(listItem);
      });
    });
  }


  function addLocationsToMap(locations) {
    const iconStyle = new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 1],
        src: 'https://i.ibb.co/MGMczYq/vecteezy-map-pointer-icon-gps-location-symbol-maps-pin-location-16314852-814.png',
        scale: 0.1,
      }),
    });

    const markerFeatures = locations.map(location => {
      const { latitude, longitude, nome } = location;

      return new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude])),
        name: nome
      });
    });

    markerFeatures.forEach(feature => {
      feature.setStyle(iconStyle);
      feature.on('click', function(evt) {
        const clickedFeature = evt.target;
        const clickedFeatureName = clickedFeature.get('name');

        const selectedLocation = locations.find(location => location.nome === clickedFeatureName);
        if (selectedLocation) {
          const content = createPopupContent(selectedLocation);
          const popup = new ol.Overlay({
            element: document.getElementById('popup'),
            positioning: 'bottom-center',
            offset: [0, -10],
          });
          map.addOverlay(popup);
          popup.setPosition(evt.coordinate);
          document.getElementById('popup-content').innerHTML = content;
        }
      });
    });

    const markerSource = new ol.source.Vector({
      features: markerFeatures
    });

    const markerLayer = new ol.layer.Vector({
      source: markerSource
    });

    map.addLayer(markerLayer);
  }

  getUserLocation()
    .then(userLocation => {
      if (userLocation) {
        const userLatitude = userLocation.latitude;
        const userLongitude = userLocation.longitude;

        return fetch(jsonFile)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            const avaliacoes = data.avaliacoes;
            addReviewsToPage(avaliacoes);

            const locations = data.locais;
            const mapaContainer = document.getElementById("mapaRestaurantes");

            map = new ol.Map({
              target: mapaContainer,
              layers: [
                new ol.layer.Tile({
                  source: new ol.source.OSM(),
                }),
              ],
              view: new ol.View({
                center: ol.proj.fromLonLat([userLongitude, userLatitude]),
                zoom: ZOOM,
              }),
            });

            addLocationsToMap(locations);
          })
          .catch(error => {
            console.error("Houve um problema ao buscar os dados:", error);
          });
      } else {
        const cityInput = document.getElementById("cityInput").value;
        const neighborhoodInput = document.getElementById("neighborhoodInput").value;
        const streetInput = document.getElementById("streetInput").value;
        const numberInput = document.getElementById("numberInput").value;

        const addressDetails = {
          city: cityInput,
          neighborhood: neighborhoodInput,
          street: streetInput,
          number: numberInput,
        };

        geocodeAddress(addressDetails)
          .then(location => {
            map.getView().setCenter(ol.proj.fromLonLat([location.longitude, location.latitude]));
            map.getView().setZoom(location.zoom);
          })
          .catch(error => {
            console.error("Erro ao geocodificar o endereço:", error);
          });
      }
    })
    .catch(error => {
      console.error("Erro ao obter a localização do usuário:", error);
    });

  const btnBusca = document.getElementById("btnBusca");
  btnBusca.addEventListener("click", function() {
    const cityInput = document.getElementById("cityInput").value;
    const neighborhoodInput = document.getElementById("neighborhoodInput").value;
    const streetInput = document.getElementById("streetInput").value;
    const numberInput = document.getElementById("numberInput").value;

    const addressDetails = {
      city: cityInput,
      neighborhood: neighborhoodInput,
      street: streetInput,
      number: numberInput,
    };

    geocodeAddress(addressDetails)
      .then(location => {
        map.getView().setCenter(ol.proj.fromLonLat([location.longitude, location.latitude]));
        map.getView().setZoom(location.zoom);
      })
      .catch(error => {
        console.error("Erro ao geocodificar o endereço:", error);
      });
  });
});