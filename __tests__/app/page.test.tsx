import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HomeView } from "@/features/home";

describe("Home", () => {
  it("affiche le titre Événements à venir", () => {
    render(<HomeView />);
    expect(screen.getByRole("heading", { name: /Événements à venir/i })).toBeInTheDocument();
  });

  it("affiche le sous-titre", () => {
    render(<HomeView />);
    expect(screen.getByText(/Ne manquez pas nos prochains rendez-vous/i)).toBeInTheDocument();
  });

  it("affiche la date", () => {
    render(<HomeView />);
    expect(screen.getByText(/15 juin 2025/)).toBeInTheDocument();
  });

  it("contient les CTA Contactez nous et Réservez un ticket", () => {
    render(<HomeView />);
    const contactLink = screen.getByRole("link", { name: /Contactez nous/i });
    const ticketLink = screen.getByRole("link", { name: /Réservez un ticket/i });
    expect(contactLink).toBeInTheDocument();
    expect(ticketLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute("href", "/messages");
    expect(ticketLink).toHaveAttribute("href", "/calendar");
  });
});
