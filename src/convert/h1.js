import { Convert } from '../convert.js'

export class H1{
  // ==
  static tag(text){
    const lines = text.split("\n")
    let flg = false
    const newDatas = []
    for(let i=lines.length-1; i>=0; i--){
      if(flg !== false){
        if(Convert.md_match(`^([ \t]*?)[\<](.*?)$` , lines[i])
        || Convert.md_match(`^[^ \ta-zA-Z0-9]` , lines[i])){
          newDatas.unshift(`<h1 name='${flg}'>${flg}</h1>`)
          newDatas.unshift(lines[i])
          flg = false
        }
        else{
          flg = lines[i] + flg
        }
      }
      
      if(flg === false && Convert.md_match(`^([ \t]*?)\=\=([ \t]*?)$` , lines[i])){
        flg = ""
      }
      else if(flg !== false && i==0){
        newDatas.unshift(`<h1 name='${flg}'>${flg}</h1>`)
        break
      }
      else if(flg === false){
        newDatas.unshift(lines[i])
      }
    }
    return newDatas.join("\n")
  }
}