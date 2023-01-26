import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import Slider from "./Slider";
import "@testing-library/jest-dom";

describe("Slider tests", () => {
  it("slider should be rendered", () => {
    render(<Slider />);
    const el = screen.getByText(/hello/i);

    expect(el).toBeTruthy();
  });
});
