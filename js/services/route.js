let Searchparameter; //global variable


let statusReload = 1; //the firts load
let closes=1; //avoid to remove and set again the class active to pages when appear a innerRouter

function handleRouteChange() {
  
  //if(location.hash.split('/').length == 2 && closes == 1 || statusReload == 1){
    pagesRoutes();
  //}
 
  innerRoutes();
  statusReload =2;
}
function pagesRoutes() {
 
  // get route from url
  var route;
  // validate pages whithout hash "home page"
  if(location.hash !== ""){
    route=location.hash.split('/')[1];
  }else{
    route = location.hash;
  }
  
  // show router
  showRoute(route);
  
}

function showRoute(route) {

  closeRouteSection();
  closeInnerRoutes();

  var targetSection = document.getElementById(route + 'Section');
  //if exist show it
  if (targetSection) {
    targetSection.classList.add('active');
  } else {
    // route not found
    var contentDiv = document.getElementById('PageNotFound');
    contentDiv.classList.add('active');
  }
}

function innerRoutes() {

  var route = location.hash.split('/')[2];
  //if there is a inner route in the hash
  if (route) {

    showInnerRoute(route);
    
  }else{
    
    closeInnerRoutes();
  }
  
}

function showInnerRoute(route) {
  Searchparameter = route.split('?')[1]
  console.log("()"+Searchparameter);
  let innerRoute = route.split('?')[0]


  closeInnerRoutes();

  var targetSection = document.getElementById(innerRoute + 'Section');
   //if exist show it
  if (targetSection) {
    
    targetSection.classList.add('active');
  } else {// route not found

    // close is parent to
    closeRouteSection();

    var contentDiv = document.getElementById('PageNotFound');
    contentDiv.classList.add('active');
  }



}


// show pages
function navigateTo(route) {
 
  let path = window.location.pathname;
  let hash = window.location.hash;

  // validate if the hash is the same
  if(hash !== `#${route}`){
    
    // if(route == "/home"){
    //   //home page
    //   window.history.pushState(null, null, `${path}#/`);
    // }else{
      
      //others page
      window.history.pushState(null, null, `${path}#${route}`);
    //}
    handleRouteChange();
  }else if(hash == ""){
    
    handleRouteChange();
  }
  
}
function keepTo(route) {
  let path = window.location.pathname;
  let hash = window.location.hash;
  

  if(hash !== `#${route}` && route == '/'){
    
    window.history.replaceState(null, null, `${path}`);

    handleRouteChange();
  }else if(hash !== `#${route}`){// validate if the hash is the same
    
      window.history.replaceState(null, null, `${path}#${route}`);
      
      handleRouteChange();
  }
}

// show inner routers
function showTo(route) {

  let validateHash,validatRoute;

  let path = window.location.pathname;
  let hash = window.location.hash;
  
  // validate if have parameter
  if(route.includes("?")){

    validateHash = hash.split('/')[2]?hash.split('/')[2].split('?')[1]:hash.split('/')[1].split('?')[1];
    validatRoute = route.split('/')[1].split('?')[1];
    
    // validate if the parameter is the same to avoid save history
    if(validateHash !== validatRoute && validateParent(route,true)){
      window.history.pushState(null, null, `${path}#/${hash.split('/')[1]}${route}`);
      handleRouteChange();
    }

  }else{ // not parameter

    validateHash = hash.split('/')[2];
    validatRoute = route.split('/')[1];
    
    // validate if the hash is the same to avoid save history
    if(validateHash !== validatRoute && validateParent(route,false)){
      window.history.pushState(null, null, `${path}#/${hash.split('/')[1]}${route}`);
      handleRouteChange();
    }
  }
  
}

// close inner router
function closeTo() {
  closes=0;
  let hash = window.location.hash.split('/');

  //validate if the pages was closed to avoid save history
  if(hash.length > 2){
    window.history.pushState(null, null, `${hash[0]}/${hash[1]}`);
    handleRouteChange();
  }
  
}

function closeRouteSection() {
  var routeSections = document.querySelectorAll('.route-section');

  // hidde all sections
  routeSections.forEach(function (section) {

    section.classList.remove('active');

  });
}
function closeInnerRoutes() {
  
  var innerRouteSections = document.querySelectorAll('.innerRoute-section');

  // hidde all sections
  innerRouteSections.forEach(function (section) {

    section.classList.remove('active');

  });
  closes =1;
}

//validate that only children "InnerRoutes" are open when is parent is opened
function validateParent(route, parameter=false){
  
  let innerRoute;
  if(parameter){
    innerRoute = route.split('/')[1].split('?')[0]
  }else{
    innerRoute = route.split('/')[1]
  }
 
  var targetSection = document.getElementById(innerRoute + 'Section');
  // if route exist
  if (targetSection) {
    
    let statusParent =targetSection.parentElement.classList.contains('active');

    // if is parent is opened
    if(statusParent){
      return true;
    }
    return false;
  }
  return false;
  
}
// verify what ruta it is to avoid load data 
function verifyRoute(routeToVerify){
  
  // if(routeToVerify == "/home"){
   
  //   if(location.hash == "#/"){
  //     return true
  //   }
  //   return false
  // }
  let actual;
  if(location.hash){
    actual =location.hash.split('#')[1].split("/")[1];
  }
  if("/"+actual !== routeToVerify){
      return false
  }
  return true
  
}
//verifyRoute('/home')
// handle the change of hash from url
//window.addEventListener('load', handleRouteChange);

//event of route
function routeEvent(event, handle){
  switch (event) {
    case 'hashchange':

      window.addEventListener('hashchange',function(){
        handleRouteChange();
        handle();
      })

      break;
      case 'load':

      window.addEventListener('load',function(){
        handleRouteChange();
      })

      break;
    default:

      break;
  }
}

routeEvent('load',()=>{});


