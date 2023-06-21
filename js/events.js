//event of route when the page change
routeEvent('hashchange',()=>{
  // validate it when url changed
  homePageRoute()

  // start validation
  requestPainted();
});

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
    
    $('.searh_details').innerHTML = `${searchResult.length} results to: ${search}`;

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
    setMyWallets(searchResult);

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
            <div class="criptoRanking image" id="${searchResult.symbol}" index="${i}">
                <div class="imgCripto">
                    <span id="crypto${i}">
                      <div class="spin-wrapper not_background" style="transform: scale(0.5);">
                        <div class="spinonediv-1" style="transform: scale(0.5);"></div>
                      </div>
                  </span>
                </div>
              <div class="ranking" style="display:none">${searchResult.symbol}</div>
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
    openCriptoDetails_mobile(i);
  
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
          
          // to avoid select .myCriptos when is not focus with arrow in desing mobile 
          if(movil_Desing){
            if(!movil_Desing_list){ // to allow click con list style from .myCriptos
              if(!element.classList.contains('focus')){ // to avoid make click to .myCripto when isnot focus
                return
              }
            }
          }
          
          // remove effect of cripto selected
          myCriptos.forEach(cripto => {
            removeClass([{e:cripto,c:'focus'}]);
          });
          // set effect of cripto selected
          setClass([{e:element,c:'focus'}]);


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
openCriptoDetails_mobile= (i)=>{

  let criptoRanking= $('.criptoRanking','all');
  // to avoid add onclick() each time it is in the bucle for so add it in the end
  if(i == user.coins.length-1){ 
    criptoRanking.forEach((element,index) => {
      element.onclick= async ()=>{
        let id=$('.ranking','all')[index].innerHTML;

        // show cripto selected in content with arrow to mobile desing
        arrow_to_slides_clickEvent(index);
        
        // avoid load the next data on mobile desing
        if(movil_Desing){
          return
        }
        
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
  }
  // to paint crypto selected after a new crypto is added
  if(movil_Desing){
    let coinIndex=paintCoindSelected();
    if($(`.image`,'all')[coinIndex]){
      $(`.image`,'all')[coinIndex].click();
    }
  }
};

open_Cripto_selected_mobile=()=>{
  // open section2 to see data on movil desing
  setClass([{e:$('.section2'),c:'show'}]);
}

// open buy section by click
$('#investInput').onclick=()=>{
  setClass([{e:$('.statusContent'),c:'active'}]);
}

$('.btnCancelBuy').onclick=()=>{
  closeBuySpace();
}
closeBuySpace=()=>{
   //remove all atrubutes sets it when i was open
   let myCripto = $('.myCriptos','all');
   let myCriptoID =BTCjson.coinSelected.index;
 
   myCripto[myCriptoID].removeAttribute('style');
   //removeClass([{e:myCripto[myCriptoID],c:'buy'}]);
   removeClass([{e:$('.statusContent'),c:'active'}]);
}

$('#open_ghost_buy').onclick=()=>{
  if($('#open_ghost_buy').checked){
    setClass([{e:$('.buySpace_ghostBuy'),c:'active'}]);
    
  }else{
    removeClass([{e:$('.buySpace_ghostBuy'),c:'active'}]);
  }
}

//paint type of chart
$('#typeChart').onclick=()=>{

  if(typeChart == 2) typeChart=0;

  if(typeChart == 1){
    paintChart(typeChart,dataChart.data,chartStyle-1,user_saved_data);//keep chartStyle
    set_style_chart(typeChart,chartStyle-1);

  } 
  if(typeChart == 0){
    paintChart(typeChart,dataChart.data,1,user_saved_data);
    set_style_chart(typeChart,1);

  }

  typeChart++;
}
//paint chart style
$('#chartStyle').onclick=()=>{
  if(chartStyle == 5) chartStyle=1;
  
  paintChart(1,dataChart.data,chartStyle,user_saved_data);
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
    paintChart(typeChart,data,chartStyle,user_saved_data);

    //to pass to the next style when I made click on the buttons
    typeChart++;
    chartStyle++;
  }else{
    //start with the default style
    paintChart(1,data,1,user_saved_data);
  }
  removeClass([{e:$('.chartContent'),c:'load'}]);
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
    // show arrow in mobile desing
    if(width <= 735){
      arrow_to_slides_clickEvent();
    }
    movilDesing();

});
mainEvent('load',()=>{
  movilDesing();
});

movilDesing=()=>{
    var width = window.innerWidth; // píxeles
    var height = window.innerHeight; // píxeles


    if(width <= 735){
      movil_Desing=true;
    }else{
      // remove arrow and style of .myCriptos
      arrow_to_slides_clickEvent();
      movil_Desing= false;
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
arrow_to_slides_clickEvent=(index=0)=>{
  CriptoSection  = $('.CriptoSection');
  myCriptos = $('.myCriptos','all');
  criptoRanking = $('.criptoRanking','all');

  // to disable this function
  if(!movil_Desing || CriptoSection.classList.contains('listing')){
    // delete last style when resize event is running
    myCriptos.forEach(element =>{element.removeAttribute('style');});
    return;
  }
  arrow_right=$('.arrow_to_slides2');
  arrow_left=$('.arrow_to_slides1');

  let long=index;

  function setfocus(longg){
    // remove previus class
    myCriptos.forEach((element, index) =>{
      
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
      element.removeAttribute('style');

    });

    if(myCriptos[longg]){
      setClass([{e:myCriptos[longg],c:'focus'}]);
    }
    //long++;
    
    if(myCriptos[longg-1]){
      setClass([{e:myCriptos[longg-1],c:'left'}]);
      myCriptos[longg-1].setAttribute('style',`left: 0%; transition: 0.5s;`);
      
    }else{
      if(myCriptos.length != 1){ // when is it just onw crypto saved
        setClass([{e:myCriptos[myCriptos.length-1],c:'left'}]);
        myCriptos[myCriptos.length-1].setAttribute('style',`left: 0%; transition: 0.5s;`);
      }
      
    }
  
    if(myCriptos[longg]){
      setClass([{e:myCriptos[longg],c:'focus'}]);
      setClass([{e:criptoRanking[longg],c:'selected'}]);
      myCriptos[longg].setAttribute('style',`left: 50%; transition: 0.5s;`);
    }
  
    if(myCriptos[longg+1]){
      setClass([{e:myCriptos[longg+1],c:'right'}]);
      myCriptos[longg+1].setAttribute('style',`left: 100%; transition: 0.5s;`);
  
    }else{
      if(myCriptos.length != 1){ // when is it just onw crypto saved
        setClass([{e:myCriptos[0],c:'left'}]);
        myCriptos[0].setAttribute('style',`left: 100%; transition: 0.5s;`);
      }
    }
  
  }

  // start when load 
  setfocus(long);
  // again to be sure it will load
  setfocus(long);
 
  function transition(direction){
    // to disable this function
    if(!movil_Desing){
      return;
    }
    // how much it will move
    if(direction == "right"){
      long++;
      if(long == myCriptos.length){
        long = 0;
      }
    }else{
      long--;
      if(long == -1){
        long = myCriptos.length-1;
      }
      if(long == -2 ){
        long = myCriptos.length-2;
      }
    }

    //load style every time
    setfocus(long);

    // last to beging again and not end
    if(long == myCriptos.length-1 && direction == "right"){
      long =-1;
    }

  }
  // right event of the arrow
  arrow_right.onclick=()=>{
    
    transition("right");
  }
  // left event of the arrow
  arrow_left.onclick=()=>{
    transition("left");
  }
}

// open config place
$('.config_btn').onclick=()=>{
  setClass([{e:$('.setups'),c:'active'}]);

  let valid=false;
  // paint my criptos to delete option
  $('.my_criptos_setup').innerHTML='';
  for (let index = 0; index < user.coins.length; index++) {

    // checkout if have invest
    for (let j = 0; j < user.criptos.length; j++) {
      const idCripto = user.criptos[j].idCripto;
      if (user.coins[index].symbol === idCripto) {
        valid=true;
        break;
      }else{
          valid =false;
      }
      }

      // to avoid delete it because have invest
      if(valid){
        $('.my_criptos_setup').innerHTML+=`<div class="my_criptos_content">
                                        <span>
                                          <img src="${user.coins[index].large}" alt="">
                                          <span class="my_criptos_symbol">${user.coins[index].symbol}</span>
                                        </span>
                                        <span class="my_criptos_content_img not_valid" id="_${index}">remove</span>
                                      </div>`;
      }else{
        $('.my_criptos_setup').innerHTML+=`<div class="my_criptos_content">
                                        <span>
                                          <img src="${user.coins[index].large}" alt="">
                                          <span class="my_criptos_symbol">${user.coins[index].symbol}</span>
                                        </span>
                                        <span class="my_criptos_content_img" id="_${index}">remove</span>
                                      </div>`;
      }
                                      
  
  }
    
  my_criptos_setup_event();
}
// close config place
$('.close_setups').onclick=()=>{
  removeClass([{e:$('.setups'),c:'active'}]);
}

$('#btn_Sing_Out').onclick=()=>{
  // this one is to load the user`s data
  firtsLoad=0;
  closeSession();

  //clear all data from session
  reloadPage()
}


// disable or enable list style to .myCriptos
$('.grid_list').onclick=()=>{
  myCriptos = $('.myCriptos','all');

  // remove effect of cripto selected from arrow_to_slides_clickEvent
  myCriptos.forEach(cripto => {
    removeClass([{e:cripto,c:'focus'}]);
    removeClass([{e:cripto,c:'left'}]);
    removeClass([{e:cripto,c:'right'}]);

    // detele all last style from arrow_to_slides_clickEvent
    cripto.removeAttribute('style');
  });
  // set effect of cripto selected only when list style is actived
  setClass([{e:myCriptos[BTCjson.coinSelected.index],c:'focus'}]);

  // disable or enable 
  if($('.CriptoSection').classList.contains('listing')){
    removeClass([{e:$('.CriptoSection'),c:'listing'}]);
    movil_Desing_list =false;
  }else{
    setClass([{e:$('.CriptoSection'),c:'listing'}]);
    movil_Desing_list =true;
  }
}

// open pages on historyContent
$('.menu_large').onclick=(event)=>{
  //add event using propagation of events (bubbling)

  let idPage=event.target.id;
  if (event.target.classList.contains('menu_large_btn')) {
    $('.menu_large_btn','all').forEach(element => {
        // to change state of checkbox to hide or show the pages
        if(idPage != element.id){
          element.checked = false;
        }else{ // to avoid close all pages and make sure always it shows one
          element.checked = true;
        }
    });
  }
  
}
function validateScreenSize(height, width) {
  const screenHeight = window.innerHeight;
  const screenWidth = window.innerWidth;

  if (screenHeight > height && screenWidth > width) {
    return true;
  }
  return false;
}
// the content that will has active ontouchstart event
touch_slide('.main ',validateScreenSize(0,0),c =>{
 
  let menuValidate= [// validate if element touched was one of this
    '.criptoContent',
    '.spin-wrapper',
    '.chartSection',
    '.rankingContent',
    '.section1',
    '.CriptoSection',
    '.arrow_to_slides2',
    '.mainSection',
    '.graphic_chart',
    '.loadinCripto'
  ];

  // open menu with slide "fingers"
  c.menu_Slide(menuValidate, { 
    slideRight: {
      onStartOne:(value)=>{
        if(!$('.menu').classList.contains('hidde')){
          $('.menu-bars').click();
        }
      },
      onEnd:(value)=>{
        if(value.velocity.fast){
          if(!$('.menu').classList.contains('hidde')){
            $('.menu-bars').click();
          }
        }
      }
    },
    slideLeft: {
      // this it is execcute when reached the maxLeng in this case maxLength.left, only one time
      onStartOne:(value)=>{
        if($('.menu').classList.contains('hidde')){
          $('.menu-bars').click();
        }
      },
      onEnd:(value)=>{
        if(value.velocity.fast){
          if($('.menu').classList.contains('hidde')){
            $('.menu-bars').click();
          }
        }
      }
    }
  });

  let menuConfig ={
    maxLength:{
        up:80,
        down:80,
        left:$('.statusSection').clientWidth/1.5,
        right:$('.historySection').clientWidth/1.5
    },
    minLength:{
        up:0,
        down:0,
        left:20,
        right:20
    },
    fastVelocity:8.5
  }
  menuValidate=[
    '.statusContent',
    '.statusSection'
  ]
  //open menu of statusSection with slide "fingers" change of windows
  c.menu_Slide(menuValidate, { 
    slideLeft: {
      onStart:(value)=>{ // every move
        $('.statusSection').setAttribute('style','left:calc(0% - '+value.position+'px);');
        $('.historySection').setAttribute('style','left:calc(100% - '+value.position+'px);');
        
      },onEnd:(value)=>{ // end of the event "up the finger"
        // open the next slide if the move is faster
        if(value.velocity.fast){
          $('.section2_option_window').click();
          $('.statusSection').removeAttribute('style')
          $('.historySection').removeAttribute('style')
          return
        }

        if(value.reached){ // reached the configured maxLenght
          $('.section2_option_window').click();

          $('.statusSection').removeAttribute('style')
          $('.historySection').removeAttribute('style')
          return
        }
        //restrar position
        $('.statusSection').setAttribute('style','left:0%')
        $('.historySection').setAttribute('style','left:100%;');
      }
    }
  },menuConfig);

  // move between page of .historySection
  let menu_large_btn_lenght = $('.menu_large_btn','all').length;
  var index=Array.from($('.menu_large_btn','all')).findIndex(function(element, i){
    return element.checked == true;
  });

  // effect of opacity to show and hidde the pages 
  function adjustOpacity(element, values, fatherWidth) {
    let value = (values/fatherWidth)*100
    // Adjust the value to be between 0 and 1
    const opacityValue = value >= 0 ? Math.min(value / 100, 1) : Math.max((100 + value) / 100, 0);
    
    // set opacity
    element.setAttribute('style','display:flex; opacity:'+opacityValue.toString()+' !important')
  }
  menuValidate=[
    '.Content_ghost',
    '.Content_chart',
    '.Content_history'
  ]
  let pages= $('.page_ct','all');
  c.menu_Slide(menuValidate, { 
    slideLeft: {
      onStart:(value)=>{ // every move
        if(index < menu_large_btn_lenght-1){
          // effect of opacity to show and hidde the pages 
          adjustOpacity(pages[index], -value.position, menuConfig.maxLength.left)
          adjustOpacity(pages[index+1], value.position, menuConfig.maxLength.left)
        }
        
      },onEnd:(value)=>{ // end of the event "up the finger"
        // remove effect of opacity
        pages.forEach(element => {
          element.removeAttribute('style')
        });

        if(value.velocity.fast){
          if(index < menu_large_btn_lenght-1){
            $('.menu_large_btn','all')[index+1].checked = true;
            $('.menu_large_btn','all')[index].checked = false;
            return
          }
          $('.menu-bars').click();
          return
        }
        if(value.reached){
          if(index < menu_large_btn_lenght-1){
            $('.menu_large_btn','all')[index+1].checked = true;
            $('.menu_large_btn','all')[index].checked = false;
           
            return
          }
          $('.menu-bars').click();
        }
      }
    },
    slideRight: {
      onStart:(value)=>{ // every move
        // to validate the first element to change to .statusSection
       if(index == 0){
        $('.statusSection').setAttribute('style','left:calc(-100% + '+(-value.position)+'px);');
        $('.historySection').setAttribute('style','left:calc(0% - '+value.position+'px);');
        return
       }
       if(index <= menu_large_btn_lenght-1){
        // effect of opacity to show and hidde the pages 
        adjustOpacity(pages[index], value.position, menuConfig.maxLength.left)
        adjustOpacity(pages[index-1], -value.position, menuConfig.maxLength.left)
      }
      },onEnd:(value, method)=>{ // end of the event "up the finger"
        // remove effect of opacity
        pages.forEach(element => {
          element.removeAttribute('style')
        });

        if(value.velocity.fast && index <= menu_large_btn_lenght-1){
          if(index != 0 ){
            $('.menu_large_btn','all')[index-1].checked = true;
            $('.menu_large_btn','all')[index].checked = false;
            
           }else{
            //open the .statusSection
            $('.section2_option_window').click();
            $('.statusSection').removeAttribute('style')
            $('.historySection').removeAttribute('style')
           }
          return
        }
        if(value.reached){ // reached the configured maxLenght
          if(index <= menu_large_btn_lenght-1){
            if(index != 0 ){
             $('.menu_large_btn','all')[index-1].checked = true;
             $('.menu_large_btn','all')[index].checked = false;
             
            }else{
             //open the .statusSection
             $('.section2_option_window').click();
             $('.statusSection').removeAttribute('style')
             $('.historySection').removeAttribute('style')
            }
            return
           }

          $('.statusSection').removeAttribute('style')
          $('.historySection').removeAttribute('style')
          return
        }
        $('.statusSection').setAttribute('style','left:-100%')
        $('.historySection').setAttribute('style','left:0%;');
      }
    }
  },menuConfig);

  //events to .myCripto
  // move slide "fingers"
  c.menu_Slide('.myCriptos', { 
    slideRight: {
      onEnd:(value)=>{
        if(value.velocity.fast){
          
          $('.arrow_to_slides1').click();
        }
      }
    },
    slideLeft: {
      onEnd:(value)=>{
        if(value.velocity.fast){
          if($('.CriptoSection').classList.contains('listing')){
            $('.menu-bars').click();
            return
          }
          $('.arrow_to_slides2').click();

        }
      }
    }
  });

});

loadCircularProgressBar($('.Content_chart'),75);

$('.changeGoal_btn').onclick=()=>{
  function random(rangoInicial, rangoFinal) {
    return Math.floor(Math.random() * (rangoFinal - rangoInicial + 1) + rangoInicial); // Generamos un número aleatorio entre rangoInicial y rangoFinal
   
  }
  loadCircularProgressBar($('.Content_chart'),random(-100,100));
  console.log(random(-100,100));
}