let online_offline;

//false it's sing In and true sing Up
let SingIn_Up=true; 

const API = "https://production.api.coindesk.com/v2/tb/price/ticker?assets=";
const searchAPI = "https://api.coingecko.com/api/v3/search";

const ValidCoins = ['BTC', 'ETH', 'XRP', 'BCH', 'ADA', 'XLM', 'NEO', 'LTC', 'EOS', 'XEM', 'IOTA', 'DASH', 'XMR', 'TRX', 'ICX', 'ETC', 'QTUM', 'BTG', 'VET', 'LSK', 'USDT', 'OMG', 'STEEM', 'ZEC', 'SC', 'BNB', 'XVG', 'ZRX', 'REP', 'KCS', 'WAVES', 'MKR', 'DCR', 'BAT', 'DGB', 'LRC', 'GAS', 'KNC', 'DENT', 'POWR', 'SYS', 'BNT', 'REQ', 'GNO', 'LINK', 'QSP', 'CVC', 'RLC', 'ENJ', 'STORJ', 'ANT', 'SNGLS', 'THETA', 'ZEN', 'MANA', 'MLN', 'DNT', 'AMP', 'GTC', 'NMR', 'STX', 'LEO', 'GMT', 'POLIS', 'DOT', 'DAI', 'XCN', 'UNI', 'ATOM', 'GRT', 'LUNA', 'DAR', 'SCRT', 'IMX', 'ARB', 'OCEAN', 'ZIL', 'HOT', 'XTZ', 'FIL', 'BIT', 'GMX', 'OP', 'ERN', 'NANO', 'WBTC', 'HT', 'OKB', 'BSV', 'DOGE', 'USDC', 'OXT', 'ALGO', 'BAND', 'BTT', 'FET', 'KAVA', 'USDP', 'PAXG', 'REN', 'AAVE', 'YFI', 'NU', 'MATIC', 'ICP', 'SOL', 'SUSHI', 'UMA', 'SNX', 'CRV', 'COMP', 'CELO', 'KSM', 'NKN', 'SHIB', 'SKL', 'SAND', 'UST', 'AVAX', 'IOTX', 'AXS', 'XYO', 'ANKR', 'CHZ', 'LPT', 'COTI', 'KEEP', 'GALA', 'CRO', 'ACHP', 'JASMY', 'SLP', 'APE', 'BUSD', 'CAKE', 'EGLD', 'ENS', 'FTM', 'FTT', 'HBAR', 'MBOX', 'MINA', 'MOVR', 'NEAR', 'NEXO', 'POLS', 'QNT', 'QUICK', 'RUNE', 'RVN', 'WAXP', 'WRX', 'XEC', 'CEL', 'ALPACA', 'AUDIO', 'AVA', 'CHR', 'CKB', 'CLV', 'FARM', 'FLOW', 'GLMR', 'IDEX', 'INJ', 'JOE', 'MIR', 'POLY', 'PYR', 'RARE', 'RAY', 'ROSE', 'SFP', 'SRM', 'STMX', 'SUN', 'SXP', 'VGX', 'WOO', 'YGG', 'LUNC', 'APT', 'MASK', 'DYDX', 'CTSI', 'CVX', 'FORTH', 'LDO', 'METIS', 'RBN', 'SAMO', 'SPELL','1INCH', 'ALCX', 'ALICE', 'API3', 'ARPA', 'ASTR', 'BADGER', 'BAL', 'BICO', 'BOBA', 'BOND', 'BTRST', 'C98', 'CELR', 'DIA', 'ETHW', 'GAL', 'GHST', 'GLM', 'HFT', 'ILV', 'KP3R', 'LCX', 'LOKA', 'LQTY', 'MC', 'MPL', 'MXC', 'OGN', 'PERP', 'PLA', 'POND', 'RAD', 'RARI', 'RLY', 'RNDR', 'RPL', 'STG', 'SYN', 'T', 'TLM', 'TRU', 'UNFI', 'AR', 'FXS', 'GUSD', 'KLAY', 'TUSD', 'XDC', 'XRD', 'USDD', 'TON', 'TWT', 'HNT', 'OSMO', 'ATLAS', 'BFC', 'BLUR', 'BABYDOGE', 'CEEK', 'ELON', 'FLOKI', 'KISHU', 'LOOKS', 'ONE', 'RACA', 'REEF', 'SAITAMA', 'WIN', 'AGLD', 'TOKE', 'GST', 'CSPR', 'GT', 'DLCS', 'MTVS', 'DFX', 'SCPX', 'SCPXX', 'DIGS', 'CCYS', 'CCYX', 'CPUS', 'CNES', 'CMIP', 'CMI', 'SMT', 'CCY', 'DTZ', 'DCF', 'CPU', 'CNE', 'CMIS', 'CSC', 'USCE'];

//check if exist
function checkStorageData(item) {
    return localStorage.getItem(item) !== null;
}

//get
function getStorageData(item) {
    return localStorage.getItem(item);
}
//delete
function deleteStorageData(item){
    localStorage.removeItem(item);
}
//set
function setStorageData(key, name, miObjeto={}) {
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
function $(selector, all='') {
    if(all == 'all'){
        return document.querySelectorAll(selector);
    }
    return document.querySelector(selector);
}
//GET API
async function fetchData(url) {
    let data;
    if (window.navigator.onLine) {
        try {/*
            const headers = {
                'Content-Type': 'application/json',
                'SameSite': 'Strict' //'Strict' o 'Lax'
            };*/

            const response = await fetch(url);
            data = await response.json();
            online_offline = true; 

            return {status:true,data};
        } catch (error) {
            online_offline = false;
        }
    } else{online_offline = false; }

    if (data === undefined || data === 'undefined') {
        online_offline = false;
    }
    if (online_offline == false) {
        getAlert('offline_page'); 
    } else {
        getAlert('close');
    }
    return {status:false};
}

//get local data
async function fecthLocalData(table, type, obj = { value: {}, id: 0 }) {
    try {
        const db = await DB(dbName);
        const objeto = new MyFunctions(db);
        switch (type) {
            case 'add':

            const userId =await objeto.createObjeto(table,obj.value);
            return userId;
            case 'remove':

                await objeto.deleteObjetoPorId(table, obj.id);
                break;
            case 'update':

                const request=await objeto.updateObjeto(table, obj.id, obj.value);
                
                return request;
            case 'showId'://get by ID
                const result = await objeto.searchObjetoById(table, obj.id);
                return result;
                
            case 'showAll'://getAll

                const data= await objeto.readAllData(table);
                return data;
            default:
                console.error('type of fecthLocalData no valid');
                break;
        }

    } catch (error) {
        console.log(error);
    }
}

//send alerts
function createAlert(alert) {
    let { type, element } = alert;
    // const newElement = document.createElement(type);
    // newElement.innerHTML=`${element}`;
    // AlertSpace.appendChild(newElement);
    AlertSpace.innerHTML = `${element}`;
};

//date format
function DateformatContacts(dateSave) {
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

//validate way to chow the elapse time
function validateElapseTime(date) {
    var elapseTime = DateformatContacts(date);
    elapseTime = elapseTime.elapseTimes;

    var validated = "";
    if (elapseTime.days == 0 && elapseTime.hours == 0 && elapseTime.minutes <= 1) {
        validated = elapseTime.seconds + " secs ago.";
    }
    if (elapseTime.days == 0 && elapseTime.hours == 0 && elapseTime.minutes == 1) {
        validated = elapseTime.minutes + " min. ";
    }
    if (elapseTime.days == 0 && elapseTime.hours == 0 && elapseTime.minutes > 1) {
        validated = elapseTime.minutes + " mins. ";
    }
    if (elapseTime.days == 0 && elapseTime.hours == 1 && elapseTime.minutes == 0) {
        validated = elapseTime.hours + " hr ago.";
    }
    if (elapseTime.days == 0 && elapseTime.hours == 1 && elapseTime.minutes > 1) {
        validated = elapseTime.hours + " hr " + elapseTime.minutes + " mins.";
    }
    if (elapseTime.days == 0 && elapseTime.hours == 1 && elapseTime.minutes == 1) {
        validated = elapseTime.hours + " hr " + elapseTime.minutes + " min.";
    }
    if (elapseTime.days == 0 && elapseTime.hours > 1 && elapseTime.minutes == 0) {
        validated = elapseTime.hours + " hrs ago.";
    }
    if (elapseTime.days == 0 && elapseTime.hours > 1 && elapseTime.minutes == 1) {
        validated = elapseTime.hours + " hrs " + elapseTime.minutes + " min.";
    }
    if (elapseTime.days == 0 && elapseTime.hours > 1 && elapseTime.minutes > 1) {
        validated = elapseTime.hours + " hrs " + elapseTime.minutes + " mins.";
    }

    if (elapseTime.days == 1 && elapseTime.hours == 0) {
        validated = elapseTime.days + " day ago.";
    }
    if (elapseTime.days > 1 && elapseTime.hours == 0) {
        validated = elapseTime.days + " days ago. ";
    }
    if (elapseTime.days == 1 && elapseTime.hours == 1) {
        validated = elapseTime.days + " day " + elapseTime.hours + " hr";
    }
    if (elapseTime.days == 1 && elapseTime.hours > 1) {
        validated = elapseTime.days + " day " + elapseTime.hours + " hrs";
    }
    if (elapseTime.days > 1 && elapseTime.hours == 1) {
        validated = elapseTime.days + " days " + elapseTime.hours + " hr";
    }
    if (elapseTime.days > 1 && elapseTime.hours > 1) {
        validated = elapseTime.days + " days " + elapseTime.hours + " hrs";
    }


    return validated;

}

function reloadPage() {
    window.location.reload();
}
//singIn/SingUp
async function login(type,data={}){
    //evoid bad request
    //delete it because while you dont close session this variable not must changes
    //and login form not must be shows
    deleteStorageData('usersSession'); 
    if(user.identified){
        getAlert('error',`Sorry!<br>There's a session open`);
        return {status:0, message:`There's a session open`};

    }else if(!window.navigator.onLine){
        getAlert('offline_page');
        return {status:0, message:`Yua're offline`};
    }

    const {email, name, password } =data;
    switch (type) {
        case 'singIn':
            user.identified=false;

            const request = await validateIfExist('users','email',email);
            if(request.status){
                const userData=await fecthLocalData('usersPasswd', 'showId', { id:request.id });
                //decript the password encripted
                const passwordDecript= await decryptValue(userData.password, password);

                if(passwordDecript.status){
                    //validate if password is equals to
                    if(password === passwordDecript.value){
                        const sessionEncript=await encryptValue(request.id,keySecret);
                        if(sessionEncript.status){
                            
                            setStorageData('json','usersSession',sessionEncript.value);
                            user.identified=true;
                            
                            
                            return {status:true, data:request.data, message:'Welcome'};
                        }else{
                            return {status:false, message:'Session cannot be save'};
                        }

                    }else{
                        return {status:false, message:'Password Incorrect'};
                    }  
                }else{
                    return {status:false, message:'Password Incorrect'};
                }   
            }else{
                return {status:0, message:`User does't exist`};
            };

        case 'singUp':
                    
            user.identified=false;

            const database = await validateIfExist('users','email',email);
            if(!database.status){//Create new user

                //encript password of user
                const encripted = await encryptValue(password,password);
                if(encripted.status){
                    const idUser = await fecthLocalData('users', 'add', { value: { email: email, name:name } });

                    //save password in another table with the id of the new user
                    await fecthLocalData('usersPasswd', 'add', { value: { id:idUser, password:encripted.value } });

                    //create the tables that belong to the new user with the ID, but start empty
                    await fecthLocalData('historySell', 'add', { value: { id:idUser,data:'' } });
                    await fecthLocalData('criptos', 'add', { value: { id:idUser,data:'' } });
                    await fecthLocalData('checkPrice', 'add', { value: { id:idUser,data:'' } });
                    await fecthLocalData('coins', 'add', { value: { id:idUser,data:'' } });

                    if(idUser){
                        //to save session encripted
                        const sessionEncript=await encryptValue(idUser,keySecret);
                        if(sessionEncript.status){
                                
                            setStorageData('json','usersSession',sessionEncript.value);
                            user.identified=true;
                            return {status:true, userId:idUser , message:'Welcome'};
                        }else{
                            return {status:false, message:'Session cannot be save'};
                        }
                        
                    }else{
                        return {status:false, message:'Something went wrong, please try again'};
                    }
                }else{
                    //getAlert('error',`Sorry!<br>Something went wrong`);
                    getAlert('error',`${encripted.value}`);
                }

            }else{
                return {status:0, message:`User already exist`};
            };

        default:
            break;
    }
}
//validate if exist the data
async function validateIfExist(table, parameter, value){
    const data= await fecthLocalData(table, 'showAll');
     var index=data.findIndex(function(element){
         return element[parameter] === value;
     });          
     if(index != -1){  
        return {status:true, id:data[index].id, position:index, data:data[index]};
     }
     return {status:false};
}

//validate if session variable saved in locaStorage it's valid
async function validateSession(){
    user.identified=false;
    if(checkStorageData('usersSession')){
        //get only the value whithout  this ""
        const encriptID = getStorageData('usersSession').split('"')[1];
        const decriptId= await decryptValue(encriptID,keySecret);

        if(decriptId.status){
            const idUser= decriptId.value;
            const id =parseInt(idUser);

            //validate user and get user's data
            const userData=await fecthLocalData('users', 'showId', { id:id });

            if(userData){
                const historySell=await fecthLocalData('historySell', 'showId', { id:id });
                const criptos=await fecthLocalData('criptos', 'showId', { id:id });
                const checkPrice=await fecthLocalData('checkPrice', 'showId', { id:id });
                const coins=await fecthLocalData('coins', 'showId', { id:id });

                let dataHistorySell;
                let dataCriptos;
                let dataCheckPrice;
                let dataCoins;
                //validate the first time on see this data
                
                try {
                    dataHistorySell=JSON.parse(historySell.data)
                } catch (error) {
                    dataHistorySell=[historySell.data]
                }
                try {
                    dataCriptos=JSON.parse(criptos.data);
                } catch (error) {
                    dataCriptos=[criptos.data];
                }  
                try {
                    dataCheckPrice=JSON.parse(checkPrice.data);
                } catch (error) {
                    dataCheckPrice=[checkPrice.data];
                }
                try {
                    dataCoins=JSON.parse(coins.data);
                } catch (error) {
                    dataCoins=[coins.data];
                }     

                // put the data in global user variable
                user={
                    data:userData,
                    historySell:dataHistorySell,
                    criptos:dataCriptos,
                    checkPrice:dataCheckPrice,
                    coins:dataCoins,
                    identified:true
                }
                //console.log(user);
                return true
            }
            //delete it cuz it is not valid
            deleteStorageData('usersSession');
            navigateTo('/login');
            return false
        }else{
            //delete it cuz it is not valid
            deleteStorageData('usersSession');
            navigateTo('/login');
            return false
        }
    }else{
        navigateTo('/login');
        return false
    }
}
function validateStatus(){
    // validate if exist a session open
    if(checkStorageData('usersSession')){
        // if have a session open and url in login then sent to /home
        if(verifyRoute('/login')){
            keepTo('/home');
            return true
        }
        // validate route to load data
        if(verifyRoute('/home')){
            return true
        }
        return false
    }else{
        // sent to
        if(verifyRoute('/login')){
            keepTo('/login');
            return false;
        }//if(verifyRoute('/home')){
        //     keepTo('/login');
        //     return false;
        // }
        else{
            keepTo('/');
            return false;
        }
    }
}
// to use validateStatus()
async function requestPainting(path,handle){
    let status =await path();
    if(status == true){
       await handle()
    }
}
//use to saved all sells, buys, and history records of buys from the user 
//this method is only use it in main.js
async function transaction(method,data={coinPrice:'',earned:'',investedPrice:'', criptoID, index},coin={}){
    const userID=user.data.id;

    switch (method) {
        case 'buy':
            let request;
            //detect which one already it is saved
            var index=user.criptos.findIndex(function(element){
                return element.idCripto === data.criptoID;
            });  
            //if already exist mean, it is a buy again to the same coin, increase the price purchased  before
            if(index != -1){
                let investedPrice={
                    price:data.investedPrice,
                    date:new Date(),
                    coinPrice:data.coinPrice  
                }
                user.criptos[index].investedPrice.push(investedPrice);

                request = await fecthLocalData('criptos','update',{value:user.criptos,id:userID});
            }else{
                //new buy or the firt buy
                criptos={
                    idCripto:data.criptoID,
                    investedPrice:[{
                        price:data.investedPrice,
                        date:new Date(),
                        coinPrice:data.coinPrice  
                    }],
                    chart:[data.coinPrice]
                    
                }
            
                //to the first time on save this data cuz it is JSON not Array
                if(Array.isArray(user.criptos)){
                    //delete the firt element created cuz it is empty
                    if(user.criptos[0].idCripto === undefined){
                        user.criptos.splice(0,1)
                    }
                    
                    user.criptos.push(criptos)
                    console.log(1);
                }else{
                    console.log(2);
                    user.criptos=criptos
                }

                request = await fecthLocalData('criptos','update',{value:user.criptos,id:userID});
            }

            return request;

        case 'sell'://disabled when there is not any buy

            //add history sell
            historySell={
                idCripto:data.criptoID,
                investedPrice:user.criptos[data.index].investedPrice,
                dateSold:new Date(),
                earned:data.earned,
                coinPrice:data.coinPrice
            }
            //to the first time on save this data cuz it is JSON not Array
            if(Array.isArray(user.historySell)){
                //delete the firt element created cuz it is empty
                if(user.historySell[0].idCripto === undefined){
                    user.historySell.splice(0,1)
                }
                user.historySell.push(historySell)
            }else{
                user.historySell=historySell
            }
            
            const requestSell = await fecthLocalData('historySell','update',{value:user.historySell,id:userID});

            if(requestSell.status){
                
                //to the first time on save this data cuz is JSON not Array
                if(Array.isArray(user.criptos)){
                    //delete the sold cripto from the array
                    user.criptos.splice(data.index,1);
                    
                }
                user.criptos[data.index]="";
                const requestCriptos =await fecthLocalData('criptos','update',{value:user.criptos,id:userID});
                
                if(requestCriptos.status){
                    return requestCriptos;
                }

            }else{
                return requestSell;
            }
            

        //this value saved in criptos's tables, it is use to detect increase and decrease
        // of the current price of the coin invested
        case 'UpdateCheckPrice':
                //each time the current price change, it is update in the database
                checkPrice={
                    idCripto:data.criptoID,
                    coinPrice:data.coinPrice,
                    h:coin.h,
                    l:coin.l
                        
                }

                let exists = false;

                if (Array.isArray(user.checkPrice)) {
                    // Check if the idCripto exists in the array
                    for (let i = 0; i < user.checkPrice.length; i++) {
                        if(!user.checkPrice[0].idCripto){
                            user.checkPrice.splice(0,1)
                        }
                        if(user.checkPrice[i]){
                            if (user.checkPrice[i].idCripto === checkPrice.idCripto) {
                                // If the idCripto exists, update the value and set exists to true
                                user.checkPrice[i] = checkPrice;
                                exists = true;
                                break;
                            }
                        }
                    }

                    // If the idCripto doesn't exist, push the new object
                    if (!exists) {
                        user.checkPrice.push(checkPrice);
                    }
                } else {
                // If the checkPrice property is not an array, create a new one with the checkPrice object
                    user.checkPrice = [checkPrice];
                }

                const checkPriceRequest =await fecthLocalData('checkPrice','update',{value:user.checkPrice,id:userID});
        
                return checkPriceRequest;

        case 'saveCoin':
                   
                //to the first time on save this data cuz it is JSON not Array
                if(Array.isArray(user.coins)){
                    //delete the firt element created cuz it is empty
                    if(user.coins[0] === ""){
                        if(user.coins[0].id === undefined){
                            user.coins.splice(0,1)
                            console.log(222);
                        }
                    }
                    // if(user.coins[0] === ""){
                    //     if(user.coins[0].id === undefined){
                    //         console.error(1);
                    //     }
                    // }
                    user.coins.push(coin)
                    //console.log(111);
                }else{
                    user.coins=coin
                }
                console.log(userID);
                console.log(user.coins);
                const requestCoins = await fecthLocalData('coins','update',{value:user.coins,id:userID});
                
    
                return requestCoins;
        
        case 'saveChart':
            let charRequest;
            //detect which one already it is saved
            var index=user.criptos.findIndex(function(element){
                return element.idCripto === data.criptoID;
            });  

            if(index != -1){

                let coinPrice = data.coinPrice  
                //since I buy chart parameter it become to array, so it`s not necesary to verify
                user.criptos[index].chart.push(coinPrice);

                charRequest = await fecthLocalData('criptos','update',{value:user.criptos,id:userID});
            }

            return charRequest;

        default:
            break;
        
    }
}

// (async ()=>{

//    setTimeout(async() => {
//     //const re= await transaction('UpdateCheckPrice',{coinPrice:1220,earned:0, criptoID:'moi2',index:0});//, {BTCjson.status.c,BTCjson.earnings})
//     //console.log(re);
//     // transaction('buy',{coinPrice:0,earned:0, criptoID:'moi1',index:0});//, {BTCjson.status.c,BTCjson.earnings})
//     // transaction('buy',{coinPrice:0,earned:0, criptoID:'moi1',index:0});//, {BTCjson.status.c,BTCjson.earnings})
//     // transaction('buy',{coinPrice:0,earned:0, criptoID:'moi2',index:1});//, {BTCjson.status.c,BTCjson.earnings})
//     //console.log(user);
//    }, 1500);
    
// })();

//cache services
cacheService = async (urlImage)=>{
    // Definir la URL de la imagen que deseas guardar en caché
    const imageUrl = urlImage;

    // Abrir la caché utilizando la API Cache
    caches.open('my-cache').then(function(cache) {

        // Comprobar si la imagen ya está en caché
        cache.match(imageUrl).then(async function(response) {

            // Si la imagen ya está en caché, usarla
            if (response) {
                console.log('si esta en cache');
            return imageUrl;
            }

            // De lo contrario, descargar la imagen y guardarla en caché
            await fetch(imageUrl).then(function(response) {
                cache.put(imageUrl, response);
            });

            console.log('no esta en cache');
            //para usar la img desde internet
            return imageUrl
        });

    });
}

//get all my saved wallets ID to use it on API
getWalletSymbols=()=>{
    let coins="";
    for(let i=0; i< user.coins.length;  i++){
        let element;
        if(i == user.coins.length-1){
            element = user.coins[i].symbol;
        }else{
            element = user.coins[i].symbol+",";
        }

        coins += element;
    } 
    return coins;
}

async function get_api_chart_data(idCripto="BTC", limit=100){
    const response=await fetch(`https://api.binance.com/api/v3/klines?symbol=${idCripto}USDT&interval=5m&limit=${limit}`)
    const buffer= await response.arrayBuffer()
    
    const data = new Uint8Array(buffer);
    const decoder = new TextDecoder();
    const json = decoder.decode(data);
    const array = JSON.parse(json);

    return array;
    
}

// catch event of window
function mainEvent(event, handle){
    switch (event) {
        case 'load':
  
            window.addEventListener('load',function(){
                handle();
            })
  
        break;
        case 'resize':
  
            window.addEventListener('resize',function(){
                handle();
            })
  
        break;
    default:
  
        break;
    }
  }