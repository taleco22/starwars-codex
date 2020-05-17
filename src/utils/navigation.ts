export const togglePreviewAttribute = (btn: NodeListOf<HTMLButtonElement>) => {
  if (document.activeElement?.nextSibling) {
    btn.forEach((v) => {
      (v.nextSibling as HTMLButtonElement)?.removeAttribute("data-preview");
    });
    (document.activeElement.nextSibling as Element).setAttribute("data-preview", "true");
  }

  return document.activeElement?.nextSibling;
};

export const getNodeListOfButtons = () => {
  const btn = document.querySelectorAll("button");
  return btn;
};

export const updateActiveButtonOnKeyUp = (
  ev: { keyCode: number },
  btn: NodeListOf<HTMLButtonElement>,
  index: number,
  cb: Function
) => {
  if (ev.keyCode === 38 && index > 0) {
    index--;
    btn[index].focus();
  } else if (ev.keyCode === 40 && index < btn.length - 1) {
    index++;
    btn[index].focus();
  } else {
    return index;
  }

  cb(btn);

  return index;
};

export const updateActiveButtonOnPoint = (
  ev: PointerEvent,
  btn: NodeListOf<HTMLButtonElement>,
  index: number,
  cb: Function,
  i?: number
) => {
  if (i) index = i;

  (ev.target as HTMLElement).focus();

  cb(btn);

  return index;
};

export const initNavigation = (): any => {
  let btn = getNodeListOfButtons();
  let index = 0;

  if (btn.length === 0) {
    return setTimeout(initNavigation, 200);
  }

  document.addEventListener("keyup", (ev) => {
    index = updateActiveButtonOnKeyUp(ev, btn, index, togglePreviewAttribute);
  });

  btn.forEach((a, i) => {
    a.addEventListener("pointerenter", (ev) => {
      index = updateActiveButtonOnPoint(ev, btn, index, togglePreviewAttribute, i);
    });

    a.addEventListener("pointerleave", (ev) => {
      index = updateActiveButtonOnPoint(ev, btn, index, togglePreviewAttribute);
    });
  });

  btn[0].focus();

  togglePreviewAttribute(btn);
};
