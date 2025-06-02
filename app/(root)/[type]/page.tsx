import Card from "@/components/Card";
import Sort from "@/components/Sort";
import { getFiles } from "@/lib/action/file.actions";
import { getFileTypesParams } from "@/lib/utils";
import { Models } from "node-appwrite";

const page = async ({ params }: SearchParamProps) => {
  const type = ((await params)?.type as string) || "";

  const types = getFileTypesParams(type) as FileType[];
  const files = await getFiles({ types }); // const response = await fetch ("api", {cache: "no-store"}); const files: FileListResponse = await response.json()

  return (
    <div className="mx-auto flex w-ful max-w-7xl flex-col items-center gap-8">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>
        <div className="flex mt-2 flex-col justify-between sm:flex-row sm:items-center">
          <p className="text-[16px] leading-[24px] font-normal">
            Total: <span className="h5">0 MB</span>
          </p>

          <div className="mt-5 flex items-center sm:mt-0 sm:gap-3">
            <p className="text-[16px] leading-[24px] font-normal hidden sm:block text-light-200">
              Sort by
            </p>
            <Sort />
          </div>
        </div>
      </section>
      {/* Render the files */}

      {files.total > 0 ? (
        <section className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {files.documents.map((file: Models.Document) => (
            <Card key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        <p className="text-[16px] leading-[24px] font-normal mt-10 text-center text-light-200 ">
          No files uploaded
        </p>
      )}
      <div></div>
    </div>
  );
};
export default page;
