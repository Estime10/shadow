import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Page from "@/app/page";

describe("Home", () => {
  it("renders the main content", () => {
    render(<Page />);
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByText(/What it do/i)).toBeInTheDocument();
    expect(screen.getByText(/\( ghost \)/)).toBeInTheDocument();
  });

  it("links to messages and calendar", () => {
    render(<Page />);
    const messagesLink = screen.getAllByRole("link", { name: /Messages/i }).find(
      (el) => el.getAttribute("href") === "/messages"
    );
    const calendarLink = screen.getAllByRole("link", { name: /Calendrier/i }).find(
      (el) => el.getAttribute("href") === "/calendar"
    );
    expect(messagesLink).toBeDefined();
    expect(calendarLink).toBeDefined();
  });
});
