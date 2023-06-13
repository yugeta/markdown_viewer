import { SetCss }  from './set_css.js'
import { Convert } from './convert.js'

export class Markdown{
  constructor(string){
    // this.set_css()
    new SetCss(this.my_script)
    
    if(string){
      this.text = new Convert(string).text
    }
    else{
      for(const elm of this.elms){
        const convert = new Convert(elm.innerHTML)
        elm.innerHTML = convert.text
      }
    }
  }

  get key(){
    return 'markdown'
  }

  get elms(){
    return document.querySelectorAll(`.${this.key}`)
  }

  get my_script(){
    return document.querySelector(`script#${this.key}`)
  }

  // set_css(){
  //   const my_script = this.my_script
  //   if(!my_script){return}
  //   const sp   = my_script.getAttribute('src').split('/')
  //   const path = sp.slice(0,-1).join('/')
  //   const link = document.createElement('link')
  //   link.rel   = 'stylesheet'
  //   link.href  = `${path}/${this.key}.css`
  //   my_script.parentNode.insertBefore(link , my_script)
  // }

}

