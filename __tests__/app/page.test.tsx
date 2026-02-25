import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HomePage from "@/app/(main)/page";

describe("Home", () => {
  it("renders the main content", () => {
    render(<HomePage />);
    expect(screen.getByText(/What it do/i)).toBeInTheDocument();
    expect(screen.getByText(/\( ghost \)/)).toBeInTheDocument();
  });

  it("links to messages and calendar", () => {
    render(<HomePage />);
    const messagesLink = screen
      .getAllByRole("link", { name: /Messages/i })
      .find((el) => el.getAttribute("href") === "/messages");
    const calendarLink = screen
      .getAllByRole("link", { name: /Calendrier/i })
      .find((el) => el.getAttribute("href") === "/calendar");
    expect(messagesLink).toBeDefined();
    expect(calendarLink).toBeDefined();
  });
});
