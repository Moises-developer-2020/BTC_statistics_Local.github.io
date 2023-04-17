var LastCheck;
var SavePriceInvert;
var Saveinvertion;
var price_invested_saved;
var online_offline;
var DifferIndicator;

function getlastCheck() {
    LastCheck = localStorage.getItem("checkPr") != undefined ? localStorage.getItem("checkPr") : 0;

}

getlastCheck();
let BTCjson = {
    status: {
        h: 30,
        l: 10,
        c: 50,
        difH: 0,
        difL: 0
    },
    percent: 0,
    simbols: {
        plus: "+",
        less: "-"
    },
    earnings: 0,
    price_invested: 0,
    price_to_invest: 0
}
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

function getElement(selector) {
    return document.querySelector(selector);
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
    indicator: getElement(".indicator"),
    savdDifferen: getElement("#savdDifferen"),
    priceSavdStorage: getElement("#priceSavdStorage")
};
Object.assign(window, elements);

async function requestPainted() {
    try {
        var data = await fetchData();
    } catch (error) {
        online_offline = false;
    }

    if (data == undefined) {
        online_offline = false;
    }
    offlinePage();//open or close


    if (online_offline) {
        console.log(data.data);
        let priceData = data.data.BTC.ohlc.c;
        let percentData = data.data.BTC.change.percent;

        let pricelow = data.data.BTC.ohlc.l;
        let priceHight = data.data.BTC.ohlc.h;

        if (Math.sign(percentData) == -1 || Math.sign(percentData) == -0) {
            percent.classList.add("negative");
        } else {
            percent.classList.remove("negative");
        }




        // console.log((data.data.BTC.ohlc.h)-(data.data.BTC.ohlc.c));
        //console.log(LastCheck);
        //console.log(data.data.BTC.ohlc.c);
        if (parseFloat(LastCheck) < parseFloat(data.data.BTC.ohlc.c)) {
            diferenceH.classList.add("negative");
            diferenceL.classList.add("positive");
            priceDifferences.classList.add("positive");
            indicator.classList.add("positive");
            upDomwIndicator(0,0,price,'class','positive',0);
        } else if (parseFloat(LastCheck) != parseFloat(data.data.BTC.ohlc.c)) {
            diferenceH.classList.remove("negative");
            diferenceL.classList.remove("positive");
            priceDifferences.classList.remove("positive");
            indicator.classList.remove("positive");
        }
        if (parseFloat(LastCheck) > parseFloat(data.data.BTC.ohlc.c)) {
            diferenceH.classList.add("positive");
            diferenceL.classList.add("negative");
            priceDifferences.classList.add("negative");
            indicator.classList.add("negative");
            upDomwIndicator(0,0,price,'class','negative',0);
        } else if (parseFloat(LastCheck) != parseFloat(data.data.BTC.ohlc.c)) {
            diferenceH.classList.remove("positive");
            diferenceL.classList.remove("negative");
            priceDifferences.classList.remove("negative");
            indicator.classList.remove("negative");
        }

        SavePriceInvert = localStorage.getItem("PriceSaved") != undefined ? localStorage.getItem("PriceSaved") : 0;
        Saveinvertion = data.data.BTC.ohlc.c;
        BTCjson.price_invested = localStorage.getItem('price_invested') != undefined ? localStorage.getItem("price_invested") : 0;
        invested_saved.innerHTML = BTCjson.price_invested;
        BTCjson.status.h = new Intl.NumberFormat('es-MX').format(parseFloat(priceHight).toFixed(2));
        BTCjson.status.l = new Intl.NumberFormat('es-MX').format(parseFloat(pricelow).toFixed(2));
        BTCjson.status.difH = new Intl.NumberFormat('es-MX').format((parseFloat(data.data.BTC.ohlc.h).toFixed(2)) - (parseFloat(data.data.BTC.ohlc.c).toFixed(2)));
        BTCjson.status.difL = new Intl.NumberFormat('es-MX').format((parseFloat(data.data.BTC.ohlc.c).toFixed(2)) - (parseFloat(data.data.BTC.ohlc.l).toFixed(2)));

        BTCjson.status.c = new Intl.NumberFormat('es-MX').format(parseFloat(priceData).toFixed(2));
        BTCjson.percent = parseFloat(percentData).toFixed(2);


        diferenceH.innerHTML = BTCjson.status.difH
        diferenceL.innerHTML = BTCjson.status.difL

        priceDifferences.innerHTML = new Intl.NumberFormat('es-MX').format((parseFloat(data.data.BTC.ohlc.c).toFixed(2)) - (parseFloat(LastCheck).toFixed(2)));
        upDomwIndicator(DifferIndicator,priceDifferences.innerHTML,indicator,'style','opacity:0;','opacity:1;');
        

        priceSavdStorage.innerHTML = new Intl.NumberFormat('es-MX').format(parseFloat(SavePriceInvert).toFixed(2));
        savdDifferen.innerHTML = new Intl.NumberFormat('es-MX').format((parseFloat(SavePriceInvert) > 0 ? parseFloat(data.data.BTC.ohlc.c).toFixed(2) : 0) - (parseFloat(SavePriceInvert).toFixed(2)));

        if (Math.sign(savdDifferen.innerHTML) == -1 || Math.sign(savdDifferen.innerHTML) == -0) {
            savdDifferen.classList.add("negative");
        } else {
            savdDifferen.classList.remove("negative");
        }


        price.innerHTML = BTCjson.status.c;
        Low.innerHTML = BTCjson.status.l;
        Hight.innerHTML = BTCjson.status.h;
        percent.innerHTML = BTCjson.percent;
        //console.log(parseFloat(priceData).toFixed(2));

        // console.log(new Intl.NumberFormat('es-MX').format((parseFloat(data.data.BTC.ohlc.h))-(parseFloat(data.data.BTC.ohlc.c)).toFixed(2)));
        
        //check out the last change of the price to paint red or green
        if (parseFloat(LastCheck) != parseFloat(data.data.BTC.ohlc.c)) {
            // console.log("es diferente");
            checkPrice(data.data.BTC.ohlc.c);
        } else {
            //console.log("no es diferente");

        }
        CalcularGanancia(parseFloat(BTCjson.price_invested), parseFloat(priceSavdStorage.innerHTML.replace(",", "")), parseFloat(price.innerHTML.replace(",", "")));

    }
};
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
            element.classList.add(initStyle);
            setTimeout(() => {
                element.classList.remove(initStyle);
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
        earnings_today.classList.add("negative");
    } else {
        earnings_today.classList.remove("negative");
    }
}
//console.log(Math.sign(-3,431.05));
function submitGet() {
    if (!center.classList.contains('animation') && !statusD.classList.contains('statusAnimation')) {
        setTimeout(() => {
            center.classList.remove('animation')
            statusD.classList.remove('statusAnimation')
        }, 1500);
    }
    center.classList.add('animation');
    statusD.classList.add('statusAnimation');
    requestPainted();
    showDate();
}
requestPainted();

setInterval(() => {
    submitGet();
    getlastCheck();
}, 15000); //15000, 10000

submit.onclick = function () {
    submitGet();

};

function checkPrice(c) {
    //console.log("true");
    localStorage.setItem("checkPr", c);


}


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


function getStorageData(){
    var data= localStorage.getItem();
    return data
}

