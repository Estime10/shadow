import type { Metadata } from "next";

type CreatePageMetadataParams = {
  title: string;
  description: string;
};

export function createPageMetadata({ title, description }: CreatePageMetadataParams): Metadata {
  return {
    title,
    description,
  };
}
