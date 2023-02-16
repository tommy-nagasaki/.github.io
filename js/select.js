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
    const output = document.getElementById("output");

    // 自動的に出力するtextareaを生成しtextareaにIDをふる
    output.innerHTML = "";
    splitText.forEach((text, index) => {
        const div = document.createElement("div");
        const textareaId = `textarea${index}`;
        const textarea = document.createElement("textarea");
        textarea.id = textareaId;
        textarea.type = "text";
        textarea.value = text;
        div.appendChild(textarea);

        // コピーするボタンを作成
        const copyButton = document.createElement("button");
        copyButton.textContent = "コピー";
        copyButton.addEventListener("click", function () {
            textarea.select();
            document.execCommand("copy");
        });
        div.appendChild(copyButton);

        // 翻訳するボタンを作成
        const translateButton = document.createElement("button");
        translateButton.textContent = "翻訳";
        translateButton.addEventListener("click", function () {
            const targetTextarea = document.getElementById(textareaId);
            // 翻訳APIに渡す処理をここに記述
            console.log(targetTextarea.value); // 例としてコンソールログにテキストを出力
        });
        div.appendChild(translateButton);

        output.appendChild(div);
    });
}

textInput.addEventListener("input", splitText);

// 入力エリアをクリア
function clearInput() {
    document.getElementById("text-input").value = "";
}

