import { Convert } from '../convert.js'

export class List{
  // -
  static tag(text){
    this.list_groups = []
    this.lines = text.split('\n')
    this.get_list_groups()
    this.set_list_groups()
    return this.lines.join('\n')
  }


  // list並びの行数をグループとして取得する。
  // 階層の判別も同時に行う。
  static get_list_groups(){
    let group = 0
    for(let i=0; i<this.lines.length; i++){
      const line = this.lines
      const res  = Convert.md_match('^([\t {2}]*?)([\-\+\*]) (.*?)$' , line)
      if(res){
        const type   = this.get_type(res[2])
        const indent_number = this.get_indent_number(res[1])
        // const group  = `${type}-${indent_number}`
        this.list_groups.push({
          num    : i,
          type   : type,
          indent_string : res[1],
          indent_number : indent_number,
          group  : group,
          string : res[3],
          res    : res,
        })
      }
      // group切り替え
      else if(line === ''){
        group++
      }
      // li内追加
      else{

      }
    }
    console.log(this.list_groups)
  }

  static set_list_groups(){
    if(!this.list_groups.length){return}
    // let prev_line_number = 0
    for(const list_group of this.list_groups){
    
      this.lines[list_group.num] = '<ul>'+'<li>'+list_group.string+'</li>'+'</ul>'

      // prev_line_number = list_group.num
    }
    // for(let i=0; i<this.list_groups.length; i++){
      
    //   if(i === 0){
    //     let html = '<li>'+this.list_groups.string+'</li>'
    //     this.lines[this.list_groups[i].num] = '<ul>'+html+'</ul>'
    //   }

    //   prev_line_number = this.list_groups[i].num
    // }
  }

  static get_type(str){
    switch(str){
      case '-':
      case '+':
      case '*':
        return 'list'
    }
  }
  static get_indent_number(str){
    if(!str){
      return 0
    }
    str = str.replace(/  /g , '\t')
    return str.split('\t').length
  }

  static set_ul(text){
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

  static set_li(text){
    const lines = text.split("\n")
    let ul_flg = false
    let li_flg = false
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


/*

- 1
2
- 3
- 4

<ul>
  <li>1
2</li>
  <li>3</li>
  <li>4</li>
</ul>

*/
