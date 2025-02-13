import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      cover: image(),
      coverAlt: z.string(),
      repo: z.string(),
      site: z.string(),
      stack: z.array(z.string()),
    }),

  loader: glob({
    base: "src/content/projects",
    pattern: "**/*.json",
  }),
});

export const collections = {
  projects,
};
