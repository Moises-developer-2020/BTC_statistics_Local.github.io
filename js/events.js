//open and close menu
$('.menu-bars').onclick=function(){
    if($('.menu').classList.contains('hidde')){
        removeClass([{e:$('.menu'),c:'hidde'},{e:$('.menu'),c:'window'}]);
        setClass([{e:$('.mainSection'),c:'hidde'}]);
        return
    }
    setClass([{e:$('.menu'),c:'hidde'}]);
    removeClass([{e:$('.mainSection'),c:'hidde'}]);
};


//searh place open
let searchResult;
$('#coinSearch').onsubmit = async (event, e) => {
  event.preventDefault();
 
  //remove focus from input
  $('#coinSearch_input').blur();

  let search = event.target[0].value;

  showTo(`/search?${search}`)

  searchResult = await fetchData(searchAPI + `?query=${search}`);
  if (searchResult.status) {
    //delete load signal
    setClass([{e:$('.rankingContent2'),c:'active'}]);
    $('.rankingContent2').innerHTML = '';

    searchResult = searchResult.data.coins;

    //convert my crypto names to array
    let MyCoinsArray=getWalletSymbols().split(",");


    //detect which one it is not valid by the API coindesk
    for (let i = 0; i < searchResult.length; i++) {
      if (!ValidCoins.includes(searchResult[i].symbol)) {
        searchResult[i].symbol="invalid";
      }
    }

    //detect which one already it is saved
    for (let i = 0; i < searchResult.length; i++) {
      if (MyCoinsArray.includes(searchResult[i].symbol)) {
        searchResult[i].symbol="own";
      }
    }
    for (let i = 0; i < searchResult.length; i++) {
        let element = `
          <div class="criptoRanking ${searchResult[i].symbol}" id="${i}" >
            <div class="imgCripto">
              <span id="coinImage${i}">
                <div class="spin-wrapper not_background">
                  <div class="spinonediv-1" style="transform: scale(0.5);"></div>
                </div>
              </span>
              <span title="ranking">${searchResult[i].market_cap_rank}</span>
            </div>
            <div class="ranking">${searchResult[i].name}</div>
          </div>
        `;
    
        $('.rankingContent2').innerHTML += element;
    }
   
    //add to my wallets
    setMyWallets();

    //paint images
    for (let i = 0; i < searchResult.length; i++) {
        // Crear una nueva instancia de Image y establecer el src en la URL de la imagen.
        const img = new Image();
        img.src = searchResult[i].large;
    
        // Esperar a que la imagen se cargue antes de agregarla al HTML.
        await new Promise(resolve => {
          img.onload = () => {
            const coinImage = document.getElementById(`coinImage${i}`);
            coinImage.innerHTML="";
            
            coinImage.insertAdjacentElement('beforeEnd',img);
            resolve();
          };
        });
    }
    
  }
}

//Paint summarize cryptos to movil desing
summarize_cryptos= async (searchResult, i)=>{

    let element = `
            <div class="criptoRanking" id="${searchResult.symbol}" index="${i}">
                <div class="imgCripto">
                    <span id="crypto${i}">
                      <div class="spin-wrapper not_background" style="transform: scale(0.5);">
                        <div class="spinonediv-1" style="transform: scale(0.5);"></div>
                      </div>
                  </span>
                </div>
              <div class="ranking">${searchResult.symbol}</div>
            </div>`;

    $('.rankingContent').innerHTML += element;


    //paint images
    const img = new Image();
    img.src = searchResult.large;

    // Esperar a que la imagen se cargue antes de agregarla al HTML.
    await new Promise(resolve => {
      img.onload = () => {
        const coinImage = document.getElementById(`crypto${i}`);
        coinImage.innerHTML="";

        coinImage.insertAdjacentElement('beforeEnd',img);
        resolve();
      };
    });
    
    //add click event to .criptoRanking
    openCriptoDetails_mobile();
}


//searh place close
$('.closeSearch').onclick=()=>{
    closeTo('/search'); 
}

//open buy section function
openCriptoDetails=()=>{
  let myCriptos= $('.myCriptos','all');
  myCriptos.forEach((element,index) => {
        element.onclick= async ()=>{
          let id=$('.criptoID','all')[index].innerHTML;
          
          //save coin selected in variable to use it on buys
          BTCjson.coinSelected={
            index:index,
            id:id
          }

          //save on localStorage the coin selected
          setStorageData('json','coinSelected',BTCjson.coinSelected);

          loadCriptoSelected();
          open_Cripto_selected_mobile();
      }
  });
};
$('.close_sect2').onclick=()=>{
  removeClass([{e:$('.section2'),c:'show'}]);
}

//open buy section function for movil desing
openCriptoDetails_mobile=()=>{
  let criptoRanking= $('.criptoRanking','all');
  criptoRanking.forEach((element,index) => {
        element.onclick= async ()=>{
          let id=$('.ranking','all')[index].innerHTML;
          
          //save coin selected in variable to use it on buys
          BTCjson.coinSelected={
            index:index,
            id:id
          }

          //save on localStorage the coin selected
          setStorageData('json','coinSelected',BTCjson.coinSelected);

          loadCriptoSelected();

          open_Cripto_selected_mobile();
      }
  });
};

open_Cripto_selected_mobile=()=>{
  //open section2 to see data on movil desing
  setClass([{e:$('.section2'),c:'show'}]);
}

////open buy section by click
$('#investInput').onclick=()=>{

  let myCriptos= $('.myCriptos','all');
  let index=BTCjson.coinSelected.index;

  //saved id of element to close after 
  setClass([{e:myCriptos[index],c:'buy'}]);
  setClass([{e:$('.buySpace'),c:'active'}]);

  let marginTop =$('.buySpace_card').offsetTop;
  let marginleft=$('.buySpace_card').offsetLeft + $('.main').offsetLeft;
  let invested_saved_coin =$('#invested_saved_coin');

  myCriptos[index].setAttribute('style',`margin-top:${marginTop}px; margin-left:${marginleft}px;`);

  //get ID of cripto
  let id=$('.criptoID','all')[index].innerHTML;


  //detect which wallets I selected and show the invested prices
  for (let j = 0; j < user.criptos.length; j++) {
    const idCripto = user.criptos[j].idCripto;
    if (id === idCripto) {
        //add invested price
        invested_saved_coin.innerHTML="invested: ";
        for (let o = 0; o < user.criptos[j].investedPrice.length; o++) {
          invested_saved_coin.innerHTML+=`<div>${validateElapseTime(user.criptos[j].investedPrice[o].date)} = &nbsp $<span>${user.criptos[j].investedPrice[o].price}</span></div>`;

        }

        break
    }else{
        invested_saved_coin.innerHTML="";
    }
  }
}

$('.btnCancelBuy').onclick=()=>{
  closeBuySpace();
}
closeBuySpace=()=>{
   //remove all atrubutes sets it when i was open
   let myCripto = $('.myCriptos','all');
   let myCriptoID =BTCjson.coinSelected.index;
 
   myCripto[myCriptoID].removeAttribute('style');
   removeClass([{e:myCripto[myCriptoID],c:'buy'}]);
   removeClass([{e:$('.buySpace'),c:'active'}]);
}

//paint type of chart
$('#typeChart').onclick=()=>{
  if(typeChart == 2) typeChart=0;

  if(typeChart == 1){
    paintChart(typeChart,testData,chartStyle-1);//keep chartStyle
    set_style_chart(typeChart,chartStyle-1);

  } 
  if(typeChart == 0){
    paintChart(typeChart,testData,1);
    set_style_chart(typeChart,1);

  }

  typeChart++;
}
//paint chart style
$('#chartStyle').onclick=()=>{
  if(chartStyle == 5) chartStyle=1;
  
  paintChart(1,testData,chartStyle);
  set_style_chart(1,chartStyle);

  typeChart=0;
  chartStyle++;
}

//save style of chart
set_style_chart=(a,b)=>{
  let saveChartStyle={
    typeChart:a,
    chartStyle:b
  }
  setStorageData('json','chartStyle',saveChartStyle);
}
//get style saved of chart
function get_style_chart(data){
  let saveChartStyle=checkStorageData('chartStyle')?getStorageData('chartStyle'):0;
  saveChartStyle=JSON.parse(saveChartStyle);

  if(saveChartStyle != 0){
    typeChart=saveChartStyle.typeChart;
    chartStyle=saveChartStyle.chartStyle;
    paintChart(typeChart,data,chartStyle);

    //to pass to the next style when I made click on the buttons
    typeChart++;
    chartStyle++;
  }else{
    //start with the default style
    paintChart(1,data,1);
  }

}

mainEvent('resize',()=>{
    var width = window.innerWidth; // píxeles
    var height = window.innerHeight; // píxeles

    //delete class of menu .window to responsive menu
    if(width >= 551){
      setClass([{e:$('.menu'),c:'window'}]);
    }else if(width <= 550){
      removeClass([{e:$('.menu'),c:'window'}]);
    }
    movilDesing(width, height);
});

movilDesing=(w,h)=>{
    var width = w; // píxeles
    var height = h; // píxeles

    if(width <= 1435){
      //setClass([{e:$('.section2'),c:'show'}]);
      
    }

}
/*open and close .section2 on movil desing*/
$('.section2_option_window').onclick=()=>{
  if(!$('.section2_option').classList.contains('active')){
    setClass([{e:$('.section2_option'),c:'active'}]);
  }else{
    removeClass([{e:$('.section2_option'),c:'active'}]);
  }
}

// event to arrow_to_slides
arrow_to_slides_clickEvent=()=>{
  arrow_right=$('.arrow_right');
  arrow_left=$('.arrow_left');

  criptoContent = $('.criptoContent');
  criptoContent_width = criptoContent.clientWidth;

  myCriptos = $('.myCriptos','all');
  criptoRanking = $('.criptoRanking','all');
  
  myCriptos_width = myCriptos[0].clientWidth;

  // width of criptoContent
  let width=-myCriptos_width;
  let widthLeft=0;
  let widthRight=0;
  let width_lenght=0;

  let long=0;
  function setfocus(index){
    
    setClass([{e:myCriptos[long],c:'focus'}]);
    //long++;
    if(myCriptos[long-1]){
      setClass([{e:myCriptos[long-1],c:'left'}]);
      myCriptos[long-1].setAttribute('style',`left: 0%;`);

    }
    setClass([{e:myCriptos[long],c:'focus'}]);
    setClass([{e:criptoRanking[long],c:'selected'}]);
    myCriptos[long].setAttribute('style',`left: 50%;`);

    if(myCriptos[long+1]){
      setClass([{e:myCriptos[long+1],c:'right'}]);
      myCriptos[long+1].setAttribute('style',`left: 100%;`);

    }
  }

  myCriptos.forEach((element, index) =>{
    // how much it will move
    if(myCriptos_width*(index+1) < criptoContent_width){
      width_lenght++;
    }
    width+=(myCriptos_width)+15
    //element.setAttribute('style',`left:${width}px;`);

    // if(element.classList.contains('focus')){
    //   console.log(index);
    // }
    
      if(index == 0){
        setfocus(0);
      }
    
  })

  // right event
  arrow_right.onclick=()=>{
    myCriptos.forEach((element, index) =>{
      //element.setAttribute('style',`left:${width}px;`);
      
      if(element.classList.contains('left')){
        removeClass([{e:element,c:'left'}]);
      }
      if(element.classList.contains('focus')){
        removeClass([{e:element,c:'focus'}]);
      }
      if(element.classList.contains('right')){
        removeClass([{e:element,c:'right'}]);
      }
      if(criptoRanking[index].classList.contains('selected')){
        removeClass([{e:criptoRanking[index],c:'selected'}]);
      }
      //myCriptos[index].setAttribute('style',`margin-left:${0}px;`);

    })

    // how much it will move
    // widthRight+=(myCriptos_width)*width_lenght;
    long++;
    if(myCriptos[long-1]){
      setClass([{e:myCriptos[long-1],c:'left'}]);
      myCriptos[long-1].setAttribute('style',`left: 0%;`);

    }
    setClass([{e:myCriptos[long],c:'focus'}]);
    setClass([{e:criptoRanking[long],c:'selected'}]);
    myCriptos[long].setAttribute('style',`left: 50%;`);

    if(myCriptos[long+1]){
      setClass([{e:myCriptos[long+1],c:'right'}]);
      myCriptos[long+1].setAttribute('style',`left: 100%;`);

    }

    // last it is to restar and not end
    if(long == myCriptos.length-1){
      long =-1;
      myCriptos[0].setAttribute('style',`left: 100%;`);
      
    }
  }
  // left event
  arrow_left.onclick=()=>{
    setClass([{e:myCriptos[3],c:'focus'}]);

    // widthLeft-=(myCriptos_width-widthRight)*width_lenght;
    // myCriptos[0].setAttribute('style',`margin-left:${-widthLeft}px;`);
  }
  console.log(myCriptos_width+":"+criptoContent_width);
}