import React from "react";
import renderer from "react-test-renderer";
import { IPlanets } from "../types";
import Planets from "./Planets";

describe("Planets.tsx", () => {
  it("render Planets component with correct data", () => {
    const results: IPlanets = {
      climate: "Arid",
      created: "2014-12-09T13:50:49.641000Z",
      diameter: "10465",
      edited: "2014-12-15T13:48:16.167217Z",
      films: ["https://swapi.dev/api/films/1/"],
      gravity: "1",
      name: "Tatooine",
      orbital_period: "304",
      population: "120000",
      residents: ["https://swapi.dev/api/people/1/"],
      rotation_period: "23",
      surface_water: "1",
      terrain: "Dessert",
      url: "https://swapi.dev/api/planets/1/",
    };
    const component = renderer.create(<Planets results={[results]} />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});