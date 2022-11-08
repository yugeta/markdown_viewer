export class Markdown{
  constructor(options){
    options = options || {}
    if(options.elm){
      this.set_element(options.elm)
    }
    else if(options.text){
      this.text = this.convert(options.text)
    }
  }

  md_match(exp , text){
    const reg = RegExp(exp , 's')
    return text.match(reg)
  }

  set_element(elm){
    if(!elm){return}
    elm.setAttribute('data-markdown' , 'converted')
    let text = elm.innerHTML
    elm.innerHTML = this.convert(text)
  }

  convert(text){
    var lines = text.split('\n')
    for(var i=0; i<lines.length; i++){
      lines[i] = this.md_tag_br(lines[i])
      lines[i] = this.md_tag_head(lines[i])
      lines[i] = this.md_tag_emphasis(lines[i])
      lines[i] = this.md_tag_link(lines[i])
      lines[i] = this.md_tag_horizon(lines[i])
    }
    text = lines.join('\n')
    text = this.md_tag_list(text)
    text = this.md_tag_pre(text)
    text = this.md_tag_h1(text)
    text = this.md_tag_quote(text)
    text = this.md_tag_table(text)
    return text
  }


  // "  $" -> <br>
  md_tag_br(text){
    const res = this.md_match(`^(.*?) {2}$` , text)
    if(res){
      text = res[1] +"<br>"
    }
    return text;
  }

  // #
  md_tag_head(text){
    for(let i=6; i>=1; i--){
      const res = this.md_match(`^(.*?)#{${i}} (.*?)$` , text)
      if(res){
        text = `${res[1]}<h${i}><a name='${res[2]}'>${res[2]}</a></h${i}>`
      }
    }
    return text
  }
  

  // -
  md_tag_list(text){
    var lines = text.split("\n")
    var flg = false
    for(var i=0; i<lines.length; i++){
      const res = this.md_match('^(.*?)- (.*?)$' , lines[i])
      if(res){
        if(flg === false){
          lines[i] = "<ul>"+ res[1] +"<li>"+ res[2] +"</li>"
          flg = true
        }
        else{
          lines[i] = res[1] +"<li>"+ res[2] +"</li>"
        }
      }
      else if(flg === true){
        lines[i] = "</ul>\n" + lines[i]
        flg = false
      }
    }
    return lines.join("\n")
  }

  // >
  md_tag_quote(text){
    var lines = text.split("\n")
    var flg = false
    var datas = []
    for(var i=0; i<lines.length; i++){
      const res = this.md_match('^([ \t]*?)((&gt;){1,})(.*?)$' , lines[i])
      if(res){
        var count = res[2].length / 4
        if(flg === false){
          datas.push("<blockquote>")
          flg = count
        }
        else if(flg < count){
          datas.push("<blockquote>")
          flg = count
        }
        else if(flg > count){
          datas.push("</blockquote>")
          flg = count
        }
        lines[i] = res[1] + res[4]
      }
      else if(flg !== false){
        datas.push("</blockquote>")
        flg = false
      }
      datas.push(lines[i])
    }
    return datas.join("\n")
  }

  // *..* , -..-
  md_tag_emphasis(text){
    let res = null
    res = this.md_match(`^(.*?) \\*\\*\\*(.+?)\\*\\*\\* (.*?)$` , text)
    if(res){text = `${res[1]}<strong><em>${res[2]}</em></strong>${res[3]}`}
    res = this.md_match(`^(.*?) \-\-\-(.+?)\-\-\- (.*?)$` , text)
    if(res){text = `${res[1]}<strong><em>${res[2]}</em></strong>${res[3]}`}
    res = this.md_match(`^(.*?) \\*\\*(.+?)\\*\\* (.*?)$` , text)
    if(res){text = `${res[1]} +"<strong>${res[2]}</strong>${res[3]}`}
    res = this.md_match(`^(.*?) \\*(.+?)\\* (.*?)$` , text)
    if(res){text = `${res[1]}<em>${res[2]}</em>${res[3]}`}
    res = this.md_match(`^(.*?) ~~(.+?)~~ (.*?)$` , text)
    if(res){text = `${res[1]}<del>${res[2]}</del>${res[3]}`}
    return text
  }

  // ``` || ~~~
  md_tag_pre(text){
    var lines = text.split("\n")
    var flg = false
    for(var i=0; i<lines.length; i++){
      if(this.md_match(`^(.*?)\`\`\`(.*?)$` , lines[i])){
        if(flg === false){
          lines[i] = lines[i].replace("```","<pre>")
          flg = true
        }
        else{
          lines[i] = lines[i].replace("```","</pre>")
          flg = false
        }
        continue
      }
      if(this.md_match(`^(.*?)~~~(.*?)$` , lines[i])){
        if(flg === false){
          lines[i] = lines[i].replace("~~~","<pre>")
          flg = true
        }
        else{
          lines[i] = lines[i].replace("~~~","</pre>")
          flg = false
        }
        continue
      }
    }
    return lines.join("\n")
  }

  // ![..](..)
  md_tag_link(text){
    // image
    const res = this.md_match(`^([ \t]*?)\!\[(.+?)\]\((.+?)\)(.*?)$` , text)
    if(res){
      var url = ""
      // global
      if(res[3].match(/^[http|https]\:\/\//)){
        url = res[3]
      }

      // local
      else{
        var urlinfo = this.urlinfo()
        var uid     = typeof urlinfo.query.uid !== "undefined" ? urlinfo.query.uid : ""
        var id      = typeof urlinfo.query.id  !== "undefined" ? urlinfo.query.id  : ""
        var sp      = res[3].split(".")
        var ext     = sp.pop()
        var branch  = typeof urlinfo.query.branch !== "undefined" ? urlinfo.query.branch : ""
        url = "image.php?mode=git&uid="+uid+"&id="+id+"&ext="+ext+"&branch="+branch+"&path="+ res[3]
      }
      text = res[1] + "<img src='"+ url +"' alt='"+ res[2] +"' />"
    }

    // link
    const res2 = this.md_match(`^([ \t]*?)\[(.+?)\]\((.+?)\)(.*?)$` , text)
    if(res2){
      text = res2[1] + "<a href='"+ res2[3] +"' title='"+ res2[2] +"' />"+ res2[2] +"</a>"
    }
    return text
  }

  // ***,---,___,===
  md_tag_horizon(text){
    const res = this.md_match(`^([ \t]*?)[\*\-\_\=]{3}([ \t]*?)$` , text)
    if(res){
      text = res[1] +'<hr>'+ res[2]
    }
    return text
  }

  // ==
  md_tag_h1(text){
    var lines = text.split("\n")
    var flg = false
    var newDatas = []
    for(var i=lines.length-1; i>=0; i--){
      if(flg !== false){
        if(this.md_match(`^([ \t]*?)[\<](.*?)$` , lines[i])
        || this.md_match(`^[^ \ta-zA-Z0-9]` , lines[i])){
          newDatas.unshift("<h1 name='"+flg+"'>"+flg+"</h1>")
          newDatas.unshift(lines[i])
          flg = false
        }
        else{
          flg = lines[i] + flg
        }
      }
      
      if(flg === false && this.md_match(`^([ \t]*?)\=\=([ \t]*?)$` , lines[i])){
        flg = ""
      }
      else if(flg !== false && i==0){
        newDatas.unshift("<h1 name='"+flg+"'>"+flg+"</h1>")
        break
      }
      else if(flg === false){
        newDatas.unshift(lines[i])
      }
    }
    return newDatas.join("\n")
  }

  // table
  md_tag_table(text){
    var lines = text.split("\n")
    var flg = false
    var newDatas = []
    var normals = []
    for(var i=0; i<lines.length; i++){
      if(lines[i].match(/^([ \t]*?)\|/)){
        normals.push(lines[i])
        flg = true
      }
      else if(flg !== false){
        if(normals.length === 1){
          newDatas.push(normals[0])
        }
        else if(normals.length >= 2 && normals[1].indexOf("-") == -1){
          newDatas.concat(normals)
        }
        else if(normals.length >= 2){
          var settings = this.set_table_setting(normals[1])

          newDatas.push("<table>")

          // header
          newDatas.push(this.set_table_cell(normals[0] , settings , "th"))

          // datas
          for(var j=2; j<normals.length; j++){
            if(!normals[j]){continue}
            newDatas.push(this.set_table_cell(normals[j] , settings , "td"))
          }
          newDatas.push("</table>")
        }
        normals = []
        flg = false
      }
      else{
        newDatas.push(lines[i])
      }
    }
    return newDatas.join("\n")
  }

  set_table_setting(line){
    var cells = line.split("|")
    var data = [cells[0]]

    for(var i=1; i<cells.length-1; i++){
      data[i] = (function(cell){
        switch(cell){
          case ":--"  : return "left"
          case "--:"  : return "right"
          case ":--:" : return "center"
          default     : return ""
        }
      })(cells[i])
    }
    return data
  };
  set_table_cell(line,settings,tag){
    var cells = line.split("|")
    var data = ""
    for(var i=1; i<cells.length-1; i++){
      data += "<"+tag+" class='"+settings[i]+"'>"+cells[i]+"</"+tag+">"
    }
    return "<tr>"+data+"</tr>"
  }
}
