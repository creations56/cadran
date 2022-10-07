// definition des constantes / variables

let now = new Date(); // la date et heure actuelle
let latitude = 0;
let longitude = 0;
let localisation = document.getElementById('localisation');
let jour=1;
let mois=1;
let annee=2020;
let entree = document.getElementById("in");
let date2 = document.getElementById("date2");
let latitude_in=document.getElementById("latitude");
let longitude_in=document.getElementById("longitude");

// date et heure
jour=now.getDate();
mois=now.getMonth()+1;
annee=now.getFullYear();
date1.textContent = "Nous sommes le : "+jour+"/"+mois+"/"+annee;
date2.value = jour+"/"+mois+"/"+annee;

function getValue() {
    // Sélectionner l'élément input et récupérer sa valeur
    entree_valeur= entree.value;
    // Afficher la valeur
    alert(entree_valeur);
    entree.value=entree_valeur+" modifié";   
  }

// permet de declencher une action si clicksur bouton "bouton1"
document.getElementById('bouton1').addEventListener('click', boutonAppuye);

function boutonAppuye() {
  localisation.textContent="bouton appuyé";
  getLocation();
  localisation.textContent= "Latitude ="+latitude+" , Longitude ="+longitude;  
  latitude_in.value=latitude;
  longitude_in.value=longitude;
}

function getLocation() {
  function affectPosition(position) {
  latitude= position.coords.latitude;
  longitude= position.coords.longitude;
  }
  localisation.textContent="localisation impossible sur ce navigateur";
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(affectPosition);
  } else { 
    latitude= 0;
    longitude= 0;
    localisation.textContent  = "Geolocation is not supported by this browser.";
  }
}


