export default class FormImage {
  constructor (url) {
    this.src = url
    this.img = document.createElement('img')
    this.img.src = this.src

    const name = url.split('/')
    this.name = name[name.length - 1]
    console.log(this.name, 'this name')
  }

  get url () {
    const imageWrapper = document.createElement('div')
    imageWrapper.classList.add('image-wrapper')
    this.img.classList.add('image')
    const close = document.createElement('div')
    close.classList.add('close')
    close.innerText = '×'

    imageWrapper.appendChild(this.img)
    imageWrapper.appendChild(close)

    return imageWrapper
  }
}
