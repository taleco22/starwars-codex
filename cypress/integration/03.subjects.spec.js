import { goDown, goUp, hasFocus } from "../fixtures/helpers"

context("Subjects Page", () => {
  before(() => {
    cy.visit("/categories/planets")
  })

  it("Changes focused button", () => {
    hasFocus("Tatooine").next().children().should("have.length", 7)
    cy.wait(100)
    goDown()
    hasFocus("Alderaan")
      .next()
      .children()
      .first()
      .next()
      .next()
      .should("have.text", "terrain: grasslands, mountains")
    goDown()
    goDown()
    hasFocus("Hoth")
    goUp()
    hasFocus("Yavin IV")
  })
})
