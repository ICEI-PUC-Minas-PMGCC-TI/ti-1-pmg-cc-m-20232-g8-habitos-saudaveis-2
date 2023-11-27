let usuario = {
    nome: "Nome do Usuário",
    rotina: []
};

function adicionarHabito(habito, descricao) {
    usuario.rotina.push({
        habito: habito,
        descricao: descricao
    });
}

// Adicionando hábitos à rotina
adicionarHabito("Exercício", "Correr 30 minutos todas as manhãs");
adicionarHabito("Dieta", "Comer frutas e vegetais todos os dias");

// Imprimindo a rotina de hábitos saudáveis do usuário
console.log(JSON.stringify(usuario, null, 2));
