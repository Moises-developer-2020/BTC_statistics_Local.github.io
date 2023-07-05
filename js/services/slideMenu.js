
function $el(selector, all='') {
    return document.querySelector(selector);
}
  
class touch{
    constructor(event) {
        this.event = event;
        this.slideConfig ={
            maxLength:{ // end moving
                up:80,
                down:80,
                left:80,
                right:80
            },minLength:{ // start moving
            up:0,
            down:0,
            left:0,
            right:0
           },
           fastVelocity:8.5
        },
        this.elapsedTimeEvents={
            click:{
                startTime:0,
                endTime:0,
                elapsedTime: this.startTime - this.endTime
            },
            move:{
                startTime:0,
                endTime:0,
                elapsedTime: this.startTime - this.endTime
            }
        }
    }

    menu_Slide(eventElement=[], callback = {}, config=this.slideConfig){
        
        const seleccionado = this.event.target
        

        // all elements inside of the parent will eject the funcion menu()
        if(eventElement[2] == 'parentContent'){
            console.log(1);
            function checkParentContent(parent){
                const parentContent = document.querySelector(parent);
                //console.log(seleccionado);
                if(!parentContent){
                    return false
                }
                return parentContent.contains(seleccionado);
            }
            console.log(seleccionado);
            console.log(checkParentContent(eventElement[1]));
            if(checkParentContent(eventElement[1])){
                menu(this);
            }
            return
        }else if (Array.isArray(eventElement)) {// valida all element class passed as array
            console.log(2);
            for (let index = 0; index < eventElement.length; index++) {
                const classElement = eventElement[index].split('.')[1];
                
                // to avoid all call of menu_slide and only the call of the one touched
                if (this.event.target.classList.contains(classElement) ) {
                    eventElement = '.'+classElement
                    //console.log(eventElement);
                    menu(this);
                    break;
                }
            }
        } else { // just one class passed but many can have the same class
            console.log(3);
            const classElement = eventElement.split('.')[1];

            // to avoid all call of menu_slide and only the call of the one touched
            if (this.event.target.classList.contains(classElement) ) {
                //console.log(eventElement);
                menu(this);
            }
        }
        //console.log(50000000);
        function menu(element){
            console.log("yes");
            // methods
            const {
                slideRight: {
                    onStart: slideRightOnStart = () => {},
                    onEnd: slideRightOnEnd = () => {},
                    onStartOne: slideRightOnStartOne = () => {}
                } = {},
                slideLeft:{
                    onStart: slideLeftOnStart = () => {},
                    onEnd: slideLeftOnEnd = () => {},
                    onStartOne: slideLeftOnStartOne = () => {}
                } = {} ,
                slideUp: {
                    onStart: slideUpOnStart = () => {},
                    onEnd: slideUpOnEnd = () => {},
                    onStartOne: slideUpOnStartOne = () => {}
                } = {},
                slideDown: {
                    onStart: slideDownOnStart = () => {},
                    onEnd: slideDownOnEnd = () => {},
                    onStartOne: slideDownOnStartOne = () => {}
                } = {},
                follow: {
                    onStart: followOnStart = () => {},
                    onEnd: followOnEnd = () => {}
                } = {}
            } = callback;
            let detectMove = 0;
            let startX = 0;
            let startY = 0;
            let currentX = 0;
            let currentY = 0;
            let direction = ""; // to validate only the direction started to not change it when it is moving
            let status={
                position:0,
                reached:false,
                cursor:{
                    x:0,
                    y:0
                },
                elapsedTime:{
                    startTime:0,
                    endTime:0,
                    elapsedTime: 0
                },
                velocity:{
                    fast:false,
                    low:false,
                    value:0
                },
                comeBack:{ // when start the event has diireccion but when it change opposite direction it`s comeBack
                    status:false,
                    x:0,
                    y:0,
                    difference:0,
                    lastPosition:0,
                }
            }

            function handleTouchStart(event) {
                startX = event.touches[0].clientX;
                startY = event.touches[0].clientY;
                //$('.statusContent').classList.add('after')

                element.event.target.addEventListener('touchmove', handleTouchMove);
                element.event.target.addEventListener('touchend', handleTouchEnd);
            }

            function handleTouchMove(event) {
                //console.error("end");
                detectMove++;
                currentX = event.touches[0].clientX;
                currentY = event.touches[0].clientY;
                
                const deltaX = startX - currentX;
                const deltaY = startY - currentY;

                // validate if have scroll vertical, becouse this is to avoid "pull-to-refresh" on movil
                if (element.event.target.clientHeight == element.event.target.scrollHeight ) {
                    /*console.log('entra');*/
                    event.preventDefault();
                }
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    if(deltaX > config.minLength.left && direction == "" || direction == "izquierda"){
                        direction = "izquierda";
                        status.position =deltaX;
                        status.elapsedTime.startTime=event.timeStamp; // Guardar la marca de tiempo inicial
                        status.comeBack.x = deltaX

                        // execute it in every mmove
                        status.reached=false;
                        
                        // reached the limit of the move selected
                        if(deltaX > config.maxLength.left){
                            status.reached=true;

                            //execute onStartOne()
                            slideLeftOnStartOne(status,methods_on);
                        }
                        // to avoid move the opposite dirrecion one it start moving
                        if(deltaX < config.minLength.down){
                            status.position=0;
                        }
                        // execute in every move
                        slideLeftOnStart(status,methods_on)
                    }else if(deltaX < -(config.minLength.right) && direction == "" || direction == "derecha"){
                        direction = "derecha";
                        status.position =deltaX;
                        status.elapsedTime.startTime=event.timeStamp;
                        status.comeBack.x = deltaX

                        status.reached=false;

                        if(deltaX < -(config.maxLength.right)){
                            status.reached=true;
                            // execute one
                            slideRightOnStartOne(status,methods_on);

                        }
                        // to avoid move the opposite dirrecion one it start moving
                        if(deltaX > -(config.minLength.right)){
                            status.position=0;
                        }
                        // execute in every move 
                        slideRightOnStart(status,methods_on);
                    }else{
                        console.error("out the window");
                        onEndEvent()
                    }
                    
                } else{
                    if(deltaY > config.minLength.up && direction == "" || direction == "arriba"){
                        direction = "arriba";
                        status.position =deltaY;
                        status.elapsedTime.startTime=event.timeStamp;
                        status.comeBack.y = deltaY

                        status.reached=false;
                        
                        if(deltaY > config.maxLength.up){
                            status.reached=true;
                            // execute one
                            slideUpOnStartOne(status,methods_on);
                        }
                        // to avoid move the opposite dirrecion one it start moving
                        if(deltaY < config.minLength.up){
                            status.position=0;
                        }
                        // execute in every move
                        slideUpOnStart(status,methods_on);
                    }else if(deltaY < -(config.minLength.down) && direction == "" || direction == "abajo"){
                        direction = "abajo";
                        status.position =deltaY;
                        status.elapsedTime.startTime=event.timeStamp;
                        status.comeBack.y = deltaY

                        status.reached=false;
                        
                        if(deltaY < -(config.maxLength.down) ){
                            status.reached=true;
                           
                            // execute one
                            slideDownOnStartOne(status,methods_on);

                        }
                        // to avoid move the opposite dirrecion one it start moving
                        if(deltaY > -(config.minLength.down)){
                            status.position=0;
                        }
                        // execute in every move 
                        slideDownOnStart(status,methods_on);
                    }else{
                        console.error("out the window");
                        onEndEvent()
                    }
                }
                //to follow finger`s move
                status.cursor.x=currentX;
                status.cursor.y=currentY;
                followOnStart(status)
                
                // vlidate if it come back of direction 
                if(Math.sign(parseFloat(status.position)) == -1 || Math.sign(parseFloat(status.position)) == -0){
                    if(status.position < status.comeBack.lastPosition){
                        status.comeBack.lastPosition = status.position;
                        status.comeBack.status =false;
                    }else{
                        status.comeBack.status =true;
                        status.comeBack.lastPosition = status.position;
                        status.comeBack.difference = status.position - status.comeBack.lastPosition;
                    } 
                }else{
                    if(status.position > status.comeBack.lastPosition){
                        status.comeBack.lastPosition = status.position;
                        status.comeBack.status =false;
                    }else{
                        status.comeBack.status =true;
                        status.comeBack.lastPosition = status.position;

                        status.comeBack.difference = status.comeBack.lastPosition - status.position;
                    } 
                }
                //console.log(direction+":"+status.position);
                console.log(status.position)
                console.log(status.cursor);
            }

            function handleTouchEnd(event) {
                startX = 0;
                startY = 0;
                currentX = 0;
                currentY = 0;
                config.minLength.down=0;
                config.minLength.up=0;
                config.minLength.left=0;
                config.minLength.right=0;
                detectMove = 0;
                // Calcular el tiempo transcurrido en milisegundos
                status.elapsedTime.endTime=event.timeStamp;
                status.elapsedTime.elapsedTime = status.elapsedTime.endTime - status.elapsedTime.startTime;

                //velocity of the move
                let velocity = Math.abs(status.position / status.elapsedTime.elapsedTime);
                status.velocity.value = velocity;

                // valocity considerate fast
                if(velocity > config.fastVelocity){
                    status.velocity.fast=true
                    status.velocity.low=false
                }else{
                    status.velocity.low=true
                    status.velocity.fast=false

                };
                //console.log(status.velocity.fast);

                //event end of the methods
                onEndEvent();

                // remove events to the children
                element.event.target.removeEventListener('touchend', handleTouchEnd);
                element.event.target.removeEventListener('touchmove', handleTouchMove);

            
            }

            //event end of the methods
            function onEndEvent(){
                followOnEnd(status);

                if(direction == 'izquierda' ){
                    slideLeftOnEnd(status, methods_on)
                    return
                }
                if(direction == 'derecha' ){
                    slideRightOnEnd(status, methods_on);
                    return
                }
                if(direction == 'arriba'  ){
                    slideUpOnEnd(status, methods_on)
                    return
                }
                if(direction == 'abajo' ){
                    slideDownOnEnd(status, methods_on)
                    return
                }
            
            }
            // methods to onStart, onStartOne and onEnd
            let methods_on={
                stop:()=>{// stop events 'it wont move more'
                    element.event.target.removeEventListener('touchmove', handleTouchMove);
                },
                click:(e)=>{
                    $el(e).click();
                },
                open_close:(elementToOpen, elementToClose)=>{
                    return {
                        direction:(direction)=>{
                            if(direction == 'right'){
                                direction = 'left'
                                $el(elementToOpen).setAttribute('style',`${direction}:calc(-100% + ${-status.position}px) !important; transition: 0.05s !important`);
                                $el(elementToClose).setAttribute('style',`${direction}:calc(0% - ${status.position}px) !important; transition: 0.05s !important`);
                                
                            }else{
                                $el(elementToOpen).setAttribute('style',`${direction}:calc(0% - ${status.position}px) !important; transition: 0.05s !important`);
                                $el(elementToClose).setAttribute('style',`${direction}:calc(100% - ${status.position}px) !important; transition: 0.05s !important`);
                            }

                            return {
                                click:(e)=>{
                                    $el(e).click();
                                }
                            }
                        },
                        restartEffect:()=>{
                            $el(elementToOpen).removeAttribute('style');
                            $el(elementToClose).removeAttribute('style');
                            return {
                                click:(e)=>{
                                    $el(e).click();
                                }
                            }
                        },
                        fadeIn:(maxWidth)=>{
                            function adjustOpacity(element, values, fatherWidth) {
                                let value = (values/fatherWidth)*100
                                // Adjust the value to be between 0 and 1
                                const opacityValue = value >= 0 ? Math.min(value / 100, 1) : Math.max((100 + value) / 100, 0);
                                
                                // set opacity
                                element.setAttribute('style','display:flex; opacity:'+opacityValue.toString()+' !important; transition:0s;')
                            }
                            adjustOpacity(elementToOpen, -status.position, maxWidth)
                            adjustOpacity(elementToClose, status.position, maxWidth)

                        }
                    }
                },
                open:(elementToOpen)=>{
                    return{
                        direction:(direction)=>{
                            $el(elementToOpen).setAttribute('style',`${direction}:calc(0% + ${status.position}px) !important; transition: 0.05s !important`);
                        },
                        restartEffect:()=>{
                            $el(elementToOpen).removeAttribute('style');
                            return {
                                click:(e)=>{
                                    $el(e).click();
                                }
                            }
                        },
                    }
                },
                close:(elementToOpen)=>{
                    return{
                        direction:(direction)=>{
                            $el(elementToOpen).setAttribute('style',`${direction}:calc(0% + ${-status.position}px) !important; transition: 0.05s !important`);
                        }
                    }
                }
                
            }
            
            // start all the events
            handleTouchStart(element.event);
        }
        
    }
    
}
// main event
touch_slide = (element, validate, callback)=>{
    if(!validate){return}

    $el(element).ontouchstart=(eventt)=>{
        const k = new touch(eventt)

        // pass the methods of k to touch_slide(c)
        callback(k);
    }   

}
  
  
  // see events from chrome`s console
  // const padre = getEventListeners(document.querySelector('.padre'));
  // const event1 = getEventListeners(document.querySelector('.hijo1'));
  // const event2 = getEventListeners(document.querySelector('.hijo2'));
  // const event3 = getEventListeners(document.querySelector('.hijo3'));
  // console.log(padre,event1,event2,event3)
  