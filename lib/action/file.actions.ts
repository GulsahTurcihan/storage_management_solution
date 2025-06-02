"use server";

import { createAdminClient } from "../appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "../appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.actions";

export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps) => {
  const adminClient = await createAdminClient();

  if (!adminClient.success) {
    console.error(adminClient.error);
    return null;
  }

  const { storage, databases } = adminClient.data;

  const inputFile = InputFile.fromBuffer(file, file.name);
  const bucketFile = await storage.createFile(
    appwriteConfig.bucketID as string,
    ID.unique(),
    inputFile
  );

  const fileDocument = {
    type: getFileType(bucketFile.name).type,
    name: bucketFile.name,
    url: constructFileUrl(bucketFile.$id),
    extension: getFileType(bucketFile.name).extension,
    size: bucketFile.sizeOriginal,
    owner: ownerId,
    accountId,
    users: [],
    bucketFileId: bucketFile.$id,
  };

  const newFile = await databases
    .createDocument(
      appwriteConfig.databaseID as string,
      appwriteConfig.fileCollectionID as string,
      ID.unique(),
      fileDocument
    )
    .catch(async (error: unknown) => {
      await storage.deleteFile(
        appwriteConfig.bucketID as string,
        bucketFile.$id
      );
      console.log(error);
      return null;
    });
  revalidatePath(path);

  if (!newFile) return null;
  return parseStringify(newFile);
};

const createQueries = (currentUser: Models.Document, types: string[]) => {
  //Appwrite'dan gelen kullanıcı nesnesidir
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]), // belgenin "owner" alanı mevcut kullanıcının "id"sine eşitse eşleşir
      Query.contains("users", [currentUser.email]), // belgenin "users" adlı dizin alanı mevcut kullanıcının email'ini içeriyorsa eşlenir
    ]),
  ]; // Sonuç: Sadece kullanıcıya ait (ya doğrudan sahibi ya da kullanıcı listesinde yer alıyorsa) belgeleri çeker

  if (types.length > 0) queries.push(Query.equal("type", types));

  return queries;

  // TO DO: search, sort, limits
};

export const getFiles = async ({ types = [] }: GetFilesProps) => {
  const adminClient = await createAdminClient();

  if (!adminClient.success) {
    console.error(adminClient.error);
    return null;
  }

  const { databases } = adminClient.data;

  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("User not found");

  const queries = createQueries(currentUser, types); //createQueries fonksiyonu çağrılarak kullanıcıya özel sorgular hazırlanır.
  console.log({ currentUser, queries });

  const files = await databases.listDocuments(
    appwriteConfig.databaseID as string,
    appwriteConfig.fileCollectionID as string, //Appwrite veritabanındaki fileCollectionID koleksiyonundan sorguya uyan belgeleri çeker.
    queries
  );
  console.log(files);

  return parseStringify(files);
};

export const renameFile = async ({
  name,
  extension,
  fileId,
  path,
}: RenameFileProps): Promise<boolean> => {
  const adminClient = await createAdminClient();

  if (!adminClient.success) {
    console.error(adminClient.error);
    return false;
  }

  const { databases } = adminClient.data;

  const newName = `${name}.${extension}`;
  const updatedFile = await databases.updateDocument(
    appwriteConfig.databaseID as string,
    appwriteConfig.fileCollectionID as string,
    fileId,
    {
      name: newName,
    }
  );

  revalidatePath(path);
  parseStringify(updatedFile);

  return true;
};

export const updateFileUsers = async ({
  emails,
  fileId,
  path,
}: UpdateFileUsersProps): Promise<boolean> => {
  const adminClient = await createAdminClient();

  if (!adminClient.success) {
    console.error(adminClient.error);
    return false;
  }

  const { databases } = adminClient.data;

  const updatedFile = await databases.updateDocument(
    appwriteConfig.databaseID as string,
    appwriteConfig.fileCollectionID as string,
    fileId,
    {
      users: emails,
    }
  );

  revalidatePath(path);
  parseStringify(updatedFile);

  return true;
};

export const deleteFile = async ({
  bucketFileId,
  fileId,
  path,
}: DeleteFileProps): Promise<boolean> => {
  const adminClient = await createAdminClient();

  if (!adminClient.success) {
    console.error(adminClient.error);
    return false;
  }

  const { databases, storage } = adminClient.data;

  const deletedFile = await databases.deleteDocument(
    appwriteConfig.databaseID as string,
    appwriteConfig.fileCollectionID as string,
    fileId
  );

  if (deletedFile) {
    await storage.deleteFile(appwriteConfig.bucketID as string, bucketFileId);
  }

  revalidatePath(path);
  parseStringify(deletedFile);

  return true;
};
