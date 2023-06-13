import { Urlinfo } from './lib/urlinfo.js'


export class SetCss{
  constructor(script_tag){
    if(!script_tag){return}
    const src  = script_tag.getAttribute('src')
    const urlinfo = new Urlinfo(src)
    const sp   = src.split('/')
    const path = sp.slice(0,-1).join('/')
    const link = document.createElement('link')
    const filename = urlinfo.filename.replace('.js' , '')
    link.rel   = 'stylesheet'
    link.href  = `${urlinfo.origin}/${urlinfo.href}/markdown.css`
    script_tag.parentNode.insertBefore(link , script_tag)
  }

}