import { Convert } from '../convert.js'

export class Pre{
  // ``` || ~~~
  static tag(text){
    // console.log(text)
    const lines = text.split("\n")
    let flg = false
    for(let i=0; i<lines.length; i++){
      if(Convert.md_match(`^(.*?)\`\`\`(.*?)$`, lines[i])){
        if(flg === false){
          lines[i] = lines[i].replace("```", "<pre>")
          flg = true
        }
        else{
          lines[i] = lines[i].replace("```", "</pre>")
          flg = false
        }
        continue
      }
      if(Convert.md_match(`^(.*?)~~~(.*?)$` , lines[i])){
        if(flg === false){
          lines[i] = lines[i].replace("~~~", "<pre>")
          flg = true
        }
        else{
          lines[i] = lines[i].replace("~~~", "</pre>")
          flg = false
        }
        continue
      }
      if(flg === true){
        lines[i] = lines[i].replace(/</g , '&lt;')
        lines[i] = lines[i].replace(/>/g , '&gt;')
      }
    }
    return lines.join("\n")
  }
}
