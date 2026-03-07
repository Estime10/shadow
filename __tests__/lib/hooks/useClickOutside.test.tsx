"use client";

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { useRef } from "react";
import { useClickOutside } from "@/lib/hooks/useClickOutside/useClickOutside";

function TestComponent({ isActive, onClose }: { isActive: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, isActive, onClose);
  return (
    <div>
      <div ref={ref} data-testid="inside">
        Inside
      </div>
      <button type="button" data-testid="outside">
        Outside
      </button>
    </div>
  );
}

describe("useClickOutside", () => {
  it("appelle onClose au clic en dehors quand isActive est true", () => {
    const onClose = vi.fn();
    render(<TestComponent isActive onClose={onClose} />);
    fireEvent.click(screen.getByTestId("outside"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("n'appelle pas onClose au clic à l'intérieur", () => {
    const onClose = vi.fn();
    render(<TestComponent isActive onClose={onClose} />);
    fireEvent.click(screen.getByTestId("inside"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("n'appelle pas onClose au clic en dehors quand isActive est false", () => {
    const onClose = vi.fn();
    render(<TestComponent isActive={false} onClose={onClose} />);
    fireEvent.click(screen.getByTestId("outside"));
    expect(onClose).not.toHaveBeenCalled();
  });
});
