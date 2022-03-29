function memberClick(){
    let pop_box=document.createElement("div");
    pop_box.setAttribute("id","pop");
    pop_box.innerHTML=`
    <div class="modal" id="modal">
        <div class="layer-1"></div>
        <div class="layer-2" id="layer-2">
            <div class="member-box">
                <div class="header">登入會員帳號</div>
                <img class="close-icon cursor" id="icon" src="../static/close.png" onclick="remove_pop();"></img>
            </div>
            <input type="email" class="form" id="email" placeholder="輸入電子信箱">
            <input type="password" class="form" id="password" placeholder="輸入密碼">
            <button class="enter-btn cursor" onclick="userLogIn();">登入帳戶</button>
            <div id="error-msg"></div>
            <div class="guide-words cursor" onclick="register();">還沒有帳戶？點此註冊</div>
        </div>
    </div>
    `;
    document.body.appendChild(pop_box);
}

function remove_pop(){
    let pop=document.getElementById("pop");
    pop.remove();
}

function register(){
    let modal=document.getElementById("modal");
    modal.innerHTML=`
        <div class="layer-1"></div>
        <div class="layer-2r" id="layer-2r">
            <div class="member-box">
                <div class="header">註冊會員帳號</div>
                <img class="close-icon cursor" id="icon" src="../static/close.png" onclick="remove_pop();"></img>
            </div>
            <input type="text" class="form" id="r-name" placeholder="輸入姓名">
            <input type="email" class="form" id="email" name="email" placeholder="輸入電子信箱">
            <input type="password" class="form" id="password" name="password" placeholder="輸入密碼">
            <button class="enter-btn cursor" onclick="userSignUp();">註冊新帳戶</button>
            <div id="error-msg-r"></div>
            <div class="guide-words cursor" onclick="login();">已經有帳戶了？點此登入</div>
        </div>
    `;
}

function login(){
    let modal=document.getElementById("modal");
    modal.innerHTML=`
        <div class="layer-1"></div>
        <div class="layer-2" id="layer-2">
            <div class="member-box">
                <div class="header">登入會員帳號</div>
                <img class="close-icon cursor" id="icon" src="../static/close.png" onclick="remove_pop();"></img>
            </div>
            <input type="email" class="form" id="email" placeholder="輸入電子信箱">
            <input type="password" class="form" id="password" placeholder="輸入密碼">
            <button class="enter-btn cursor" onclick="userLogIn();">登入帳戶</button>
            <div id="error-msg"></div>
            <div class="guide-words cursor" onclick="register();">還沒有帳戶？點此註冊</div>
        </div>
    `;
}