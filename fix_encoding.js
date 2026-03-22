const fs = require('fs');
const path = require('path');

const replacements = {
    // Uppercase
    "Saram": "Sarıçam",
    "TAKS": "TAKSİ",
    "SS": "SİS",
    "letiim": "İletişim",
    "Boynuyoun": "Boynuyoğun",
    "Ky": "Köy",
    "Gvenilir": "Güvenilir",
    "ster": "İster",
    "Balant": "Bağlantı",
    "Destei": "Desteği",
    "ar": "Çağır",
    "Uzaklk": "Uzaklık",
    "Alanlarna": "Alanlarına",
    "Blgeleri": "Bölgeleri",
    "Hekimky": "Hekimköy",
    "Yeiltepe'de": "Yeşiltepe'de",
    "Yeiltepe": "Yeşiltepe",
    "Al": "Acil",
    "zm": "Çözüm",
    "Gvenli": "Güvenli",
    "Hzl": "Hızlı",
    "zel": "Özel",
    "Aralarmz": "Araçlarımız",
    // Lowercase
    "evresinde": "çevresinde",
    "yollar": "yolları",
    "hzl": "hızlı",
    "ofrler": "şoförler",
    "yzlm": "yüzölçümü",
    "geni": "geniş",
    "doayla": "doğayla",
    "i ie": "iç içe",
    "adyla": "adıyla",
    "ulam": "ulaşım",
    "zel": "özel",
    "dank": "dağınık",
    "yerleimi": "yerleşimi",
    "ihtiyac": "ihtiyacı",
    "gn": "gün",
    "ara": "araç",
    "gnderimi": "gönderimi",
    "salyoruz": "sağlıyoruz",
    "corafi": "coğrafi",
    "yapsna": "yapısına",
    "ky": "köy",
    "iinden": "içinden",
    "ba": "bağ",
    "aradnzda": "aradığınızda",
    "kyoruz": "çıkıyoruz",
    "koullarna": "koşullarına",
    "dn": "ödün",
    "yaadnzda": "yaşadığınızda",
    "ila": "ilaç",
    "almanz": "almanız",
    "gerektiinde": "gerektiğinde",
    "ktnda": "çıktığında",
    "uzanzdadr": "uzağınızdadır",
    "trl": "türlü",
    "ihtiyacnzda": "ihtiyacınızda",
    "ihtiyalarnza": "ihtiyaçlarınıza",
    "ekinmeden": "çekinmeden",
    "deil": "değil",
    "yeil": "yeşil",
    "iin": "için",
    "planladnz": "planladığınız",
    "gidi-dn": "gidiş-dönüş",
    "karrken": "çıkarırken",
    "ofrlerimizle": "şoförlerimizle",
    "zmler": "çözümler",
    "yaatld": "yaşatıldığı",
    "blgemizde": "bölgemizde",
    "gtren": "götüren",
    "kltrnn": "kültürünün",

    // Add variations for user mentioned text
    "Saram'n": "Sarıçam'ın",
    "ulam": "ulaşım",

    // General parts for fallback
    "gve": "güve",
    "z": "çöz",
    "tm": "tüm",
    "dn": "dönüş"
};

const dir = 'C:/Users/User/Desktop/Works/sarıcam/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const fullPath = path.join(dir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    let original = content;

    // Sort keys by length descending so longer words match first
    const keys = Object.keys(replacements).sort((a, b) => b.length - a.length);

    keys.forEach(key => {
        const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        content = content.replace(regex, replacements[key]);
    });

    // Still remaining ?
    // We can't automatically replace them all, but let's log if there are any left.
    const remainingCount = (content.match(/\ufffd/g) || []).length;
    if (remainingCount > 0) {
        console.log(`File ${file} still has ${remainingCount}  characters.`);
    }

    if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed: ${file}`);
    }
});
