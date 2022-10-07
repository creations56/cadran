// definition des constantes / variables


let latitude = 0;
let longitude = 0;
let jour=1;
let mois=1;
let annee=2020;

let localisation = document.getElementById('localisation');
let entree = document.getElementById("in");
let date2 = document.getElementById("date2");
let latitude_in=document.getElementById("latitude");
let longitude_in=document.getElementById("longitude");

let now = new Date(); // la date et heure actuelle

// permet de declencher une action si click sur bouton "bouton1"
document.getElementById('bouton1').addEventListener('click', boutonAppuye);


// date et heure
jour=now.getDate();
mois=now.getMonth()+1;
annee=now.getFullYear();
date1.textContent = now;
date2.value = jour+"/"+mois+"/"+annee;

function getValue() {
    // Sélectionner l'élément input et récupérer sa valeur
    entree_valeur= entree.value;
    // Afficher la valeur
    alert(entree_valeur);
    entree.value=entree_valeur+" modifié";   
  }

  
function boutonAppuye() {
  localisation.textContent="bouton appuyé";
  getLocation2();
}



// alternative geolocalisation



function getLocation2() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    localisation.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  localisation.innerHTML = "Latitude: " + position.coords.latitude + 
  "<br>Longitude: " + position.coords.longitude;
}


