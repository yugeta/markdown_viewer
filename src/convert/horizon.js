import { Convert } from '../convert.js'

export class Horizon{
  // ***,---,___,===
  static tag(text){
    const res = Convert.md_match(`^([ \t]*?)[\*\-\_\=]{3}([ \t]*?)$` , text)
    if(res){
      text = `${res[1]}<hr>${res[2]}`
    }
    return text
  }
}