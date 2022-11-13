var HL=new Date(); // heure legale
var UTC=new Date(); // heure UTC
var HSM= new Date(); // heure solaire moyenne
var HSV=new Date(); // heure solaire vraie
//var midiSolaire=new Date(); // heure du midi solaire

var decalageHL=0; // decalage heure UTC par rapport a HL
var decalageHSM=0;// decalage heure HSM par rapport a HL
var decalageHSV=0;// decalage heure HSV par rapport a HL

const nomMois = ['jan', 'fev', 'mars', 'avr', 'mai', 'juin', 'juil', 'aout', 'sept', 'oct','nov','dec'];
const nbJoursMois = [31,28,31,30,31,30,31,31,30,31,30,31];
const nbJoursMois_b = [31,29,31,30,31,30,31,31,30,31,30,31];

var lat=99;  // latitude non valide
var long=0; // longitude
//var latLong="non_actif"; // pas de valeurs lat long actifs
// ne pas utiliser de variable pour les elements definis par id

// ----------------------------------
// ------ fonctions diverses --------
// ----------------------------------

function formatNombre(x) {
  // format le nombre x et retourne une chaine formatee
  // ajoute un plus devant le nombre si positif
  let av=2; // nombre de chiffres avant le point
  let ap=3; // nombre de chiffres apres le poiny
  let pos=0; // position du point dans la chaine
  let valeur=x*1; // enleve les zero residuels ?
  let multi=10**ap;
  valeur =Math.round(valeur*multi)/multi;
  let chaineTotale=valeur+"";// converti nombre en chaine
  let chaineDec="";
  let chaineFrac="";
  // si negatif on enleve le - et on le stocke
  let signe="+";
  if (chaineTotale.substring(0, 1)=="-"){
    chaineTotale=chaineTotale.substring(1);
    signe="-";  
  }
  // partie decimale et partie frac
  pos=chaineTotale.indexOf('.');
  if (pos==-1) {chaineDec=chaineTotale;chaineFrac=""} // pas de point
  else {chaineDec=chaineTotale.substring(0, pos); chaineFrac=chaineTotale.substring(pos+1)}
  // ajout de zeros partiefrac
  while (chaineFrac.length<ap){chaineFrac=chaineFrac+"0"}// ajout de zero
  // ajout de zeros partie decimale
  while (chaineDec.length<av){chaineDec="0"+chaineDec}// ajout de zero
  // recomposition chaineTotale
  chaineTotale=signe+chaineDec+"."+chaineFrac;
  return chaineTotale;
}

function addZeroes( value ) {
    // utilise par fonction arrondi
    var new_value = value*1; //removes trailing zeros
    new_value = new_value+''; //casts it to string
    pos = new_value.indexOf('.');
    if (pos==-1) new_value = new_value + '.000';
    else {
        var integer = new_value.substring(0,pos);
        var decimals = new_value.substring(pos+1);
        while(decimals.length<3) decimals=decimals+'0';
        new_value = integer+'.'+decimals;
    }
    return new_value;
  }

function arrondi(x) {
  // arrondi a 3 decimales
  y=Math.round(x*1000)/1000;
  y=addZeroes(y);// ajoute des zeros si besoin
  return y;
}

function ajouteZero(val){
  // ajoute un zero avant si nombre <10, retourne un string
  let x="";
  x=String(val).padStart(2,'0');
  return x;
}

function frac(x) {
  let y=parseFloat(x); //converti en nombre si besoin
  y= y-Math.floor(y);
  return y;
}


// --------------------------------------
// ----- actualisation date/heure -------
// --------------------------------------

function heureAuto() {
  // appelle par bouton actualisation de l'heure
  let now= new Date();
  HL.setTime(now.getTime());
  decalageHL=-1*HL.getTimezoneOffset()/60;
  afficheDate();
  afficheHL();
  calculUTC();
  calculHSV();
  calculHSM();
  }
}

// --------------------------------------
// ----- affichage date et heures -------
// --------------------------------------


// ------ affiche date -----
function afficheDate(){
let jour=HL.getDate();
let mois=HL.getMonth();
let annee=HL.getFullYear();
let formatDate=ajouteZero(jour)+" "+nomMois[mois]+" "+annee;
document.getElementById("idDate").textContent = formatDate;
}

// -------- affiche heure legale -------
function afficheHL(){
  let formatHeure="";
  let decalageHL_texte="";
  let heureHL=HL.getHours();
  let minuteHL=HL.getMinutes();
  //decalageHL=String(-1*HL.getTimezoneOffset()/60);
  if (decalageHL>0){decalageHL_texte="+"+decalageHL;};
  formatHeure=ajouteZero(heureHL)+" H "+ajouteZero(minuteHL)+" mn"+" ("+"GMT "+decalageHL_texte+")";
  document.getElementById("l3").textContent=formatHeure;
}

// ----- calcul heure solaire moyenne , heure solaire vraie, heure UTC ------

function calculUTC() {
  // getUTChours non utilise
  UTC.setTime(HL.getTime()-decalageHL*60*60*1000);
  let formatHeure=""; // variable locale
  let heureUTC=UTC.getHours();
  let minuteUTC=UTC.getMinutes();
  formatHeure=ajouteZero(heureUTC)+" H "+ajouteZero(minuteUTC)+" mn ";
  document.getElementById("idUTC").textContent=formatHeure;
}

function calculHSM() {
  //ecartHeureLong=long/15+decalageHL;// ecart en heures lie a la longitude
  let affichHSM="-- H -- mn";
  decalageHSM=long/15-decalageHL; 
  HSM.setTime(HL.getTime() + (decalageHSM*60*60*1000));
  let formatHeure="-- H -- mn"; // variable locale
  let heureHSM=HSM.getHours();
  let minuteHSM=HSM.getMinutes();
  formatHeure=ajouteZero(heureHSM)+" H "+ajouteZero(minuteHSM)+" mn ";
  if (lat!=99) {affichHSM=formatHeure};
  document.getElementById("idHSM").textContent=affichHSM;
}

function calculHSV() {
  // calcul equation du temps , HSV=HSM−ΔT ou HSM=HSV+ΔT
  // variables affichage
  let affichET=String.fromCharCode(177)+" -- mn";
  let affichHSV="-- H -- mn";
  let affichMS="-- H -- mn";
  // calcul equation du temps
  let nombreJours=0;
  let B=0;
  let deltaT=0; // delta T en minutes
  let premierJanvier= new Date(HL.getFullYear(),0,1,0);// premier janvier
  let diffTemps = HL.getTime() - premierJanvier.getTime(); 
  nombreJours =  Math.floor(diffTemps / (1000 * 3600 * 24)+1); 
  B=2*Math.PI*(nombreJours-81)/365; 
  deltaT=7.678*Math.sin(B+1.374)-9.87*Math.sin(2*B);
  if (lat!=99) {affichET=Math.round(deltaT)+" mn" }// -----
  document.getElementById("idET").textContent=affichET;
  // calcul heure solaire vraie
  decalageHSV=long/15-decalageHL-deltaT/60;
  HSV.setTime(HL.getTime() + (decalageHSV*60*60*1000));
  let formatHeure=""; // variable locale
  let heureHSV=HSV.getHours();
  let minuteHSV=HSV.getMinutes();
  formatHeure=ajouteZero(heureHSV)+" H "+ajouteZero(minuteHSV)+" mn";
  if (lat!=99) {affichHSV=formatHeure }// -----
  document.getElementById("l5").textContent=affichHSV;
  // calcul midi solaire
  //midiSolaire.setHours(12-decalageHSV);
  let midiSol=12-decalageHSV;
  let heureMidi= Math.floor(midiSol);
  let minuteMidi= Math.ceil(frac(midiSol)*60);
  formatHeureMidi=ajouteZero(heureMidi)+" H "+ajouteZero(minuteMidi)+" mn";
  if (lat!=99) {affichMS=formatHeureMidi}// -----
  document.getElementById("idmidi").textContent=affichMS;
}

// --------------------------------------
// ---------- mise a jour affichages ----
// --------------------------------------
function majAffichages() {
  afficheDate();
  afficheHL();
  calculUTC();
  affichageLatLong();
  calculHSM();
  calculHSV();
  
}


// --------------------------------------
// ---------- geolocalisation -----------
// --------------------------------------

function affichageLatLong(){
if (lat!=99){
document.getElementById("idLatLong").textContent=formatNombre(lat) + "° , "+formatNombre(long)+"°";}
else {document.getElementById("idLatLong").textContent="coordonnées non détectées ou nulles";}
}

function successHandler(position)  {
  // Success Handler
  lat=position.coords.latitude;
  long=position.coords.longitude;
  //if (lat!=0 || long!=0) {latLong="actif"};
  //alert(latLong);
  //latLong="actif";
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
  document.getElementById("idLatLong").textContent="en cours (environ 2 s)";
    setTimeout(majAffichages, 2000); //On attend 5 secondes avant d'exécuter la fonction
}

// validation coordonnees automatiques
function affichageCoord()  {
  document.getElementById("idLatLong").textContent="en cours... (environ 2)";
  navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
  lat=99; 
  long=0;
  miseEnAttente();// if faut attendre que successHandler retourne les valeurs de lat et long
  }

// validation coordonnees manuelles 
function validCoordManuel() {
  lat = document.getElementById("latM").value;
  long= document.getElementById("longM").value;
  if (lat>90) {lat=90;}
  if (lat<-90) {lat=-90;}
  if (long>180) {long=180;}
  if (long<-180) {long=-180;}
  majAffichages();
  latLong="actif";
}
  
// -------------------------------------------
// ---- definition date heure manuelle -------
// -------------------------------------------

// validation heure legale manuelle
function setHLmanuelle() {
  // attention bien analyser dans l'ordre an, mois, jour
  
  // ------ an bissextile ?
  let liste=nbJoursMois;// liste des nb jours par mois non bissextile
  let an=HL.getYear();
  if (frac(an/100)==0) {an=an/100};// si siecle on compte les siecles
  if (frac(an/4)==0){liste=nbJoursMois};// bissextile
  
  // ----- mois
  let moisM=document.getElementById("idmois").value;
  if (moisM=="") {moisM="nv"} ;// chaine vide remplace par nv
  let moisM0=parseInt(moisM, 10); //de chaine vers numerique
  if (isNaN(moisM0)) {;} // entier non valide pas de changement de mois
  else {
    moisM0=Math.max(moisM0, 1); // valeur de 1 a 12
    moisM0= Math.min(moisM0, 12);
    document.getElementById("idmois").value=moisM0+""; // mise a jour input
    HL.setMonth(moisM0-1);//pour setMonth les mois vont de 0 a 11
  }
  
  // ----- jour
  let jourMax=liste[HL.getMonth()];
  //alert (jourMax);
  let jourM=document.getElementById("idjour").value;
  if (jourM=="") {jourM="nv"} ;// chaine vide remplace par nv
  let jourM0=parseInt(jourM, 10); //de chaine vers numerique
  if (isNaN(jourM0)) {;} // entier non valide pas de changement de mois
  else {
    jourM0=Math.max(jourM0, 1); // valeur de 1 a jourMax
    jourM0= Math.min(jourM0, jourMax);
    document.getElementById("idjour").value=jourM0+""; // mise a jour input
    HL.setDate(jourM0);
  }
  
  // ----- heure
  //let jourMax=liste[HL.getMonth()];
  //alert (jourMax);
  let heureM=document.getElementById("idheure").value;
  if (heureM=="") {heureM="nv"} ;// chaine vide remplace par nv
  let heureM0=parseInt(heureM, 10); //de chaine vers numerique
  if (isNaN(heureM0)) {;} // entier non valide pas de changement de mois
  else {
    heureM0=Math.max(heureM0, 0); // valeur de 0 a 23
    heureM0= Math.min(heureM0, 23);
    document.getElementById("idheure").value=heureM0+""; // mise a jour input
    HL.setHours(heureM0);
  }
  
  // ------- minute
  let minuteM=document.getElementById("idminute").value;
  if (minuteM=="") {heureM="nv"} ;// chaine vide remplace par nv
  let minuteM0=parseInt(minuteM, 10); //de chaine vers numerique
  if (isNaN(minuteM0)) {;} // entier non valide pas de changement de mois
  else {
    minuteM0=Math.max(minuteM0, 0); // valeur de 1 a 59
    minuteM0= Math.min(minuteM0, 59);
    document.getElementById("idminute").value=minuteM0+""; // mise a jour input
    HL.setMinutes(minuteM0);
  }
  
  // -------- GMT
  let GMTM=document.getElementById("idGMT").value;
  if (GMTM=="") {GMTM="nv"} ;// chaine vide remplace par nv
  let GMTM0=parseInt(GMTM, 10); //de chaine vers numerique
  if (isNaN(GMTM0)) {;} // entier non valide pas de changement de mois
  else {
    GMTM0=Math.max(GMTM0, -12); // valeur de -12 a 12
    GMTM0= Math.min(GMTM0,12);
    document.getElementById("idGMT").value=GMTM0+""; // mise a jour input
    decalageHL=GMTM0;
  }
  majAffichages();
}
 
// -------------------------------------------
// ------------- initialisation --------------
// -------------------------------------------
function initialisation(){
  HL = new Date();
  decalageHL=-1*HL.getTimezoneOffset()/60;
  afficheDate();
  afficheHL();
  calculUTC();
}