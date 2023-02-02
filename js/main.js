// ローディング
const loading = document.querySelector( '.loading' );
 
window.addEventListener( 'load', () => {
    loadTimer();
}, false );

// タイマーの開始
function loadTimer() {
    timerId = setTimeout( executeWork , 500 );
}

// 処理の中身
function executeWork() {
    loading.classList.add( 'hide' );
}

// グローバル
// div要素を格納
var cards = [];
// 開始時間
var startTime;
// 経過秒数用 タイマーID
var timer;
// カードめくり用 タイマーID
var backTimer;
// 1枚目かどうかのフラグ   1枚目: true   2枚目: false
var flgFirst = true;
// 1枚目のカードを格納
var cardFirst;
// そろえた枚数
var countUnit = 0;
//カードの組数
var pair = 10;
//カウントダウン
var cnt = 0;

window.onload = function(){
    //タイトル画面
    var title = document.getElementById('title');
    title.textContent = "神経衰弱";

    //画像挿入
    var img = document.createElement('img');
        img.id = 'game_image_place';
        img.src = 'img/game_cards.png';
        img.setAttribute('onclick', 'koushin()');
        title.after(img);
    
    /*画面下の炎
    var fire_back = document.createElement('img');
        fire_back.id = 'fire_image_place';
        fire_back.src = 'img/bg_fire.png';
        document.body.appendChild(fire_back);
    */

    //難易度設定
    var difficult = document.getElementById('dif');
    difficult.setAttribute('type','button');
    difficult.textContent = "むずしい";
    var easy = document.getElementById('eas');
    easy.setAttribute('type','button');
    easy.textContent = "かんたん";
    var normal = document.getElementById('nor');
    normal.setAttribute('type','button');
    normal.textContent = "ふつう";
}


var gameStart = function(p,sec) {
    //トップ画像削除
    var img = document.getElementById('game_image_place');
    img.remove();
    //タイトル削除
    title.textContent = "";
    var easy = document.getElementById('eas');
    easy.remove();
    var difficult = document.getElementById('dif');
    difficult.remove();
    var normal = document.getElementById('nor');

    //吹き出しと画像の親タグ
    var sb_top = document.createElement('div');
    sb_top.className = 'sb_top';
    title.before(sb_top);

    //吹き出し
    var sb = document.createElement('div');
    sb.className = 'sb';
    sb.textContent = "わが心眼を以て全てを見通さん…";
    sb_top.appendChild(sb);

    //画像タグ追加
    var top = document.createElement('div');
    top.id = 'game_comment';
    sb_top.appendChild(top);

    var top_image = document.createElement('img');
    top_image.id = 'game_comment_image';
    top_image.src = 'img/kids_chuunibyou_boy.png';
    game_comment.appendChild(top_image);


    normal.remove();
    // 開始時刻を取得
    startTime = new Date();
    // 数字格納 一時配列
    var arr = [];
    
    for (var i = 0; i < p; i++){
        // ペアの数字を10組
        arr.push(i);
        arr.push(i);
    }
    
    // シャッフル
    shuffle(arr);
    
    var panel = document.createElement('div');
    panel.id = "panel";
    result.before(panel);
    
    // div要素作成
    for (i = 0; i < p * 2; i++){
        var div = document.createElement('div');
        var classn = Math.floor(Math.random() * 2);
        if(classn == 1){
            div.className = 'card back bn53_card';
        }else{
            div.className = 'card back bn53_card_0';
        }
        div.id = "card_" + (i + 1);
        div.index = i;
        div.number = arr[i];
        div.innerHTML = '';
        div.onclick = turn;
        panel.appendChild(div);
        cards.push(div);

        //カードをランダムに配置
        var card_position = "card_" + (i + 1);
        var el = document.getElementById(card_position);
        var top = (Math.random() * 250) + "px";
        el.style.top = top;
        var left = (Math.random() * 250) + "px";
        el.style.left = left;
        var rotate = "rotate(" + (Math.random() * 200) + "deg)";
        el.style.transform = rotate;
    }

    // タイマー開始
    startTimer();

    // タイマー開始
    function startTimer(){
        timer = setInterval(showSecond, 1000);
    }

    // 秒数表示
    function showSecond(){

        var nowTime = new Date();

        var elapsedTime = Math.floor(sec / 1000 + 1 - (nowTime - startTime) / 1000);
        var str = 'のこりじかん: ' + elapsedTime + '秒';

        var re = document.getElementById('result');
        re.textContent = str;
    }

    //ゲームーバー
    setTimeout(gameOver, sec);


    // シャッフル用関数
    function shuffle(arr) {
        var n = arr.length;
        var temp, i;

        while (n) {
            i = Math.floor(Math.random() * n--);
            temp = arr[n];
            arr[n] = arr[i];
            arr[i] = temp;
        }
        return arr;
    }

    // クリック時の処理
    function turn(e){
        
        var div = e.target;
        
        // カードのタイマー処理が動作中は return
        if (backTimer) return;

        // 裏向きのカードをクリックした場合は数字を表示する
        if (div.innerHTML == ''){
            div.className = 'card';
            div.innerHTML = div.number;
            sb.textContent = "見える…！見えるぞ！"
            top_image.src = 'img/kids_chuunibyou_boy.png';
        }else{
            // 数字が表示されているカードは return
            return;
        }
        
        // 1枚目の処理
        if (flgFirst){
            // cardFirst は2枚目の処理のときに使う
            cardFirst = div;
            // フラグ変更
            flgFirst = false;
            
        // 2枚目の処理
        }else{
            
            // 数字が1枚目と一致する場合
            if (cardFirst.number == div.number){
                countUnit++;
                sb.textContent = "クク…我の心眼を以てすれば容易いこと…"
                // 見えない状態にする
                backTimer = setTimeout(function(){
                    div.className = 'card finish';
                    cardFirst.className = 'card finish';
                    backTimer = NaN;
                    
                    if (countUnit == p){
                        gameClear();

                    }
                }, 500)

            // 一致しない場合
            }else{  
                // カードを裏側に戻す
                backTimer = setTimeout(function(){
                    sb.textContent = "ぐはっ"
                    top_image.src = 'img/medical_koutai_breakthrough_man.png';
                    div.className = 'card back bn53_card';
                    div.innerHTML = '';
                    cardFirst.className = 'card back bn53_card';
                    cardFirst.innerHTML = '';
                    cardFirst = null;
                    backTimer = NaN;
                }, 500);
            }
            
            flgFirst = true;
        }  
    }
}


//ゲームオーバー処理
var gameOver = function(){
    var img = document.createElement('img');
        img.id = 'image_place';
        img.src = 'img/gameOver.png';
        img.setAttribute('onclick', 'koushin()');
        var objBody = document.getElementsByTagName("body").item(0);
        objBody.appendChild(img);
        clearInterval(timer);
}

//ゲームクリア処理
var gameClear = function(){
    var img = document.createElement('img');
        img.id = 'image_place';
        img.src = 'img/gameClear.png';
        img.setAttribute('onclick', 'koushin()');
        var objBody = document.getElementsByTagName("body").item(0);
        objBody.appendChild(img);
        clearInterval(timer);
}

//更新
function koushin(){
  location.reload();
}
