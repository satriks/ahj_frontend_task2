import FormImage from './Images/Image'

export default class ImageControl {
  constructor () {
    this.form = document.querySelector('.image-form')
    this.inputName = document.querySelector('.image-form__name input')
    this.inputUrl = document.querySelector('.image-form__url input')
    this.imagePlace = document.querySelector('.images')
    this.fileArea = document.querySelector('.image-form')
    this.inputFile = document.querySelector('.input-file')
    this.addButton = document.querySelector('.addImage')

    this.form.addEventListener('submit', this.onSubmit)
    this.imagePlace.addEventListener('click', this.onClose)
    this.fileArea.addEventListener('click', this.onClick)
    this.inputFile.addEventListener('change', this.onFile)
    this.fileArea.addEventListener('dragover', (event) => { event.preventDefault() })
    this.fileArea.addEventListener('drop', this.onDrop)
    this.server = 'http://192.168.31.18:7070'
    this.images = []
  }

  drawDom = () => {
    fetch('http://192.168.31.18:7070?method=getimages')
      .then(resp => resp.json())
      .then(res => {
        this.images.forEach(el => el.remove())
        this.images = []
        res.forEach(el => {
          const image = new FormImage(this.server + '/' + el)
          this.images.push(image)
          image.img.addEventListener('error', this.errorImage)

          this.imagePlace.insertAdjacentElement('beforeend', image.url)
        })
      })
  }

  onSubmit = (event) => {
    event.preventDefault()

    const image = new FormImage(this.inputUrl.value)
    this.images.push(image)
    image.img.addEventListener('error', this.errorImage)

    this.imagePlace.insertAdjacentElement('beforeend', image.url)
    this.form.reset()
  }

  errorImage = (event) => {
    document.querySelector('.error-url').classList.remove('hidden')
    setTimeout(() => {
      document.querySelector('.error-url').classList.add('hidden')
    }, 2000)
    event.target.closest('.image-wrapper').remove()
  }

  onClose = (event) => {
    if (event.target.classList.contains('close')) {
      const src = event.target.closest('.image-wrapper').querySelector('img').src
      const image = this.images.find(el => el.src === src)
      event.target.closest('.image-wrapper').remove()
      fetch(`${this.server}?method=removeimage&name=${image.name}`, { method: 'POST' })
    }
  }

  onClick = (event) => {
    this.inputFile.dispatchEvent(new MouseEvent('click'))
  }

  onFile = (event) => {
    const file = this.inputFile.files && this.inputFile.files[0]
    this.renderFile(file)
  }

  onDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files && event.dataTransfer.files[0]
    this.renderFile(file)
  }

  renderFile = (file) => {
    const data = new FormData()
    data.append('file', file)

    fetch('http://192.168.31.18:7070?method=addimage', { method: 'POST', body: data })
    const url = URL.createObjectURL(file)
    this.inputUrl.value = url
    this.addButton.dispatchEvent(new MouseEvent('click'))
    setTimeout(() => { URL.revokeObjectURL(url) }, 1000)
  }
}
