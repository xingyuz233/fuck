import png_0 from '../../static/image/0.png';
import png_1 from '../../static/image/1.png';
import png_2 from '../../static/image/2.png';
import png_3 from '../../static/image/3.png';
import png_4 from '../../static/image/4.png';
import png_5 from '../../static/image/5.png';
import png_6 from '../../static/image/6.png';
import png_7 from '../../static/image/7.png';
import png_8 from '../../static/image/8.png';
import png_9 from '../../static/image/9.png';
import png_damage_back from '../../static/image/damage_back.png';
import png_damage_front from '../../static/image/damage_front.png';
import png_damage_left from '../../static/image/damage_left.png';
import png_damage_right from '../../static/image/damage_right.png';
import png_gun from '../../static/image/gun.png';
import png_HP from '../../static/image/HP.png';
import png_kill from '../../static/image/kill.png';
import png_MapContainer from '../../static/image/MapContainer.png';
import png_MessageBoard from '../../static/image/MessageBoard.png';
import png_post from '../../static/image/post.png';
import png_ScoreBoard from '../../static/image/ScoreBoard.png';
import png_separator from '../../static/image/separator.png';
import png_TabBoard from '../../static/image/TabBoard.png';
import png_terrorist_win from '../../static/image/terrorist-win.png';
import png_counterterrorist_win from '../../static/image/counter-terrorist-win.png';

export class UI {
    constructor () {
        // this.life=100;
        // this.redRemain=5;
        // this.blueRemain=5;
        const WINDOW_WIDTH=window.screen.availWidth-10;
        const WINDOW_HEIGHT=window.screen.availHeight-10;
        // this.HP_0=document.getElementById("HP_0");
        // this.HP_1=document.getElementById("HP_1");
        // this.HP_2=document.getElementById("HP_2");
        // this.TabBoard=document.getElementById("TabBoard");
        // this.TabBoard.style.left=""+(WINDOW_WIDTH-800)/2+"px";
        // this.TabBoard.style.top=""+(WINDOW_HEIGHT-800)/2+"px";
        // this.closeTabBoard();
        this.Damage=document.getElementById("damage");
        this.Damage.style.left=""+(WINDOW_WIDTH-500)/2+"px";
        this.Damage.style.top=""+(WINDOW_HEIGHT-500)/2+"px";
        // this.Post=document.getElementById("post");
        // this.Post.style.left=(WINDOW_WIDTH/2+5)+"px";
        // this.Post.style.top=(WINDOW_HEIGHT-30)/2+"px";
        // this.red_0=document.getElementById("redRemain_0");
        // this.red_1=document.getElementById("redRemain_1");
        // this.blue_0=document.getElementById("blueRemain_0");
        // this.blue_1=document.getElementById("blueRemain_1");
        // this.players=new Array(10);
        // this.messageBox=document.getElementById("messageBox");
        this.messages=document.getElementById("messages");
        this.messageInput = document.getElementById("messageInput");
        // this.messageBoard = document.getElementById("messageBoard");
        this.closeMessageBoard();
        // this.killMessages=document.getElementById("killMessageBox");
        this.damage_left=document.getElementById("damage_left");
        this.damage_right=document.getElementById("damage_right");
        this.damage_front=document.getElementById("damage_front");
        this.damage_back=document.getElementById("damage_back");
        // this.time=document.getElementById("time");

        // this.win_image=document.getElementById("win-image");
        // this.win_image.style.display = "none";

//         this.gunimg = document.getElementById("gunimg");
//         this.gunimg.src = png_gun;
//         this.gunimgheight = this.gunimg.height;
//         this.gunimgwidth = this.gunimg.width;
//         console.log(this.gunimgheight);
//         console.log(this.gunimgwidth);
// //console.log(messages.children[0].innerHTML);
        this.messageCount=0;
        // this.killMessageCount=0;





        // this.table_out = document.getElementById("table_out");
        // this.table_out.setAttribute("width",WINDOW_WIDTH);
        // this.table_out.setAttribute("height",WINDOW_HEIGHT);
        // this.leftBox=document.getElementById("leftBox");
        // this.leftBox.style.width="20%";
        // this.leftBox.style.textAlign="center";
        // this.midBox=document.getElementById("scoreBoard");
        // this.midBox.style.width="60%";
        // this.midBox.style.textAlign="center";
        //
        // this.HPBoard=document.getElementById("HPBoard");
        // this.HPBoard.style.textAlign="center";
        // this.HP=document.getElementById("HP");
        // this.HP.style.textAlign="center";

        //插入图片。。。
        // document.getElementById('scoreBoardBackground').src = png_ScoreBoard;
        // document.getElementById('MapContainer').src = png_MapContainer;
        // document.getElementById('separator').src = png_separator;
        // document.getElementById('kill1').src = png_kill;
        // document.getElementById('kill2').src = png_kill;
        // document.getElementById('kill3').src = png_kill;
        // document.getElementById('hpimg').src = png_HP;
        // document.getElementById('HP_0').src = png_1;
        // document.getElementById('HP_1').src = png_0;
        // document.getElementById('HP_2').src = png_0;
        // document.getElementById('messageBoard').src = png_MessageBoard;

        document.getElementById('damage_right').src = png_damage_right;
        document.getElementById('damage_left').src = png_damage_left;
        document.getElementById('damage_front').src = png_damage_front;
        document.getElementById('damage_back').src = png_damage_back;
        // document.getElementById('postimg').src = png_post;
        // document.getElementById('tabBoardimg').src = png_TabBoard;
        //
        // document.getElementById('redRemain_0').src = png_0;
        // document.getElementById('redRemain_1').src = png_0;
        // document.getElementById('blueRemain_0').src = png_0;
        // document.getElementById('blueRemain_1').src = png_0;
        //
        // document.getElementById('minute1').src = png_0;
        // document.getElementById('minute2').src = png_0;
        // document.getElementById('second1').src = png_0;
        // document.getElementById('second2').src = png_0;









    }

    // setLife(lifepoint) {
    //     let hundred=Math.floor(lifepoint/100);
    //     let ten=Math.floor((lifepoint-hundred*100)/10);
    //     let one=lifepoint-hundred*100-ten*10;
    //     this.setNum(this.HP_0,hundred,2);
    //     this.setNum(this.HP_1,ten,2);
    //     this.setNum(this.HP_2,one,2);
    //     this.life=lifepoint;
    //
    //
    // }
    //
    // setRed_remain(red_remain){
    //     let ten=Math.floor(red_remain/10);
    //     let one=red_remain-ten*10;
    //     this.setNum(this.red_0,ten,2);
    //     this.setNum(this.red_1,one,2);
    //     this.redRemain=red_remain;
    //
    // }
    //
    // setBlue_remain(blue_remain){
    //     let ten=Math.floor(blue_remain/10);
    //     let one=blue_remain-ten*10;
    //     this.setNum(this.blue_0,ten,2);
    //     this.setNum(this.blue_1,one,2);
    //     this.blueRemain=blue_remain;
    //
    // }
    //
    // setTime(minute,second) {
    //     let ten=Math.floor(minute/10);
    //     let one=minute-ten*10;
    //     this.setNum(this.time.children[0],ten,3);
    //     this.setNum(this.time.children[1],one,3);
    //     ten=Math.floor(second/10);
    //     one=second-ten*10;
    //     this.setNum(this.time.children[3],ten,3);
    //     this.setNum(this.time.children[4],one,3);
    //
    //
    // }
    //
    // showTabBoard() {
    //     this.setTabBoardVisibility(true);
    //     //this.printPlayerInfo(terrororistList, counterrororistList);
    // }
    // closeTabBoard(){
    //     this.setTabBoardVisibility(false);
    // }
    // setTabBoardVisibility(visible) {
    //     if (visible===true){
    //         this.TabBoard.style.visibility="visible";
    //     }else{
    //         this.TabBoard.style.visibility="hidden";
    //     }
    //
    // }


    showMessageBoard() {
        this.messages.style.background = "rgba(20,20,20,0.2)";
        this.messageInput.style.visibility = "visible";
        this.messageInput.focus();
    }

    closeMessageBoard() {
        this.messages.style.background = "rgba(20,20,20,0.0)";
        this.messageInput.style.visibility = "hidden";

    }

    printPlayerInfo(terrororistList, counterrororistList) {
        console.log(terrororistList);
        console.log(counterrororistList);
        for(let i=0;i<counterrororistList.length;i++){
            let player=counterrororistList[i];
            console.log(player);
            let playerInfo=document.getElementById("player"+i);
            playerInfo.children[0].innerHTML=player.name;
            if (player.status) {
                playerInfo.children[1].innerHTML="DEAD";
            } else {
                playerInfo.children[1].innerHTML="";
            }
            playerInfo.children[2].innerHTML=player.kills;
            playerInfo.children[3].innerHTML=player.dies;
        }

        for (let i=0; i < terrororistList.length; i++) {
            let player=terrororistList[i];
            console.log(player);
            let playerInfo=document.getElementById("player"+(i+5));
            playerInfo.children[0].innerHTML=player.name;
            if (player.status) {
                playerInfo.children[1].innerHTML="DEAD";
            } else {
                playerInfo.children[1].innerHTML="";
            }
            playerInfo.children[2].innerHTML=player.kills;
            playerInfo.children[3].innerHTML=player.dies;
        }

    }

    printMessage(message) {
        for (let i=0;i<8;i++){
            this.messages.children[i].innerHTML=this.messages.children[i+1].innerHTML;
        }
        this.messages.children[8].innerHTML=message;
        if (this.messageCount<9) {
            this.messageCount++;
        }

    }

    // printDeathMessage(killer,victim) {
    //     for (let i=0;i<2;i++){
    //         this.killMessages.children[i].childNodes[1].innerHTML=this.killMessages.children[i+1].childNodes[1].innerHTML;
    //     }
    //     this.killMessages.children[2].childNodes[1].innerHTML=killer+ " kills " +victim;
    //     if (this.killMessageCount<3){
    //         this.killMessages.children[2-this.killMessageCount].style.visibility="visible";
    //         this.killMessageCount++;
    //     }
    //
    // }
    // hurt(direction) {
    //     let damage;
    //     switch (direction){
    //         case "left":
    //             damage=this.damage_left;
    //             break;
    //         case "right":
    //             damage=this.damage_right;
    //             break;
    //         case "front":
    //             damage=this.damage_front;
    //             break;
    //         case "back":
    //             damage=this.damage_back;
    //         //console.log("back");
    //     }
    //     //console.log(damage);
    //     damage.style.opacity=1;
    //     let timer=null;
    //     clearInterval(timer);
    //     let alpha=100;
    //     timer=setInterval(function()
    //     {
    //         let speed=-5;    //定义运动的速度
    //         if (alpha===0)  //若传入的的透明度等于本来的透明度就清除定时器
    //         {
    //             clearInterval(timer);
    //         }
    //         else
    //         {
    //             alpha=alpha+speed;
    //             //damage.style.filter='alpha(opacity:"+alpha+")';
    //             damage.style.opacity=alpha/100;
    //         }
    //     },30)
    //
    //
    // }
    //
    // setNum(object,num,d) {
    //     let width=this.getNumWidth(num);
    //
    //     object.setAttribute("src",this.getNumPng(num));
    //     object.setAttribute("width",Math.floor(width/d)+"");
    //     object.setAttribute("height",Math.floor(100/d+""));
    //
    //
    // }
    // getNumPng(num) {
    //     switch(num) {
    //         case 0:return png_0;
    //         case 1:return png_1;
    //         case 2:return png_2;
    //         case 3:return png_3;
    //         case 4:return png_4;
    //         case 5:return png_5;
    //         case 6:return png_6;
    //         case 7:return png_7;
    //         case 8:return png_8;
    //         case 9:return png_9;
    //         default:return png_0;
    //
    //     }
    // }
    // getNumWidth(num) {
    //     switch (num){
    //         case 0:return 52;
    //         case 1:return 34;
    //         case 4:return 61;
    //         case 2:
    //         case 5:
    //         case 6:
    //         case 7:
    //         case 8:
    //         case 9:
    //         case 3:
    //             return 51;
    //
    //     }
    //
    // }
    //
    // terroristWin() {
    //     let scope = this;
    //     scope.win_image.src = png_terrorist_win;
    //     scope.win_image.style.display = "block";
    //     setTimeout(function () {
    //         scope.win_image.style.display = "none";
    //     },2000);
    // }
    //
    // counterTerroristWin() {
    //     let scope = this;
    //     scope.win_image.src = png_counterterrorist_win;
    //     scope.win_image.style.display = "block";
    //
    //     setTimeout(function () {
    //         scope.win_image.style.display = "none";
    //     },2000);
    // }

}