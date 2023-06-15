const circleChart=`<svg class="circleChart" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100">
<path class="grey" d="M40,90 A40,40 0 1,1 110,90" ></path>
<path class="purple" id="progressPath" d="M40,90 A40,40 0 1,1 110,90" ></path>
<path class="progressGuia" d="M51,92 A44,45 0 1,1 129,92" ></path>
<text class="svgPercent load0" x="0" y="0">0%</text>
<text class="svgPercent load100" x="0" y="0">100%</text>
<text id="progressText" class="svgPercent" x="0" y="0" >50%</text>
<circle id="progressBall" class="red" cx="0" cy="0"></circle>    
</svg>`;

loadCircularProgressBar = (divElement,percent) => {

  // add the svg
  if(!document.querySelector('.circleChart')){
    var div = divElement;
    var parser = new DOMParser();
    var svgElement = parser.parseFromString(circleChart, "image/svg+xml").querySelector("svg");
    div.insertBefore(svgElement, div.firstChild);
  }

    // min and max value to the stroke-dashoffset of the svg path
    let maxValue=169;
    let minValue=3;
  
    let statusChart =1; //positive:1 and negative:0
    let normalPercent = percent;
  
    if(percent < 0 || percent < -1 ){
      statusChart = 0; // return negative
      percent = -percent
  
      // paint to red the chart its bars
      document.querySelector('.Content_chart').classList.add('negatives');
    }else{
      if(document.querySelector('.Content_chart').classList.contains('negatives')){
        document.querySelector('.Content_chart').classList.remove('negatives')
      }
    }
  
  
    const fullChart = maxValue; // value to 0%
    const emptyChart = minValue; // value to 100%
  
    let rango = emptyChart - fullChart;
    let porcentajeActual = fullChart + (percent / 100) * rango;
  
    // the path who is filled
    document.querySelector('.purple').setAttribute("style", "stroke-dashoffset:" + porcentajeActual);
  
    var newPath = document.querySelector('.progressGuia');
    var progressPath = document.getElementById("progressPath");
    var progressBall = document.getElementById("progressBall");
    var progressText = document.getElementById("progressText");
  
    const fullChartInfo = minValue; // value to 0%
    const emptyChartInfo = maxValue; // value to 100%
  
    rango = emptyChartInfo - fullChartInfo;
  
    function moveTextAlongPath() {
      porcentajeActual = fullChartInfo + (percent / 100) * rango+4;
      
      var pathLength = newPath.getTotalLength();
      var strokeLength = pathLength - porcentajeActual;
  
      var point = newPath.getPointAtLength((0 * strokeLength) + porcentajeActual);
  
      progressText.setAttribute("x", point.x);
      progressText.setAttribute("y", point.y);
  
      progressText.innerHTML=normalPercent+"%";
  
      // adjust the percent text its position 
      if(percent >= 10 && percent < 20){
        progressText.setAttribute('style','transform: translate(-48px, -19px);')
      }else if(percent >= 20 && percent < 30){
        progressText.setAttribute('style','transform: translate(-49px, -17px);')
      }else if(percent >= 30 && percent < 40){
        progressText.setAttribute('style','transform: translate(-49px, -18px);')
      }else if(percent >= 40 && percent < 50){
        progressText.setAttribute('style','transform: translate(-50px, -19px);')
      }else if(percent >= 50 && percent <= 70){
        progressText.setAttribute('style','transform: translate(-39px, -19px);')
      }else if(percent >= 70){
        progressText.setAttribute('style','transform: translate(-41px, -19px);')
      }else{
        progressText.setAttribute('style','transform: translate(-47px, -19px);')
  
      }
      
    }
    function moveCircleAlongPath() {
      porcentajeActual = fullChartInfo + (percent / 100) * rango;
      
      var pathLength = progressPath.getTotalLength();
      var strokeLength = pathLength - porcentajeActual;
      
      var point = progressPath.getPointAtLength((0 * strokeLength) + porcentajeActual-4);
  
  
      progressBall.setAttribute("cx", point.x);
      progressBall.setAttribute("cy", point.y);
    }
  
    moveCircleAlongPath();
    moveTextAlongPath();
  
    return statusChart;
  }
  