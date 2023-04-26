const AlertSpace = $("#AlertSpace");

let Alert_Content={
    offline_page:{
        type:'div',
        text:'',
        get element() {
            return `<div class="offline" style="display:flex;">
                        <div>
                            <span>${this.text}</span>
                            <span><input type="button" onclick="reloadPage()" class="button-34" value="Reload"></span>
                        </div>
                    </div>`;
        }
    },
    error:{
        type:'div',
        text:'',
        get element() {
            return `<div class="offline" style="display:flex;">
                        <div>
                            <span>${this.text}</span>
                            <span><input type="button" onclick="reloadPage()" class="button-34" value="Reload"></span>
                        </div>
                    </div>`;
        }
    }
 };

function getAlert(type, text="", option={}){
    switch (type) {
        case 'offline_page':
            Alert_Content.offline_page.text=text || `Ups! <br> You're offline`;
            createAlert(Alert_Content.offline_page);
            break;
        case 'error':

            Alert_Content.error.text=text || 'Something went wrong';
            createAlert(Alert_Content.error);

            break;
        case 'close':
            removeClass([{e:AlertSpace,c:'show'}])
            break;
        default:
            break;
    }
    setClass([{e:AlertSpace,c:'show'}])
}

