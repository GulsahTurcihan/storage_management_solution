"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// **CREATE ACCOUNT FLOW**
// 1. User enters email and full name
// 2. Check if the user already exist using the email which we will use this to identify if we still need to create a new user doc. or not
// 3. Send OTP to user's email
// 4. Verify the OTP and create user in the database
// 5. Create a new user document if the user is a new user
// 6. Return the user's accountId that will be used to complete the sign up process
// 7. Verify OTP and authenticate to login the user

/*const getUserByEmail2 = async (email: string) => {
  const { databases } = await createAdminClient();
  const result = await databases.listDocuments(
    appwriteConfig.databaseID as string,
    appwriteConfig.userCollectionID as string,
    [Query.equal("email", [email])]
  );

  return result.total > 0 ? result.documents[0] : null;
};*/

export const getUserByEmail = async (email: string) => {
  const adminClient = await createAdminClient();
  if (!adminClient.success) {
    console.error(adminClient.error);
    return null;
  }
  const { databases } = adminClient.data;

  const result = await databases.listDocuments(
    appwriteConfig.databaseID as string,
    appwriteConfig.userCollectionID as string,
    [Query.equal("email", [email])]
  );
  if (result.total > 0) {
    return parseStringify(result.documents[0]);
  }
  return null;
};

export const handleError = async (error: unknown, message: string) => {
  console.error(message, error);
  throw new Error(message);
};

/*export const sendEmailOTP2 = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send OTP to email");
  }
};*/

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const adminClient = await createAdminClient();

  if (!adminClient.success) {
    console.error(adminClient.error);
    return null;
  }

  const { account } = adminClient.data;
  const session = await account.createEmailToken(ID.unique(), email);
  if (!session) {
    throw new Error("Failed to send OTP to email");
  }
  return session.userId;
};

export const createAccount = async ({
  email,
  fullName,
}: {
  email: string;
  fullName: string;
}) => {
  const adminClient = await createAdminClient();

  if (!adminClient.success) {
    console.error(adminClient.error);
    return null;
  }

  const { databases } = adminClient.data;

  const existingUser = await getUserByEmail(email);
  const accountId = await sendEmailOTP({ email });
  if (!accountId) {
    throw new Error("Failed to send OTP to email");
  }
  if (!existingUser) {
    await databases.createDocument(
      appwriteConfig.databaseID as string, //where to create the document
      appwriteConfig.userCollectionID as string, //which collection to create the document
      ID.unique(), //document ID
      {
        email, //user email
        fullName, //user full name
        avatar:
          "https://img.freepik.com/premium-vector/cute-woman-avatar-profile-vector-illustration_1058532-14592.jpg",
        accountId, //user account ID
      }
    );
  }
  return parseStringify({ accountId });
};

/*export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  const existingUser = await getUserByEmail(email);

  const accountId = await sendEmailOTP({ email });
  if (!accountId) {
    throw new Error("Failed to send OTP to email");
  }
  if (!existingUser) {
    const { databases } = await createAdminClient();

    await databases.createDocument(
      appwriteConfig.databaseID as string, //where to create the document
      appwriteConfig.userCollectionID as string, //which collection to create the document
      ID.unique(), //document ID
      {
        email, //user email
        fullName, //user full name
        avatar:
          "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
        accountId, //user account ID
      }
    );
  }

  return parseStringify({ accountId });
};
*/

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  const adminClient = await createAdminClient();

  if (!adminClient.success) {
    console.error(adminClient.error);
    return null;
  }

  const { account } = adminClient.data;

  const session = await account.createSession(accountId, password);

  (await cookies()).set("appwrite-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  return parseStringify({ sessionId: session.$id });
};

/*export const getCurrentUser = async () => {
  try {
    const { databases, account } = await createSessionClient();

    const result = await account.get();

    const user = await databases.listDocuments(
      appwriteConfig.databaseID as string,
      appwriteConfig.userCollectionID as string,
      [Query.equal("accountId", result.$id)]
    );

    if (user.total <= 0) return null;

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};
*/

export const getCurrentUser = async () => {
  const sessionClient = await createSessionClient();

  console.log(sessionClient);

  if (!sessionClient.success) {
    console.error(sessionClient.error);
    return null;
  }

  const { account, databases } = sessionClient.data;

  const result = await account.get();

  console.log(result);

  const user = await databases.listDocuments(
    appwriteConfig.databaseID as string,
    appwriteConfig.userCollectionID as string,
    [Query.equal("accountId", result.$id)]
  );

  if (user.total <= 0) return null;

  return parseStringify(user.documents[0]);
};

export const signOutUser = async () => {
  const sessionClient = await createSessionClient();

  if (!sessionClient.success) {
    console.error(sessionClient.error);
    return null;
  }

  const { account } = sessionClient.data;

  await account.deleteSession("current");
  (await cookies()).delete("appwrite-session");
  return redirect("/sign-in");
};

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      await sendEmailOTP({ email });
      return parseStringify({ accountId: existingUser.accountId });
    }
    return parseStringify({ accountId: null, error: "user not found" });
  } catch (error) {
    console.error(error);
  }
};
