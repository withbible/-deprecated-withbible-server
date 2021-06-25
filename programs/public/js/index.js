const loginbutton = document.querySelector('#loginBtn')

const param = location.search;
var query = new URLSearchParams(param);
var if_logined = query.get('if_logined');


console.log("이건 : ", if_logined);
console.log(typeof(if_logined));

if (if_logined =='true') {
  loginbutton.value = '로그아웃'
}
else {
  loginbutton.value = '로그인'
}






// function Islogin(req){//메인 페이지에서 session값이 있는지 없는지를 확인시켜줄 함수
//     if(req.session.if_logined){
        
//     }
//     else{
//         return false;
//     }
// }

