const apiUrl = 'https://jsonserver-2.paulo-henriq161.repl.co'; 

function displayMessage(mensagem) {
    msg = document.getElementById('msg');
    msg.innerHTML = '<div class="alert alert-warning">' + mensagem + '</div>';
}

function readUserData(createGraphs) {
    fetch(`${apiUrl}/userData`)
        .then(response => response.json())
        .then(data => {
            createGraphs(data);
        })
        .catch(error => {
            console.error('Erro ao ler os dados via API JSONServer:', error);
            displayMessage("Erro ao ler os dados");
        });
}

function createUserMeasurement(measurements) {
    fetch(`${apiUrl}/userData`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(measurements),
    })
        .then(response => response.json())
        .then(data => {
            displayMessage("Dados inseridos com sucesso");
        })
        .catch(error => {
            console.error('Erro ao inserir dados via API JSONServer:', error);
            displayMessage("Erro ao inserir dados");
        });
}

// function updateContato(id, contato, refreshFunction) {
//     fetch(`${apiUrl}/${id}`, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(contato),
//     })
//         .then(response => response.json())
//         .then(data => {
//             displayMessage("Contato alterado com sucesso");
//             if (refreshFunction)
//                 refreshFunction();
//         })
//         .catch(error => {
//             console.error('Erro ao atualizar contato via API JSONServer:', error);
//             displayMessage("Erro ao atualizar contato");
//         });
// }

// function deleteContato(id, refreshFunction) {
//     fetch(`${apiUrl}/${id}`, {
//         method: 'DELETE',
//     })
//         .then(response => response.json())
//         .then(data => {
//             displayMessage("Contato removido com sucesso");
//             if (refreshFunction)
//                 refreshFunction();
//         })
//         .catch(error => {
//             console.error('Erro ao remover contato via API JSONServer:', error);
//             displayMessage("Erro ao remover contato");
//         });
// }
