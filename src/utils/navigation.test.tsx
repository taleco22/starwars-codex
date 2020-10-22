import "@testing-library/jest-dom"
import { fireEvent } from "@testing-library/react"
import { waitButtons } from "."
import "../setupTest"
import {
  getNodeListOfButtons,
  initNavigation,
  playLightSaberOnKeyUp,
  togglePreviewAttribute,
  updateActiveButtonOnKeyUp,
  updateActiveButtonOnPoint,
} from "./navigation"

describe("Utils", () => {
  describe("Navigation", () => {
    let mockPreview: jest.Mock<ChildNode, []>
    let list_of_buttons: NodeListOf<HTMLButtonElement>
    let up_arrow: { keyCode: number }
    let down_arrow: { keyCode: number }
    let event: PointerEvent

    beforeEach(() => {
      document.body.innerHTML =
        "<div><button id='b1'></button><hr id='0'/></div>" +
        "<div><button id='b2'></button><hr id='1'/></div>" +
        "<div><button id='b3'></button><hr id='2'/></div>" +
        "<div><button id='b4'></button><hr id='3' data-preview='true'/></div>"

      mockPreview = jest.fn(() =>
        togglePreviewAttribute(getNodeListOfButtons()),
      )
      list_of_buttons = getNodeListOfButtons()
      event = ({ target: list_of_buttons[0] } as unknown) as PointerEvent
      up_arrow = { keyCode: 40 }
      down_arrow = { keyCode: 38 }
    })

    describe("getNodeListOfButtons()", () => {
      it("get an array of 4 buttons", () => {
        expect(list_of_buttons).toHaveLength(4)
      })

      it("get 0 buttons", () => {
        document.body.innerHTML = "<div> </div>"
        expect(getNodeListOfButtons()).toHaveLength(0)
      })
    })

    describe("togglePreviewAttribute()", () => {
      it("return null in ausence of sibling", () => {
        document.body.innerHTML = "<div><button id='b1'></button></div"
        getNodeListOfButtons()[0].focus()
        expect(togglePreviewAttribute(getNodeListOfButtons())).toBeNull()
      })
      it("add property data-preview to focused element", () => {
        list_of_buttons[1].focus()
        expect(togglePreviewAttribute(list_of_buttons)).toEqual(
          list_of_buttons[1].nextSibling,
        )
      })

      it("remove property data-preview from unfocused element", () => {
        expect(list_of_buttons[3].nextSibling).toHaveAttribute(
          "data-preview",
          "true",
        )

        list_of_buttons[1].focus()
        togglePreviewAttribute(list_of_buttons)

        expect(list_of_buttons[3].nextSibling).not.toHaveAttribute(
          "data-preview",
          "true",
        )
      })
    })

    describe("updateActiveButtonOnKeyUp()", () => {
      describe("Unit tests", () => {
        it("not increment index if index === array.length", () => {
          const length = list_of_buttons.length
          expect(
            updateActiveButtonOnKeyUp(
              up_arrow,
              list_of_buttons,
              length,
              mockPreview,
            ),
          ).toEqual(length)
        })

        it("not increment index if index === array.length - 1", () => {
          const length = list_of_buttons.length
          expect(
            updateActiveButtonOnKeyUp(
              up_arrow,
              list_of_buttons,
              length - 1,
              mockPreview,
            ),
          ).toEqual(length - 1)
        })

        it("increment index if index < array.length - 1", () => {
          const length = list_of_buttons.length
          expect(
            updateActiveButtonOnKeyUp(
              up_arrow,
              list_of_buttons,
              length - 1 - 1,
              mockPreview,
            ),
          ).toEqual(length - 1)
        })

        it("not decrement index value if index === 0", () => {
          expect(
            updateActiveButtonOnKeyUp(
              down_arrow,
              list_of_buttons,
              0,
              mockPreview,
            ),
          ).toEqual(0)
        })

        it("decrement index if index > 0", () => {
          expect(
            updateActiveButtonOnKeyUp(
              down_arrow,
              list_of_buttons,
              1,
              mockPreview,
            ),
          ).toEqual(0)
        })
      })

      describe("Integration tests", () => {
        it("trigger togglePreviewAttribute()", () => {
          updateActiveButtonOnKeyUp(down_arrow, list_of_buttons, 1, mockPreview)

          expect(mockPreview).toBeCalled()
          expect(mockPreview.mock.calls.length).toEqual(1)

          updateActiveButtonOnKeyUp(down_arrow, list_of_buttons, 1, mockPreview)
          expect(mockPreview.mock.calls.length).toEqual(2)
        })

        it("return immediately", () => {
          expect(
            updateActiveButtonOnKeyUp(
              { keyCode: 10 },
              list_of_buttons,
              1,
              mockPreview,
            ),
          ).toEqual(1)

          expect(mockPreview).not.toBeCalled()
        })
      })
    })

    describe("updateActiveButtonOnPoint()", () => {
      describe("Unit tests", () => {
        it("not update index value", () => {
          expect(
            updateActiveButtonOnPoint(
              ({ target: list_of_buttons[0] } as unknown) as PointerEvent,
              list_of_buttons,
              0,
              mockPreview,
              0,
            ),
          ).toEqual(0)
        })

        it("update index value to equal i", () => {
          expect(
            updateActiveButtonOnPoint(
              ({ target: list_of_buttons[0] } as unknown) as PointerEvent,
              list_of_buttons,
              0,
              mockPreview,
              1,
            ),
          ).toEqual(1)
        })

        it("focus targeted button", () => {
          updateActiveButtonOnPoint(
            ({ target: list_of_buttons[0] } as unknown) as PointerEvent,
            list_of_buttons,
            0,
            mockPreview,
            1,
          )

          expect(document.activeElement).toEqual(list_of_buttons[0])
        })
      })

      describe("Integration tests", () => {
        it("trigger togglePreviewAttribute()", () => {
          updateActiveButtonOnPoint(event, list_of_buttons, 1, mockPreview, 2)

          expect(mockPreview).toBeCalled()
          expect(mockPreview.mock.calls.length).toEqual(1)

          updateActiveButtonOnPoint(event, list_of_buttons, 1, mockPreview, 3)
          expect(mockPreview.mock.calls.length).toEqual(2)
        })

        it("return immediately", () => {
          updateActiveButtonOnPoint(event, list_of_buttons, 1, mockPreview)

          expect(mockPreview).not.toBeCalled()
        })
      })
    })

    describe("waitButtons()", () => {
      it("return number with if 0 buttons", () => {
        document.body.innerHTML = ""
        expect(waitButtons()).not.toBeNaN()
      })

      it("return undefined if exists buttons", () => {
        expect(waitButtons()).toBeUndefined()
      })
    })

    describe("initNavigation()", () => {
      beforeEach(() => {
        initNavigation(getNodeListOfButtons(), 0)
      })

      it("apply focus in default button", () => {
        expect(document.activeElement).toEqual(list_of_buttons[0])
        expect(document.activeElement).not.toEqual(list_of_buttons[2])
      })

      it("returns initial value", () => {
        expect(list_of_buttons[0].nextSibling).toHaveAttribute(
          "data-preview",
          "true",
        )
        expect(list_of_buttons[0]).toHaveFocus()
      })

      it("on keyUp return selected value", () => {
        fireEvent.keyUp(document, { keyCode: 40 })
        expect(list_of_buttons[1].nextSibling).toHaveAttribute(
          "data-preview",
          "true",
        )
        expect(list_of_buttons[1]).toHaveFocus()
      })

      it("on pointerEnter return focused value", () => {
        fireEvent.pointerEnter(list_of_buttons[1], {
          target: list_of_buttons[1],
        })
        expect(list_of_buttons[1].nextSibling).toHaveAttribute(
          "data-preview",
          "true",
        )
        expect(list_of_buttons[1]).toHaveFocus()
      })

      it("on pointerLeave return last focused value", () => {
        fireEvent.pointerLeave(list_of_buttons[1], {
          target: list_of_buttons[1],
        })

        expect(list_of_buttons[1]).toHaveFocus()
      })
    })
  })

  describe("playLightsaberOnKeyUp()", () => {
    beforeAll(() => {
      document.body.innerHTML = `<div><audio id="lightsaberMove"></audio></div>`
    })

    it("play sound", () => {
      const { audio } = playLightSaberOnKeyUp()
      expect(audio).toHaveClass("play")
    })

    it("remove class on ended event", () => {
      const { audio } = playLightSaberOnKeyUp()

      audio && fireEvent.ended(audio)

      expect(audio).not.toHaveClass("play")
    })

    it("audio is null", () => {
      document.body.innerHTML = ""
      const { audio } = playLightSaberOnKeyUp()

      expect(audio).toBeNull()
    })
  })
})
