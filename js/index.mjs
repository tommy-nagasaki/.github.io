// 上記クラスを使用して、実際に翻訳APIを呼び出す
import { MinnaTransClass } from './minnaTransClass.js';
const minnaTrans = new MinnaTransClass('f527fee6c2deedaa792e2cd9dae8d0a1063e48856', '08573baae8b5884da8f6d64e263c7cc0', 'tommy0209');

const resource = '隣の客はよく柿食う客だ';
console.log(`原文：${resource}`);
const result = await minnaTrans.translateJa2En(resource);
console.log(result);
const result2 = await minnaTrans.translateEn2Ja(result);
console.log(result2);