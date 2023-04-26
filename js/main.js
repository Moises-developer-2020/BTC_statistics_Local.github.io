var LastCheck;
var SavePriceInvert;
var Saveinvertion;
var price_invested_saved;
var DifferIndicator;
var firtsLoad=0;

const criptoID='BTC'; //only test before to implement more services
const indexCripto=0; //it is the position on the table, only test before to implement more services


//Api`s data
let critopApi={
    priceData:0,
    percentData:0,
    pricelow:0,
    priceHight:0
}

//Api`s data modifed to show them
let BTCjson = {
    status: {
        h: 0,
        l: 0,
        c: 0,
        difH: 0,
        difL: 0 //different with the Low price
    },
    percent: 0,
    earnings: 0,
    price_invested: 0,
    price_to_invest: 0
}

let saveStyle={
    diferenceH:'',
    diferenceL:'',
    priceDifferences:'',
    indicator:''
}

const elements = {
    price: $("#price"),
    Hight: $("#Hight"),
    Low: $("#Low"),
    percent: $("#percent"),
    btnReload: $("#btnReload"),
    btnBuy: $("#btnBuy"),
    investInput: $("#investInput"),
    btnCancelBuy: $("#btnCancelBuy"),
    earnings_today: $("#earnings_today"),
    price_invest: $("#price_invest"),
    invested_saved: $("#invested_saved"),
    profits: $(".profits"),
    center: $(".center"),
    statusD: $(".status"),
    diferenceH: $("#diferenceH"),
    diferenceL: $("#diferenceL"),
    priceDifferences: $("#priceDifferences"),
    indicator: $("#indicator"),
    savdDifferen: $("#savdDifferen"),
    priceSavdStorage: $("#priceSavdStorage"),
    infoLogin: $(".infoLogin"),
    optionTo: $(".optionTo"),
    singInButton: $("#singInButton"),
    inputName: $("#inputName"),
    inputPassword: $("#inputPassword"),
    inputEmail: $("#inputEmail"),
    formLogin: $(".login"),
    singInMsg: $(".singInMsg"),
    inputCenter: $(".inputCenter"),
    inputSingUp: $(".inputSingUp")
};
Object.assign(window, elements);

async function getRequestData(API){
    try {
        var data =API;

        critopApi.priceData = data.data.BTC.ohlc.c;
        critopApi.percentData = data.data.BTC.change.percent;
        critopApi.pricelow = data.data.BTC.ohlc.l;
        critopApi.priceHight = data.data.BTC.ohlc.h;

    } catch (error) {
        online_offline = false;
    }

    
    //console.log(online_offline);
}
//to see data just call user.
async function requestPainted() {
    
    //first load of the page
    if(firtsLoad == 0){
        getStyleSaved();

        //validate session and get his data
        const userStatus=await validateSession();
        if(!userStatus){
            //open login
            setClass([{e:formLogin,c:'active'}]);
            //hide all the main content
            setClass([{e:center,c:'disabled'}]);
        }
    }
    console.log(user);
    //getRequestData(await fetchData(API));

    if (online_offline && user.identified) {
        LastCheck = user.checkPrice[indexCripto]?user.checkPrice[indexCripto].coinPrice:0;

        if (Math.sign(critopApi.percentData) == -1 || Math.sign(critopApi.percentData) == -0) {
            setClass([{e:percent,c:"negative"}]);
        } else {
            removeClass([{e:percent,c:"negative"}]);
        }
        
        if (parseFloat(LastCheck) < parseFloat(critopApi.priceData)) {
            setClass([{e:diferenceH,c:"negative"} , {e:diferenceL,c:"positive"} , {e:priceDifferences,c:"positive"} , {e:indicator,c:"positive"}]);
            upDomwIndicator(0,0,price,'class','positive',0);

        } else if (parseFloat(LastCheck) != parseFloat(critopApi.priceData)) {
            removeClass([{e:diferenceH,c:"negative"},{e:diferenceL,c:"positive"},{e:priceDifferences,c:"positive"},{e:indicator,c:"positive"}]);
    
        }
        if (parseFloat(LastCheck) > parseFloat(critopApi.priceData)) {
            setClass([{e:diferenceH,c:"positive"} , {e:diferenceL,c:"negative"} , {e:priceDifferences,c:"negative"} , {e:indicator,c:"negative"}]);
            upDomwIndicator(0,0,price,'class','negative',0);

        } else if (parseFloat(LastCheck) != parseFloat(critopApi.priceData)) {
            removeClass([{e:diferenceH,c:"positive"},{e:diferenceL,c:"negative"},{e:priceDifferences,c:"negative"},{e:indicator,c:"negative"}]);
            
        }

        SavePriceInvert = user.criptos[indexCripto]?user.criptos[indexCripto].investedPrice[0].coinPrice:0;
        Saveinvertion = critopApi.priceData;
        BTCjson.price_invested = user.criptos[indexCripto]?user.criptos[indexCripto].investedPrice[0].price:0;
        invested_saved.innerHTML = BTCjson.price_invested;
        BTCjson.status.h = convertPrice(critopApi.priceHight, false, 0);
        BTCjson.status.l = convertPrice(critopApi.pricelow, false, 0);
        BTCjson.status.difH = convertPrice(critopApi.priceHight,'-' , critopApi.priceData); 
        BTCjson.status.difL = convertPrice(critopApi.priceData,'-' , critopApi.pricelow); 

        BTCjson.status.c = convertPrice(critopApi.priceData, false, 0);
        BTCjson.percent = parseFloat(critopApi.percentData).toFixed(2);


        diferenceH.innerHTML = BTCjson.status.difH
        diferenceL.innerHTML = BTCjson.status.difL

        priceDifferences.innerHTML = convertPrice(critopApi.priceData,'-' , LastCheck);

        //indicator of increase or decrease
        upDomwIndicator(DifferIndicator,priceDifferences.innerHTML,indicator,'style','opacity:0;','opacity:1;');
        

        priceSavdStorage.innerHTML = convertPrice(SavePriceInvert, false, 0); 
        savdDifferen.innerHTML = convertPrice(SavePriceInvert > 0 ? critopApi.priceData : 0, '-', SavePriceInvert);

        if (parseFloat(savdDifferen.innerHTML) < 0) {
            setClass([{e:savdDifferen,c:"negative"}]);
        } else {
            removeClass([{e:savdDifferen,c:"negative"}]);
        }


        price.innerHTML = BTCjson.status.c;
        Low.innerHTML = BTCjson.status.l;
        Hight.innerHTML = BTCjson.status.h;
        percent.innerHTML = BTCjson.percent;
        
        
        //check out the last change of the price to save it if it`s diferent
        checkToSAvedPrice();
        
        CalcularGanancia(parseFloat(BTCjson.price_invested), parseFloat(priceSavdStorage.innerHTML.replace(",", "")), parseFloat(price.innerHTML.replace(",", "")));
        firtsLoad=1;
        //display the time that has passed since invested
        showDate();
    }
};
 
//cconvert the price of API`s data to show them
function convertPrice(price, operator, secondPrice){
    let priceModifed;
    if(!operator){
        priceModifed = new Intl.NumberFormat('es-MX').format(parseFloat(price).toFixed(2));
    }else if(operator == '-'){
        priceModifed = new Intl.NumberFormat('es-MX').format((parseFloat(price).toFixed(2)) - (parseFloat(secondPrice).toFixed(2)));
    } 

    return priceModifed;
}
function upDomwIndicator(variable,compare,element,option,initStyle,endStyle){
    switch (option) {
        case 'style':
            if(variable != compare && compare !=0){
                element.setAttribute('style',initStyle);
                setTimeout(() => {
                    element.setAttribute('style',endStyle);
                    
                }, 300);
            }
            variable=compare;
            break;
        case 'class':
            setClass([{e:element,c:initStyle}]);
            setTimeout(() => {
                removeClass([{e:element,c:initStyle}]);
            }, 300);
            break;
        default:
            break;
    }
}
function CalcularGanancia(invested_money, Saved_price, Price_actual) {
    // Definimos la cantidad de dólares invertidos
    const dolaresInvertidos = invested_money;

    // Definimos la tasa de cambio actual en dólares por bitcoin
    const tasaCambio = Saved_price;

    // Calculamos la cantidad de bitcoins que se pueden comprar con los dólares invertidos
    const bitcoinsComprados = dolaresInvertidos / tasaCambio;

    // Suponiendo que la tasa de cambio subió a 65000 dólares por bitcoin, calculamos la ganancia en dólares
    const gananciaDolares = bitcoinsComprados * (Price_actual - tasaCambio);

    // Imprimimos el resultado en la consola
    BTCjson.earnings = new Intl.NumberFormat('es-MX').format(parseFloat(gananciaDolares).toFixed(2));
    earnings_today.innerHTML = BTCjson.earnings != 'NaN' ? BTCjson.earnings : 0;

    if (Math.sign(earnings_today.innerHTML) == -1 || Math.sign(earnings_today.innerHTML) == -0) {
        setClass([{e:earnings_today,c:"negative"}]);
    } else {
        removeClass([{e:earnings_today,c:"negative"}]);
    }
}
//animation to buy or reload
function submitGet() {
    if (!center.classList.contains('animation') && !statusD.classList.contains('statusAnimation')) {
        setTimeout(() => {
            removeClass([{e:center,c:'animation'},{e:statusD,c:'statusAnimation'}])
        }, 1500);
    }
    setClass([{e:center,c:'animation'} , {e:statusD,c:'statusAnimation'}]);

    requestPainted();
}
requestPainted();

//reload DATA
setInterval(() => {
    submitGet();
}, 15000); //15000, 10000

btnReload.onclick = function () {
    submitGet();
};

async function checkToSAvedPrice() {
    if (parseFloat(LastCheck) != parseFloat(critopApi.priceData)) {
        //diferent;
        await transaction('UpdateCheckPrice',{criptoID:criptoID, coinPrice:critopApi.priceData,index:indexCripto});

        saveStyles();
    }//else{ no diferent};
};


btnBuy.onclick = async function () {

    let data={
        coinPrice:Saveinvertion,
        investedPrice:BTCjson.price_to_invest,
        criptoID:criptoID,
        index:indexCripto
    }
    const re= await transaction('buy',data);
    console.log(re);

    submitGet();

    //close the invest window
    profits.setAttribute('style', 'height:0%;');
}

investInput.onclick = function () {
    //open the invest window
    profits.setAttribute('style', 'height:98%;');
    price_invest.focus();
}
btnCancelBuy.onclick = function () {
    //close the invest window
    profits.setAttribute('style', 'height:0%;');
}

price_invest.onkeyup = function () {
    if (price_invest.value != 0 || price_invest.value != '') {
        BTCjson.price_to_invest = price_invest.value;
    } else {
        BTCjson.price_to_invest = 0;
    }
}

//elapse time
var investedDate = document.getElementById("investedDate");
var elapseTim = document.getElementById("elapseTim");

//show date on window
function showDate() {
    investedDate.innerHTML = user.criptos[indexCripto]? DateformatContacts(user.criptos[indexCripto].investedPrice[0].date).dateSaved : "---, ---, --, -- &nbsp &nbsp &nbsp --:-- --";
    elapseTim.innerHTML = user.criptos[indexCripto]? validateElapseTime(user.criptos[indexCripto].investedPrice[0].date): "-- --- ---";
}


var sellSubmit = document.getElementById("sellSubmit");
sellSubmit.onclick = async function () {
    let data={
        coinPrice:Saveinvertion,
        investedPrice:BTCjson.price_to_invest,
        criptoID:criptoID,
        index:indexCripto,
        earned:BTCjson.earnings
    }
    const re= await transaction('sell',data);
    console.log(re);
    submitGet();
}


function getStyleSaved(){
    let savedStyle = checkStorageData('saveStyle')? getStorageData('saveStyle'):'';
    if(savedStyle != ''){
        let savedStyleParse = JSON.parse(savedStyle);
        if(savedStyleParse.indicator != ""){
            setClass([{e:diferenceH,c:savedStyleParse.diferenceH} , {e:diferenceL,c:savedStyleParse.diferenceL} , {e:priceDifferences,c:savedStyleParse.priceDifferences} , {e:indicator,c:savedStyleParse.indicator}]);
        }
    }
}
function saveStyles() {
    if(priceDifferences.classList.value !== undefined && diferenceH.className != null){
        
        saveStyle.diferenceH=diferenceH.classList.value;
        saveStyle.diferenceL=diferenceL.classList.value;
        saveStyle.priceDifferences=priceDifferences.classList.value;
        saveStyle.indicator=indicator.classList.value;
        setStorageData('json','saveStyle',saveStyle);

    }
}

//change type of login
optionTo.onclick = async function(){
    SingIn_Up=!SingIn_Up; //choose if sing In or Sing Up
    if(!SingIn_Up){
        setClass([{e:inputSingUp,c:'allow'}]);
        setClass([{e:infoLogin,c:'sing'}]);
        removeClass([{e:inputCenter,c:'allow'}]);

    }else{
        removeClass([{e:inputSingUp,c:'allow'}]);
        setClass([{e:inputCenter,c:'allow'}]);
        removeClass([{e:infoLogin,c:'sing'}]);

    }
}


//SingIn or Sing Up
singInButton.onclick = async function(){
    let data;
    if(SingIn_Up){
        data =await login('singIn',{email:inputEmail.value, password:inputPassword.value});
        singInMsg.innerHTML=`<span class="msm">${data.message}</span>`;

    }else{
        data =await login('singUp',{email:inputEmail.value,name:inputName.value, password:inputPassword.value});
        singInMsg.innerHTML=`<span class="msm">${data.message}</span>`; 
    }

    //working with a succesfully session
    if(data.status){
        requestPainted();
        removeClass([{e:formLogin,c:'active'}]);
        removeClass([{e:center,c:'disabled'}]);
    }
}


//window.addEventListener('beforeunload', saveStyles);


