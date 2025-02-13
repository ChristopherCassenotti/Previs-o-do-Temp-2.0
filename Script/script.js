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


//function

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

    prev00.innerHTML = parseInt(data.list[3].main.temp) + "&deg;";
    prev06.innerHTML = parseInt(data.list[5].main.temp) + "&deg;";
    prev12.innerHTML = parseInt(data.list[7].main.temp) + "&deg;";
    prev18.innerHTML = parseInt(data.list[9].main.temp) + "&deg;";

  }
