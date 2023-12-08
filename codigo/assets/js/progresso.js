function adicionarDadosAoGrafico(updateToDatabase) {
    let height = document.getElementById("height").value;
    let date = document.getElementById("date").value;
    let weight = parseFloat(document.getElementById("currentWeight").value);
    let bodyfat = parseFloat(document.getElementById("bodyfat").value);

    if (isNaN(weight) || isNaN(bodyfat) || weight <= 0 || bodyfat <= 0) {
        alert("Por favor, insira valores válidos para peso e percentual de gordura!");
        return;
    }

    let chart = Chart.getChart("progressChart");

    chart.data.labels.push(date);
    chart.data.datasets[0].data.push(weight);
    chart.data.datasets[1].data.push(bodyfat);

    chart.update();

    const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    if (usuarioCorrenteJSON) {
        const usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
        updateToDatabase({
            date: date,
            weight: weight,
            bodyfat: bodyfat,
            height: height,
            userid: usuarioCorrente.id,
        });
    } else {
        console.log('Nenhum usuário está logado');
    }

    /*document.getElementById("data").value = "";
    document.getElementById("currentWeight").value = "";
    document.getElementById("bodyfat").value = "";*/
}

function addImc(){
  let weight = parseFloat(document.getElementById("currentWeight").value);
  let height = parseFloat(document.getElementById("height").value);
  let imc = classeImc(weight,height);
  pushImc(imc);
}

function classeImc(weight, height) {

    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        alert("Por favor, insira valores válidos para peso e altura!");
        return;
    }

    let imc = weight / ((height/100) * (height/100));
    let resultado = "";

    if (imc < 16) {
        resultado = "Magreza Grave";
    } else if (imc >= 16 && imc < 17) {
        resultado = "Magreza Moderada";
    } else if (imc >= 17 && imc < 18.5) {
        resultado = "Magreza Leve";
    } else if (imc >= 18.5 && imc < 25) {
        resultado = "Saudável";
    } else if (imc >= 25 && imc < 30) {
        resultado = "Sobrepeso";
    } else if (imc >= 30 && imc < 35) {
        resultado = "Obesidade Grau 1";
    } else if (imc >= 35 && imc < 40) {
        resultado = "Obesidade Grau 2";
    } else {
        resultado = "Obesidade Grau 3 (mórbida)";
    }

    return resultado;
}

function pushImc(imc){
  
  let chart2 = Chart.getChart("myPieChart");
  let labels = chart2.data.labels;
  let data = chart2.data.datasets[0].data;
  let index = labels.indexOf(imc);

    if (index !== -1) {
        data[index]++;
    } else {
        labels.push(imc);
        data.push(1);
    }

    chart2.update();

    document.getElementById("resultadoIMC").innerHTML = "Classificação do IMC: " + imc;
}

const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
if (usuarioCorrenteJSON) {
    const usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
    console.log('ID do usuário logado:', usuarioCorrente.id);
} else {
    console.log('Nenhum usuário está logado');
}