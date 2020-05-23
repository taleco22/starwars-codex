import { Codex } from "../store/codex/types";

const API_URL = "https://swapi.dev/api";

async function swapi(path?: string): Promise<Codex | undefined> {
  if (!path) return;

  const response = await fetch(`${API_URL}/${path}`);
  const result = await response.json();
  return result;
}

const extractPathFromUrl = (url: string) => {
  const rgx = /(https?:\/\/\w+\.\w+\/api\/)/g;
  let extractedPath = url;
  if (rgx.test(url)) {
    extractedPath = url.replace(rgx, "");
  }
  return extractedPath;
};

export { swapi, extractPathFromUrl, API_URL };
