let query_string=location.search;
let number=query_string.slice(8);
// console.log(number);

showOrderId();

function showOrderId(){
    let id=document.getElementById("order-id");
    id.innerHTML=number;
}