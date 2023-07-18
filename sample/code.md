タグマネージャー
===
```
Create : 2023.07.18
Author : Yugeta.Koji
```

下記の%**%を指定の値に書き直してお使い下さい。
```
<div></div>
&lt;script src='https://gadget.ura9.com/api.js?platform=%platform%&site=%site%&menu_type=%menu-type%&content=label&view_published=' async defer&gt;&lt;/script&gt;
```

【パラメータ】

```
platform=%platform%        : mobile , app ...
site=%site%                : サイト名(サブドメイン)
menu_type=%menu-type%      : ppv (default) , monthly , free
content=%api/contents/***% : api名（フォルダ名）を登録
view_published=%true%      : 更新日の表示を無くす（通常はこの設定は書かなくて大丈夫です）
【ABテストの記述方法】
```

2つのapi-contentをABテストする場合は、下記のように記述してください。

```
&lt;script&gt;(()=>{
const script = document.createElement('script')
const content = Math.random() * 2 < 1 ? '%api-name-1%' :  '%api-name-2%'
script.src = `https://gadget.ura9.com/api.js?platform=%platform%&site=%site%&content=${content}&menu_type=%menu-type%`
document.body.appendChild(script)
})()&lt;/script&gt;
```

【パラメータ】
```
%api-name-1%  : ABテストしたい、api-content名
%api-name-2%  : ABテストしたい、api-content名
```

【おまけ】
```
3つ以上のABテストを行いたい場合は、上記のMath.random()の箇所を下記のように変更することで、対応できます。
const api_contents = ['%api-name-1%','%api-name-2%','%api-name-3%'];
const content = api_contents[Math.floor(Math.random() * api_contents.length)];
```

ABテストの比率を変更したい場合は、math.randomの取得値を、比率で判定するプログラミングをすることで対応可能です。
※ケースが発生した時に、追記します。