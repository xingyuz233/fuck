var register_name=document.getElementById("name");
var register_password=document.getElementById("pass");
var register_confirm=document.getElementById("confirm");
var alert_username1=document.getElementById("alert_username1");
var alert_username2=document.getElementById("alert_username2");
var alert_password=document.getElementById("alert_password");
var register_name_ok=false;
var register_confirm_ok=false;

function checkRegisterName() {
    console.log("lalala");
    console.log("长度："+register_name.value.length);
    if (register_name.value.length>12) {
        alert_username1.style.display = "block";
        register_name_ok=false;
    }
    else {
        alert_username1.style.display="none";
        register_name_ok=true;
    }
    alert_username2.style.display="none";

}
function checkConfirm() {
    console.log("checking confirm");
    if (!(register_password.value===register_confirm.value)){
        alert_password.style.display="block";
        register_confirm_ok=false;
    }
    else{
        alert_password.style.display="none";
        register_confirm_ok=true;
    }

}

function register_request() {
    if(!register_name_ok){
        alert("用户名长度不得超过12个字符");
        return ;
    }

    if (!register_confirm_ok){
        alert("两次密码不一致");
        return ;
    }
    console.log("confirm true");
    var username=register_name.value;
    var password=register_password.value;
    console.log("lallaa "+username+" "+password);
    $.ajax({
        type: "POST",
        url: "http://localhost:3006/api/user/register",
        data : {username:username,password:password},
        success: function(msg) {
            console.log(msg);
            window.localStorage.setItem("user", username);
            window.location.href = "";
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            switch(XMLHttpRequest.responseJSON.code){
                case "username_existed":
                    alert_username2.style.display="block";
            }
        }
    });

}
