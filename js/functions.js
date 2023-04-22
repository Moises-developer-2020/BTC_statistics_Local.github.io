let online_offline;
const API = "https://production.api.coindesk.com/v2/tb/price/ticker?assets=BTC";
//check if exist
function checkStorageData(item) {
    return localStorage.getItem(item) !== null;
}

//get
function getStorageData(item) {
    return localStorage.getItem(item);
}

//set
function setStorageData(key, name, miObjeto) {
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
async function fetchData(url) {
    let data;
    if (window.navigator.onLine) {
        try {
            const response = await fetch(url);
             data = await response.json();
            online_offline = true;
            return data;
        } catch (error) {
            online_offline = false;
        }
    } else{online_offline = false;}

    if (data === undefined || data === 'undefined') {
        online_offline = false;
    }
    if (online_offline == false) {
        getAlert('offline_page'); 
    } else {
        getAlert('close');
    }
}

//get local data
async function fecthLocalData(table, type, obj = { value: {}, id: 0 }) {
    try {
        const db = await DB(dbName);
        const objeto = new MyFunctions(db);
        switch (type) {
            case 'add':

            const userId =await objeto.crearObjeto(table,obj.value);
            return userId;
            case 'remove':

                await objeto.deleteObjetoPorId(table, obj.id);
                break;
            case 'update':

                await objeto.updateObjeto(table, obj.id, obj.value);
                break;
            case 'showId':
                const result = await objeto.searchObjetoById(table, obj.id);
                return result;
                
            case 'showAll':

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
function validateElapseTime(date) {
    if (checkStorageData(date)) {
        var elapseTime = DateformatContacts(getStorageData(date));
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

function reloadPage() {
    window.location.reload();
}
async function login(type,data={}){
    const {email, name, password } =data;
    switch (type) {
        case 'sinIn':
                const users= await fecthLocalData('users', 'showAll');
                console.log(users);
            break;
        case 'sinUp':
                const idUser =await fecthLocalData('users', 'add', { value: { email: email, name:name, key:'password' } });
                const result =await fecthLocalData('usersPasswd', 'add', { value: { id: idUser, password:password } });
            return result;
        default:
            break;
    }
}