// import { Convert } from '../convert.js'

export class Link{
  // ![..](..)
  static tag(text){
    const res = text.match(/^(.*?)\[(.+?)\]\((.+?)\)(.*?)$/)
    if(res){
      const sp = res[3].split(' ')
      const link  = sp[0].trim()
      const title = sp[1] ? `title="${sp.splice(1).join(' ').replace(/\"/g,'').replace(/\'/g,'').trim()}"` : ''
      return `${res[1]}<a href='${link}' ${title}/>${res[2]}</a>${res[4]}`
    }
    else{  
      return text
    }
  }

  
}