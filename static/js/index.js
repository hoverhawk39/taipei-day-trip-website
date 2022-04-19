let page;
let output;
let src="/api/attractions?page=0";
fetch(src).then(function(response){
    return response.json();
}).then(function(result){
    // console.log("index 打印資料", result);
    output=result;
    let num=output.data.length;
    let img_urls=[];
    for(let i=0;i<num;i++){
        let img_url=output.data[i].images[0];
        img_urls.push(img_url);
    }
    let names=[];
    let mrts=[];
    let categories=[];
    let ids=[];
    for(let i=0;i<num;i++){
        let name=output.data[i].name;
        names.push(name);
        let mrt=output.data[i].mrt;
        mrts.push(mrt);
        let category=output.data[i].category;
        categories.push(category);
        let id=output.data[i].id;
        ids.push(id);
    }

    for(let i=1;i<=num;i++){
        let spot_link=document.createElement("a");
        spot_link.setAttribute("href","/attraction/"+ids[i-1].toString());
        let new_box=document.createElement("div");
        new_box.setAttribute("class","box");
        let inbox1=document.createElement("div");
        inbox1.setAttribute("class","img-box");
        let image=document.createElement("img");
        image.setAttribute("src",img_urls[i-1]);
        let inbox2=document.createElement("div");
        inbox2.setAttribute("class","s-title");
        inbox2.textContent=names[i-1];
        let inbox3=document.createElement("div");
        inbox3.setAttribute("id","info");
        let inbox4=document.createElement("div");
        inbox4.setAttribute("class","s-info1");
        inbox4.textContent=mrts[i-1];
        let inbox5=document.createElement("div");
        inbox5.setAttribute("class","s-info2");
        inbox5.textContent=categories[i-1];
        let main=document.getElementById("main");
        main.appendChild(new_box);
        new_box.appendChild(inbox1);
        inbox1.appendChild(spot_link);
        spot_link.appendChild(image);
        new_box.appendChild(inbox2);
        spot_link.appendChild(inbox2);
        new_box.appendChild(inbox3);
        spot_link.appendChild(inbox3);
        inbox3.appendChild(inbox4);
        inbox3.appendChild(inbox5);
    }

    page=output.nextPage;

    let options={
        root: null,
        rootMargins: "0px",
        threshold: 0,
    }
    
    let callback = (entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                let api="/api/attractions?page=";
                let link=api+page.toString();
                fetch(link).then(function(response){
                    return response.json();
                }).then(function(result){
                    // console.log("index 打印新資料", result);
                    output=result;
                    let num=output.data.length;
                    let img_urls=[];
                    for(let i=0;i<num;i++){
                        let img_url=output.data[i].images[0];
                        img_urls.push(img_url);
                    }
                    let names=[];
                    let mrts=[];
                    let categories=[];
                    let ids=[];
                    for(let i=0;i<num;i++){
                        let name=output.data[i].name;
                        names.push(name);
                        let mrt=output.data[i].mrt;
                        mrts.push(mrt);
                        let category=output.data[i].category;
                        categories.push(category);
                        let id=output.data[i].id;
                        ids.push(id);
                    }

                    for(let i=1;i<=num;i++){
                        let spot_link=document.createElement("a");
                        spot_link.setAttribute("href","/attraction/"+ids[i-1].toString());
                        let new_box=document.createElement("div");
                        new_box.setAttribute("class","box");
                        let inbox1=document.createElement("div");
                        inbox1.setAttribute("class","img-box");
                        let image=document.createElement("img");
                        image.setAttribute("src",img_urls[i-1]);
                        let inbox2=document.createElement("div");
                        inbox2.setAttribute("class","s-title");
                        inbox2.textContent=names[i-1];
                        let inbox3=document.createElement("div");
                        inbox3.setAttribute("id","info");
                        let inbox4=document.createElement("div");
                        inbox4.setAttribute("class","s-info1");
                        inbox4.textContent=mrts[i-1];
                        let inbox5=document.createElement("div");
                        inbox5.setAttribute("class","s-info2");
                        inbox5.textContent=categories[i-1];
                        let main=document.getElementById("main");
                        main.appendChild(new_box);
                        new_box.appendChild(inbox1);
                        inbox1.appendChild(spot_link);
                        spot_link.appendChild(image);
                        new_box.appendChild(inbox2);
                        spot_link.appendChild(inbox2);
                        new_box.appendChild(inbox3);
                        spot_link.appendChild(inbox3);
                        inbox3.appendChild(inbox4);
                        inbox3.appendChild(inbox5);
                    }
                    page=output.nextPage;
                });
            }
        });
    };
    let observer = new IntersectionObserver(callback, options);
    let target = document.querySelector("#target");
    observer.observe(target);
});

function search(){
    let keyword=document.getElementById("sbox").value;
    let api="/api/attractions?page=0&keyword=";
    let link=api+keyword;
    fetch(link).then(function(response){
        return response.json();
    }).then(function(result){
        if(result.data.length==0){
            let main=document.getElementById("main");
            main.innerHTML="沒有任何結果";
            page=null;
        }
        else{
            let main=document.getElementById("main");
            main.innerHTML="";
            output=result;
            // console.log("search 打印資料", output);
            let num=output.data.length;
            let img_urls=[];
            for(let i=0;i<num;i++){
                let img_url=output.data[i].images[0];
                img_urls.push(img_url);
            }
            let names=[];
            let mrts=[];
            let categories=[];
            let ids=[];
            for(let i=0;i<num;i++){
                let name=output.data[i].name;
                names.push(name);
                let mrt=output.data[i].mrt;
                mrts.push(mrt);
                let category=output.data[i].category;
                categories.push(category);
                let id=output.data[i].id;
                ids.push(id);
            }

            for(let i=1;i<=num;i++){
                let spot_link=document.createElement("a");
                spot_link.setAttribute("href","/attraction/"+ids[i-1].toString());
                let new_box=document.createElement("div");
                new_box.setAttribute("class","box");
                let inbox1=document.createElement("div");
                inbox1.setAttribute("class","img-box");
                let image=document.createElement("img");
                image.setAttribute("src",img_urls[i-1]);
                let inbox2=document.createElement("div");
                inbox2.setAttribute("class","s-title");
                inbox2.textContent=names[i-1];
                let inbox3=document.createElement("div");
                inbox3.setAttribute("id","info");
                let inbox4=document.createElement("div");
                inbox4.setAttribute("class","s-info1");
                inbox4.textContent=mrts[i-1];
                let inbox5=document.createElement("div");
                inbox5.setAttribute("class","s-info2");
                inbox5.textContent=categories[i-1];
                let main=document.getElementById("main");
                main.appendChild(new_box);
                new_box.appendChild(inbox1);
                inbox1.appendChild(spot_link);
                spot_link.appendChild(image);
                new_box.appendChild(inbox2);
                spot_link.appendChild(inbox2);
                new_box.appendChild(inbox3);
                spot_link.appendChild(inbox3);
                inbox3.appendChild(inbox4);
                inbox3.appendChild(inbox5);
            }

            let p=output.nextPage;
            page=null;

            let options={
                root: null,
                rootMargins: "0px",
                threshold: 0,
            }
            
            let callback = (entries, observer) => {
                entries.forEach(entry => {
                    if(entry.isIntersecting){
                        let link="/api/attractions?page="+p.toString()+"&keyword="+keyword;
                        fetch(link).then(function(response){
                            return response.json();
                        }).then(function(result){
                            // console.log("search 打印新資料", result);
                            output=result;
                            let num=output.data.length;
                            let img_urls=[];
                            for(let i=0;i<num;i++){
                                let img_url=output.data[i].images[0];
                                img_urls.push(img_url);
                            }
                            let names=[];
                            let mrts=[];
                            let categories=[];
                            let ids=[];
                            for(let i=0;i<num;i++){
                                let name=output.data[i].name;
                                names.push(name);
                                let mrt=output.data[i].mrt;
                                mrts.push(mrt);
                                let category=output.data[i].category;
                                categories.push(category);
                                let id=output.data[i].id;
                                ids.push(id);
                            }
        
                            for(let i=1;i<=num;i++){
                                let spot_link=document.createElement("a");
                                spot_link.setAttribute("href","/attraction/"+ids[i-1].toString());
                                let new_box=document.createElement("div");
                                new_box.setAttribute("class","box");
                                let inbox1=document.createElement("div");
                                inbox1.setAttribute("class","img-box");
                                let image=document.createElement("img");
                                image.setAttribute("src",img_urls[i-1]);
                                let inbox2=document.createElement("div");
                                inbox2.setAttribute("class","s-title");
                                inbox2.textContent=names[i-1];
                                let inbox3=document.createElement("div");
                                inbox3.setAttribute("id","info");
                                let inbox4=document.createElement("div");
                                inbox4.setAttribute("class","s-info1");
                                inbox4.textContent=mrts[i-1];
                                let inbox5=document.createElement("div");
                                inbox5.setAttribute("class","s-info2");
                                inbox5.textContent=categories[i-1];
                                let main=document.getElementById("main");
                                main.appendChild(new_box);
                                new_box.appendChild(inbox1);
                                inbox1.appendChild(spot_link);
                                spot_link.appendChild(image);
                                new_box.appendChild(inbox2);
                                spot_link.appendChild(inbox2);
                                new_box.appendChild(inbox3);
                                spot_link.appendChild(inbox3);
                                inbox3.appendChild(inbox4);
                                inbox3.appendChild(inbox5);
                            }
                            p=output.nextPage;
                        });
                    }
                });
            };
            let observer = new IntersectionObserver(callback, options);
            let target = document.querySelector("#target");
            observer.observe(target);
        }
    });
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