var jour=1;
var mois=1;
var annee=1;
var heure=1;
var minute=1;
var seconde=1;
var jourUTC=1;
var moisUTC=1;
var anneeUTC=1;
var heureUTC=1;
var minuteUTC=1;
var secondeUTC=1;
var timeZone=0;
const nomMois = ['jan', 'fev', 'mars', 'avr', 'mai', 'juin', 'juil', 'aout', 'sept', 'oct','nov','dec'];
var lat=999;  // latitude
var long=999; // longitude
// ne pas utiliser de variable pour les elements definis par id

function refresh(){
var t = 1000; // rafraîchissement en millisecondes
setTimeout('majHeure()',t)
}

function affichage(){
  let mois2=mois+1;
document.getElementById("log-area2").textContent = jour+ " : " +mois2+ " : "+annee+ "\n"+heure+" : "+minute+" : "+seconde;
}

function ajouteZero(val){
  // ajoute un zero si nombre <10, retourne un string
  let x="";
  x=String(val).padStart(2,'0');
  return x;
}

function majHeure()  {
let now = new Date(); // la date et heure actuelle
let formatHeure="";
let formatDate="";
jour=now.getDate();
mois=now.getMonth();
annee=now.getFullYear();
heure=now.getHours();
minute=now.getMinutes();
seconde=now.getSeconds();
jourUTC=now.getUTCDate();
moisUTC=now.getUTCMonth();
anneeUTC=now.getUTCFullYear();
heureUTC=now.getUTCHours();
minuteUTC=now.getUTCMinutes();
secondeUTC=now.getUTCSeconds();

timeZone=String(-1*now.getTimezoneOffset()/60);
if (now.getTimezoneOffset()<0){
  timeZone="+"+timeZone;
}

// affiche heure systeme
formatHeure=ajouteZero(heure)+" H "+ajouteZero(minute)+" mn "+ajouteZero(seconde)+" s";
formatDate=ajouteZero(jour)+" "+nomMois[mois]+" "+annee;
document.getElementById("l1c1").textContent = formatDate+"\n"+formatHeure+"\n"+"fuseau horaire GMT "+timeZone;

// affiche heure UTC
formatHeure=ajouteZero(heureUTC)+" H "+ajouteZero(minuteUTC)+" mn "+ajouteZero(secondeUTC)+" s";
formatDate=ajouteZero(jourUTC)+" "+nomMois[moisUTC]+" "+anneeUTC;
document.getElementById("l1c2").textContent = formatDate+"\n"+formatHeure;
refresh();
}

function initialisation(){
  majHeure();
}

// ---------- geolocalisation ----------



function affichage(){
  document.getElementById("l3c1").value="Latitude: " + lat + "\n"+"longitude: " + long;
  //let logArea = document.getElementById("l3c1");
  //logArea.value = "";
  //logArea.value += "Latitude: " + position.coords.latitude + "\n";
  //logArea.value += "Longitude: " + position.coords.longitude + "\n";
}

function successHandler(position)  {
  // Success Handler
  //let logArea = document.getElementById("l3c1");
  //logArea.value = "";
  //logArea.value += "Latitude: " + position.coords.latitude + "\n";
  //logArea.value += "Longitude: " + position.coords.longitude + "\n";
  lat=position.coords.latitude;
  long=position.coords.longitude;
}

function errorHandler(positionError)  {
   // Error Handler
   if(positionError.code == 1) { // PERMISSION_DENIED
       alert("Error: Permission Denied! " + positionError.message);
   } else if(positionError.code == 2) { // POSITION_UNAVAILABLE
       alert("Error: Position Unavailable! " + positionError.message);
   } else if(positionError.code == 3) { // TIMEOUT
       alert("Error: Timeout!" + positionError.message);
   }
}

function miseEnAttente(){
  // appel d'affichage
  document.getElementById("l3c1").value="attente des valeurs de geolocalisation (environ 2 secondes) ...";
    setTimeout(affichage, 2000); //On attend 5 secondes avant d'exécuter la fonction
}

function affichageCoord()  {
  document.getElementById("l3c1").value="attente des valeurs de geolocalisation (environ 2 secondes) ...";
  navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
  miseEnAttente();// if faut attendre que successHandler retourne les valeurs de lat et long
}


