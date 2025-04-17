"use server";

import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";
import { appwriteConfig } from "./config";
import { cookies } from "next/headers";

export const createSessionClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointURL as string) // Your API Endpoint
    .setProject(appwriteConfig.projectID as string); // Your project ID

  const session = (await cookies()).get("appwrite-session");

  if (!session || !session.value) {
    return new Error("Session not found");
  }
  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
};

export const createAdminClient = async () => {
  if (!appwriteConfig.secretKey) {
    throw new Error("Secret key is missing");
  }
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointURL as string) // Your API Endpoint
    .setProject(appwriteConfig.projectID as string) // Your project ID
    .setKey(appwriteConfig.secretKey as string); // Your secret key

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatar() {
      return new Avatars(client);
    },
  };
};
