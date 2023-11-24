 document.addEventListener("DOMContentLoaded", function () {
            fetch('/codigo/assets/js/treinos.json')
                .then(response => response.json())
                .then(data => {
                    const fichasDeTreino = data.fichasDeTreino;
                    const fichasTreinoDiv = document.getElementById('fichasTreino');

                    function toggleFicha(ficha) {
                        const fichaContainer = document.getElementById(`ficha${ficha.id}`);
                        if (fichaContainer.style.display === 'none' || fichaContainer.style.display === '') {
                            fichaContainer.style.display = 'block';
                        } else {
                            fichaContainer.style.display = 'none';
                        }
                    }

                    function adicionarFicha(ficha) {
                        const fichaDiv = document.createElement('div');
                        fichaDiv.classList.add('ficha');

                        const button = document.createElement('button');
                        button.textContent = ficha.titulo;
                        button.onclick = () => {
                            toggleFicha(ficha);
                        };

                        fichasTreinoDiv.appendChild(button);

                        const fichaContainer = document.createElement('div');
                        fichaContainer.id = `ficha${ficha.id}`;
                        fichaContainer.style.display = 'none';
                        fichaContainer.innerHTML = `
                            <h2>${ficha.titulo}</h2>
                            <p>Tipo: ${ficha.tipo}</p>
                            <p>Alongamento: ${ficha.alongamento.descricao}</p>
                            <iframe width="360" height="200" src="${ficha.alongamento.videoURL}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                            <p>Exercícios:</p>
                            ${ficha.exercicios.map(exercicio => `<p>${exercicio.nome}</p><iframe width="360" height="200" src="${exercicio.videoURL}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`).join('')}
                        `;

                        fichasTreinoDiv.appendChild(fichaContainer);
                    }

                    fichasDeTreino.forEach(ficha => {
                        adicionarFicha(ficha);
                    });
                });
        });