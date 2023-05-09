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
    setClass([{e:$('.chartSection'),c:'hidde'}]);
    setClass([{e:$('.expenseSection'),c:'searchPlace'}]);

    $('.rankingContent').innerHTML = '';
    let search = event.target[0].value;
  
    searchResult = await fetchData(searchAPI + `?query=${search}`);
    searchResult = searchResult.coins;

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
            <span>
              <img id="coinImage${i}" alt="">
            </span>
            <span title="ranking">${searchResult[i].market_cap_rank}</span>
          </div>
          <div class="ranking">${searchResult[i].name}</div>
        </div>
      `;
  
      $('.rankingContent').innerHTML += element;
  
      // Crear una nueva instancia de Image y establecer el src en la URL de la imagen.
      const img = new Image();
      img.src = searchResult[i].large;
  
      // Esperar a que la imagen se cargue antes de agregarla al HTML.
      await new Promise(resolve => {
        img.onload = () => {
          const coinImage = document.getElementById(`coinImage${i}`);
          coinImage.src = searchResult[i].large;
          resolve();
        };
      });
    }
    
    //add to my wallets
    setMyWallets();
  
}



//searh place close
$('.closeSearch').onclick=()=>{
    removeClass([{e:$('.chartSection'),c:'hidde'}]);
    removeClass([{e:$('.expenseSection'),c:'searchPlace'}]);
}
//do not show search place
$('.hiddenExp').onclick=()=>{
    setClass([{e:$('.CriptoSection'),c:'expenseHidde'}]);
    setClass([{e:$('.expenseSection'),c:'hidde'}]);
}


//open buy section
openBuySection=()=>{
  let myCriptos= $('.myCriptos','all');
  myCriptos.forEach((element,index) => {
        element.onclick= async ()=>{
          //saved id of element to close after 
          setClass([{e:element,c:'buy'}]);
          setClass([{e:$('.buySpace'),c:'active'}]);

          let marginTop =$('.buySpace_card').offsetTop;
          let marginleft=$('.buySpace_card').offsetLeft + $('.main').offsetLeft;
          let invested_saved_coin =$('#invested_saved_coin');

          element.setAttribute('style',`margin-top:${marginTop}px; margin-left:${marginleft}px;`);

          //get ID of cripto
          let id=$('.criptoID','all')[index].innerHTML;
          //let id=element.children.item(0).children.item(0).children.item(1).children.item(1).innerHTML;
          //save data on variable
          BTCjson.coinSelected={
            index:index,
            id:id
          }

          //detect which wallets I selected and show the prices I invested
          for (let j = 0; j < user.criptos.length; j++) {
            const idCripto = user.criptos[j].idCripto;
            if (id === idCripto) {
                //add invested price
                invested_saved_coin.innerHTML="invested: ";
                for (let o = 0; o < user.criptos[j].investedPrice.length; o++) {
                  console.log(user.criptos[j].investedPrice[o].date);
                  invested_saved_coin.innerHTML+=`<div>${validateElapseTime(user.criptos[j].investedPrice[o].date)} = &nbsp $<span>${user.criptos[j].investedPrice[o].price}</span></div>`;

                }
        
                break
            }else{
                invested_saved_coin.innerHTML="";
            }
        }
        //   //add invested price if exist
        //   $('#invested_saved_coin').innerHTML="invested: "+user.criptos[index].investedPrice[0].price;
        }
  });
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
let typeChart=0; //between 0 to 1
let chartStyle=2; //between 1 to 4

$('#typeChart').onclick=()=>{
  if(typeChart == 2) typeChart=0;

  if(typeChart == 1) paintChart(typeChart,testData,chartStyle-1);//keep chartStyle
  if(typeChart == 0) paintChart(typeChart,testData,1);
  set_style_chart();
  
  typeChart++;
}
//paint chart style
$('#chartStyle').onclick=()=>{
  if(chartStyle == 5) chartStyle=1;
  
  paintChart(1,testData,chartStyle);
  set_style_chart();

  chartStyle++;
  typeChart=0;
}

//save style of chart
set_style_chart=()=>{
  let saveChartStyle={
    typeChart,
    chartStyle
  }
  setStorageData('json','chartStyle',saveChartStyle);
}