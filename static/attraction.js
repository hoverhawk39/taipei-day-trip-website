let index=1;
let output;
let now_path=location.pathname;
// console.log(now_path);
let src="/api"+now_path;
fetch(src).then(function(response){
    return response.json();
}).then(function(result){
    console.log("打印資料", result);
    output=result;
    num=output.data.images.length
    let imgs=[];
    for(let i=0;i<num;i++){
        let img=output.data.images[i];
        imgs.push(img);
    }

    for(let j=0;j<num;j++){
        let image=document.createElement("img");
        image.setAttribute("src",imgs[j]);
        image.setAttribute("class","img")
        let main_img=document.getElementById("main-img");
        main_img.appendChild(image);
    }

    for(let k=0;k<imgs.length;k++){
        let span=document.createElement("span");
        span.setAttribute("class","dot")
        let dots=document.getElementById("dots")
        dots.appendChild(span);
    }

    let name=document.getElementById("name");
    name.innerHTML=output.data.name;
    let category=document.getElementById("category");
    category.innerHTML=output.data.category;
    let mrt=document.getElementById("mrt");
    mrt.innerHTML=output.data.mrt;

    let description=document.getElementById("description");
    description.innerHTML=output.data.description;
    let address=document.getElementById("address");
    address.innerHTML=output.data.address;
    let transport=document.getElementById("transport");
    transport.innerHTML=output.data.transport;
    showPhotos(0);
});

function showPhotos(n){
    let photoIndex=index+n;
    let imgs=document.getElementsByClassName("img");
    let dots=document.getElementsByClassName("dot");
    if(photoIndex>imgs.length){
        photoIndex=1;
        index=0;
    }
    if(photoIndex<1){
        photoIndex=imgs.length;
        index=imgs.length+1;
    }
    for(let i=0;i<imgs.length;i++){
        imgs[i].style.display="none";
        dots[i].style.background="white";
    }
    imgs[photoIndex-1].style.display="block";
    dots[photoIndex-1].style.background="black";
    index+=n;
}

function lowerPrice(){
    let money=document.getElementById("money");
    money.innerHTML="2000";
}

function higherPrice(){
    let money=document.getElementById("money");
    money.innerHTML="2500";
}