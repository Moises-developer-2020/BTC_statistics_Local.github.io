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

//set class [{ e: element, c: class }]
function setClass(d = [{ e: null, c: '' }]) {
    let elements = d;
    for (let i = 0; i < elements.length; i++) {
        elements[i]['e'].classList.add(elements[i]['c']);
    }
}

//remove class
function removeClass(d = [{ e: null, c: '' }]) {
    let elements = d;
    for (let i = 0; i < elements.length; i++) {
        elements[i]['e'].classList.remove(elements[i]['c']);
    }
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