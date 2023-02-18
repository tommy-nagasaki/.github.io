// 翻訳を実行するクラス
// 詳細は公式ページのソースを参照。
// なお公式ページはrequestを使ってますが、今回はaxiosで記載
const axios = require('axios');
const oauth = require('axios-oauth-client');
const axiosFetcher = axios.default;

class MinnaTransClass {
    // これが全APIのベースとなるURL
    #BASE_URL = 'https://mt-auto-minhon-mlt.ucri.jgn-x.jp/api/mt/generalNT_en_ja/';

    #key = '';       // API Key
    #secret = '';   // API Secret
    #name = '';   // ログインID
    #token = '';    // アクセストークン
    #expire = 0;  // 有効期限(今回はほとんど使ってないです)

    constructor(key, secret, name) {
        this.#key = key;
        this.#secret = secret;
        this.#name = name;
    }

    // 英→日翻訳
    async translateEn2Ja(text) {
        if (this.#isNeedNewToken()) {
            await this.#getAuthorizationCode();
        }

        return (await this.#request('mt/generalNT_en_ja/', text));
    };

    // 日→英翻訳
    async translateJa2En(text) {
        if (this.#isNeedNewToken()) {
            await this.#getAuthorizationCode();
        }

        return (await this.#request('mt/generalNT_ja_en/', text));
    };

    // アクセストークン取得要否を判定する。  
    // 有効期限5分前を切ったら再取得する。  
    // (今回使うことはないけど)
    #isNeedNewToken() {
        return this.#token === '' || this.#expire < Date.now();
    }

    // OAuth2認可を行い、アクセストークンを取得する関数
    // urlとurlAccessTokenにはOAuth2認可の固定URLを設定する。
    // grant_typeはclient_credentials固定。  
    // client_idとclient_secretはそれぞれAPI KeyとAPI Secretを指定する。
    async #getAuthorizationCode() {
        const oauthFunc = oauth.client(axios.create(), {
            url: `${this.#BASE_URL}/oauth2/token.php`,
            grant_type: 'client_credentials',
            client_id: this.#key,
            client_secret: this.#secret,
            urlAccessToken: `${this.#BASE_URL}/oauth2/token.php`
        });

        const auth = await oauthFunc();
        this.#token = String(auth.access_token) || '';
        this.#expire = Number(auth.expires_in) + Date.now();
        return;
    }

    // 実際に翻訳APIを実行する関数
    // postするパラメータは下記コメント参照
    // また詳細はAPIの詳細仕様を参照  
    // ちなみにtype以外は必須パラメータ
    async #request(path, text) {
        const pathElements = path.split('/');
        const params = {
            access_token: this.#token,  // アクセストークン
            key: this.#key,  // API Key                  
            api_name: pathElements[0], // 固定文字列(汎用NTの場合'mt'固定)
            api_param: pathElements[1], // 英→日および日→英で固定の文字列 
            name: this.#name,  // ログインID
            text,  // 翻訳するテキスト
            type: 'json',  // レスポンス形式(xml/json, デフォルトはxml)
        };

        // URLSearchParamsにしないと、ログインID認証エラーが発生した  
        var searchParams = new URLSearchParams();
        for (let key in params) {
            searchParams.append(key, params[key]);
        }

        const res = await axiosFetcher.post(`${this.#BASE_URL}/api/`, searchParams);

        // 翻訳テキストはrespose.bodyのresultset.result.textに格納される
        return res.data.resultset.result.text;
    }
};

module.exports = {
    MinnaTransClass: MinnaTransClass,
};
