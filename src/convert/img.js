import { Convert } from '../convert.js'

export class Img{
  // ![%alt](%url)
  // ![%alt](%url " ")
  // ![%alt][%temp]
  static tag(text='' , temps=[]){
    // image
    const res0 = Convert.md_match(/^(.*?)!\[(.+?)\]\((.+?)( "(.*?)")*\)*$/ , text)
    if(res0){
      const url   = res0[3]
      const alt   = res0[2]||''
      const title = res0[5]||''
      text = `${res0[1]}<img src='${url}' alt='${alt}' title='${title}'/>`
    }

    // temp
    const res1 = Convert.md_match(/^(.*?)!\[(.+?)\]\[(.+?)\](.*?)$/ , text)
    if(res1){
      const temp = temps.find(e => e.key === res1[3])

      if(temp){
        const url   = temp.value
        const alt   = res1[2]||''
        const title = temp.title
        text = `${res1[1]}<img src='${url}' alt='${alt}' title='${title}'/>${res1[4]}`
      }
    }
    return text
  }

  
}