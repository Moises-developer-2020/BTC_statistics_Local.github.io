function menuSlide(eventElement, callback) {
    const divElement = eventElement;
    let startX = 0;
    let currentX = 0;
    let isOpen = true;
  
    divElement.addEventListener('touchstart', handleTouchStart);
    divElement.addEventListener('touchmove', handleTouchMove);
    divElement.addEventListener('touchend', handleTouchEnd);
  
    function handleTouchStart(event) {
      startX = event.touches[0].clientX;
    }
  
    function handleTouchMove(event) {
      currentX = event.touches[0].clientX;
      const diffX = currentX - startX;
  
      if (!isOpen && diffX > 80) {
        callback.slideRight(); // Llamar a la función slideRight a través del objeto de devolución de llamada
        isOpen = true;
      } else if (isOpen && diffX <  -80) {
        callback.slideLeft(); // Llamar a la función slideLeft a través del objeto de devolución de llamada
        isOpen = false;
      }
      console.log(diffX+":"+isOpen);
    }
  
    function handleTouchEnd(event) {
      startX = 0;
      currentX = 0;
    }
  }
  
 
  