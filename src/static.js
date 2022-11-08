;$$markdown_viewer = (function(){

  var __options = {
    target : "body",
    style  : "normal"
  };

  var LIB = function(){};

  // 起動scriptタグを選択
  LIB.prototype.currentScriptTag = (function(){
    var scripts = document.getElementsByTagName("script");
    return this.currentScriptTag = scripts[scripts.length-1].src;
  })();

	LIB.prototype.event = function(target, mode, func){
		if (target.addEventListener){target.addEventListener(mode, func, false)}
		else{target.attachEvent('on' + mode, function(){func.call(target , window.event)})}
	};

	LIB.prototype.urlinfo = function(uri){
    uri = (uri) ? uri : location.href;
    var data={};
    var urls_hash  = uri.split("#");
    var urls_query = urls_hash[0].split("?");
		var sp   = urls_query[0].split("/");
		var data = {
      uri      : uri
		,	url      : sp.join("/")
    , dir      : sp.slice(0 , sp.length-1).join("/") +"/"
    , file     : sp.pop()
		,	domain   : sp[2] ? sp[2] : ""
    , protocol : sp[0] ? sp[0].replace(":","") : ""
    , hash     : (urls_hash[1]) ? urls_hash[1] : ""
		,	query    : (urls_query[1])?(function(urls_query){
				var data = {};
				var sp   = urls_query.split("#")[0].split("&");
				for(var i=0;i<sp .length;i++){
					var kv = sp[i].split("=");
					if(!kv[0]){continue}
					data[kv[0]]=kv[1];
				}
				return data;
			})(urls_query[1]):[]
		};
		return data;
  };

  LIB.prototype.upperSelector = function(elm , selectors) {
    selectors = (typeof selectors === "object") ? selectors : [selectors];
    if(!elm || !selectors){return;}
    var flg = null;
    for(var i=0; i<selectors.length; i++){
      for (var cur=elm; cur; cur=cur.parentElement) {
        if (cur.matches(selectors[i])) {
          flg = true;
          break;
        }
      }
      if(flg){
        break;
      }
    }
    return cur;
  }

  // ゼロパディング
  LIB.prototype.zeroPadding = function(num , len){
    var num_len = num.toString().length;
    if(num_len > len){
      return num;
    }
    var zero_len = len - num_len;
    var zero_val = "";
    for(var i=0; i<zero_len; i++){
      zero_val += "0";
    }
    return (zero_val + num.toString()) . slice( -1 * len);
  }

  LIB.prototype.construct = function(){
    var lib = new LIB();

    switch(document.readyState){
      case "complete"    : new MAIN;break;
      case "interactive" : lib.event(window , "DOMContentLoaded" , function(){new MAIN});break;
      default            : lib.event(window , "load" , function(){new MAIN});break;
		}
  };



  // 基本起動処理
  var MAIN = function(options){
    this.options = this.setOptions(options);
    this.setCSS();
    this.set_markdown();
  };

  // options
  MAIN.prototype.setOptions = function(options){
    var new_options = JSON.parse(JSON.stringify(__options));
    if(options){
      for(var i in options){
        new_options[i] = options[i];
      }
    }
    return new_options;
  };

  // set-css
  MAIN.prototype.setCSS = function(){
    if(document.querySelector("link[data-markdown-viewer='1']")){return}
    var myScript = new LIB().currentScriptTag;
    var href = myScript.replace(".js",".css");
    var link = document.createElement("link");
    link.setAttribute("data-markdown-viewer","1");
    link.rel = "stylesheet";
    link.href = href;
    var head = document.getElementsByTagName("head");
    head[0].appendChild(link);
  };

  // MarkDown-view
  MAIN.prototype.set_markdown = function(){
    if(typeof this.options.target === "undefined" || !this.options.target){
      this.options.target = "body";
    }
    var targets = document.querySelectorAll(this.options.target);
    if(!targets || !targets.length){return;}

    for(var i=0; i<targets.length; i++){
      this.md_convert(targets[i]);
    }
  };

  MAIN.prototype.md_convert = function(elm){
    if(!elm){return;}
    var text = elm.innerHTML;
    if(!text){return;}
// console.log(text.replace(/\n/g,"---"));

    // marking
    elm.setAttribute("data-markdown" , "converted");
    elm.setAttribute("data-markdown-style" , this.options.style);

    // convert
    var lines = text.split("\n");
    for(var i=0; i<lines.length; i++){
      // lines[i] = this.md_tag_escape(lines[i]);
      lines[i] = this.md_tag_br(lines[i]);
      lines[i] = this.md_tag_head(lines[i]);
      lines[i] = this.md_tag_emphasis(lines[i]);
      lines[i] = this.md_tag_link(lines[i]);
      lines[i] = this.md_tag_horizon(lines[i]);
    }
    text = lines.join("\n");

    text = this.md_tag_list(text);
    text = this.md_tag_pre(text);
    text = this.md_tag_h1(text);
    text = this.md_tag_quote(text);
    text = this.md_tag_table(text);

    // view
    elm.innerHTML = text;
  };


  // "  $" -> <br>
  MAIN.prototype.md_tag_br = function(text){
    if(text.match(/^(.*?) {2}$/)){
      text = RegExp.$1 +"<br>";
    }
    return text;
  };

  // #
  MAIN.prototype.md_tag_head = function(text){
    if(text.match(/^(.*?)#{6} (.*?)$/)){
      text = RegExp.$1 +"<h6><a name='"+RegExp.$2+"'>"+ RegExp.$2 +"</a></h6>";
    }
    else if(text.match(/^(.*?)# {5}(.*?)$/)){
      text = RegExp.$1 +"<h5><a name='"+RegExp.$2+"'>"+ RegExp.$2 +"</a></h5>";
    }
    else if(text.match(/^(.*?)# {4}(.*?)$/)){
      text = RegExp.$1 +"<h4><a name='"+RegExp.$2+"'>"+ RegExp.$2 +"</a></h4>";
    }
    else if(text.match(/^(.*?)# {3}(.*?)$/)){
      text = RegExp.$1 +"<h3><a name='"+RegExp.$2+"'>"+ RegExp.$2 +"</a></h3>";
    }
    else if(text.match(/^(.*?)# {2}(.*?)$/)){
      text = RegExp.$1 +"<h2><a name='"+RegExp.$2+"'>"+ RegExp.$2 +"</a></h2>";
    }
    else if(text.match(/^(.*?)# (.*?)$/)){
      text = RegExp.$1 +"<h1><a name='"+RegExp.$2+"'>"+ RegExp.$2 +"</a></h1>";
    }
    return text;
  };

  // -
  MAIN.prototype.md_tag_list = function(text){
    var lines = text.split("\n");
    var flg = false;
    for(var i=0; i<lines.length; i++){
      if(lines[i].match(/^(.*?)- (.*?)$/)){
        if(flg === false){
          lines[i] = "<ul>"+ RegExp.$1 +"<li>"+ RegExp.$2 +"</li>";
          flg = true;
        }
        else{
          lines[i] = RegExp.$1 +"<li>"+ RegExp.$2 +"</li>";
        }
      }
      else if(flg === true){
        lines[i] = "</ul>\n" + lines[i];
        flg = false;
      }
    }
    return lines.join("\n");
  }

  // >
  MAIN.prototype.md_tag_quote = function(text){
    var lines = text.split("\n");
    var flg = false;
    var datas = [];
    for(var i=0; i<lines.length; i++){
      if(lines[i].match(/^([ \t]*?)((&gt;){1,})(.*?)$/)){
        var count = RegExp.$2.length / 4;
        if(flg === false){
          datas.push("<blockquote>");
          flg = count;
        }
        else if(flg < count){
          datas.push("<blockquote>");
          flg = count;
        }
        else if(flg > count){
          datas.push("</blockquote>");
          flg = count;
        }
        lines[i] = RegExp.$1 + RegExp.$4;
      }
      else if(flg !== false){
        datas.push("</blockquote>");
        flg = false;
      }
      datas.push(lines[i]);
    }
    return datas.join("\n");
  }

  // *..* , -..-
  MAIN.prototype.md_tag_emphasis = function(text){
    if(text.match(/^(.*?) \*\*\*(.+?)\*\*\* (.*?)$/)
    || text.match(/^(.*?) \-\-\-(.+?)\-\-\- (.*?)$/)){
      text = RegExp.$1 +"<strong><em>"+ RegExp.$2 +"</em></strong>" + RegExp.$3;
    }
    else if(text.match(/^(.*?) \*\*(.+?)\*\* (.*?)$/)
    || text.match(/^(.*?) \-\-(.+?)\-\- (.*?)$/)){
      text = RegExp.$1 +"<strong>"+ RegExp.$2 +"</strong>" + RegExp.$3;
    }
    else if(text.match(/^(.*?) \*(.+?)\* (.*?)$/)
    || text.match(/^(.*?) \-(.+?)\- (.*?)$/)){
      text = RegExp.$1 +"<em>"+ RegExp.$2 +"</em>" + RegExp.$3;
    }
    else if(text.match(/^(.*?) ~~(.+?)~~ (.*?)$/)){
      text = RegExp.$1 +"<del>"+ RegExp.$2 +"</del>" + RegExp.$3;
    }
    return text;
  }

  // ``` || ~~~
  MAIN.prototype.md_tag_pre = function(text){
    var lines = text.split("\n");
    var flg = false;
    for(var i=0; i<lines.length; i++){
      if(lines[i].match(/^(.*?)```(.*?)$/)){
        if(flg === false){
          lines[i] = lines[i].replace("```","<pre>");
          flg = true;
        }
        else{
          lines[i] = lines[i].replace("```","</pre>");
          flg = false;
        }
      }
      else if(lines[i].match(/^(.*?)~~~(.*?)$/)){
        if(flg === false){
          lines[i] = lines[i].replace("~~~","<pre>");
          flg = true;
        }
        else{
          lines[i] = lines[i].replace("~~~","</pre>");
          flg = false;
        }
      }
    }
    return lines.join("\n");
  }

  // ![..](..)
  MAIN.prototype.md_tag_link = function(text){

    // image
    if(text.match(/^([ \t]*?)\!\[(.+?)\]\((.+?)\)(.*?)$/)){
      var url = "";
      // global
      if(RegExp.$3.match(/^[http|https]\:\/\//)){
        url = RegExp.$3;
      }

      // local
      else{
        var urlinfo = new LIB().urlinfo();
        var uid     = typeof urlinfo.query.uid !== "undefined" ? urlinfo.query.uid : "";
        var id      = typeof urlinfo.query.id  !== "undefined" ? urlinfo.query.id  : "";
        var sp      = RegExp.$3.split(".");
        var ext     = sp.pop();
        var branch  = typeof urlinfo.query.branch !== "undefined" ? urlinfo.query.branch : "";
        url = "image.php?mode=git&uid="+uid+"&id="+id+"&ext="+ext+"&branch="+branch+"&path="+ RegExp.$3
      }
      text = RegExp.$1 + "<img src='"+ url +"' alt='"+ RegExp.$2 +"' />";
    }

    // link
    else if(text.match(/^([ \t]*?)\[(.+?)\]\((.+?)\)(.*?)$/)){
      text = RegExp.$1 + "<a href='"+ RegExp.$3 +"' title='"+ RegExp.$2 +"' />"+ RegExp.$2 +"</a>";
    }

    return text;
  }

  // ***,---,___,===
  MAIN.prototype.md_tag_horizon = function(text){
    if(text.match(/^( \t*?)\*{3}( \t*?)$/)
    || text.match(/^( \t*?)\-{3}( \t*?)$/)
    || text.match(/^( \t*?)\_{3}( \t*?)$/)
    || text.match(/^( \t*?)\={3}( \t*?)$/)){
      text = RegExp.$1 +"<hr>"+ RegExp.$2;
    }
    return text;
  }

  // ==
  MAIN.prototype.md_tag_h1 = function(text){
    var lines = text.split("\n");
    var flg = false;
    var newDatas = [];
    for(var i=lines.length-1; i>=0; i--){
      if(flg !== false){
        if(lines[i].match(/^([ \t]*?)[\<](.*?)$/)
        || lines[i].match(/^[^ \ta-zA-Z0-9]/)){
          newDatas.unshift("<h1 name='"+flg+"'>"+flg+"</h1>");
          newDatas.unshift(lines[i]);
          flg = false;
        }
        else{
          flg = lines[i] + flg;
        }
      }

      if(flg === false && lines[i].match(/^([ \t]*?)\=\=([ \t]*?)$/)){
        flg = "";
      }
      else if(flg !== false && i==0){
        newDatas.unshift("<h1 name='"+flg+"'>"+flg+"</h1>");
        break;
      }
      else if(flg === false){
        newDatas.unshift(lines[i]);
      }
    }
    return newDatas.join("\n");
  }

  // table
  MAIN.prototype.md_tag_table = function(text){
    var lines = text.split("\n");
    var flg = false;
    var newDatas = [];
    var normals = [];
    for(var i=0; i<lines.length; i++){
      if(lines[i].match(/^([ \t]*?)\|/)){
        normals.push(lines[i]);
        flg = true;
      }
      else if(flg !== false){
        if(normals.length === 1){console.log(1);
          newDatas.push(normals[0]);
        }
        else if(normals.length >= 2 && normals[1].indexOf("-") == -1){
          newDatas.concat(normals);
        }
        else if(normals.length >= 2){
          var settings = this.set_table_setting(normals[1]);

          newDatas.push("<table>");

          // header
          newDatas.push(this.set_table_cell(normals[0] , settings , "th"));

          // datas
          for(var j=2; j<normals.length; j++){
            if(!normals[j]){continue;}
            newDatas.push(this.set_table_cell(normals[j] , settings , "td"));
          }

          newDatas.push("</table>");
        }
        normals = [];
        flg = false;
      }
      else{
        newDatas.push(lines[i]);
      }
    }
    return newDatas.join("\n");
  }

  MAIN.prototype.set_table_setting = function(line){
    var cells = line.split("|");
    var data = [cells[0]];

    for(var i=1; i<cells.length-1; i++){
      data[i] = (function(cell){
        switch(cell){
          case ":--"  : return "left";
          case "--:"  : return "right";
          case ":--:" : return "center";
          default     : return "";
        }
      })(cells[i]);
    }
    return data;
  };
  MAIN.prototype.set_table_cell = function(line,settings,tag){
    var cells = line.split("|");
    var data = "";
    for(var i=1; i<cells.length-1; i++){
      data += "<"+tag+" class='"+settings[i]+"'>"+cells[i]+"</"+tag+">";
    }
    return "<tr>"+data+"</tr>";
  };



  return MAIN;
})();