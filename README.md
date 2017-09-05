# STOMP

STOMP basit metin yönelimli mesajlaşma protokolüdür.

STOMP, arabulucu sunucular aracılığıyla istemciler arasında eşzamansız mesajlaşma iletimi için tasarlanmış basit ve birlikte çalışabilir bir protokoldür. Bu istemciler ve sunucular arasında iletilen mesajlar için metin tabanlı bir kablo biçimi tanımlar.

## Protokol

Bir STOMP sunucusu, mesajların gönderilebileceği bir varış yeri kümesi olarak modellenmiştir. STOMP protokolü hedefleri opak dize(Sunucu tarafından belirlenen ve istemci tarafından değiştirilmeden gönderilecek bir veri dizesi.) olarak kabul eder ve sözdizimleri sunucunun uygulanmasına özgüdür. Buna ek olarak STOMP, hedeflerin teslimat semantiklerinin ne olması gerektiğini tanımlamaz. Hedeflerin teslimatı veya "mesaj alışverişi" anlamları, sunucudan sunucuya hatta hedeften hedefe değişebilir. Bu, sunucuların STOMP ile destekleyebilecekleri semantiklerle yaratıcı olmasını sağlar.

Bir STOMP istemcisi, iki (muhtemelen eşzamanlı) modda hareket edebilen bir kullanıcı aracısıdır:

- bir üretici olarak, bir SEND çerçevesiyle(FRAME) sunucu üzerindeki bir hedefe(DESTINATION) mesaj göndermek
- bir tüketici olarak belirli bir varış noktası için bir SUBSCRIBE çerçevesi gönderir ve sunucudan MESSAGE çerçeveleri olarak mesajlar alır.

## Çerçeve

STOMP, iki yönlü akış ağı protokolü (TCP gibi) altında varsayan güvenilir  bir çerçeve tabanlı bir protokoldür. İstemci ve sunucu, akış üzerinden gönderilen STOMP çerçeveleri kullanarak iletişim kuracaklardır.

## Body

Yalnızca SEND, MESSAGE ve ERROR çerçevelerinin bir gövdesi olabilir. Diğer tüm çerçeveler bir gövdeye sahip DEĞİLDİR.

### Standart Headers

Çoğu çerçeveyle birlikte bazı başlıklar kullanılmalı ve özel bir anlam taşımalıdır.

### Header content-length

Tüm çerçeveler bir content-length başlığı içerebilir. Mesaj gövdesinin uzunluğu için bu başlık bir sekizlik sayıdır.

### Header content-type

Eğer çerçeve bir gövde varsa, SEND, MESSAGE ve ERROR çerçeveleri, alıcının çerçeve gövdesini yorumlamasına yardımcı olacak bir içerik türü başlıklığı içermesi GEREKİR. Başlık içerik-türü ayarlanırsa, değeri vücudun biçimini tanımlayan bir MIME türü OLMALI. Aksi takdirde alıcı, gövdeyi ikili damla olarak görmesi GEREKİR.

### Header receipt

CONNECT dışında herhangi bir istemci çerçevesi, rasgele bir değere sahip bir alındı başlığı belirtebilir. Bu, sunucunun istemci çerçevesinin bir RECEIPT çerçevesi ile işlemesini onaylamasına neden olacaktır.

## Boyut Sınırları

Kötü niyetli istemcilerin bir sunucudaki bellek tahsisini istismar etmesini önlemek için, sunucular aşağıdakiler üzerine maksimum sınırlar bırakabilir:

- tek bir çerçevede izin verilen çerçeve başlıklarının sayısı
- başlık satırlarının maksimum uzunluğu
- bir çerçeve gövdesinin maksimum boyutu

Bu sınırlar aşılırsa, sunucu istemciye bir ERROR çerçevesi göndermeli ve daha sonra bağlantıyı kapatmalıdır.

## Bağlantı Duraksama Süresi

STOMP sunucuları, hızla bağlanan ve bağlantısını kesen istemcileri destekleyebilmelidir.

Bu bağlantı sıfırlanmadan önce yalnızca kapalı bağlantıların kısa süre sunucuyu oyalanmasına izin vereceğini anlamına gelir.

Sonuç olarak, bir istemci soket sıfırlanmadan önce sunucu tarafından gönderilen son kareyi(örneğin bir ERROR çerçevesi veya DISCONNECT çerçevesine yanıt olarak RECEIPT çerçevesi) alamayabilir.

## Kaynaklar

[STOMP 1.2 Implementations](https://stomp.github.io/stomp-specification-1.2.html)
[STOMP Over Websocket](https://stomp-js.github.io/stomp-websocket/codo/alphabetical_index.html)