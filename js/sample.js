const url = 'https://mt-auto-minhon-mlt.ucri.jgn-x.jp/api/mt/generalNT_en_ja/';  // 基底URL (https://xxx.jpまでを入力)
const key = 'f527fee6c2deedaa792e2cd9dae8d0a1063e48856';  // API key
const secret = '08573baae8b5884da8f6d64e263c7cc0';  // API secret
const name = 'tommy0209';  // ログインID

const api_name = 'mt';  // API名 (https://xxx.jp/api/mt/generalNT_ja_en/ の場合は、"mt")
const api_param = 'generalNT_ja_en';  // API値 (https://xxx.jp/api/mt/generalNT_ja_en/ の場合は、"generalNT_ja_en")

const access_token = null;

const request = require('request');

const call_api = function () {

    const params = {
        access_token: access_token,
        key: key,                   // API Key
        api_name: api_name,
        api_param: api_param,
        name: name,                 // ログインID
        type: 'json',               // レスポンスタイプ
        xxx: 'xxx'                  // 以下、APIごとのパラメータ
    };

    request.post(url + '/api/', {
        form: params,
    }, function (err, res) {
        if (err) {
            console.log("error:", err);
            return;
        }

        if (res) {
            console.log("response.body:", res.body);
            return;
        }
    });
};

request.post(url + '/oauth2/token.php', {
    form: {
        grant_type: 'client_credentials',
        client_id: key,                             // API Key
        client_secret: secret,                      // API secret
        urlAccessToken: url + '/oauth2/token.php'   // アクセストークン取得URI
    }
}, function (err, res) {

    if (err) {
        console.log("error:", err);
        return;
    }

    if (res) {
        try {
            access_token = JSON.parse(res.body).access_token;   // アクセストークン

        } catch (e) {
            console.log(e);
            return;
        }

        if (!access_token) {
            console.log("response:", res);
            return;
        }

        call_api();

    }
});


