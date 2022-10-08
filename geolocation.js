var lat=999;
var long=999;

function affichage(){
  document.getElementById("log-area2").value=lat+" , "+long;
}

function successHandler(position)  {
  // Success Handler
  let logArea = document.getElementById("log-area");
  logArea.value = "";
  logArea.value += "Latitude: " + position.coords.latitude + "\n";
  logArea.value += "Longitude: " + position.coords.longitude + "\n";
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
  document.getElementById("log-area2").value="attente des valeurs de geolocalisation (environ 5 secondes) ...";
    setTimeout(affichage, 1000); //On attend 5 secondes avant d'exécuter la fonction
}

function showInfos()  {
  navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
  miseEnAttente();// if faut attendre que successHandler retourne les valeurs de lat et long
  //document.getElementById("log-area2").value=lat+" , "+long;
  //affichage();
}


