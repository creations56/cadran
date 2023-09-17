  
// voir point ci dessous ligne = 281
//long=parseFloat(long,10); !!!!! pourquoi pas bon ?


var HL=new Date(); // heure legale
var UTC=new Date(); // heure UTC
var HSM= new Date(); // heure solaire moyenne
var HSV=new Date(); // heure solaire vraie
//var midiSolaire=new Date(); // heure du midi solaire

var nombreJours=0;// nbr de jours depuis le 1er janvier

var decalageHL=0; // decalage heure UTC par rapport a HL
var decalageHSM=0;// decalage heure HSM par rapport a HL
var decalageHSV=0;// decalage heure HSV par rapport a HL, HL=HSV-decalageHSV

//var decSol=0; // declinaison du Soleil
var HLS=0; // heure du lever de soleil
var HCS=0; // heure du coucher de soleil
var ALS=0; // azimut au lever du soleil
var ACS=0; // azimut au coucher du soleil
var hautSolMidi=0; // hauteur du soleil a midi
var HSVangulaire=0;// heure solaire vraie angulaire

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
  let ap=3; // nombre de chiffres apres le point
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

function arrondi1(x) {
  // arrondi a 1 decimales
  y=Math.round(x*10)/10;
  //y=addZeroes(y);// ajoute des zeros si besoin
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
  declinaisonSol();
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
  document.getElementById("idHL").textContent=formatHeure;
}

// --- afiche coordoneees solaire
function afficheSol() {
  
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
  nombreJours=0;// raz nbr de jours depuis le 1er janvier
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
  decalageHSV=long/15-decalageHL-deltaT/60; // HL=HSV-decalageHSV
  HSV.setTime(HL.getTime() + (decalageHSV*60*60*1000));
  let formatHeure=""; // variable locale
  let heureHSV=HSV.getHours();
  let minuteHSV=HSV.getMinutes();
  formatHeure=ajouteZero(heureHSV)+" H "+ajouteZero(minuteHSV)+" mn";
  HSVangulaire=180*((heureHSV+(minuteHSV/60))/12-1); // heure vraie angulaire
  if (lat!=99) {affichHSV=formatHeure }// -----
  document.getElementById("idHSV").textContent=affichHSV;
  // calcul midi solaire 
  //midiSolaire.setHours(12-decalageHSV);
  //if (lat!=99) {declinaisonSol();} // calcul de la hauteur du soleil
  let midiSol=12-decalageHSV;
  let heureMidi= Math.floor(midiSol);
  let minuteMidi= Math.ceil(frac(midiSol)*60);
  formatHeureMidi=ajouteZero(heureMidi)+" H "+ajouteZero(minuteMidi);
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
  declinaisonSol();
  afficheSol();
}


// --------------------------------------
// ---------- geolocalisation -----------
// --------------------------------------

function affichageLatLong(){
if (lat!=99){
document.getElementById("idLatLong").textContent="lat = "+formatNombre(lat) + "° , "+"long = "+formatNombre(long)+"°";}
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
  document.getElementById("idLatLong").textContent="localisation en cours (environ 2 s)";
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
  //lat=parseFloat(lat, 10);
  lat=lat*1;
  long=long*1;
  if (lat>90) {lat=90;}
  if (lat<-90) {lat=-90;}
  if (long>180) {long=180;}
  if (long<-180) {long=-180;}
  majAffichages();
  //latLong="actif";
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
// ----------- position du soleil ------------
// -------------------------------------------

function declinaisonSol() {
// calcul la declinaison, la hauteur, l'azimut et les heures de lever et coucher su Soleil
// utiliser HSV() avant cette fonction, pour que nombreJours soit calcule

let A=0;
let decSol=0;
let formatHautSol=", haut= --°";
let formatLeverSol="-- H -- mn , az= -- °";
let formatCoucherSol="-- H -- mn , az= -- °";
let formatPosSol="haut= --°, az= -- °";
let ecartAngulaire=0;
let azLever=0;
let azCoucher=0;
//let Ah=0; // temps solaire vrai ??????
let hautSolHeure=0; // hauteur soleil a heure vraie
let azSolHeure=0; // azimut soleil a heure vraie

if (lat<=90){ // si lat inconnue alors lat=99
// declinaison
// Dec = arcsin ( sin (23,45 / 180 * pi) x sin ( 2 x pi / 365,25 x (J-81)))
let B=(2*Math.PI/365.25*(nombreJours-81));
A=Math.sin(23.45/180*Math.PI)*Math.sin(2*Math.PI/365.25*(nombreJours-81));
decSol=Math.asin(A);// declinaison en radians
// .....
// hauteur soleil a midi
hautSolMidi=Math.round(90-lat+(decSol/Math.PI*180));// modifier 
formatHautSol=", haut="+hautSolMidi+"°";
// .....
// azimut et hauteur soleil a heure vraie
hautSolHeure= Math.asin(Math.sin((lat/180*Math.PI)*Math.sin(decSol/180*Math.PI))+Math.cos(lat/180*Math.PI)*Math.cos(decSol/180*Math.PI)*Math.cos(HSVangulaire/180*Math.PI)); // valeur en rd
azSolHeure= Math.asin(Math.cos(decSol/180*Math.PI)*Math.sin(HSVangulaire/180*Math.PI)/Math.cos(hautSolHeure));
formatPosSol=" haut= "+Math.round(hautSolHeure/Math.PI*180)+"° , az="+ Math.round(azSolHeure/Math.PI*180+180)+" °";
///......
// ecart angulaire lever/ coucher
// EA = arccos ( -sin( Dec ) / cos (Lat) ) 
ecartAngulaire=Math.acos(-Math.sin(decSol)/Math.cos(lat/180*Math.PI));// rd
//alert(ecartAngulaire);// --------------
azLever= Math.round(180-ecartAngulaire/Math.PI*180);
azCoucher= Math.round(180+ecartAngulaire/Math.PI*180);
// heure de coucher et de lever
//A2= arccos ( -tan ( Lat) x tan ( Dec)     en radians 
//DJ = A / pi x 180 /15 x2 en heures
let A2=Math.acos(-Math.tan(lat/180*Math.PI)*Math.tan(decSol));
let dureeJour=A2/Math.PI*180/15*2; // heures decimales
hdLever=12-decalageHSV-dureeJour/2; // heure locale decimale
hdCoucher=12-decalageHSV+dureeJour/2; // heure locale decimale
formatLeverSol=Math.floor(hdLever)+" H "+Math.round(frac(hdLever)*60)+" mn , az= "+azLever+" °";
formatCoucherSol=Math.floor(hdCoucher)+" H "+Math.round(frac(hdCoucher)*60)+" mn , az= "+azCoucher+" °";
}

else {
  formatHautSol=", haut= --°"; // ?
}

document.getElementById("idmidi2").textContent=formatHautSol;
document.getElementById("idHLS").textContent=formatLeverSol;
document.getElementById("idHCS").textContent=formatCoucherSol;
document.getElementById("idHSVang").textContent=formatPosSol;
}


// -------------------------------------------
// ------------- initialisation --------------
// -------------------------------------------
function initialisation(){
  HL = new Date();
  decalageHL=-1*HL.getTimezoneOffset()/60;
  majAffichages();
}
