var LastCheck;
var LastCheck_H_L={};
var SavePriceInvert;
var price_invested_saved;
var firtsLoad=0;
let price_to_invest=0;

let typeChart=0; //between 0 to 1
let chartStyle=2; //between 1 to 4
let dataChart={
    data:'',
    date:''
}
let user_saved_data={
    invested:0,
    criptoName:"none"
    };

movil_Desing=false; // to know is it size of a mobile
movil_Desing_list=false; // allow click on .myCriptos in list desing mobile

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
    price_invest: $("#price_invest"),
    MainIndicator: $("#indicator"),
    center: $(".center"),
    statusD: $(".status"),
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

(async ()=>{
    // get user`s data if session if valid
    await validateSession()
    // validate it when load the page
    homePageRoute()
})();


async function getRequestData(API,parameter="BTC"){
    try {
        if(API.status){
            var data =API.data;
            //console.log(data.data[parameter]);

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
                    earnings: [],
                    price_invested: [],
                    coinPrice:0
                }
            }
            online_offline = true;
        }else{
            online_offline = false;
        }
        
    } catch (error) {
        online_offline = false;
    }
    //console.log(online_offline);
}

async function requestPainted(){
    
    requestPainting(validateStatus, async()=>{
        await paintingData();
    });
}
//to see data just call user.
async function paintingData(){
    //first load of the page
    if(firtsLoad == 0){

        //validate session and get his data
        await validateSession();

        //load if exist saved wallets
        if(user.coins[0] !== undefined && user.coins[0] !== ""){
            paintWallets();
        }

        for(var i=0; i< user.coins.length; i++){
            
            if(user.coins[0] !== undefined && user.coins[0] !== ""){
                let coin=user.coins[i].symbol;
                getStyleSaved(coin,i);
            }
        }

        if(user.coins[0] !== ""){
            
            let coin=paintCoindSelected();
            // when start load selected crypto on slide
            arrow_to_slides_clickEvent(coin);
        }
    }
    //console.log(user);
    //take a peek if there is saved wallets
    if(user.coins[0] !== undefined && user.coins[0] !== ""){
        //get data of saved wallets
        getRequestData(await fetchData(API+`${getWalletSymbols()}`));
    }
    
    if (online_offline && user.identified && user.coins[0] !== "") {
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
            let priceDifferences= $(".priceDifferences",'all');
            const myCriptos= $('.myCriptos','all');
            let storagePrice;

            if (Math.sign(critopApi[coin].percentData) == -1 || Math.sign(critopApi[coin].percentData) == -0) {
                setClass([{e:percent[i],c:"negative"}]);
            } else {
                removeClass([{e:percent[i],c:"negative"}]);
            }
            
            if (parseFloat(LastCheck) < parseFloat(critopApi[coin].priceData)) {
                setClass([{e:diferenceH[i],c:"negative"} , {e:diferenceL[i],c:"positive"} , {e:priceDifferences[i],c:"positive"} , {e:indicator[i],c:"positive"}]);

                //color of the price in 700 miliseconds
                upDomwIndicator(price[i],'class','positive');

                //background color of the wallet
                upDomwIndicator(myCriptos[i],'class','positives');

            } else if (parseFloat(LastCheck) != parseFloat(critopApi[coin].priceData)) {
                removeClass([{e:diferenceH[i],c:"negative"},{e:diferenceL[i],c:"positive"},{e:priceDifferences[i],c:"positive"},{e:indicator[i],c:"positive"}]);
        
            }
            if (parseFloat(LastCheck) > parseFloat(critopApi[coin].priceData)) {
                setClass([{e:diferenceH[i],c:"positive"} , {e:diferenceL[i],c:"negative"} , {e:priceDifferences[i],c:"negative"} , {e:indicator[i],c:"negative"}]);

                //color of the price in 700 miliseconds
                upDomwIndicator(price[i],'class','negative');
                
                //background color of the wallet
                upDomwIndicator(myCriptos[i],'class','negatives');

            } else if (parseFloat(LastCheck) != parseFloat(critopApi[coin].priceData)) {
                removeClass([{e:diferenceH[i],c:"positive"},{e:diferenceL[i],c:"negative"},{e:priceDifferences[i],c:"negative"},{e:indicator[i],c:"negative"}]);
                
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
                    // profits highter and lower
                    LastCheck_H_L[coin] = {h:user.checkPrice[i]?user.checkPrice[i].h:"0", l: user.checkPrice[i]?user.checkPrice[i].l:"0"};
                    LastCheck_H_L[coin].h = LastCheck_H_L[coin].h === undefined? 0:LastCheck_H_L[coin].h;
                    LastCheck_H_L[coin].l = LastCheck_H_L[coin].l === undefined? 0:LastCheck_H_L[coin].l;
                    // LastCheck_H_L[coin] = {h:0, l:0};
                    calc_profits_h_l(coin, j)

                    break
                }else{
                    storagePrice=0;
                }
                
            }
            
            SavePriceInvert = storagePrice;
            BTCjson[coin].coinPrice = critopApi[coin].priceData;
            BTCjson[coin].status.h = convertPrice(critopApi[coin].priceHight, false, 0);
            BTCjson[coin].status.l = convertPrice(critopApi[coin].pricelow, false, 0);
            BTCjson[coin].status.difH = convertPrice(critopApi[coin].priceHight,'-' , critopApi[coin].priceData); 
            BTCjson[coin].status.difL = convertPrice(critopApi[coin].priceData,'-' , critopApi[coin].pricelow); 

            BTCjson[coin].status.c = convertPrice(critopApi[coin].priceData, false, 0);
            BTCjson[coin].percent = parseFloat(critopApi[coin].percentData).toFixed(2);


            diferenceH[i].innerHTML = BTCjson[coin].status.difH
            diferenceL[i].innerHTML = BTCjson[coin].status.difL

            priceDifferences[i].innerHTML = convertPrice(critopApi[coin].priceData,'-' , LastCheck); 

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
            
            //firtsLoad=1;
            
        }
        loadCriptoSelected();
        
        
    }
    firtsLoad=1;

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
function upDomwIndicator(element,option,initStyle,endStyle=''){
    switch (option) {
        case 'style':
                element.setAttribute('style',initStyle);
                setTimeout(() => {
                    element.setAttribute('style',endStyle);
                    
                }, 300);
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
function CalcularGanancia(invested_money, Saved_price, Price_actual) {
    // Definimos la cantidad de dólares invertidos
    const dolaresInvertidos = invested_money;

    // Definimos la tasa de cambio actual en dólares por bitcoin
    const tasaCambio = Saved_price;

    // Calculamos la cantidad de bitcoins que se pueden comprar con los dólares invertidos
    const bitcoinsComprados = dolaresInvertidos / tasaCambio;

    // Suponiendo que la tasa de cambio subió a 65000 dólares por bitcoin, calculamos la ganancia en dólares
    const gananciaDolares = bitcoinsComprados * (Price_actual - tasaCambio);

    //devolvemos el resultado
    return moneyFormat(gananciaDolares);
   
}
function moneyFormat(money){
    return new Intl.NumberFormat('es-MX').format(parseFloat(money).toFixed(2));
}
//animation to buy or reload
function submitGet() {
    if (!$('.cripto_IMG_selected').classList.contains('animation') && !statusD.classList.contains('statusAnimation')) {
        setTimeout(() => {
            removeClass([{e:$('.cripto_IMG_selected'),c:'animation'},{e:statusD,c:'statusAnimation'}])
        }, 1500);
    }
    setClass([{e:$('.cripto_IMG_selected'),c:'animation'} , {e:statusD,c:'statusAnimation'}]);

    requestPainted();
}
requestPainted();

//reload DATA
setInterval(() => {
    submitGet();
}, 15000); //15000, 10000

$('.cripto_IMG_selected').onclick = function () {
    submitGet();
};

async function checkToSAvedPrice(coin,id) {
    let indicator= $(".indicator",'all');
    let chartIndicator= $("#reflact_indicator");
    let idCoinSelected=BTCjson.coinSelected.id;

    if (parseFloat(LastCheck) != parseFloat(critopApi[coin].priceData)) {
        //diferent;

        //.myCriptos arrow indicator of increase or decrease
        upDomwIndicator(indicator[id],'style','opacity:0;','opacity:1;');

        if(idCoinSelected == coin){
            //.center arrow indicator of increase or decrease
            upDomwIndicator(MainIndicator,'style','opacity:0;','opacity:1;');
            // to indicator from chart
            upDomwIndicator(chartIndicator,'style','opacity:0;','opacity:1;');
        }

        //update the new price
        await transaction('UpdateCheckPrice',{criptoID:coin, coinPrice:critopApi[coin].priceData,index:id},LastCheck_H_L[coin]);

        saveStyles(coin,id);
    }//else{ no diferent};

};


btnBuy.onclick = async function () {
    let indexCripto =BTCjson.coinSelected.index;
    let idCripto =BTCjson.coinSelected.id;

    let data={
        coinPrice:BTCjson[idCripto].coinPrice,
        investedPrice:price_to_invest,
        criptoID:idCripto,
        index:indexCripto
    }
    const re= await transaction('buy',data);
    console.log(re);

    price_to_invest=0;

    submitGet();

    loadCriptoSelected();
    closeBuySpace();

}


price_invest.onkeyup = function () {
    let idCripto =BTCjson.coinSelected.id;

    if (price_invest.value != 0 || price_invest.value != '') {
        price_to_invest = price_invest.value;
    } else {
        price_to_invest = 0;
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
        investedPrice:BTCjson[idCripto].price_invested,
        criptoID:idCripto,
        index:indexCripto,
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
            let priceDifferences= $(".priceDifferences",'all');

            if(savedStyleParse[coin] && savedStyleParse[coin].diferenceH !=""){
                setClass([{e:diferenceH[id],c:savedStyleParse[coin].diferenceH} , {e:diferenceL[id],c:savedStyleParse[coin].diferenceL} , {e:priceDifferences[id],c:savedStyleParse[coin].priceDifferences} , {e:indicator[id],c:savedStyleParse[coin].indicator}]);
            }
        }
    }
}
function saveStyles(coin,id) {
    let diferenceH= $(".diferenceH",'all');
    let diferenceL= $(".diferenceL",'all');
    let indicator= $(".indicator",'all');
    let priceDifferences= $(".priceDifferences",'all');

    if(priceDifferences[id].classList.value !== undefined && diferenceH[id].className != null){
        
        saveStyle[coin]={
            diferenceH:diferenceH[id].classList.item(1),
            diferenceL:diferenceL[id].classList.item(1),
            priceDifferences:priceDifferences[id].classList.item(1),
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
    //console.log(data);
    if(data.status){
        navigateTo('/home')
        requestPainted();
    }
}

//add to my wallets
setMyWallets=(searchResult)=>{
    let criptos= $('.rankingContent2');
    //add event to work even when not all the elements are set, using propagation of events (bubbling)
    criptos.onclick= async(event) =>{
        if (event.target.classList.contains('criptoRanking')) {
            
            let element =event.target;

            let index = element.id;
            let data=searchResult[index];

            //save only valid coins
            if(!element.classList.contains("own") && !element.classList.contains("invalid")){
                const re= await transaction('saveCoin',{},data);
                console.log(index);
                if(re.status){
                    setClass([{e:element,c:'own'}]);
                }
                //update data users
                await validateSession();

                //paint wallet on window
                paintWallets();

                //update API data
                requestPainted();
                
            }
        }
    };      
}


function paintWallets(){
    $('.criptoContent').innerHTML='';
    $('.rankingContent').innerHTML='';
    for (let index = 0; index < user.coins.length; index++) {
        $('.criptoContent').innerHTML+=`<div class="myCriptos not_buys">
                    <div class="infoCripto">
                        <div class="criptoData">
                            <span class="cristoIMG"> <img src="${user.coins[index].large}" alt="img"></span>
                        </div>
                        <div class="cripto_info">
                            <div class="cripto_info_item">
                                <span class="critoName blue">${user.coins[index].name}</span>
                                <span class="price">Loading</span>
                                
                            </div>
                            <div class="cripto_info_item" >
                                <span class="criptoID">${user.coins[index].symbol}</span>
                                <div style="text-align: right; display: flex; justify-content: space-between;align-items: center;" >
                                <span class="priceDifferences" ></span>
                                    <div class="percentCripto">
                                        <span class="indicator"></span>
                                        <span class='percent positive'>Loading</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="status">
                                    <div id="statusTextH">
                                        <div>
                                            <span class="blue">H: </span>
                                            <span class="Hight"></span>
                                        </div>
                                        <div>
                                            <span>&#8800: </span>
                                            <span class="diferenceH" >Loading</span>
                                        </div>
                                        
                                    </div>
                                    <div id="statusTextL">
                                        <div>
                                            <span class="blue">L: </span>
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
                            <span class="blue">Invested since</span>
                            <span class="elapseTim">-----</span>
                        </div>
                        <div class="detailsCritoContent">
                            <span class="priceSavdStorage">---</span>
                            <span class="savdDifferen">----</span>
                        </div>
                    </div>
                </div>`;

                //add criptos summarize to mobile desing
                summarize_cryptos(user.coins[index],index);
    }
    
    //add click event to .myCriptos
    openCriptoDetails();

    // paint numbers of my saved wallets
    $('.num_walltes').innerHTML=user.coins.length;
}
let lastCriptoSelected; // to avoid reload the chart when it is the same selected
getChart=async (idCripto, limit)=>{
    //validate if doesn't exist data 
    if(dataChart.data == '' || idCripto != lastCriptoSelected){

        // load effect to change chart for the new cripto
        setClass([{e:$('.chartContent'),c:'load'}]);

        let data= await get_api_chart_data(idCripto, limit);
        
        if(data.status){
            dataChart={
                data:data.data,
                date:new Date() //to validate 5 min. of the API
            }
            //paint chart
            get_style_chart(data.data);
    
            await linearChart(data.data)
        }else{
            // paint that is not valid to show the chart
            $('.graphic_chart').innerHTML='<span class="graphic_chart_not_valid"><p>Chart not valid</p></span>';
        }
    }else{

        var elapseTime = DateformatContacts(dataChart.date);
        elapseTime = elapseTime.elapseTimes;

        //request to the API again
        if(elapseTime.minutes >= 5 && elapseTime.seconds >= 30){
            let data= await get_api_chart_data(idCripto, limit);

            if(data.status){
                dataChart={
                    data:data.data,
                    date:new Date() //to validate 5 min. of the API
                }
                //paint chart
                get_style_chart(data.data);
    
                await linearChart(data.data)
            }else{
                // paint that is not valid to show the chart
                $('.graphic_chart').innerHTML='<span class="graphic_chart_not_valid"><p>Chart not valid</p></span>';
            }
        }
    }
    lastCriptoSelected=idCripto;
}
// load the chart
loadChart= async()=>{
    if(BTCjson.coinSelected.id !== ""){
        if(BTCjson[BTCjson.coinSelected.id]){
            let idCripto =BTCjson.coinSelected.id;

            if(BTCjson[BTCjson.coinSelected.id].price_invested[0]){
                let Price_saved =BTCjson[BTCjson.coinSelected.id].price_invested[0].coinPrice
                Price_saved = convertPrice(Price_saved, false, 0);
                let toValidPrice = Price_saved.replace(',','');

                user_saved_data.invested=toValidPrice;
                //user_saved_data.criptoName=idCripto;
                user_saved_data.criptoName='';

            }else{
                //user_saved_data.criptoName=idCripto;
                user_saved_data.criptoName='';
                user_saved_data.invested=0;
            }

            //await getChart(idCripto);
        }
        
    }
}
// load of linear chart from buySpace
linearChart= async (data)=>{
    // remove last data
    // last colors and width
    $('.chart_percent_negativo').setAttribute('style','width:0%;');
    $('.chart_percent_positivo').setAttribute('style','width:0%;');

    // last value
    $('.chart_percent_negativo').innerHTML='0%';
    $('.chart_percent_positivo').innerHTML='0%';

    let chart_data=await calculatePercentage(data);
    // to colors and width
    $('.chart_percent_negativo').setAttribute('style','width:'+chart_data.decrease+'%;');
    $('.chart_percent_positivo').setAttribute('style','width:'+chart_data.increase+'%;');

    // value
    $('.chart_percent_negativo').innerHTML=chart_data.decrease+'%';
    $('.chart_percent_positivo').innerHTML=chart_data.increase+'%';
}
//criptos selected to show it in .main
loadCriptoSelected= async ()=>{
    //get coin selected saved
    let getDataSAved=checkStorageData('coinSelected')? getStorageData('coinSelected'):0;
  
    if(getDataSAved != 0){
      //delete loading massage
      removeClass([{e:$('.statusContent'),c:'show_loading'}]);
  
      BTCjson.coinSelected=JSON.parse(getDataSAved);
  
      let index=BTCjson.coinSelected.index;
      let id=BTCjson.coinSelected.id;

      let indicator_style=$('.indicator','all')[index].classList[1];
      let reflact_indicator= $("#reflact_indicator");

      let savdDifferen=$('#savdDifferen');
      let earnings_today=$('#earnings_today');

      let invest_status_img =$('.invest_status_img');
      let cripto_IMG_selected =$('.cripto_IMG_selected');// to phone desing
      let investex2 =$('.investex2');
      let invested_saved =$('#invested_saved');
      let elapseTim =$('#elapseTim');
      let investedDate =$('#investedDate');
      let priceSavdStorage =$('#priceSavdStorage');

      // profits of my investion hight and low
      let Hight =$('#Hight');
      let Low =$('#Low');

      // if there is a investion show the highter and lower profits otherwise dont show it
      Hight.innerHTML=moneyFormat(LastCheck_H_L[id]?LastCheck_H_L[id].h:0)
      Low.innerHTML=moneyFormat(LastCheck_H_L[id]?LastCheck_H_L[id].l:0)
     
      // paint respective color of the price
      negative_positive(Hight,Hight.innerHTML)
      negative_positive(Low,Low.innerHTML)

      let totalInvested=0;
  
      //paint data of selected crypto on .center div
      invest_status_img.innerHTML=$('.cristoIMG','all')[index].innerHTML;
      cripto_IMG_selected.innerHTML=$('.cristoIMG','all')[index].innerHTML;

      //paint the differences of the last price with the new price
      $("#priceDifferences").innerHTML =$('.priceDifferences','all')[index].innerHTML; 
      negative_positive($("#priceDifferences"),$("#priceDifferences").innerHTML);

      $("#price").innerHTML =$('.price','all')[index].innerHTML; 

      $("#percent").innerHTML =$('.percent','all')[index].innerHTML; 
      negative_positive($(".reflact_percentCripto"),$("#percent").innerHTML);

      // chart indicator to percent
      reflact_indicator.removeAttribute('class');
      setClass([{e:reflact_indicator,c:`${indicator_style}`}]);
        
      //detect which wallet was selected and show the invested prices
      for (let j = 0; j < user.criptos.length; j++) {
        const idCripto = user.criptos[j].idCripto;
        if (id === idCripto) {
            notBuys('close');
            //paint the mainIndicator of cripto selected
            if(MainIndicator.classList.length>0){
                MainIndicator.removeAttribute('class');
            }
            setClass([{e:MainIndicator,c:`${indicator_style}`}]);
            
            //add invested price
            investex2.innerHTML="";
  
            for (let o = 0; o < user.criptos[j].investedPrice.length; o++) {
              let user_data=user.criptos[j].investedPrice[o];
              let user_data2=user.criptos[j].investedPrice[0];
  
              let elapseTime=validateElapseTime(user_data.date);
              let elapseTimeDate=DateformatContacts(user_data.date).dateSaved;
              totalInvested=parseFloat(totalInvested) + parseFloat(user_data.price);
  
              investedDate.innerHTML=DateformatContacts(user_data2.date).dateSaved;
  
  
              elapseTim.innerHTML=validateElapseTime(user_data2.date);
              //the firt invested
              priceSavdStorage.innerHTML=convertPrice(user_data2.coinPrice, false, 0);

              //more than one investion
              if(user.criptos[j].investedPrice.length>1){//o>0
                investedDate.innerHTML=DateformatContacts(user_data.date).dateSaved+`<span title="Total Investions">🔻X${o+1}</span>`;
  
                investex2.innerHTML+=`<div class="investex2_details">
                                        <span class="elapseTime2 blue" title="${elapseTimeDate}">${elapseTime}</span> 
                                        <div class="priceSavd2">
                                          <span class="priceSavdStorage2">${convertPrice(user_data.coinPrice, false, 0)}&nbsp≠&nbsp</span>
                                          <span class="savdDifferen2 positive">↻</span>
                                        </div> 
                                        <span class="earningStatus"><span class="invested_saved2">$${parseFloat(user_data.price)}</span> <span>≠</span>
                                      <span class="earnings_today2 positive">↻</span></span>
                                      </div>`;
              }

              load_rewards(j,o);
            }
            invested_saved.innerHTML="$"+totalInvested;

            break
        }else{
            investex2.innerHTML="";
            invested_saved.innerHTML="";
            investedDate.innerHTML="";
            priceSavdStorage.innerHTML="";
            savdDifferen.innerHTML='';
            earnings_today.innerHTML='';
            notBuys('open')
            
        }
      }

      paintCoindSelected();
      await loadChart();
    }
}
notBuys=(status)=>{
    if(status == "close"){
        removeClass([{e:$('.not_buys_to_show'),c:'show'}]);
        removeClass([{e:$('.center'),c:'hidde'}]);
        removeClass([{e:$('.ct_btn_sell'),c:'hidde'}]);
    }else{
        setClass([{e:$('.not_buys_to_show'),c:'show'}]);
        setClass([{e:$('.center'),c:'hidde'}]);
        setClass([{e:$('.ct_btn_sell'),c:'hidde'}]);
    }
}
//get rewards of investion
load_rewards=(criptoIndex,index)=>{
    let user_data1=user.criptos[criptoIndex].investedPrice[0];
    let user_data2=user.criptos[criptoIndex].investedPrice[index];

    let savdDifferen=$('#savdDifferen');
    let earnings_today=$('#earnings_today');

    let savdDifferen2=$('.savdDifferen2','all');
    let earnings_today2=$('.earnings_today2','all');

    
    //the firt invested
    if(BTCjson[BTCjson.coinSelected.id]){

        //let coinPrice=BTCjson[BTCjson.coinSelected.id].coinPrice
        let coinPrice=critopApi[BTCjson.coinSelected.id].priceData
        let jsonData=BTCjson[BTCjson.coinSelected.id];
        
        let reward=CalcularGanancia(parseFloat(user_data2.price) ,parseFloat(user_data2.coinPrice) ,parseFloat(coinPrice));

        //for Sales record
        let data=user.criptos[criptoIndex].investedPrice[index];
        data.earnings=reward;

        //avoid to push when I select a coin more than one time, otherwise the data will be duplicates
        if(jsonData.earnings.length == user.criptos[criptoIndex].investedPrice.length){

            //replace data
            jsonData.price_invested.splice(data,0);
            jsonData.earnings.splice(reward,0);
        }else{

            //add data
            jsonData.price_invested.push(data);
            jsonData.earnings.push(reward);
        }
        
        //console.log(BTCjson[BTCjson.coinSelected.id])
        //console.log(critopApi)
        
        //get diffent of the price since I invest
        savdDifferen.innerHTML=convertPrice(coinPrice, '-', user_data1.coinPrice );
        earnings_today.innerHTML=jsonData.earnings[0];
        
        let diferences =savdDifferen.innerHTML.toString();
        //replace any ',' that it could has
        diferences = diferences.replace(/,?/g,'');
        diferences=parseFloat(diferences);

        let Hight =$('#Hight').innerHTML.toString();
        //replace any ',' that it could has
        Hight = Hight.replace(/,?/g,'');
        Hight=parseFloat(Hight);

        let Low =$('#Low').innerHTML.toString();
        //replace any ',' that it could has
        Low = Low.replace(/,?/g,'');
        Low=parseFloat(Low);
        
        $('#diferenceH').innerHTML= convertPrice(diferences,'-' , Hight); 
        $('#diferenceL').innerHTML= convertPrice(diferences,'-' , Low); 
        
        // paint respective color of the price
        negative_positive($('#diferenceH'),$('#diferenceH').innerHTML);
        negative_positive($('#diferenceL'),$('#diferenceL').innerHTML);

        //more than one investion
        if(user.criptos[criptoIndex].investedPrice.length>1){//index>0

            savdDifferen2[index].innerHTML=convertPrice(coinPrice, '-', user_data2.coinPrice );
            earnings_today2[index].innerHTML=CalcularGanancia(parseFloat(user_data2.price) ,parseFloat(user_data2.coinPrice) ,parseFloat(coinPrice));
            
            //sum all the inversion o show it in earnings_today
            let totalEarning=0;
            for (let i = 0; i < jsonData.earnings.length; i++) {
                totalEarning += parseFloat(jsonData.earnings[i])

            }
            earnings_today.innerHTML=moneyFormat(totalEarning);

            negative_positive(savdDifferen2[index], savdDifferen2[index].innerHTML);
            let p_n=negative_positive(earnings_today2[index], earnings_today2[index].innerHTML);
            if(!p_n){
                
                setClass([{e:$('.earningStatus','all')[index],c:"negative"}]);
            }else{
                removeClass([{e:$('.earningStatus','all')[index],c:"negative"}]);
            }
        }
       
        negative_positive(savdDifferen, savdDifferen.innerHTML);
        let p_n=negative_positive(earnings_today, earnings_today.innerHTML);
        if(!p_n){
            setClass([{e:$('.p_n'),c:"negative"}]);
        }else{
            removeClass([{e:$('.p_n'),c:"negative"}]);
        }
        get_prices_to_sell_buy_btn(savdDifferen.innerHTML,$("#price").innerHTML);
    }
  
};
get_prices_to_sell_buy_btn=(sellPrice, buyPrice)=>{
    $('.sellSubmit_price').innerHTML = sellPrice;
    // paint it the repective color
    negative_positive($('.sellSubmit_price'), sellPrice);

    $('.investInput_price').innerHTML = buyPrice;
}
calc_profits_h_l=(criptoIndex,index)=>{
    let user_data1=user.criptos[index].investedPrice[0];

    let coinPrice=critopApi[criptoIndex].priceData
    let diference =convertPrice(coinPrice, '-', user_data1.coinPrice ).toString()
    //replace any ',' that it could has
    diference = diference.replace(/,?/g,'');
    diference=parseFloat(diference);

    let hight= LastCheck_H_L[criptoIndex].h.toString(); // turn it into string
    let low= LastCheck_H_L[criptoIndex].l.toString();
    hight= hight.replace(/,?/g,''); // remove any ',' only if there is
    low=low.replace(/,?/g,'');

    hight=parseFloat(hight)
    low=parseFloat(low)

    if(diference > hight){
        LastCheck_H_L[criptoIndex].h = diference;
    }else if(hight === 0){ // only when it starts
        LastCheck_H_L[criptoIndex].h = diference;
    }
    
    if(diference < low){
        LastCheck_H_L[criptoIndex].l = diference;
     }else if(low === 0){ // only when it starts
        LastCheck_H_L[criptoIndex].l = diference;
    }
}

//paint red if the value is negatives o green default 
function negative_positive(element, value){
    let status = false;
    if(Math.sign(parseFloat(value)) == -1 || Math.sign(parseFloat(value)) == -0){
        setClass([{e:element,c:"negative"}]);
        status = false;
    } else {
        removeClass([{e:element,c:"negative"}]);
        status = true;
    }

    return status;
}

paintCoindSelected=()=>{
    let coin;
    if(BTCjson.coinSelected.id == ''){
        coin = checkStorageData('coinSelected')? JSON.parse(getStorageData('coinSelected')).index:'';
    }else{
        coin = BTCjson.coinSelected.index;
    }

    if(coin !== ''){
        let Put_delete_class=$('.criptoRanking','all');

        // delete class of last selected
        Put_delete_class.forEach(element => {
        if(element.classList.contains('selected')){
            removeClass([{e:element,c:'selected'}]);
        }
        });
        
        // add class to the new selected
        setClass([{e:$('.criptoRanking','all')[coin],c:'selected'}]);

        return coin;
    };
    return 0;
    
}

//add event to my_criptos_setup
my_criptos_setup_event=()=>{
    let criptos= $('.my_criptos_setup');
    //add event using propagation of events (bubbling)
    criptos.onclick= async(event) =>{
        if (event.target.classList.contains('my_criptos_content_img')) {
            
            let element =event.target;
            let index = element.id.split('_')[1];
        
            
            if(!element.classList.contains('not_valid')){

                // if the deleted coin was the selected
                if(BTCjson.coinSelected.index == index){
                    //save coin selected in variable
                    BTCjson.coinSelected={
                        index:0,
                        id:user.criptos[0].symbol
                    }

                    //save on localStorage the coin selected
                    setStorageData('json','coinSelected',BTCjson.coinSelected);
                    $('.myCriptos','all')[0].click();
                }


                const re= await transaction('deleteCoin',{},coin={index});
               
                // update data users
                await validateSession();

                // paint wallet on window
                paintWallets();

                // update API data
                requestPainted();


                // to reload the coin os setups place
                $('.config_btn').click();
            }
              
                
                
                
            
        }
    };      
}
// validate when it is in homePage
homePageRoute=()=>{
    if(verifyRoute('/')){
        if(user.identified){
            removeClass([{e:$('.url_home'),c:'hidde'}]);
            $('.url_home').innerHTML=`Continue has ${user.data.name}`
            setClass([{e:$('.url_login'),c:'hidde'}]);
        }else{
            setClass([{e:$('.url_home'),c:'hidde'}]);
            removeClass([{e:$('.url_login'),c:'hidde'}]);
        }
    }
    
    // add name and Email of user
    $('.nameUser_movil').innerHTML=user.data.name;
    $('.nameUser').innerHTML=user.data.name;
    $('.EmailUser').innerHTML=user.data.email;
}

