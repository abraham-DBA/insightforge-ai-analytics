import { Scalekit } from "@scalekit-sdk/node";

const url = process.env.SCALEKIT_ENVIRONMENT_URL;
const clientId = process.env.SCALEKIT_CLIENT_ID;
const clientSecret = process.env.SCALEKIT_CLIENT_SECRET;

if (!url || !clientId || !clientSecret) {
  throw new Error("Missing required environment variables: SCALEKIT_ENVIRONMENT_URL, SCALEKIT_CLIENT_ID, SCALEKIT_CLIENT_SECRET");
}

const scalekit = new Scalekit(url, clientId, clientSecret);

export default scalekit;