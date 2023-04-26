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