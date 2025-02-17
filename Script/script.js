const apiKey = "6e496b0c0a1d24da18427ab07fb3e8bd";

var pesquisa_btn = document.querySelector("#pesquisa_btn");
var cidade_input = document.querySelector("#cidade_input");

//Variaveis da previsão em tempo real
const nome_cidade = document.getElementById("nome_cidade");
const bandeira_pais = document.getElementById("bandeira_pais");
const clima_atual = document.getElementById("clima");
const temperatura = document.getElementById("temperatura");
const temp_min = document.getElementById("min_temp");
const temp_max = document.getElementById("max_temp");
const feels_like = document.getElementById("feels_like");
const icone_climaAtual = document.querySelector('#icone-clima');
const humidade = document.getElementById("humidade");
const vento = document.getElementById("vento");

// Default
document.addEventListener("DOMContentLoaded", function () {
  //cidade padrão
  const cidadePadrao = "São Paulo"; 

  const carregarClimaPadrao = async (city) => {
    const data = await consultaApi(city);
  
    nome_cidade.innerHTML = data.name;
    bandeira_pais.setAttribute("src", `https://flagcdn.com/w80/${data.sys.country.toLowerCase()}.png`);
    clima_atual.innerHTML = data.weather[0].description;
    temperatura.innerHTML = parseInt(data.main.temp) + "&deg;";
    temp_max.innerHTML = "máx " + parseInt(data.main.temp_max) + "&deg;";
    temp_min.innerHTML = "min " + parseInt(data.main.temp_min) + "&deg;";
    feels_like.innerHTML = "Sensação Térmica de " + parseInt(data.main.feels_like) + "&deg;";
    icone_climaAtual.setAttribute("src", `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
    humidade.innerHTML = data.main.humidity + " %";
    vento.innerHTML = data.wind.speed + " KM/H";
  };

  const carregarPrevisao = async (city) => {
    const data = await dataApiCall5(city);

    //previsão em 6 em 6 horas
    prev00.innerHTML = parseInt(data.list[3].main.temp) + "&deg;";
    prev06.innerHTML = parseInt(data.list[5].main.temp) + "&deg;";
    prev12.innerHTML = parseInt(data.list[7].main.temp) + "&deg;";
    prev18.innerHTML = parseInt(data.list[9].main.temp) + "&deg;";

    //icon da previsão em 6 em 6 horas
    icon00.setAttribute("src", `http://openweathermap.org/img/wn/${data.list[3].weather[0].icon}@2x.png`);
    icon06.setAttribute("src", `http://openweathermap.org/img/wn/${data.list[5].weather[0].icon}@2x.png`);
    icon12.setAttribute("src", `http://openweathermap.org/img/wn/${data.list[7].weather[0].icon}@2x.png`);
    icon18.setAttribute("src", `http://openweathermap.org/img/wn/${data.list[9].weather[0].icon}@2x.png`);

    //previsão para os próximos 5 dias
    let proximasDatas = [];
    const indices = [3, 10, 18, 26, 34];
    indices.forEach(index => {
      const dataHoraCompleta = data.list[index].dt_txt;
      const partesData = dataHoraCompleta.split(" ")[0].split("-");
      const dataFormatada = `${partesData[2]}/${partesData[1]}`;
      proximasDatas.push(dataFormatada);
    });

    const [dia01, dia02, dia03, dia04, dia05] = proximasDatas;

    //datas da previsão
    dia1[0].innerHTML = proximasDatas[0];
    dia2[0].innerHTML = proximasDatas[1];
    dia3[0].innerHTML = proximasDatas[2];
    dia4[0].innerHTML = proximasDatas[3];
    dia5[0].innerHTML = proximasDatas[4];

    temp1[0].innerHTML = parseInt(data.list[7].main.temp) + "&deg;";
    temp2[0].innerHTML = parseInt(data.list[14].main.temp) + "&deg;";
    temp3[0].innerHTML = parseInt(data.list[22].main.temp) + "&deg;";
    temp4[0].innerHTML = parseInt(data.list[30].main.temp) + "&deg;";
    temp5[0].innerHTML = parseInt(data.list[38].main.temp) + "&deg;";
  };

  const dataApiCall5 = async (city) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`;
    const response = await fetch(url);
    if (!response.ok) {
      alert("Previsão não encontrada!");
      return;
    }
    const data = await response.json();
    return data;
  };

  // Carrega o clima, previsao e a cidade default
  carregarClimaPadrao(cidadePadrao);
  carregarPrevisao(cidadePadrao);
});


//Criação do MAPA

document.addEventListener("DOMContentLoaded", function () {
    let map = L.map("map").setView([0, 0], 2);
  
    // Adiciona mapa base do OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
        
    
    // Adiciona camada base
    let weatherLayer = L.tileLayer(`https://tile.openweathermap.org/map/clouds_new//{z}/{x}/{y}.png?appid=${apiKey}`);
    
    weatherLayer.addTo(map);
    
    // Muda a camada do mapa ao precionar os botões
    window.changeLayer = function(layerType){
      if(weatherLayer){
        map.removeLayer(weatherLayer);
      }

      switch (layerType){
        case "clouds_new":
          weatherLayer = L.tileLayer(`https://tile.openweathermap.org/map/clouds_new//{z}/{x}/{y}.png?appid=${apiKey}`);
          break;
        
        case "temp_new":
          weatherLayer = L.tileLayer(`https://tile.openweathermap.org/map/temp_new//{z}/{x}/{y}.png?appid=${apiKey}`);
          break;
        
        case "wind_new":
          weatherLayer = L.tileLayer(`https://tile.openweathermap.org/map/wind_new//{z}/{x}/{y}.png?appid=${apiKey}`);
          break;
        
        case "pressure_new":
          weatherLayer = L.tileLayer(`https://tile.openweathermap.org/map/pressure_new//{z}/{x}/{y}.png?appid=${apiKey}`);
          break;
        
        case "precipitation_new":
          weatherLayer = L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new//{z}/{x}/{y}.png?appid=${apiKey}`);
          break;
        default:
            console.log("Camada inválida!");
            return;
        }

        weatherLayer.addTo(map);
    };
            
    //Botão de procura
    window.searchLocation = function () {
      let location = cidade_input.value;
      if (!location) return alert("Digite um local!");
  
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.length === 0) {
            alert("Local não encontrado!");
            return;
          }
          // Move o mapa para o local encontrado
          let lat = data[0].lat;
          let lon = data[0].lon;
          map.setView([lat, lon], 5);
          L.marker([lat, lon]).addTo(map).bindPopup(location).openPopup();
        })
        .catch((error) => console.error(error));

    };
  });
  
  //Botão style
  document.addEventListener("DOMContentLoaded", function () {
    //seleciona todos os buttons e deixa em formato de array
    const buttons = document.querySelectorAll(".btn_modos button");


    buttons.forEach((button) => {
        button.addEventListener("click", function () {
            buttons.forEach((btn) => btn.classList.remove("active"));

            //this serve para add a class para o btn que executou a função
            this.classList.add("active");
        });
    });
});

//Temperatura

//Function

const consultaApi = async (city) =>{
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;

  const response = await fetch(apiURL);
  const data = await (response).json();
  
  return data;
};

const dataApi = async (city)=>{
  const data = await consultaApi(city);

    nome_cidade.innerHTML =  data.name;
    bandeira_pais.setAttribute("src",  `https://flagcdn.com/w80/${data.sys.country.toLowerCase()}.png`);
    clima_atual.innerHTML = data.weather[0].description;
    temperatura.innerHTML = parseInt(data.main.temp)+"&deg;";
    temp_max.innerHTML ="máx " + parseInt(data.main.temp_max)+"&deg;";
    temp_min.innerHTML ="min " + parseInt(data.main.temp_min)+"&deg;";
    feels_like.innerHTML = "Sensação Térmica de " + parseInt(data.main.feels_like) +"&deg;";
    icone_climaAtual.setAttribute("src", `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`) 
    humidade.innerHTML = data.main.humidity + " %";
    vento.innerHTML = data.wind.speed + " KM/H";
};


//event
pesquisa_btn.addEventListener("click", function(){
  
  let city = cidade_input.value;
  dataApi(city); 
});

//Variaveis da Previsão da semana

const prev00 = document.getElementById('temp00');
const prev06 = document.getElementById('temp06');
const prev12 = document.getElementById('temp12');
const prev18 = document.getElementById('temp18');

const icon00 = document.getElementById("1icone-clima");
const icon06 = document.getElementById('2icone-clima');
const icon12 = document.getElementById('3icone-clima');
const icon18 = document.getElementById('4icone-clima');

const dia1 = document.querySelectorAll('.dia1 span');
const dia2 = document.querySelectorAll('.dia2 span');
const dia3 = document.querySelectorAll('.dia3 span');
const dia4 = document.querySelectorAll('.dia4 span');
const dia5 = document.querySelectorAll('.dia5 span');

const temp1 = document.querySelectorAll('.dia1 span#temperatura');
const temp2 = document.querySelectorAll('.dia2 span#temperatura');
const temp3 = document.querySelectorAll('.dia3 span#temperatura');
const temp4 = document.querySelectorAll('.dia4 span#temperatura');
const temp5 = document.querySelectorAll('.dia5 span#temperatura');

//function
document.addEventListener("DOMContentLoaded", function(){
pesquisa_btn.addEventListener("click", function(){

  var city = cidade_input.value;
  addInfoApiCall5();
})
  

const dataApiCall5 = async ()=>{
  let location = cidade_input.value;
    
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric&lang=pt_br`;
  const response = await fetch(url);
    if(!response.ok){
      alert("previsão não encontrada!");
      return
    };
    
    const data = await response.json();

    return data;
}

const addInfoApiCall5 = async ()=>{
  const data = await dataApiCall5();

//Transforma a data e hora em apenas dia e mês no sistema BR
let proximasDatas = [];

  const indices = [3, 10, 18, 26, 34];

  indices.forEach(index => {
    const dataHoraCompleta = data.list[index].dt_txt;
    const partesData = dataHoraCompleta.split(" ")[0].split("-");
    const dataFormatada = `${partesData[2]}/${partesData[1]}`;
    
    proximasDatas.push(dataFormatada);
  });
  const [dia01, dia02, dia03, dia04, dia05] = proximasDatas;

    //previsao em horas
    prev00.innerHTML = parseInt(data.list[3].main.temp) + "&deg;";
    prev06.innerHTML = parseInt(data.list[5].main.temp) + "&deg;";
    prev12.innerHTML = parseInt(data.list[7].main.temp) + "&deg;";
    prev18.innerHTML = parseInt(data.list[9].main.temp) + "&deg;";
    
    //icone da previsao em horas
    icon00.setAttribute("src", `http://openweathermap.org/img/wn/${data.list[3].weather[0].icon}@2x.png`);
    icon06.setAttribute("src", `http://openweathermap.org/img/wn/${data.list[5].weather[0].icon}@2x.png`);
    icon12.setAttribute("src", `http://openweathermap.org/img/wn/${data.list[7].weather[0].icon}@2x.png`);
    icon18.setAttribute("src", `http://openweathermap.org/img/wn/${data.list[9].weather[0].icon}@2x.png`);

    //data da previsao
    dia1[0].innerHTML = proximasDatas[0];
    dia2[0].innerHTML = proximasDatas[1];
    dia3[0].innerHTML = proximasDatas[2];
    dia4[0].innerHTML = proximasDatas[3];
    dia5[0].innerHTML = proximasDatas[4];

    //temp da previsao data
    temp1[0].innerHTML = parseInt(data.list[7].main.temp) + "&deg;";
    temp2[0].innerHTML = parseInt(data.list[14].main.temp) + "&deg;";
    temp3[0].innerHTML = parseInt(data.list[22].main.temp) + "&deg;";
    temp4[0].innerHTML = parseInt(data.list[30].main.temp) + "&deg;";
    temp5[0].innerHTML = parseInt(data.list[38].main.temp) + "&deg;";
  }
});