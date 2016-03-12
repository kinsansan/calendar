//ウィンドウは少し大きめに表示してください 確認環境 1920*1080 chrome ver46
document.addEventListener("DOMContentLoaded", function () {
    var request = new XMLHttpRequest();
    request.open('GET', 'http://calendar.t-lab.cs.teu.ac.jp/getjson', false);
    request.send();

    var count = 0;
    var left = document.getElementById("left");
    var right = document.getElementById("right");
    left.addEventListener('click', function () {//左ボタンが押されるとcountの値を減算
        count--;
        write();
    }, false);
    right.addEventListener('click', function () {//右ボタンが押されるとcountの値を加算
        count++;
        write();
    }, false);

    if (request.status === 200) {//取得成功したら
        var text = JSON.parse(request.responseText);
        write();
        function write() {//テーブルとスケジュール出力
            var start = new Date(2015 + " " + 9 + "," + 27);
            start.setDate(start.getDate() + 7 * count);
            var schedule_out = "";//スケジュールの出力用
            var left = 53;//1マス目の位置
            var height = 52;//1マス分の幅
            var output = start.getFullYear() + "年<table class=\"all\"><tr><th class=\"day\"></th>";
            for (var i = 0; i < 7; i++) {//曜日を数字から文字に変換
                var weekday;
                switch (start.getDay()) {
                    case 0:
                        weekday = "日";
                        break;
                    case 1:
                        weekday = "月";
                        break;
                    case 2:
                        weekday = "火";
                        break;
                    case 3:
                        weekday = "水";
                        break;
                    case 4:
                        weekday = "木";
                        break;
                    case 5:
                        weekday = "金";
                        break;
                    case 6:
                        weekday = "土";
                        break;
                }
                for (var k = 0; k < text.length; k++) {
                    var top = 163;//1マス目の高さ
                    var today = new Date(start);//カレンダーでの今の日付
                    var schedule_date = new Date(text[k].year + " " + text[k].month + "," + text[k].date);//スケジュールの日程を日付型に
                    if (schedule_date.toLocaleString() === today.toLocaleString()) {
                        var beginhour = (text[k].begin).substring(0, 2);//開始の時間
                        var beginmin = (text[k].begin).substring(3, 5);//開始の分
                        var beginsum = Number(beginhour) * 60 + Number(beginmin);//時間も分に計算し加算
                        var endhour = (text[k].end).substring(0, 2);//終了の時間
                        var endmin = (text[k].end).substring(3, 5);//終了の分
                        var endsum = Number(endhour) * 60 + Number(endmin);//終了の分に換算
                        top = 163 + 56 * Math.floor(beginsum / 60) + (beginsum % 60) / 15 * 14;//表示位置の計算 163=1マス目の位置 56=1時間でずれる幅　14=15分でずれる幅
                        height = (52 * Math.floor((endsum - beginsum) / 60)) + (Math.floor((endsum - beginsum) / 60) - 1) * 4 + ((endsum - beginsum) % 60) / 15 * 14; //52=1マスの高さ 4=枠線と空白 14=15分でずれる幅
                        schedule_out += "<div class=\"box\" style=\"top:" + top + "px; left:" + left + "px; height:" + height + "px\">" + text[k].begin + "～" + text[k].end + "<br>場所:" + text[k].place + "<br>予定:" + text[k].title + "</div>";
                    }
                }
                left += 156;//次の日に移動するので隣のセルまでの値を加算
                output += "<th class=\"day\">" + Number(start.getMonth() + 1) + "月" + start.getDate() + "日(" + weekday + ")</th>";
                start.setDate(start.getDate() + 1);//次の日に移動
            }
            for (var i = 0; i <= 24; i++) {
                output += "<tr><th class=\"time\">" + i + ":00</th>";
                for (var j = 0; j < 7; j++) {
                    output += "<td></td>";
                }
                output += "</tr>";
            }
            output += "</tr></table>";
            document.getElementById("main").innerHTML = output;//テーブル出力
            document.getElementById("main").innerHTML += schedule_out;//スケジュール出力
        }
    }
    else {
        document.write("error");
    }
});