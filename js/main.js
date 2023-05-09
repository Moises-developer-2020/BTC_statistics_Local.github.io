var LastCheck;
var SavePriceInvert;
var price_invested_saved;
var DifferIndicator;
var firtsLoad=0;


let typeChart=0; //between 0 to 1
let chartStyle=2; //between 1 to 4

//Api`s data
let critopApi={}

//Api`s data modifed to show them
let BTCjson = {
    coinSelected:{
        index:0, //position ex. 0 to 100
        id:'' //'BTC', 'ETH'
    }
}

let saveStyle={}

const elements = {
    btnReload: $("#btnReload"),
    btnBuy: $("#btnBuy"),
    earnings_today: $("#earnings_today"),
    price_invest: $("#price_invest"),
    invested_saved: $("#invested_saved"),
    center: $(".center"),
    statusD: $(".status"),
    priceDifferences: $("#priceDifferences"),
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

async function getRequestData(API,parameter="BTC"){
    try {
        var data =API;
        //console.log(data.data[parameter]);
        
        // critopApi.priceData = data.data.BTC.ohlc.c;
        // critopApi.percentData = data.data.BTC.change.percent;
        // critopApi.pricelow = data.data.BTC.ohlc.l;
        // critopApi.priceHight = data.data.BTC.ohlc.h;

        //save data of API on variable with the Symbol of cripto
        for (let i = 0; i < user.coins.length; i++) {
            critopApi[user.coins[i].symbol]={
                priceData : data.data[user.coins[i].symbol].ohlc.c,
                percentData : data.data[user.coins[i].symbol].change.percent,
                pricelow : data.data[user.coins[i].symbol].ohlc.l,
                priceHight : data.data[user.coins[i].symbol].ohlc.h
            }
            BTCjson[user.coins[i].symbol] = {
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
                price_to_invest: 0,
                coinPrice:0
            }
        }
        online_offline = true;
    } catch (error) {
        online_offline = false;
    }

    
    //console.log(online_offline);
}
//to see data just call user.
async function requestPainted() {
    
    //first load of the page
    if(firtsLoad == 0){

        //validate session and get his data
        const userStatus=await validateSession();
        if(!userStatus){
            //open login
            setClass([{e:formLogin,c:'active'}]);
            //hide all the main content
            setClass([{e:center,c:'disabled'}]);
        }
        if(user.coins[0] !== undefined && user.coins[0] !== ""){
            paintWallets();
        }

        for(var i=0; i< user.coins.length; i++){
            
            if(user.coins[0] !== undefined && user.coins[0] !== ""){
                let coin=user.coins[i].symbol;
                getStyleSaved(coin,i);
            }
            
        }
    }
    console.log(user);
    //take a peek if there is saved wallets
    if(user.coins[0] !== undefined && user.coins[0] !== ""){
        //get data of saved wallets
        getRequestData(await fetchData(API+`${getWalletSymbols()}`));
    }
    
    if (online_offline && user.identified && user.coins[0] != "") {
        for(var i=0; i< user.coins.length; i++){

            LastCheck = user.checkPrice[i]?user.checkPrice[i].coinPrice:0;

            let coin=user.coins[i].symbol;
            let diferenceL =$(".diferenceL",'all');
            let price =$(".price",'all');
            let percent= $(".percent",'all');
            let indicator= $(".indicator",'all');
            let Low= $(".Low",'all');
            let Hight= $(".Hight",'all');
            let diferenceH= $(".diferenceH",'all');
            let priceSavdStorage= $(".priceSavdStorage",'all');
            let savdDifferen= $(".savdDifferen",'all');
            const myCriptos= $('.myCriptos','all');
            let storagePrice;

            if (Math.sign(critopApi[coin].percentData) == -1 || Math.sign(critopApi[coin].percentData) == -0) {
                setClass([{e:percent[i],c:"negative"}]);
            } else {
                removeClass([{e:percent[i],c:"negative"}]);
            }
            
            if (parseFloat(LastCheck) < parseFloat(critopApi[coin].priceData)) {
                setClass([{e:diferenceH[i],c:"negative"} , {e:diferenceL[i],c:"positive"} , {e:priceDifferences,c:"positive"} , {e:indicator[i],c:"positive"}]);
                upDomwIndicator(0,0,price[i],'class','positive',0);
                
                upDomwIndicator(0,0,myCriptos[i],'class','positive',0);
            } else if (parseFloat(LastCheck) != parseFloat(critopApi[coin].priceData)) {
                removeClass([{e:diferenceH[i],c:"negative"},{e:diferenceL[i],c:"positive"},{e:priceDifferences,c:"positive"},{e:indicator[i],c:"positive"}]);
        
            }
            if (parseFloat(LastCheck) > parseFloat(critopApi[coin].priceData)) {
                setClass([{e:diferenceH[i],c:"positive"} , {e:diferenceL[i],c:"negative"} , {e:priceDifferences,c:"negative"} , {e:indicator[i],c:"negative"}]);
                upDomwIndicator(0,0,price[i],'class','negative',0);

                upDomwIndicator(0,0,myCriptos[i],'class','negative',0);

            } else if (parseFloat(LastCheck) != parseFloat(critopApi[coin].priceData)) {
                removeClass([{e:diferenceH[i],c:"positive"},{e:diferenceL[i],c:"negative"},{e:priceDifferences,c:"negative"},{e:indicator[i],c:"negative"}]);
                
            }

            //detect which wallets I invested
            for (let j = 0; j < user.criptos.length; j++) {
                const idCripto = user.criptos[j].idCripto;
                if (coin === idCripto) {
                    storagePrice=user.criptos[j].investedPrice[0].coinPrice;
                    //remove class not_buys
                    removeClass([{e:myCriptos[i],c:"not_buys"}]);
                    
                    //display the time that has passed since invested
                    showDate(i, j);

                    //save price to show chat of the invested coin only when it is different
                    if (parseFloat(LastCheck) != parseFloat(critopApi[coin].priceData)) {
                        save_price_to_chart(coin,critopApi[coin].priceData);

                    }

                    break
                }else{
                    storagePrice=0;
                }
                
            }
            
            SavePriceInvert = storagePrice;
            BTCjson[coin].coinPrice = critopApi[coin].priceData;
            BTCjson[coin].price_invested = user.criptos[i]?user.criptos[i].investedPrice[0].price:0;
            invested_saved.innerHTML = BTCjson[coin].price_invested;
            BTCjson[coin].status.h = convertPrice(critopApi[coin].priceHight, false, 0);
            BTCjson[coin].status.l = convertPrice(critopApi[coin].pricelow, false, 0);
            BTCjson[coin].status.difH = convertPrice(critopApi[coin].priceHight,'-' , critopApi[coin].priceData); 
            BTCjson[coin].status.difL = convertPrice(critopApi[coin].priceData,'-' , critopApi[coin].pricelow); 

            BTCjson[coin].status.c = convertPrice(critopApi[coin].priceData, false, 0);
            BTCjson[coin].percent = parseFloat(critopApi[coin].percentData).toFixed(2);


            diferenceH[i].innerHTML = BTCjson[coin].status.difH
            diferenceL[i].innerHTML = BTCjson[coin].status.difL

            priceDifferences.innerHTML = convertPrice(critopApi[coin].priceData,'-' , LastCheck);

            //indicator of increase or decrease
            upDomwIndicator(DifferIndicator,priceDifferences.innerHTML,indicator[i],'style','opacity:0;','opacity:1;');
            

            priceSavdStorage[i].innerHTML = convertPrice(SavePriceInvert, false, 0); 
            savdDifferen[i].innerHTML = convertPrice(SavePriceInvert > 0 ? critopApi[coin].priceData : 0, '-', SavePriceInvert);

            if (parseFloat(savdDifferen[i].innerHTML) < 0) {
                setClass([{e:savdDifferen[i],c:"negative"}]);
            } else {
                removeClass([{e:savdDifferen[i],c:"negative"}]);
            }


            price[i].innerHTML = BTCjson[coin].status.c;
            Low[i].innerHTML = BTCjson[coin].status.l;
            Hight[i].innerHTML = BTCjson[coin].status.h;
            percent[i].innerHTML = BTCjson[coin].percent;
            
            
            //check out the last change of the price to save it if it`s diferent
            checkToSAvedPrice(coin, i);
            
            CalcularGanancia(parseFloat(BTCjson[coin].price_invested), parseFloat(priceSavdStorage[i].innerHTML.replace(",", "")), parseFloat(price[i].innerHTML.replace(",", "")),coin);
            firtsLoad=1;
            
        }
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
            }, 700);
            break;
        default:
            break;
    }
}
function CalcularGanancia(invested_money, Saved_price, Price_actual,coin) {
    // Definimos la cantidad de dólares invertidos
    const dolaresInvertidos = invested_money;

    // Definimos la tasa de cambio actual en dólares por bitcoin
    const tasaCambio = Saved_price;

    // Calculamos la cantidad de bitcoins que se pueden comprar con los dólares invertidos
    const bitcoinsComprados = dolaresInvertidos / tasaCambio;

    // Suponiendo que la tasa de cambio subió a 65000 dólares por bitcoin, calculamos la ganancia en dólares
    const gananciaDolares = bitcoinsComprados * (Price_actual - tasaCambio);

    // Imprimimos el resultado en la consola
    BTCjson[coin].earnings = new Intl.NumberFormat('es-MX').format(parseFloat(gananciaDolares).toFixed(2));
    earnings_today.innerHTML = BTCjson[coin].earnings != 'NaN' ? BTCjson[coin].earnings : 0;

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

async function checkToSAvedPrice(coin,id) {
    if (parseFloat(LastCheck) != parseFloat(critopApi[coin].priceData)) {
        //diferent;
        
        await transaction('UpdateCheckPrice',{criptoID:coin, coinPrice:critopApi[coin].priceData,index:id});

        saveStyles(coin,id);
    }//else{ no diferent};

};


btnBuy.onclick = async function () {
    let indexCripto =BTCjson.coinSelected.index;
    let idCripto =BTCjson.coinSelected.id;

    let data={
        coinPrice:BTCjson[idCripto].coinPrice,
        investedPrice:BTCjson[idCripto].price_to_invest,
        criptoID:idCripto,
        index:indexCripto
    }
    const re= await transaction('buy',data);
    console.log(re);

    submitGet();
    closeBuySpace();

}


price_invest.onkeyup = function () {
    let idCripto =BTCjson.coinSelected.id;

    if (price_invest.value != 0 || price_invest.value != '') {
        BTCjson[idCripto].price_to_invest = price_invest.value;
    } else {
        BTCjson[idCripto].price_to_invest = 0;
    }
}

//elapse time
var investedDate = document.getElementById("investedDate");

//show date on window
function showDate(index, indexCripto) {
    let elapseTim =$('.elapseTim','all');
    investedDate.innerHTML = user.criptos[indexCripto]? DateformatContacts(user.criptos[indexCripto].investedPrice[0].date).dateSaved : "---, ---, --, -- &nbsp &nbsp &nbsp --:-- --";
    elapseTim[index].innerHTML = user.criptos[indexCripto]? validateElapseTime(user.criptos[indexCripto].investedPrice[0].date): "-- --- ---";
}


var sellSubmit = document.getElementById("sellSubmit");
sellSubmit.onclick = async function () {
    let indexCripto =BTCjson.coinSelected.index;
    let idCripto =BTCjson.coinSelected.id;

    let data={
        coinPrice:BTCjson[idCripto].coinPrice,
        investedPrice:BTCjson[idCripto].price_to_invest,
        criptoID:idCripto,
        index:indexCripto,
        earned:BTCjson[idCripto].earnings
    }
    const re= await transaction('sell',data);
    console.log(re);
    submitGet();
}

save_price_to_chart = async (criptoID, coinPrice)=>{
    let data={
        criptoID,
        coinPrice
    }
    const re= await transaction('saveChart',data);
}

function getStyleSaved(coin,id){
    let savedStyle = checkStorageData('saveStyle')? getStorageData('saveStyle'):'';

    if(savedStyle != ''){
        let savedStyleParse = JSON.parse(savedStyle);
        if(savedStyleParse.indicator != ""){
            let diferenceH= $(".diferenceH",'all');
            let diferenceL= $(".diferenceL",'all');
            let indicator= $(".indicator",'all');

            if(savedStyleParse[coin] && savedStyleParse[coin].diferenceH !=""){
                setClass([{e:diferenceH[id],c:savedStyleParse[coin].diferenceH} , {e:diferenceL[id],c:savedStyleParse[coin].diferenceL} , {e:priceDifferences,c:savedStyleParse[coin].priceDifferences} , {e:indicator[id],c:savedStyleParse[coin].indicator}]);
            }
        }
    }
}
function saveStyles(coin,id) {
    let diferenceH= $(".diferenceH",'all');
    let diferenceL= $(".diferenceL",'all');
    let indicator= $(".indicator",'all');
    if(priceDifferences.classList.value !== undefined && diferenceH[id].className != null){
        
        saveStyle[coin]={
            diferenceH:diferenceH[id].classList.item(1),
            diferenceL:diferenceL[id].classList.item(1),
            priceDifferences:priceDifferences.classList.item(1),
            indicator:indicator[id].classList.item(1)
        }
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

//add to my wallets
setMyWallets=()=>{
    let criptos= $('.criptoRanking','all');
    criptos.forEach(element => {
        element.onclick= async ()=>{
            let index = element.id;
            let data=searchResult[index];

            //save only valid coins
            if(!element.classList.contains("own") && !element.classList.contains("invalid")){
                const re= await transaction('saveCoin',{},data);

                //update data users
                await validateSession();
                //paint wallet on window
                paintWallets();
                //update API data
                requestPainted();
               
            }
        }
    });
}


function paintWallets(){
    $('.criptoContent').innerHTML='';
    for (let index = 0; index < user.coins.length; index++) {
        $('.criptoContent').innerHTML+=`<div class="myCriptos not_buys">
                    <div class="infoCripto">
                        <div class="criptoData">
                            <span class="cristoIMG"> <img src="${user.coins[index].large}" alt=""></span>
                            <div>
                                <span class="critoName">${user.coins[index].name}</span>
                                <span class="criptoID">${user.coins[index].symbol}</span>
                            </div>
                        </div>
                        
                        <div>
                        <span class="price">Loading</span>
                            <div class="percentCripto">
                            
                                <span class="indicator"></span>
                                <span class='percent positive'>Loading</span>
                            </div>
                        </div>
                    </div>
                    <div class="status">
                                    <div id="statusTextH">
                                        <div>
                                            <span>H: </span>
                                            <span class="Hight"></span>
                                        </div>
                                        <div>
                                            <span>&#8800: </span>
                                            <span class="diferenceH" >Loading</span>
                                        </div>
                                        
                                    </div>
                                    <div id="statusTextL">
                                        <div>
                                            <span>L: </span>
                                            <span class="Low"></span>
                                        </div>
                                        <div>
                                            <span>&#8800: </span>
                                            <span class="diferenceL" >Loading</span>
                                        </div>
                                    </div>
                                    
                                </div>
                    <div class="chartCrito">
                        <div>
                            <span>Invested since</span>
                            <span class="elapseTim">-----</span>
                        </div>
                        <div class="detailsCritoContent">
                            <span class="priceSavdStorage">---</span>
                            <span class="savdDifferen">----</span>
                        </div>
                    </div>
                </div>`;
        
    }
    openBuySection();
}