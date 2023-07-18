import { Markdown } from './markdown.js'

export class File{
  constructor(filepath , selector){
    this.filepath = filepath
    this.selector = selector
    this.load()
  }
  load(){
    const xhr = new XMLHttpRequest()
    xhr.open('get' , this.filepath , true)
    xhr.setRequestHeader('Content-Type', 'text/html');
    xhr.onload = this.loaded.bind(this)
    xhr.send()
  }
  loaded(e){
    document.querySelector(this.selector).innerHTML = new Markdown(e.target.response).text
  }
}

