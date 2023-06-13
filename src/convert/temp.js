export class Temp{
  static search(lines){
    if(!lines || !lines.length){return}
    const arr = []
    for(const line of lines){
      const res = line.match(/\[(.+?)\]\:(.+?)( "(.*?)")*\)*$/)
      if(!res){continue}
      arr.push({
        key   : res[1],
        value : (res[2] || '').trim(),
        title : res[4] || ''
      })
    }
    return arr
  }
}