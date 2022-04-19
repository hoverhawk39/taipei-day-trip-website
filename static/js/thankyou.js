let query_string=location.search;
let number=query_string.slice(8);
// console.log(number);

showOrderId();

function showOrderId(){
    let id=document.getElementById("order-id");
    id.innerHTML=number;
}

function toHomePage(){
    window.location.href='/';
}

function bookingPlan(){
    fetch("/api/user", {method:'GET'})
    .then(function(response){
        return response.json();
    }).then(function(result){
        // console.log("打印 member 資料", result);
        if(result.data==null){
            memberClick();
        }
        else{
            window.location.href='/booking';
        }
    });
}