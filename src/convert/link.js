import { Convert } from '../convert.js'

export class Link{
  // ![..](..)
  static tag(text){
    // link
    const res = Convert.md_match(/^(.*?)\[(.+?)\]\((.+?)\)(.*?)$/ , text)
    if(res){
      const url   = res[3]
      const value = res[2]
      text = `${res[1]}<a href='${url}' />${value}</a>${res[4]}`
    }
    return text
  }

  
}