//open and close menu
$('.menu-bars').onclick=function(){
    if($('.menu').classList.contains('hidde')){
        removeClass([{e:$('.menu'),c:'hidde'}]);
        setClass([{e:$('.mainSection'),c:'hidde'}]);
        return
    }
    removeClass([{e:$('.mainSection'),c:'hidde'}]);
    setClass([{e:$('.menu'),c:'hidde'}]);
};


//searh place open
let searchResult;
$('#coinSearch').onsubmit = async (event, e) => {
  event.preventDefault();
  
  //hidde elements necesary to show search place
  setClass([{e:$('.seach_place'),c:'searchPlace'}]);

  let search = event.target[0].value;

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
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto;/* background: rgb(241, 242, 243); */display: block;" width="204px" height="204px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                  <circle cx="50" cy="50" r="0" fill="none" stroke="#93dbe9" stroke-width="4">
                    <animate attributeName="r" repeatCount="indefinite" dur="1.075268817204301s" values="0;38" keyTimes="0;1" keySplines="0 0.2 0.8 1" calcMode="spline" begin="0s"></animate>
                    <animate attributeName="opacity" repeatCount="indefinite" dur="1.075268817204301s" values="1;0" keyTimes="0;1" keySplines="0.2 0 0.8 1" calcMode="spline" begin="0s"></animate>
                  </circle><circle cx="50" cy="50" r="0" fill="none" stroke="#689cc5" stroke-width="4">
                    <animate attributeName="r" repeatCount="indefinite" dur="1.075268817204301s" values="0;38" keyTimes="0;1" keySplines="0 0.2 0.8 1" calcMode="spline" begin="-0.5376344086021505s"></animate>
                    <animate attributeName="opacity" repeatCount="indefinite" dur="1.075268817204301s" values="1;0" keyTimes="0;1" keySplines="0.2 0 0.8 1" calcMode="spline" begin="-0.5376344086021505s"></animate>
                  </circle>
                  </svg>
              </span>
              <span title="ranking">${searchResult[i].market_cap_rank}</span>
            </div>
            <div class="ranking">${searchResult[i].name}</div>
          </div>
        `;
    
        $('.rankingContent2').innerHTML += element;
    }

    //paint images
    for (let i = 0; i < searchResult.length; i++) {
        // Crear una nueva instancia de Image y establecer el src en la URL de la imagen.
        const img = new Image();
        img.src = searchResult[i].large;
    
        // Esperar a que la imagen se cargue antes de agregarla al HTML.
        await new Promise(resolve => {
          img.onload = () => {
            const coinImage = document.getElementById(`coinImage${i}`);
            //coinImage.innerHTML = `<img src="${searchResult[i].large}" alt="">`;
            coinImage.innerHTML="";
            coinImage.insertAdjacentElement('beforeEnd',img);
            resolve();
          };
        });
    }
      
    //add to my wallets
    setMyWallets();
  }
}

//Paint summarize cryptos to movil desing
summarize_cryptos= async (searchResult, i)=>{
  
    let element = `
            <div class="criptoRanking" id="${searchResult.symbol}" index="${i}">
                <div class="imgCripto">
                    <span id="crypto${i}">↻</span>
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
        //coinImage.innerHTML= `<img src="${searchResult.large}" alt="">`; 
        coinImage.insertAdjacentElement('beforeEnd',img);// `<img src="${searchResult.large}" alt="">`; 
        resolve();
      };
    });
    
    //add click event to .criptoRanking
    openCriptoDetails_mobile();
}


//searh place close
$('.closeSearch').onclick=()=>{
    removeClass([{e:$('.seach_place'),c:'searchPlace'}]);
    removeClass([{e:$('.rankingContent2'),c:'active'}]);
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

      }
  });
};
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

      }
  });
};

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
