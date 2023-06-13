
export class Table{
  static tag(text){
    const lines = text.split("\n")
    let flg = false
    const newDatas = []
    let normals = []
    for(let i=0; i<lines.length; i++){
      if(lines[i].match(/^([ \t]*?)\|/)){
        normals.push(lines[i])
        flg = true
      }
      else if(flg !== false){
        if(normals.length === 1){
          newDatas.push(normals[0])
        }
        else if(normals.length >= 2 && normals[1].indexOf("-") == -1){
          newDatas.concat(normals)
        }
        else if(normals.length >= 2){
          const settings = Table.setting(normals[1])

          newDatas.push("<table>")

          // header
          newDatas.push(Table.cell(normals[0] , settings , "th"))

          // datas
          for(let j=2; j<normals.length; j++){
            if(!normals[j]){continue}
            newDatas.push(Table.cell(normals[j] , settings , "td"))
          }
          newDatas.push("</table>")
        }
        normals = []
        flg = false
      }
      else{
        newDatas.push(lines[i])
      }
    }
    return newDatas.join("\n")
  }

  static setting(line){
    const cells = line.split("|")
    const data = [cells[0]]

    for(let i=1; i<cells.length-1; i++){
      data[i] = (function(cell){
        switch(cell){
          case ":--"  : return "left"
          case "--:"  : return "right"
          case ":--:" : return "center"
          default     : return ""
        }
      })(cells[i])
    }
    return data
  }

  static cell(line,settings,tag){
    const cells = line.split("|")
    let data = ""
    for(let i=1; i<cells.length-1; i++){
      data += `<${tag} class='${settings[i]}'>${cells[i]}</${tag}>`
    }
    return "<tr>"+data+"</tr>"
  }
}