import { Convert } from '../convert.js'

export class Br{
  // "  $" -> <br>
  static tag(text){
    const res = Convert.md_match(`^(.*?) {2}$` , text)
    if(res){
      text = `${res[1]}<br>`
    }
    return text;
  }
}