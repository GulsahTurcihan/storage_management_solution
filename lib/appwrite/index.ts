"use server";

import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";
import { appwriteConfig } from "./config";
import { cookies } from "next/headers";

type Result<T> = { success: true; data: T } | { success: false; error: Error };

export const createSessionClient = async (): Promise<
  Result<{ account: Account; databases: Databases }>
> => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointURL as string)
    .setProject(appwriteConfig.projectID as string);

  const session = (await cookies()).get("appwrite-session");

  if (!session || !session.value) {
    return { success: false, error: new Error("Session not found") };
  }

  client.setSession(session.value);

  return {
    success: true,
    data: {
      account: new Account(client),
      databases: new Databases(client),
    },
  };
};

/*export const createSessionClient = async () => {
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
};*/

export const createAdminClient = async (): Promise<
  Result<{
    account: Account;
    databases: Databases;
    storage: Storage;
    avatars: Avatars;
  }>
> => {
  if (!appwriteConfig.secretKey) {
    throw new Error("Secret key is missing");
  }
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointURL as string) // Your API Endpoint
    .setProject(appwriteConfig.projectID as string) // Your project ID
    .setKey(appwriteConfig.secretKey as string); // Your secret key

  return {
    success: true,
    data: {
      account: new Account(client),
      databases: new Databases(client),
      storage: new Storage(client),
      avatars: new Avatars(client),
    },
  };
};
