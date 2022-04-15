function ValidateEmail(input){
    let format = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(input.match(format)){
        return true;
    }
    else{
        return false;
    }
}

function userStatus(){
    fetch("/api/user", {method:'GET'})
    .then(function(response){
        return response.json();
    }).then(function(result){
        // console.log("打印 member 資料", result);
        if(result.data!=null){
            let status=document.getElementById("m-status");
            status.innerHTML="登出系統";
            status.removeAttribute("onclick");
            status.setAttribute("onclick","userLogOut();");
        }
        else{
            let status=document.getElementById("m-status");
            status.innerHTML="登入/註冊";
        }
    });
}

function userLogIn(){
    let ul_email=document.getElementById("email").value;
    let ul_password=document.getElementById("password").value;
    let ans=ValidateEmail(ul_email);
    if((ans==true)&&(ul_password!="")){
        let ul_info={
            email: ul_email,
            password: ul_password,
        };
        let options={
            method: 'PATCH',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(ul_info),
        };
        fetch("/api/user", options)
        .then(function(response){
            return response.json();
        }).then(function(result){
            // console.log("打印 member 資料", result);
            if(result.message=="登入失敗，帳號或密碼錯誤或其他原因"){
                let layer=document.getElementById("layer-2");
                layer.style.height="305px";
                let msg=document.getElementById("error-msg");
                msg.style.display="block";
                msg.innerHTML="Email 或密碼錯誤";
            }
            if(result.ok==true){
                userStatus();
                window.location.reload();
            }
        });
    }
    else{
        let layer=document.getElementById("layer-2");
        layer.style.height="305px";
        let msg=document.getElementById("error-msg");
        msg.style.display="block";
        msg.innerHTML="請填妥各欄位 (email 需注意格式)";
    }
}

function userSignUp(){
    let us_name=document.getElementById("r-name").value;
    let us_email=document.getElementById("email").value;
    let us_password=document.getElementById("password").value;
    let ans=ValidateEmail(us_email);
    if((us_name!="")&&(ans==true)&&(us_password!="")){
        let us_info={
            name: us_name,
            email: us_email,
            password: us_password,
        };
        // console.log(us_info);
        let options={
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(us_info),
        };
        fetch("/api/user", options)
        .then(function(response){
            return response.json();
        }).then(function(result){
            // console.log("打印 member 資料", result);
            if(result.message=="註冊失敗，重複的 Email 或其他原因"){
                let layer=document.getElementById("layer-2r");
                layer.style.height="355px";
                let msg=document.getElementById("error-msg-r");
                msg.style.display="block";
                msg.innerHTML="Email 已經註冊帳戶";
            }
            if(result.ok==true){
                let layer=document.getElementById("layer-2r");
                layer.style.height="355px";
                let msg=document.getElementById("error-msg-r");
                msg.style.display="block";
                msg.innerHTML="註冊成功！";
            }
        });
    }
    else{
        let layer=document.getElementById("layer-2r");
        layer.style.height="355px";
        let msg=document.getElementById("error-msg-r");
        msg.style.display="block";
        msg.innerHTML="請填妥各欄位 (email 需注意格式)";
    }
}

function userLogOut(){
    fetch("/api/user", {method:'DELETE'})
    .then(function(response){
        return response.json();
    }).then(function(result){
        // console.log("打印 member 資料", result);
        userStatus();
        window.location.reload();
    });
}