import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  schema: z.object({
    title: z.string()
  }),
  loader: glob({
    base: "src/content/projects",
    pattern: "**.md"
  })
})

export const collections = {
  projects
}