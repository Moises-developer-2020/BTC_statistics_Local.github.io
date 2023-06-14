function menuSlide(eventElement, callback) {
    const divElement = eventElement;
    let startX = 0;
    let currentX = 0;
  
    divElement.addEventListener('touchstart', handleTouchStart);
    divElement.addEventListener('touchend', handleTouchEnd);
  
    function handleTouchStart(event) {
      startX = event.touches[0].clientX;
      divElement.addEventListener('touchmove', handleTouchMove); // add event
    }
  
    function handleTouchMove(event) {
        currentX = event.touches[0].clientX;
        const diffX = currentX - startX;

        if (diffX > 0) {
            if ( diffX > 80) {
                // Llamar a la función slideRight a través del objeto de devolución de llamada
                callback.slideRight(diffX);
                // remove event to avoid been calling to slideRight() if not up the finger
                divElement.removeEventListener('touchmove', handleTouchMove);
                return
            }
        } else if ( diffX <  0) {
            if(diffX <  -80){
                // Llamar a la función slideRight a través del objeto de devolución de llamada
                callback.slideLeft(diffX);
                // remove event to avoid been calling to slideLeft() if not up the finger
                divElement.removeEventListener('touchmove', handleTouchMove);
                return
            }
        }
        //console.log(diffX); 
    }
  
    function handleTouchEnd(event) {
      startX = 0;
      currentX = 0;
    }
}
  