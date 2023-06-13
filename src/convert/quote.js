import { Convert } from '../convert.js'

export class Quote{
  // >
  static tag(text){
    const lines = text.split("\n")
    let flg = false
    const datas = []
    for(let i=0; i<lines.length; i++){
      const res = Convert.md_match('^([ \t]*?)((&gt;){1,})(.*?)$' , lines[i])
      if(res){
        const count = res[2].length / 4
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
}