import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HomeView } from "@/features/home/components";

describe("Home", () => {
  it("affiche le titre avec le nom affiché", () => {
    render(<HomeView displayName="ghost" />);
    expect(screen.getByText(/What it do/i)).toBeInTheDocument();
    expect(screen.getByText(/\( ghost \)/)).toBeInTheDocument();
  });

  it("affiche le username quand fourni", () => {
    render(<HomeView displayName="alice" />);
    expect(screen.getByText(/\( alice \)/)).toBeInTheDocument();
  });

  it("contient les liens Messages et Calendrier", () => {
    render(<HomeView displayName="ghost" />);
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
