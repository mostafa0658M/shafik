import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const token = import.meta.env.VITE_SANITY_TOKEN;
export const client = createClient({
  projectId,
  dataset: "production",
  apiVersion: "2023-06-24",
  useCdn: true,
  token,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);
