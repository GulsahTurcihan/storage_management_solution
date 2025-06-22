"use server";

import { createAdminClient, createSessionClient } from "../appwrite";
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

const createQueries = (
  currentUser: Models.Document,
  types: string[],
  searchText: string,
  sort: string,
  limit?: number
) => {
  //Appwrite'dan gelen kullanıcı nesnesidir
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]), // belgenin "owner" alanı mevcut kullanıcının "id"sine eşitse eşleşir
      Query.contains("users", [currentUser.email]), // belgenin "users" adlı dizin alanı mevcut kullanıcının email'ini içeriyorsa eşlenir
    ]),
  ]; // Sonuç: Sadece kullanıcıya ait (ya doğrudan sahibi ya da kullanıcı listesinde yer alıyorsa) belgeleri çeker

  if (types.length > 0) queries.push(Query.equal("type", types));
  if (searchText) queries.push(Query.contains("name", searchText));
  if (limit) queries.push(Query.limit(limit));
  if (sort) {
    const [sortBy, orderBy] = sort.split("-");
    queries.push(
      orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy)
    );
  }

  return queries;
};

export const getFiles = async ({
  types = [],
  searchText = "",
  sort = `$createdAt-desc`,
  limit,
}: GetFilesProps) => {
  const adminClient = await createAdminClient();

  if (!adminClient.success) {
    console.error(adminClient.error);
    return null;
  }

  const { databases } = adminClient.data;

  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("User not found");

  const queries = createQueries(currentUser, types, searchText, sort, limit); //createQueries fonksiyonu çağrılarak kullanıcıya özel sorgular hazırlanır.
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

// ============================== TOTAL FILE SPACE USED

export async function getTotalSpaceUsed() {
  const sessionClient = await createSessionClient();

  if (!sessionClient.success) {
    console.log(sessionClient.error);
    return false;
  }

  const { databases } = sessionClient.data;
  const currentUser = await getCurrentUser();

  const files = await databases.listDocuments(
    appwriteConfig.databaseID as string,
    appwriteConfig.fileCollectionID as string,
    [Query.equal("owner", [currentUser.$id])]
  );

  const totalSpace = {
    image: { size: 0, latestDate: "" },
    document: { size: 0, latestDate: "" },
    video: { size: 0, latestDate: "" },
    audio: { size: 0, latestDate: "" },
    other: { size: 0, latestDate: "" },
    used: 0,
    all: 2 * 1024 * 1024 * 1024 /* 2GB available bucket storage */,
  };

  files.documents.forEach((file) => {
    const fileType = file.type as FileType;
    totalSpace[fileType].size += file.size;
    totalSpace.used += file.size;

    if (
      !totalSpace[fileType].latestDate ||
      new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)
    ) {
      totalSpace[fileType].latestDate = file.$updatedAt;
    }
  });
  return parseStringify(totalSpace);
}
