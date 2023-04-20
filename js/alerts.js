let AlertType=['offline_page','error']
const AlertsSpace = getElement("#AlertsSpace");

let Alert_Content={
    offline_page:{
        type:'div',
        text:'',
        get element() {
            setClass([{e:AlertsSpace,c:'show'}])
            return `<div class="moises">${this.text}</div>`;
        }
    },
    error:{
        type:'div',
        text:'5',
        get element() {
            return `<div class="moises">${this.text}</div>`;
        }
    }
 };

 function createAlert(alert){
    let {type, element} = alert;
    // const newElement = document.createElement(type);
    // newElement.innerHTML=`${element}`;
    // AlertsSpace.appendChild(newElement);
    AlertsSpace.innerHTML=`${element}`;
};

function getAlert(type, text, option={}){
    switch (type) {
        case 'offline_page':

            Alert_Content.offline_page.text=text;
            createAlert(Alert_Content.offline_page);

            break;
        case 'error':

            break;
        case 'close':
            removeClass([{e:AlertsSpace,c:'show'}])
            break;
        default:
            break;
    }
}

function AlertOfflinePage() {
    if (online_offline == false) {
        offline.setAttribute('style', 'display:flex;')
    } else { offline.setAttribute('style', 'display:none;') }
}
window.onload=function(){
    getAlert('offline_page',"hi Aim Moises Alert hahaha");
}