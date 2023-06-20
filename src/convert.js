// import { Temp }    from './convert/temp.js'

// import { Table }   from './convert/table.js'
// import { Quote }   from './convert/quote.js'
// import { H1 }      from './convert/h1.js'
// import { Pre }     from './convert/pre.js'
// import { List }    from './convert/list.js'

// import { Br }      from './convert/br.js'
// import { Head }    from './convert/head.js'
// import { Em }      from './convert/em.js'
// import { Img }     from './convert/img.js'
import { Link }    from './convert/link.js'
// import { Horizon } from './convert/horizon.js'

export class Convert{
  constructor(text){
    this.base_text = text
    this.lines = text.split('\n')
    this.set_line_datas()
    console.log(this.line_groups)
    console.log(this.line_groups.map(e => e.type))
    // this.text = this.lines.join('<br>')
    this.text = this.replace_tag()
  }

  set_line_datas(){
    const datas = []
    const num = {
      ul : 0,
      ol : 0,
      code : 0,
      blockquote : 0,
    }
    for(let i=0; i<this.lines.length; i++){
      this.lines[i] = this.lines[i].replace(/\r^/,'')
      if(this.lines[i] === ''){continue}
      const data = this.get_line_data(this.lines[i] , i)
      datas.push(data)
    }
    this.adjust_datas(datas)
    this.line_groups = datas
  }

  // ul,ol,code,blockquote,hr,header
  get_line_data(line_string , line_number){
    const unorderd_list = line_string.match(/^([\t {2}]*?)([\-\+\*]) (.*?)$/s)
    if(unorderd_list){
      return {
        line_number   : line_number,
        line_string   : line_string,
        type          : `unorderd_list`,
        tag           : 'li',
        indent_number : this.get_indent_number(unorderd_list[1]),
        target_string : this.tag(unorderd_list[3]),
        mark          : unorderd_list[2],
      }
    }

    const orderd_list = line_string.match(/^([\t {2}]*?)([0-9]+?\.) (.*?)$/s)
    if(orderd_list){
      return {
        line_number   : line_number,
        line_string   : line_string,
        type          : `orderd_list`,
        tag           : 'li',
        indent_number : this.get_indent_number(orderd_list[1]),
        target_string : this.tag(orderd_list[3]),
        mark          : orderd_list[2],
      }
    }

    const code = line_string.match(/^([\t {2}]*?)(\`{2,3})(.*?)$/s)
    if(code){
      return {
        line_number   : line_number,
        line_string   : line_string,
        type          : `code`,
        tag           : 'code',
        indent_number : this.get_indent_number(code[1]),
        target_string : this.tag(code[3]),
        mark          : code[2],
      }
    }

    const blockquote = line_string.match(/^([\t {2}]*?)(\>+?) (.*?)$/s)
    if(blockquote){
      return{
        line_number   : line_number,
        line_string   : line_string,
        type          : `blockquote`,
        tag           : `blockquote`,
        indent_number : this.get_indent_number(blockquote[1]),
        count         : blockquote[2].split('>').length,
        target_string : this.tag(blockquote[3]),
        mark          : blockquote[2],
      }
    }

    const horizontal_rule = line_string.match(/^([\t {2}]*?)([\-\=\*]{3})(.*?)$/s)
    if(horizontal_rule){
      return {
        line_number   : line_number,
        line_string   : line_string,
        type          : `hr`,
        tag           : `hr`,
        indent_number : this.get_indent_number(horizontal_rule[1]),
        target_string : this.tag(horizontal_rule[3]),
        mark          : horizontal_rule[2],
      }
    }

    const header = line_string.match(/^([\t {2}]*?)(#{1,6})(.*?)$/s)
    if(header){
      const count = header[2].split('#').length-1
      return {
        line_number   : line_number,
        line_string   : line_string,
        type          : `header`,
        tag           : `h${count}`,
        count         : count,
        indent_number : this.get_indent_number(header[1]),
        target_string : this.tag(header[3]),
        mark          : header[2],
        tag_close     : true,
      }
    }

    const etc = line_string.match(/^([\t {2}]*?)(.*?)$/s)
    return {
      line_number   : line_number,
      line_string   : line_string,
      type          : null,
      indent_number : this.get_indent_number(etc[1]),
      target_string : this.tag(etc[2]),
    }
  }

  get_indent_number(indent_string){
    return indent_string ? indent_string.replace(/  /g , '\t').split('\t').length-1 : 0
  }

  tag(string){
    return string
  }

  adjust_datas(datas){
    let current_type = null
    for(let i=0; i<datas.length; i++){

      if(current_type === 'blockquote' && datas[i].type !== current_type){
        datas.splice(i,0,{
          type : `blockquote`,
          tag  : '/blockquote'
        })
        i++
      }

      if(!datas[i].type){continue}

      // code
      if(datas[i].type === 'code'){
        // end
        if(current_type === datas[i].type){
          datas[i].tag = `/${datas[i].tag}`
        }
      }


      // ul,ol
      if(datas[i].type !== current_type){
        // end
        if(current_type === 'unorderd_list'){
          datas.splice(i,0,{
            type : `unorderd_list`,
            tag  : '/ul'
          })
          i++
        }
        if(current_type === 'orderd_list'){
          datas.splice(i,0,{
            type : `orderd_list`,
            tag  : '/ol'
          })
          i++
        }

        // start
        if(datas[i].type === 'unorderd_list'){
          datas.splice(i,0,{
            type : 'unorderd_list',
            tag : `ul`,
          })
          i++
        }
        if(datas[i].type === 'orderd_list'){
          datas.splice(i,0,{
            type : 'orderd_list',
            tag : `ol`,
          })
          i++
        }
      }
      current_type = datas[i].type
    }
    
    // console.log(datas)
  }

  replace_tag(){
    let html = ''
    for(const line_group of this.line_groups){
      let str = line_group.target_string || ''
      if(line_group.tag){
        const tag = line_group.tag
        if(line_group.tag_close){
          str = `<${tag}>${str}</${tag}>`
        }
        else if(line_group.tag === 'code' || line_group.tag === 'blockquote'){
          str = `<${tag}>${str}`
        }
        else{
          str = `<${tag}>${str}`
        }
      }
      str = this.single_tag(str)

      html += str
    }
    return html
  }

  single_tag(str){
    // str = this.tag_br(str)
    str = Link.tag(str)
    return str
  }

  tag_br(str){
    const res = str.match(/^(.*?) {2}$/s)
    if(res){
      str = `${res[1]}<br>`
    }
    return str
  }

  // constructor(text){
  //   const lines = text.split('\n')
  //   const temps = Temp.search(lines)

  //   for(var i=0; i<lines.length; i++){
  //     lines[i] = Br.tag(lines[i])
  //     lines[i] = Head.tag(lines[i])
  //     lines[i] = Em.tag(lines[i]) // emphasis
  //     lines[i] = Img.tag(lines[i] , temps)
  //     lines[i] = Link.tag(lines[i])
  //     lines[i] = Horizon.tag(lines[i])
  //   }
  //   text = lines.join('\n')
  //   text = List.tag(text)
  //   text = Pre.tag(text)
  //   text = H1.tag(text)
  //   text = Quote.tag(text)
  //   text = Table.tag(text)
  //   this.text = text
  // }

  // static md_match(exp , text){
  //   const reg = RegExp(exp , 's')
  //   return text.match(reg)
  // }  

  // static urlinfo(uri){
  //   const urls_hash  = uri.split("#")
  //   const urls_query = urls_hash[0].split("?")
	// 	const sp   = urls_query[0].split("/")
	// 	const data = {
  //     uri      : uri,
	// 	  url      : sp.join("/"),
  //     dir      : sp.slice(0 , sp.length-1).join("/") +"/",
  //     file     : sp.pop(),
	// 	  domain   : sp[2] ? sp[2] : "",
  //     protocol : sp[0] ? sp[0].replace(":","") : "",
  //     hash     : (urls_hash[1]) ? urls_hash[1] : "",
	// 	  query    : (urls_query[1])?(function(urls_query){
	// 			var data = {};
	// 			var sp   = urls_query.split("#")[0].split("&")
	// 			for(var i=0;i<sp .length;i++){
	// 				var kv = sp[i].split("=")
	// 				if(!kv[0]){continue}
	// 				data[kv[0]]=kv[1]
	// 			}
	// 			return data;
	// 		})(urls_query[1]):[]
	// 	}
	// 	return data
  // }
}


