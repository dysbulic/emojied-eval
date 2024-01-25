export class Drifter {
  elem
  start
  end
  initial
  height

  constructor(
    { parent, element, start, end, initial, height, content }:
    {
      parent: HTMLElement
      element?: HTMLElement
      start: number
      end: number
      initial: { x: number, y: number }
      height?: number
      content: string
    }
  ) {
    element ??= (() => {
      const newElem = document.createElement('span')
      newElem.classList.add('drifting')
      parent.appendChild(newElem)
      return newElem
    })()
    this.elem = element
    this.content = content
    this.opacity = '0'

    this.start = start ?? Number(element.dataset.start)
    if(isNaN(this.start)) {
      throw new Error(
        '`.drifting` must have a `data-start` time or '
        + '`Drifting` must have `{start}`.'
      )
    }

    this.end = end ?? Number(element.dataset.end ?? this.start + 2500)

    element.dataset.x ??= String(20 + Math.random() * 60)
    this.initial = {
      x: initial?.x ?? Number(element.dataset.x),
      y: initial?.y ?? Number(element.dataset.y ?? 0),
    }

    this.height = height ?? Number(element.dataset.height ?? 40)
  }

  set left(x: string) {
    this.elem.style.left = x
  }

  set top(y: string) {
    this.elem.style.top = y
  }

  set opacity(o: string | number) {
    this.elem.style.opacity = String(o)
  }

  set content(content: string) {
    this.elem.textContent = content
  }

  set time(t: number) {
    if(t >= this.start && t <= this.end) {
      const progress = (t - this.start) / (this.end - this.start)
      const x = `${this.initial.x + Math.cos(6 * Math.PI * progress)}%`
      this.left = x
      const y = `${-this.initial.y + 100 - (this.height * progress)}%`
      this.top = y
      this.opacity = 1 - progress
    } else {
      this.opacity = 0
    }
  }

  toString() {
    return (
      'Drifter('
      + `${this.start}–${this.end}, `
      + `<${this.initial.x}, ${this.initial.y}>, `
      + `${this.elem.textContent})`
    )
  }
}
