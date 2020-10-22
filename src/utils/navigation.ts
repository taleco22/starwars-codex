export const playLightSaberOnKeyUp = () => {
  const audio: HTMLMediaElement | null = document.querySelector(
    "#lightsaberMove",
  )

  if (audio?.classList.contains("play")) {
    const isPlaying =
      audio.currentTime > 0 &&
      !audio.paused &&
      !audio.ended &&
      audio.readyState > 2

    if (!isPlaying) {
      return { audio }
    }
    audio.pause()
    audio.currentTime = 0
  }

  audio?.classList.add("play")
  audio?.play()
  audio?.addEventListener("ended", () => audio.classList.remove("play"))

  return { audio }
}

export const togglePreviewAttribute = (
  btn: NodeListOf<HTMLButtonElement>,
): ChildNode | null | undefined => {
  if (
    document.activeElement?.nextSibling &&
    document.activeElement?.previousSibling?.nodeName !== "BUTTON" &&
    document.activeElement?.nextSibling?.nodeName !== "BUTTON"
  ) {
    btn.forEach((v) => {
      ;(v.nextSibling as HTMLButtonElement)?.removeAttribute("data-preview")
    })
    ;(document.activeElement?.nextSibling as Element).setAttribute(
      "data-preview",
      "true",
    )
  }

  return document.activeElement?.nextSibling
}

export const getNodeListOfButtons = () => {
  const btn = document.querySelectorAll("button")
  return btn
}

export const updateActiveButtonOnKeyUp = (
  ev: { keyCode: number },
  btn: NodeListOf<HTMLButtonElement>,
  index: number,
  togglePreviewAttribute: (
    a: NodeListOf<HTMLButtonElement>,
  ) => ChildNode | null | undefined,
): number => {
  if (ev.keyCode === 38 && index > 0) {
    index -= 1
    btn[index].focus()
    playLightSaberOnKeyUp()
  } else if (ev.keyCode === 40 && index < btn.length - 1) {
    index += 1
    btn[index].focus()
    playLightSaberOnKeyUp()
  } else {
    return index
  }

  togglePreviewAttribute(btn)

  return index
}

export const updateActiveButtonOnPoint = (
  ev: PointerEvent,
  btn: NodeListOf<HTMLButtonElement>,
  index: number,
  togglePreviewAttribute: (
    a: NodeListOf<HTMLButtonElement>,
  ) => ChildNode | null | undefined,
  i?: number,
): number => {
  ;(ev.target as HTMLElement).focus()
  if (i !== undefined) {
    togglePreviewAttribute(btn)
    return i
  }

  return index
}

export const initNavigation = (
  btn: NodeListOf<HTMLButtonElement>,
  index: number,
): void => {
  btn[0].focus()
  togglePreviewAttribute(btn)
  let selected = index

  document.addEventListener("keyup", (ev) => {
    selected = updateActiveButtonOnKeyUp(
      ev,
      btn,
      selected,
      togglePreviewAttribute,
    )
  })

  btn.forEach((a, i) => {
    a.addEventListener("pointerenter", (ev) => {
      selected = updateActiveButtonOnPoint(
        ev,
        btn,
        selected,
        togglePreviewAttribute,
        i,
      )
    })

    a.addEventListener("pointerleave", (ev) => {
      selected = updateActiveButtonOnPoint(
        ev,
        btn,
        selected,
        togglePreviewAttribute,
        i,
      )
    })
  })
}

export const waitButtons = (): NodeJS.Timeout | undefined => {
  const btn = getNodeListOfButtons()
  const index = 0

  if (btn.length === 0) {
    return setTimeout(waitButtons, 200)
  }

  initNavigation(btn, index)
  return undefined
}
