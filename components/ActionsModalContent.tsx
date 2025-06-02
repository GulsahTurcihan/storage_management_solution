import { Models } from "node-appwrite";
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";
import { convertFileSize, formatDateTime } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";
import removeIcon from "@/public/assets/icons/remove.svg";

const ImageThumbnail = ({ file }: { file: Models.Document }) => {
  return (
    <div className="!mb-1 flex items-center gap-3 rounded-xl border border-light-200/40 bg-light-400/50 p-3">
      <Thumbnail type={file.type} extension={file.extension} url={file.url} />
      <div className="flex-col flex">
        <p className="text-[14px] leading-[20px] font-semibold mb-1">
          {file.name}
        </p>
        <FormattedDateTime
          date={file.$createdAt}
          className="text-[12px] leading-[16px] font-normal"
        />
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex">
    <p className="body-2 w-[30%] text-light-100 text-left">{label}</p>
    <p className="subtitle-2 flex-1 text-left">{value}</p>
  </div>
);

export const FileDetails = ({ file }: { file: Models.Document }) => {
  return (
    <>
      <ImageThumbnail file={file} />
      <div className="space-y-4 px-2 py-2">
        {" "}
        <DetailRow label="Format:" value={file.extension} />
        <DetailRow label="Size:" value={convertFileSize(file.size)} />
        <DetailRow label="Owner:" value={file.owner.fullName} />
        <DetailRow label="Last edit:" value={formatDateTime(file.$updatedAt)} />
      </div>
    </>
  );
};

interface Props {
  file: Models.Document;
  onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
  onRemove: (mail: string) => void; // void means nothing to return
}

export const ShareInput = ({ file, onInputChange, onRemove }: Props) => {
  return (
    <>
      <ImageThumbnail file={file} />
      <div className="!mt-2 space-y-2">
        <p className="subtitle-2 pl-1 text-light-100">
          Share file with other users
        </p>
        <Input
          type="email"
          placeholder="Enter email address"
          onChange={(e) => onInputChange(e.target.value.trim().split(","))}
          className="body-2 h-[52px] w-full rounded-full border px-4 shadow-drop-1 outline-none ring-offset-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
        />
        <div className="pt-4">
          <div className="flex justify-between">
            <p className="subtitle-2 text-light-100">Shared with</p>
            <p className="subtitle-2 text-light-200">
              {file.users.length} users
            </p>
          </div>

          <ul className="pt-2">
            {file.users.map((email: string) => (
              <li
                key={email}
                className="flex items-center justify-between gap-2"
              >
                <p className="subtitle-2">{email}</p>
                <Button
                  onClick={() => onRemove(email)}
                  className="bg-transparent rounded-full text-light-100 shadow-none hover:bg-transparent cursor-pointer"
                >
                  <Image
                    src={removeIcon}
                    alt="Remove"
                    width={24}
                    height={24}
                    className="aspect-square rounded-full "
                  />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
