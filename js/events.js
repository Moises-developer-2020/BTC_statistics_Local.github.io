//open and close menu
$('.menu-bars').onclick=()=>{
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
