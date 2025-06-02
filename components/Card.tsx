import Link from "next/link";
import { Models } from "node-appwrite";
import Thumbnail from "./Thumbnail";
import ActionDropdown from "./ActionDropdown";
import { convertFileSize } from "@/lib/utils";
import FormattedDateTime from "./FormattedDateTime";

const Card = ({ file }: { file: Models.Document }) => {
  return (
    <Link
      href={file.url}
      target="_blank"
      className="flex cursor-pointer flex-col gap-6 p-5 rounded-[18px] bg-white shadow-sm transition-all hover:shadow-drop-3"
    >
      <div className="flex justify-between">
        <Thumbnail
          type={file.type}
          extension={file.extension}
          url={file.url}
          className="!size-20"
          imageClassName="!size-11"
        />
        <div className="flex flex-col items-end justify-between">
          <ActionDropdown file={file} />
          <p className="text-[16px] leading-[24px] font-normal">
            {convertFileSize(file.size)}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-light-100">
        <p className="text-[14px] leading-[20px] font-semibold line-clamp-1">
          {file.name}
        </p>
        <FormattedDateTime date={file.$createdAt} />
        <p className=" text-[12px] leading-[16px] font-normal line-clamp-1 text-light-200">
          By : {file.owner.fullName}
        </p>
      </div>
    </Link>
  );
};
export default Card;
