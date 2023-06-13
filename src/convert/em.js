import { Convert } from '../convert.js'

export class Em{
  // *..* , -..-
  static tag(text){
    let res = null
    
    res = Convert.md_match(`^(.*?) \\*\\*\\*(.+?)\\*\\*\\* (.*?)$` , text)
    if(res){text = `${res[1]}<strong><em>${res[2]}</em></strong>${res[3]}`}

    res = Convert.md_match(`^(.*?) \-\-\-(.+?)\-\-\- (.*?)$` , text)
    if(res){text = `${res[1]}<strong><em>${res[2]}</em></strong>${res[3]}`}

    res = Convert.md_match(/^(.*?)__(.+?)__(.*?)$/ , text)
    if(res){text = `${res[1]}<strong>${res[2]}</strong>${res[3]}`}

    res = Convert.md_match(`^(.*?) \\*\\*(.+?)\\*\\* (.*?)$` , text)
    if(res){text = `${res[1]} +"<strong>${res[2]}</strong>${res[3]}`}

    res = Convert.md_match(`^(.*?) \\*(.+?)\\* (.*?)$` , text)
    if(res){text = `${res[1]}<em>${res[2]}</em>${res[3]}`}

    res = Convert.md_match(`^(.*?) ~~(.+?)~~ (.*?)$` , text)
    if(res){text = `${res[1]}<del>${res[2]}</del>${res[3]}`}

    return text
  }
}