import React from 'react'
import { Converter } from 'showdown'
import emoji from 'emoji-dictionary'

class Markdown {
  constructor () {
    this.showdown = new Converter({
      openLinksInNewWindow: true,
      backslashEscapesHTMLTags: true
    })

    this.showdown.setFlavor('github')
  }

  title (title) {
    return this.emoji(title)
  }

  html (text) {
    text = this.emoji(text)
    text = this.removeEmTagInLink(text)

    return (
      <div className="mde-preview">
        <div
          className="mde-preview-content"
          dangerouslySetInnerHTML={{
            __html: this.showdown.makeHtml(text)
          }}
        />
      </div>
    )
  }

  emoji (text) {
    let emoticons = {
      ':)': ':slightly_smiling_face:',
      ':(': ':slightly_frowning_face:',
      // ':/': ':confused:', // This emoticon produces a bug when parsing an url (http://...)
      ':p': ':stuck_out_tongue:',
      ':P': ':stuck_out_tongue:',
      ':D': ':smiley:',
      ';)': ':wink:'
    }

    // Ascii emoticons to :emoji:
    text = Object.keys(emoticons).reduce((text, emoticon) => {
      return text.replace(emoticon, emoticons[emoticon])
    }, text)

    // :emoji: to unicode emojis
    return text.replace(/:\w+:/gi, name => emoji.getUnicode(name))
  }

  removeEmTagInLink (text) {
    text = text.replace(/\[(.*)\]\((.*)\)/g, (link, name, url) => {
      url = url.replace('<em>', '').replace('</em>', '')
      return `[${name}](${url})`
    })

    return text
  }
}

const markdown = new Markdown()

export default markdown