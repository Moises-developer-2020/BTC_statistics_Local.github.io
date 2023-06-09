
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
        
        const seleccionado = '.'+this.event.target.classList.value;
        console.log(seleccionado);
        //document.querySelector(seleccionado).parentElement.classList.add('moi');
        // function validarElementoEnRango(tophijo,seleccionado) {
        //     const tophijoElement = document.querySelector(tophijo);
            
        //     const seleccionadoElement = document.querySelector(seleccionado);
            
        //     if (!tophijoElement || !seleccionadoElement) {
        //       // Si no se encuentran los elementos con las clases especificadas, se retorna false
        //       return false;
        //     }
            
            
        //       return tophijoElement.contains(seleccionadoElement[0]);
        //   }
        //   console.log(validarElementoEnRango(eventElement[0],seleccionado));

        // function validateParentChildRelationship(hijo, padre) {
        //     const hijoElement = document.querySelector(hijo);
        //     const padreElement = document.querySelector(padre);
            
        //     if (!hijoElement || !padreElement) {
        //       // Si no se encuentran los elementos con las clases especificadas, se retorna false
        //       return false;
        //     }
            
        //     return padreElement.contains(hijoElement);
        // }

        // valida all element class passed as array
        if (Array.isArray(eventElement)) {
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

        } else { // just one class passed
            const classElement = eventElement.split('.')[1];

            // to avoid all call of menu_slide and only the call of the one touched
            if (this.event.target.classList.contains(classElement) ) {
                //console.log(eventElement);
                menu(this);
            }
        }
        console.log(50000000);
        function menu(element){
            console.log(eventElement);
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

            let divElement;
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
                divElement = eventElement;
                startX = event.touches[0].clientX;
                startY = event.touches[0].clientY;
                //$('.statusContent').classList.add('after')

                $el(divElement).addEventListener('touchmove', handleTouchMove);
                $el(divElement).addEventListener('touchend', handleTouchEnd);
            }

            function handleTouchMove(event) {
                currentX = event.touches[0].clientX;
                currentY = event.touches[0].clientY;
                
                const deltaX = startX - currentX;
                const deltaY = startY - currentY;


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
                        // execute in every move 
                        slideRightOnStart(status,methods_on);
                    }
                    
                } else {
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
                        // execute in every move 
                        slideDownOnStart(status,methods_on);
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
                //console.log(status.comeBack);
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
                $el(divElement).removeEventListener('touchend', handleTouchEnd);
                $el(divElement).removeEventListener('touchmove', handleTouchMove);

            
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
                    $el(divElement).removeEventListener('touchmove', handleTouchMove);
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
  