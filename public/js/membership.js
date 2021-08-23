const id = document.querySelector("#id"),
    pw = document.querySelector("#pw"),
    repw = document.querySelector("#repw"),
    names = document.querySelector("#names"),
    email = document.querySelector("#email"),
    age = document.querySelector("#age"),
    mbutton = document.querySelector("#btn");

const URL = "http://localhost:3000/users/membership";

mbutton.addEventListener("click", checkmembership);

function check_Id(id) {
    var regExp = /^[A-za-z0-9]{4,12}$/;//영문과 숫자를 섞어 4~12자리
    return regExp.test(id);
};
function check_Pw(pw) {
    var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,10}$/; //8 ~ 10자 영문, 숫자 조합
    return regExp.test(pw); // 형식에 맞는 경우 true 리턴
};
function check_Repw() {
    return pw.value == repw.value
}
function check_Name(names) {
    var regExp = /^[가-힣]{2,4}$/;//한글 2~4

    return regExp.test(names)
};
function check_Email(email) {
    var regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;//숫자영영문자@숫자영문자.영문자2~3자리
    return regExp.test(email); // 형식에 맞는 경우 true 리턴   
};
function check_Age(age) {
    var regExp = /^[0-9]{1,2}$/
    return regExp.test(age)
};

function checkmembership() {
    var check = [check_Id(id.value), check_Pw(pw.value), check_Repw(), check_Name(names.value), check_Email(email.value)];
    var alertArray = ['아이디 형식이 다릅니다.\n (영문+숫자 4~12자리)',
        '비밀번호 형식이 다릅니다.\n (영문+숫자 8~10자리)',
        '비밀번호가 같지않습니다.',
        '이름이 형식과 다릅니다.\n(한글 2~4자리)',
        '이메일 형식이 다릅니다.',
        '나이 형식이 다릅니다.'
    ];
    var boolmembership = true;

    for (var i = 0; i < check.length; i++) {
        if (check[i] == false) {
            boolmembership = false;
            break;
        }
    }
    if (boolmembership == false) {
        alert(alertArray[i]);
    }
    else {
        const req = {//id와 psword값을 저장하는 객체
            id: id.value,
            pw: pw.value,
            repw: repw.value,
            name: names.value,
            email: email.value,
            age: age.value,
        };

        //서버로 id, pw값 보내줌(membership.js -> app.js)
        fetch("/users/membership", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"//json으로 보내준다
            },
            body: JSON.stringify(req)
        }).then((res) => res.json())//응답값을 보내줌(비동기)then을 사용한 이유
            //res.json의 반환값은 promise임으로
            //아래 then은 위에 then과 같이 res로 반환하기 때문에 생략가능
            .then((res) => {
                if (res.success) {
                    alert("회원가입을 축하드립니다. 이제 공부하세요:)");
                    location.href = '/users/login';
                }
                else {
                    alert(res.msg);
                }
            })
            .catch((err) => {
                console.error(new Error("회원가입 중 에러"));
            });
    }
};