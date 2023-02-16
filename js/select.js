// ドロップを許可
function allowDrop(event) {
    event.preventDefault();
}
// ドロップか入力された時
function dropTextOrFile(event) {
    event.preventDefault();
    // ID"text-input"を取得
    const textInput = document.getElementById("text-input");
    // ファイルオブジェクト取得
    const data = event.dataTransfer.items[0].getAsFile();
    // もしテキストファイルなら
    if (data.type === "text/plain") {
        const reader = new FileReader();
        reader.readAsText(data);
        reader.onload = function () {
            textInput.value = reader.result;
        };
    // 違ったら
    } else {
        textInput.value = `ファイル名: ${data.name}\nタイプ: ${data.type}\nサイズ: ${data.size} bytes`;
    }
}

// テキスト分割
function splitText() {
    const textInput = document.getElementById("text-input").value;
    const maxLen = 5000;
    const regexp = new RegExp(`.{1,${maxLen}}[。．！？.]`, 'g');
    const splitText = textInput.replace(/\n/g, ";").match(regexp);
    // split後のtextにあるセミコロンを改行にもどす変数の宣言
    // const preoutput = textbox.replace(/\;/g, "\n").match(splitText);
    const output = document.getElementById("output");

    output.innerHTML = "";
    splitText.forEach((text) => {
        const textbox = document.createElement("textarea");
        textbox.type = "text";
        textbox.value = text.replace(/\;/g, "\n"); 
        output.appendChild(textbox);

        // コピーするボタンを作成
        const button = document.createElement("button");
        button.textContent = "コピー";
        button.addEventListener("click", function () {
            textbox.select();
            document.execCommand("copy");
        });
        output.appendChild(button);
    });
}

textInput.addEventListener("input", splitText);

// 入力エリアをクリア
function clearInput() {
    document.getElementById("text-input").value = "";
}
