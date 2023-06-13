import { Convert } from '../convert.js'

export class List{
  // -
  static tag(text){
    const lines = text.split("\n")
    let flg = false
    for(let i=0; i<lines.length; i++){
      const res = Convert.md_match('^(.*?)- (.*?)$' , lines[i])
      if(res){
        if(flg === false){
          lines[i] = `<ul>${res[1]}<li>${res[2]}</li>`
          flg = true
        }
        else{
          lines[i] = `${res[1]}<li>${res[2]}</li>`
        }
      }
      else if(flg === true){
        lines[i] = `</ul>\n${lines[i]}`
        flg = false
      }
    }
    return lines.join("\n")
  }
}