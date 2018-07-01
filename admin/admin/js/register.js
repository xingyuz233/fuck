var register_name=document.getElementById("name");
var alert_message=document.getElementById("alert");
var register_name_ok=false;

function checkRegisterName() {
    console.log("lalala");
    console.log("长度："+register_name.value.length);
    if (register_name.value.length>12) {
        alert_message.style.display = "block";
        register_name_ok=false;
    }
    else {
        alert_message.style.display="none";
        register_name_ok=true;
    }

}

function register_request() {
    if(!register_name_ok){
        alert("用户名长度不得超过12个字符");
        return ;
    }

    var username=document.getElementById("name").value;
    var password=document.getElementById("pass").value;
    var confirm=document.getElementById("confirm").value;
    if (!(password===confirm)){
        console.log("confirm false");
        return;
    }
    console.log("confirm true");
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

            alert(XMLHttpRequest.responseJSON.code);
        }
    });

}
