const scroll = {
  isEnd: false,
  start(callback) {
    let timer = null;
    callback && window.addEventListener('scroll', () => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        const scrollTop = document.documentElement.scrollTop
        const scrollheight = document.documentElement.scrollHeight
        const clientHeight = document.documentElement.clientHeight
        if (!this.isEnd && scrollheight == scrollTop + clientHeight) {
          window.scrollTo(0, scrollTop - 100)
          callback()
        }
      }, 300)
    })
  },
  end() {
    this.isEnd = true
  }
}
export default scroll;