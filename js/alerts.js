const AlertSpace = getElement("#AlertSpace");

let Alert_Content={
    offline_page:{
        type:'div',
        text:'',
        get element() {
            return `<div class="offline" style="display:flex;">
            <div>
                <span>Upps! <br> You're offline</span>
                <span><input type="button" onclick="reloadPage()" class="button-34" value="Reload"></span>
            </div>
        </div>`;
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

function getAlert(type, text="", option={}){
    switch (type) {
        case 'offline_page':
            createAlert(Alert_Content.offline_page);
            break;
        case 'error':
                //Alert_Content.offline_page.text=text;
                // createAlert(Alert_Content.offline_page);
            break;
        case 'close':
            removeClass([{e:AlertSpace,c:'show'}])
            break;
        default:
            break;
    }
    setClass([{e:AlertSpace,c:'show'}])
}

