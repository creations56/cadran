var HL=new Date();
var HSM= new Date();
var HSV=new Date();
var jour=1;// heure systeme
var mois=1;
var annee=1;
var heure=1;
var minute=1;
var seconde=1;
var jourUTC=1;// ? UTC
var moisUTC=1;
var anneeUTC=1;
var heureUTC=1;
var minuteUTC=1;
var secondeUTC=1;
var timeZone=0; //
var ecartUTCLong=0; // 
var heureHL=0; // heure legale
var minuteHL=0;
var heureUTC=0; // heure UTC
var minuteUTC=0;
var heureHSM=0; // heure solaire moyenne
var minuteHSM=0;
var heureHSV=0; // heure solaire vraie
var minuteHSV=0;
var decalageHL=0; // decalage heures par rapport a HL
var decalageHSM=0;
var decalageHSV=0;
const nomMois = ['jan', 'fev', 'mars', 'avr', 'mai', 'juin', 'juil', 'aout', 'sept', 'oct','nov','dec'];
var lat=999;  // latitude
var long=999; // longitude
// ne pas utiliser de variable pour les elements definis par id


// ---------- calcul heure systeme et heure UTC----------

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
var now = new Date(); // la date et heure actuelle 
//HL.setTime(now.getTime());
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
//formatHeure=ajouteZero(heureUTC)+" H "+ajouteZero(minuteUTC)+" mn "+ajouteZero(secondeUTC)+" s";
//formatDate=ajouteZero(jourUTC)+" "+nomMois[moisUTC]+" "+anneeUTC;
//document.getElementById("l1c2").textContent = formatDate+"\n"+formatHeure;
refresh();
}

// -------- affiche heure legale -------
function afficheHL(){
  let formatHeure="";
  heureHL=HL.getHours();
  minuteHL=HL.getMinutes();
  decalageHL=String(-1*HL.getTimezoneOffset()/60);
  if (HL.getTimezoneOffset()<0){decalageHL="+"+decalageHL;}
  formatHeure=ajouteZero(heureHL)+" H "+ajouteZero(minuteHL)+" mn"+"\n"+"GMT "+decalageHL;
  document.getElementById("l3").value=formatHeure;
}

// -------- affiche heure UTC -------
function afficheUTC(){
  let formatHeure="";
  heureUTC=HL.getUTCHours();
  minuteUTC=HL.getUTCMinutes();
  formatHeure=ajouteZero(heureUTC)+" H "+ajouteZero(minuteUTC)+" mn ";
  document.getElementById("l2").value=formatHeure;
}

// ----- calcul heure solaire moyenne , heure solaire vraie----------

function calculHSM() {
  ecartHeureLong=long/15-decalageHL;// ecart en heures lie a la longitude
  decalageHSM=long/15-decalageHL;
  //ecartHeureLong=0;
  // setTime getTime donne l'heure en millisecondes
  HSM.setTime(HL.getTime() + (ecartHeureLong*60*60*1000));
  let formatHeure=""; // variable locale
  heureHSM=HSM.getHours();
  minuteHSM=HSM.getMinutes();
  formatHeure=ajouteZero(heureHSM)+" H "+ajouteZero(minuteHSM)+" mn ";
  document.getElementById("l4").value=formatHeure;
}

function calculHSV() {
  // HSV=HSM−ΔT ou HSM=HSV+ΔT
  let nombreJours=0;
  let B=0;
  let deltaT=0; // delta T en minutes
  let premierJanvier= new Date(HL.getFullYear(),0,1,0);// premier janvier
  //premierJanvier.setUTCHours(-2);
  //let temp= new Date(HL.getFullYear(),2,20,0);//  
  let diffTemps = HL.getTime() - premierJanvier.getTime(); 
  nombreJours =  Math.floor(diffTemps / (1000 * 3600 * 24)+1); 
  B=2*Math.PI*(nombreJours-81)/365; 
  deltaT=7.678*Math.sin(B+1.374)-9.87*Math.sin(2*B);
  alert(B+" , "+deltaT);
  
  decalageHSV=long/15-decalageHL-deltaT/60;//
  HSV.setTime(HL.getTime() + (decalageHSV*60*60*1000));
  let formatHeure=""; // variable locale
  heureHSV=HSV.getHours();
  minuteHSV=HSV.getMinutes();
  formatHeure=ajouteZero(heureHSV)+" H "+ajouteZero(minuteHSV)+" mn "+" ("+deltaT+" mn)";
  document.getElementById("l5").value=formatHeure;
}

// ---------- geolocalisation ----------

function affichageLatLong(){
  document.getElementById("l3c1").value="latitude: " + lat + "°\n"+"longitude: " + long+"°";
  if (long!=999) {calculHSM();calculHSV()}// si valeur long entrée afficher HSM et HSV
}

function successHandler(position)  {
  // Success Handler
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
    setTimeout(affichageLatLong, 2000); //On attend 5 secondes avant d'exécuter la fonction
}

function affichageCoord()  {
  document.getElementById("l3c1").value="attente des valeurs de geolocalisation (environ 2 secondes) ...";
  navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
  miseEnAttente();// if faut attendre que successHandler retourne les valeurs de lat et long
  }
  
  function validCoordManuel() {
    lat = document.getElementById("latM").value;
    long= document.getElementById("longM").value;
    if (lat>90) {lat=90;}
    if (lat<-90) {lat=-90;}
    if (long>180) {long=180;}
    if (long<-180) {long=-180;}
    affichageLatLong();
  }
 
// ---------- geolocalisation ---------- 
  function initialisation(){
  majHeure();
  HL = new Date();
  afficheHL();
  afficheUTC();
}