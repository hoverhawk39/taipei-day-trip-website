let cardNumber=document.getElementById('card_number');
let expirationDate=document.getElementById('card_expiration_date');
let cvv=document.getElementById('card_cvv');
let confirmBtn=document.getElementById('confirm_btn');
let contactName=document.getElementById('c-name');
let contactEmail=document.getElementById('c-email');
let contactPhone=document.getElementById('c-phone');

// TPDirect.setupSDK(11327,'app_whdEWBH8e8Lzy4N6BysVRRMILYORF6UxXbiOFsICkz0J9j1C0JUlCHv1tVJC','sandbox');
TPDirect.setupSDK(124023,'app_1pW5xgzme1t9WtmP9nzDdCG8PrrGKSf1MKQQerJHf5CQ7Fx1TcmTXGtwmiMx','sandbox');
let fields={
    number:{
        element: cardNumber,
        placeholder: '**** **** **** ****',
    },
    expirationDate:{
        element: expirationDate,
        placeholder: 'MM / YY',
    },
    ccv:{
        element: cvv,
        placeholder: 'CVV',
    }
}

TPDirect.card.setup({
    fields: fields,
    styles:{
        'input':{
        'font-size':'16px',
        },
        '.valid':{
        'color':'green'
        },
        '.invalid':{
        'color':'red'
        },
    }
});

TPDirect.card.onUpdate((update)=>{
    if(update.canGetPrime){
        confirmBtn.removeAttribute('disabled');
    }
    else{
        confirmBtn.setAttribute('disabled',true);
    }
})

function bookingStatus(){
    fetch("/api/user", {method:"GET"})
    .then(function(response){
        return response.json();
    }).then(function(result){
        // console.log("打印 member 資料", result);
        if(result.data==null){
            window.location.href='/';
        }
        else{
            let status=document.getElementById("m-status");
            status.innerHTML="登出系統";
            status.removeAttribute("onclick");
            status.setAttribute("onclick","userLogOut();");
            let user=document.getElementById("user");
            user.innerHTML=result.data.name;
            bookingGet();
        }
    });
}

function bookingPlan(){
    fetch("/api/user", {method:"GET"})
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

let bookingInfo;
function bookingGet(){
    fetch("/api/booking", {method:"GET"})
    .then(function(response){
        return response.json();
    }).then(function(result){
        // console.log("打印 booking 資料", result);
        if(result.data!=null){
            info=result.data;
            let empty=document.getElementById("empty");
            empty.style.display="none";
            let content=document.getElementById("content");
            content.style.display="block";
            let img=document.createElement("img");
            img.setAttribute("src",info.attraction.image);
            let main=document.getElementById("main-img");
            main.appendChild(img);
            let name=document.getElementById("name");
            name.innerHTML=info.attraction.name;
            let date=document.getElementById("date");
            date.innerHTML=info.date;
            let time=document.getElementById("time");
            time.innerHTML=info.time;
            let price=document.getElementById("price");
            price.innerHTML=info.price;
            let address=document.getElementById("address");
            address.innerHTML=info.attraction.address;
            let total=document.getElementById("total");
            total.innerHTML=info.price;
            let end=document.getElementById("end");
            end.style.height="104px";
            end.style.paddingTop="0px";
            end.style.alignItems="center";
            bookingInfo=info;
        }
    });
}

function bookingPost(){
    fetch("/api/user", {method:"GET"})
    .then(function(response){
        return response.json();
    }).then(function(result){
        // console.log("打印 member 資料", result);
        if(result.data==null){
            memberClick();
        }
        else{
            let now_path=location.pathname;
            let b_id=now_path.split("/attraction/")[1];
            let b_date=document.getElementById("date").value;
            let b_time=document.querySelector('input[name="time"]:checked').value;
            let b_price=document.getElementById("money").innerHTML;
            let b_info={
                attractionId: b_id,
                date: b_date,
                time: b_time,
                price: b_price,
            };
            // console.log(b_info);
            let options={
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(b_info),
            };
            fetch("/api/booking", options)
            .then(function(response){
                return response.json();
            }).then(function(result){
                // console.log("打印 booking 資料", result);
                if(result.ok){
                window.location.href="/booking";
                }
                else{
                    let calendar=document.querySelector('input[type="date"]');
                    calendar.style.border="1px solid red";
                }
            });
        }
    });
}

function bookingDelete(){
    fetch("/api/booking", {method:"DELETE"})
    .then(function(response){
        return response.json();
    }).then(function(result){
        // console.log("打印 booking 資料", result);
        if(result.ok){
        let empty=document.getElementById("empty");
        empty.style.display="block";
        let content=document.getElementById("content");
        content.style.display="none";
        let end=document.getElementById("end");
        end.style.height="100vh";
        end.style.paddingTop="45px";
        end.style.alignItems="unset";
        window.location.reload();
        }
    });
}

function confirmPayment(){
    const tappayStatus=TPDirect.card.getTappayFieldsStatus();
    if(tappayStatus.canGetPrime===true){
        let ans=ValidateEmail(contactEmail.value);
        if((contactName!="")&&(ans==true)&&(contactPhone!="")){
            TPDirect.card.getPrime((result)=>{
                let paymentInfo={
                    prime: result.card.prime,
                    order:{
                        price: bookingInfo.price,
                        trip:{
                            attraction:{
                                id: bookingInfo.attraction.id,
                                name: bookingInfo.attraction.name,
                                address: bookingInfo.attraction.address,
                                image: bookingInfo.attraction.image
                            },
                            date: bookingInfo.date,
                            time: bookingInfo.time,
                        },
                        contact:{
                            name: contactName.value,
                            email: contactEmail.value,
                            phone: contactPhone.value,
                        }
                    }
                };
                console.log(paymentInfo);
                let options={
                    method: 'POST',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify(paymentInfo),
                };
                fetch("/api/order", options)
                .then(response=>response.json())
                .then(result=>{
                    if(result.data.payment.status==0){
                        window.location.href='/thankyou?number='+result.data.number;
                    }
                })
            })
        }
        else{
            contactName.style.border="1px solid red";
            contactEmail.style.border="1px solid red";
            contactPhone.style.border="1px solid red";
        }
    }
}

confirmBtn.addEventListener('click', confirmPayment);

function toHomePage(){
    window.location.href='/';
}