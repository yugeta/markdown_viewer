import { Temp }    from './convert/temp.js'

import { Table }   from './convert/table.js'
import { Quote }   from './convert/quote.js'
import { H1 }      from './convert/h1.js'
import { Pre }     from './convert/pre.js'
import { List }    from './convert/list.js'

import { Br }      from './convert/br.js'
import { Head }    from './convert/head.js'
import { Em }      from './convert/em.js'
import { Img }     from './convert/img.js'
import { Link }    from './convert/link.js'
import { Horizon } from './convert/horizon.js'

export class Convert{
  constructor(text){
    const lines = text.split('\n')
    const temps = Temp.search(lines)

    for(var i=0; i<lines.length; i++){
      lines[i] = Br.tag(lines[i])
      lines[i] = Head.tag(lines[i])
      lines[i] = Em.tag(lines[i]) // emphasis
      lines[i] = Img.tag(lines[i] , temps)
      lines[i] = Link.tag(lines[i])
      lines[i] = Horizon.tag(lines[i])
    }
    text = lines.join('\n')
    text = List.tag(text)
    text = Pre.tag(text)
    text = H1.tag(text)
    text = Quote.tag(text)
    text = Table.tag(text)
    this.text = text
  }

  static md_match(exp , text){
    const reg = RegExp(exp , 's')
    return text.match(reg)
  }  

  static urlinfo(uri){
    const urls_hash  = uri.split("#")
    const urls_query = urls_hash[0].split("?")
		const sp   = urls_query[0].split("/")
		const data = {
      uri      : uri,
		  url      : sp.join("/"),
      dir      : sp.slice(0 , sp.length-1).join("/") +"/",
      file     : sp.pop(),
		  domain   : sp[2] ? sp[2] : "",
      protocol : sp[0] ? sp[0].replace(":","") : "",
      hash     : (urls_hash[1]) ? urls_hash[1] : "",
		  query    : (urls_query[1])?(function(urls_query){
				var data = {};
				var sp   = urls_query.split("#")[0].split("&")
				for(var i=0;i<sp .length;i++){
					var kv = sp[i].split("=")
					if(!kv[0]){continue}
					data[kv[0]]=kv[1]
				}
				return data;
			})(urls_query[1]):[]
		}
		return data
  }
}


