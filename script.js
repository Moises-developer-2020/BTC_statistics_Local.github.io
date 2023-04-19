var LastCheck;
var SavePriceInvert;
var Saveinvertion;
var price_invested_saved;
var DifferIndicator;
var firtsLoad=0;


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
    price: getElement("#price"),
    Hight: getElement("#Hight"),
    Low: getElement("#Low"),
    percent: getElement("#percent"),
    submit: getElement("#submit"),
    saveSubmit: getElement("#saveSubmit"),
    investInput: getElement("#investInput"),
    cancelSubmit: getElement("#cancelSubmit"),
    earnings_today: getElement("#earnings_today"),
    price_invest: getElement("#price_invest"),
    invested_saved: getElement("#invested_saved"),
    offline_button: getElement("#offline_button"),
    profits: getElement(".profits"),
    center: getElement(".center"),
    offline: getElement(".offline"),
    statusD: getElement(".status"),
    diferenceH: getElement("#diferenceH"),
    diferenceL: getElement("#diferenceL"),
    priceDifferences: getElement("#priceDifferences"),
    indicator: getElement("#indicator"),
    savdDifferen: getElement("#savdDifferen"),
    priceSavdStorage: getElement("#priceSavdStorage")
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

    if (data == undefined) {
        online_offline = false;
    }
    offlinePage();//open or close
}

async function requestPainted() {
    
    getRequestData(await fetchData());

    if (online_offline) {
        LastCheck = checkStorageData("checkPr")?getStorageData("checkPr"):0;

        if (Math.sign(critopApi.percentData) == -1 || Math.sign(critopApi.percentData) == -0) {
            setClass([{e:percent,c:"negative"}]);
        } else {
            removeClass([{e:percent,c:"negative"}]);
        }
        //not lose the color of the numbers
        if(firtsLoad == 0){
            getStyleSaved();
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

        SavePriceInvert = localStorage.getItem("PriceSaved") != undefined ? localStorage.getItem("PriceSaved") : 0;
        Saveinvertion = critopApi.priceData;
        BTCjson.price_invested = localStorage.getItem('price_invested') != undefined ? localStorage.getItem("price_invested") : 0;
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

        if (Math.sign(savdDifferen.innerHTML) == -1 || Math.sign(savdDifferen.innerHTML) == -0) {
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
    showDate();
}
requestPainted();

//reload DATA
setInterval(() => {
    submitGet();
}, 15000); //15000, 10000

submit.onclick = function () {
    submitGet();

};

function checkToSAvedPrice() {
    if (parseFloat(LastCheck) != parseFloat(critopApi.priceData)) {
        //diferent;
        localStorage.setItem("checkPr", critopApi.priceData);
        saveStyles();
    }//else{ no diferent};
};


saveSubmit.onclick = function () {
    localStorage.setItem('PriceSaved', Saveinvertion);
    localStorage.setItem("price_invested", BTCjson.price_to_invest);
    localStorage.setItem('date', new Date());
    submitGet();

    //close the invest window
    profits.setAttribute('style', 'height:0%;');
}

investInput.onclick = function () {
    //open the invest window
    profits.setAttribute('style', 'height:98%;');
    price_invest.focus();
}
cancelSubmit.onclick = function () {
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
function offlinePage() {
    //console.log('online: '+ online_offline);
    if (online_offline == false) {
        offline.setAttribute('style', 'display:flex;')
    } else { offline.setAttribute('style', 'display:none;') }

}
offline_button.onclick = function () {
    window.location.reload();
}
//elapse time
var investedDate = document.getElementById("investedDate");
var elapseTim = document.getElementById("elapseTim");

function DateformatContacts(dateSave) {
    if (dateSave) {
        function dateInHours() {
            // Set the date we're counting down to
            var getDateSave = new Date(dateSave).getTime();

            // Get todays date and time
            var now = new Date().getTime();

            // Find the distance between now an the count down date
            var distance = now - getDateSave;

            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            return JSON.parse(`{
            "dateFormat":{
                "days":${days},
                "hours":${hours},
                "minutes":${minutes},
                "seconds":${seconds}
            }}`);
        };

        var date = new Date(dateSave);
        let timestampSave = date.toLocaleTimeString('en-US');

        var formatHour = timestampSave.split(':');
        //without seconds
        var hour = formatHour[0] + ':' + formatHour[1] + ' ' + formatHour[2].split(' ')[1];

        var days = date.toDateString().split(' ')[0];
        var monts = date.toDateString().split(' ')[1];
        var days_number = date.toDateString().split(' ')[2];
        var year = date.toDateString().split(' ')[3];

        var dateSaveFormat = days + ', ' + monts + ' ' + days_number + ', ' + year.slice(2, 4) + '&nbsp &nbsp ' + hour;
        var endData = {
            dateSaved: dateSaveFormat,
            elapseTimes: dateInHours().dateFormat
        }
        return endData;

    }
}


//validate way to chow the elapse time
function validateElapseTime() {
    if (localStorage.getItem("date")) {
        var elapseTime = DateformatContacts(localStorage.getItem("date"));
        elapseTime = elapseTime.elapseTimes;

        var validated = "";
        if (elapseTime.days == 0 && elapseTime.hours == 0 && elapseTime.minutes <= 1) {
            validated = elapseTime.seconds + " seconds ago.";
        }
        if (elapseTime.days == 0 && elapseTime.hours == 0 && elapseTime.minutes == 1) {
            validated = elapseTime.minutes + " min. ";
        }
        if (elapseTime.days == 0 && elapseTime.hours == 0 && elapseTime.minutes > 1) {
            validated = elapseTime.minutes + " mins. ";
        }
        if (elapseTime.days == 0 && elapseTime.hours == 1 && elapseTime.minutes == 0) {
            validated = elapseTime.hours + " hour ago.";
        }
        if (elapseTime.days == 0 && elapseTime.hours == 1 && elapseTime.minutes > 1) {
            validated = elapseTime.hours + " hour " + elapseTime.minutes + " mins.";
        }
        if (elapseTime.days == 0 && elapseTime.hours == 1 && elapseTime.minutes == 1) {
            validated = elapseTime.hours + " hour " + elapseTime.minutes + " min.";
        }
        if (elapseTime.days == 0 && elapseTime.hours > 1 && elapseTime.minutes == 0) {
            validated = elapseTime.hours + " hours ago.";
        }
        if (elapseTime.days == 0 && elapseTime.hours > 1 && elapseTime.minutes == 1) {
            validated = elapseTime.hours + " hours " + elapseTime.minutes + " min.";
        }
        if (elapseTime.days == 0 && elapseTime.hours > 1 && elapseTime.minutes > 1) {
            validated = elapseTime.hours + " hours " + elapseTime.minutes + " mins.";
        }

        if (elapseTime.days == 1 && elapseTime.hours == 0) {
            validated = elapseTime.days + " day ago.";
        }
        if (elapseTime.days > 1 && elapseTime.hours == 0) {
            validated = elapseTime.days + " days ago. ";
        }
        if (elapseTime.days == 1 && elapseTime.hours == 1) {
            validated = elapseTime.days + " day " + elapseTime.hours + " hour";
        }
        if (elapseTime.days == 1 && elapseTime.hours > 1) {
            validated = elapseTime.days + " day " + elapseTime.hours + " hours";
        }
        if (elapseTime.days > 1 && elapseTime.hours == 1) {
            validated = elapseTime.days + " days " + elapseTime.hours + " hour";
        }
        if (elapseTime.days > 1 && elapseTime.hours > 1) {
            validated = elapseTime.days + " days " + elapseTime.hours + " hours";
        }


        return validated;
    }
    else {
        return "-----";
    }
}

function showDate() {
    investedDate.innerHTML = localStorage.getItem("date") ? DateformatContacts(localStorage.getItem("date")).dateSaved : "---, ---, --, -- &nbsp &nbsp &nbsp --:-- --";
    elapseTim.innerHTML = validateElapseTime();
}


var sellSubmit = document.getElementById("sellSubmit");
sellSubmit.onclick = function () {
    localStorage.removeItem("PriceSaved");
    localStorage.removeItem("price_invested");
    localStorage.removeItem("date");
    submitGet();
}
showDate();

function getStyleSaved(){
    let savedStyle = checkStorageData('saveStyle')? getStorageData('saveStyle'):'';
    if(savedStyle != ''){
        let savedStyleParse = JSON.parse(savedStyle);
        setClass([{e:diferenceH,c:savedStyleParse.diferenceH} , {e:diferenceL,c:savedStyleParse.diferenceL} , {e:priceDifferences,c:savedStyleParse.priceDifferences} , {e:indicator,c:savedStyleParse.indicator}]);
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
  
//window.addEventListener('beforeunload', saveStyles);


