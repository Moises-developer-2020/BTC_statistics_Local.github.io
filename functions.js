let online_offline;

//check if exist
function checkStorageData(item) {
    return localStorage.getItem(item) !== null;
}

//get
function getStorageData(item) {
    return localStorage.getItem(item);
}

//set
function setStorageData(key,name,miObjeto) {
    switch (key) {
        case 'json':
            let miObjetoJSON = JSON.stringify(miObjeto);
            localStorage.setItem(name, miObjetoJSON);
            break;
        default:
            localStorage.setItem(name, miObjeto);
            break;
    }
}

//set class
function setClass(element, classElement){
    element.classList.add(classElement);
}

//remove class
function removeClass(element, classElement){
    element.classList.remove(classElement);
}
//get element
function getElement(selector) {
    return document.querySelector(selector);
}
//GET API
async function fetchData() {

    if(window.navigator.onLine){
        try {
            const response = await fetch("https://production.api.coindesk.com/v2/tb/price/ticker?assets=BTC");
            const data = await response.json();
            online_offline = true;
            return data;
        } catch (error) {
            online_offline = false;
        }
    }else online_offline = false;

}

//get BD
async function fetchBD() {


}