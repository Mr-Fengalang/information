var CryptoJS = require("crypto-js")

var key = CryptoJS.enc.Utf8.parse("ideal@(zhenniub)");
//ECB加密
var options = {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
}

export function encryptedData(plaintText) {
    if(typeof plaintText !== 'string'){
        var text = JSON.stringify(plaintText)
    }else{
        var text = plaintText
    }
    // 加密
    var encryptedData = CryptoJS.AES.encrypt(text, key, options);

    var encryptedBase64Str = encryptedData.toString();
    // console.log('encryptedBase64Str', encryptedBase64Str);
    return encryptedBase64Str

}







export function decryptedData(decryptedData) {
// 解密
var decryptedData = CryptoJS.AES.decrypt(decryptedData, key, options);

// 解密后，需要按照Utf8的方式将明文转位字符串
var decryptedStr = decryptedData.toString(CryptoJS.enc.Utf8);
// console.log('decryptedStr', decryptedStr);
return decryptedStr

}