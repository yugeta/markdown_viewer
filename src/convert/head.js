import { Convert } from '../convert.js'

export class Head{
  // #
  static tag(text){
    for(let i=6; i>=1; i--){
      const res = Convert.md_match(`^(.*?)#{${i}} (.*?)$` , text)
      if(res){
        text = `${res[1]}<h${i}><a name='${res[2]}'>${res[2]}</a></h${i}>`
      }
    }
    return text
  }
}