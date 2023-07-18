MarkDown viewer
===

![title-banner](docs/markdown_viewer.jpg)

```
Create : 2020.04.17
Author : Yugeta.Koji
Update : 2023.06.09
```

# Summary
This tool is "mark down viewer".
You can set the markdown display for any element.


# Howto
- sample-1
1. 書き換えたいMarkdown表示させたいElementにclass='markdown'をセットする。
```
<div class='sentence'>
Sample
===
```
hoge-hoge
fuga-fuga
```
</div>
```

2. 使用したいページに、src/main.jsを読み込む。（htmlのhead内に以下のタグを埋め込む）
```
<script src='markdown_viewer/src/main.js'></script>
```

- sample-2
1. モジュールを読み込んで、直接文字列を書き換える
```
<script type='module'>
import { Markdown } from './markdown_viewer/src/markdown.js'
document.getElementById('sample') = new Markdown('convertしたい文字列').text
</script>
```

# Homepage
https://blog.myntinc.com/2020/05/markdowntexthtmlmarkdownviewer.html


# Update
- 2020.04.20 : first-commit
- 2022.11.09 : bug-fix
- 2023.06.09 : ver 2.0 : 起動仕様を変更

# Sample Blog
- kageori
  - https://www.kageori.com/2021/11/bloggermarkdown.html


