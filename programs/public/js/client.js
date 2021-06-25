// const { response } = require("express");

const id = document.querySelector("#id"),//login.html의 id='id'를 가져옴
    pw = document.querySelector("#pw"),// login.html의 id='psword'를 가져옴
    loginBtn = document.querySelector("#btn"); //login.html의 button를 가져옴

loginBtn.addEventListener("click", login);//클릭을 하면 login 함수 실행

function login(){
    const req = {//id와 psword값을 저장하는 객체
        id: id.value,
        pw: pw.value,
    };
    /*fetch 
    get은 url로 부터 어떤 데이터를 가져오는 것이고 post는 url로 어떤 데이터를 보내는것
    */
    //서버로 id, pw값 보내줌(client.js -> app.js)
    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"//json으로 보내준다
        },
        body: JSON.stringify(req)
    }).then((res) => res.json())//응답값을 보내줌(비동기)then을 사용한 이유
    //res.json의 반환값은 promise임으로
    //아래 then은 위에 then과 같이 res로 반환하기 때문에 생략가능
        .then((res)=>{
            if(res.success){
                alert("ID는 :  " + res.userId);
                location.href = `/?if_logined=${res.if_logined}`;
            }
            else{
                alert(res.msg);
            }
        })
        .catch((err) => {
            console.error(new Error("로그인 중 에러"));
        });
}










