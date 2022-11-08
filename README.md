MarkDown viewer
===

![title-banner](docs/markdown_viewer.jpg)

```
Create : 2020.04.17
Author : Yugeta.Koji
Update : 2022.11.09
```

# Summary
This tool is "mark down viewer".
You can set the markdown display for any element.

# Howto

1. 使用したいページに、main.cssを読み込む。（htmlのhead内に以下のタグを埋め込む）
```
<link rel='stylesheet' href='markdown_viewer/src/main.css'/>
```

2. 実行したいjavascriptでmain.jsを読み込んで、変換したい文字が含まれている対象のエレメントをセットする。
```
<script type='module'>
import { Markdown as MD} from from './markdown_viewer/src/main.js'

new Markdown({elm : element})
</script>
```

3. 任意のタイミングで、任意のelement内を変換したい場合
```
<script type='module'>
import { Markdown as MD} from from './markdown_viewer/src/main.js'

const element = document.querySelector('target-element')
element.innerHTML = new Markdown().convert(element.innerHTML)
</script>
```

# Homepage
https://blog.myntinc.com/2020/05/markdowntexthtmlmarkdownviewer.html

https://draft.blogger.com/u/2/blog/post/edit/preview/1302948195388337515/5187720051686997148

