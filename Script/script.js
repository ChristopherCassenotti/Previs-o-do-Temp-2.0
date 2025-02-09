const apiKey = "6e496b0c0a1d24da18427ab07fb3e8bd";

var pesquisa_btn = document.querySelector("#pesquisa_btn");
var cidade_input = document.querySelector("#cidade_input");
var nuvens_map = document.querySelector("#nuvens_map");









//Criação do MAPA

document.addEventListener("DOMContentLoaded", function () {
    let map = L.map("map").setView([0, 0], 2);
  
    // Adiciona mapa base do OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    
    // Adiciona camada base
    let weatherLayer = L.tileLayer(`https://tile.openweathermap.org/map/temp_new//{z}/{x}/{y}.png?appid=${apiKey}`);;
    
    nuvens_map.addEventListener("click", (e) =>{
        e.preventDefault();
    
        const mod_map = L.tileLayer(`https://tile.openweathermap.org/map/clouds_new//{z}/{x}/{y}.png?appid=${apiKey}`);      
    
            weatherLayer = mod_map;
    
            return weatherLayer;
    });
    

    weatherLayer.addTo(map);
    

            
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
          map.setView([lat, lon], 10);
          L.marker([lat, lon]).addTo(map).bindPopup(location).openPopup();
        })
        .catch((error) => console.error(error));

    };


  });
  
