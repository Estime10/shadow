import { describe, it, expect } from "vitest";
import { MAIN_PAGE_MAIN_CLASS, MESSAGES_PAGE_MAIN_CLASS } from "@/lib/config/pages";

describe("pages config", () => {
  it("MAIN_PAGE_MAIN_CLASS contient les classes attendues", () => {
    expect(MAIN_PAGE_MAIN_CLASS).toContain("max-w-[var(--content-max-w)]");
    expect(MAIN_PAGE_MAIN_CLASS).toContain("pt-3");
  });

  it("MESSAGES_PAGE_MAIN_CLASS contient les classes attendues", () => {
    expect(MESSAGES_PAGE_MAIN_CLASS).toContain("max-w-[var(--content-max-w)]");
    expect(MESSAGES_PAGE_MAIN_CLASS).toContain("px-0");
  });
});
