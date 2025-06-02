"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { cn, convertFileToUrl, getFileType, MAX_FILE_SIZE } from "@/lib/utils";
import Image from "next/image";
import uploadIcon from "@/public/assets/icons/upload.svg";
import Thumbnail from "./Thumbnail";
import loaderGif from "@/public/assets/icons/file-loader.gif";
import removeIcon from "@/public/assets/icons/remove.svg";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { uploadFile } from "@/lib/action/file.actions";

const FileUploader = ({ ownerId, accountId, className }: FileUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]); // Temporarily holds files that are being uploaded. setFiles: Adds new incoming files to the state.
  const path = usePathname();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);

      const uploadPromises = acceptedFiles.map(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prevFiles) =>
            prevFiles.filter((f) => f.name !== file.name)
          );

          return toast("File couldn't been uploaded", {
            description: (
              <p className="text-white text-[14px] leading-[20px] font-normal">
                <span className="font-semibold">{file.name}</span>is too large.
                Max file size is 50MB
              </p>
            ),
            className:
              "rounded-[10px] bg-red-600 p-4 text-white text-[14px] leading-[20px] font-normal",
            unstyled: true,
          });
        }

        return uploadFile({ file, ownerId, accountId, path }).then(
          (uploadFile) => {
            if (uploadFile) {
              setFiles((prevFiles) =>
                prevFiles.filter((f) => f.name !== file.name)
              );

              return toast.success("File uploaded successfully", {
                description: `${file.name}`,
                className:
                  "rounded-[10px] bg-green-400 p-4 text-white text-[14px] leading-[20px] font-normal",
                unstyled: true,
              });
            }
          }
        );
      });
      await Promise.all(uploadPromises);
    },
    [ownerId, accountId, path]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    fileName: string
  ) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button
        type="button"
        className={cn(
          "h-[52px] gap-2 px-10 shadow-drop-1 cursor-pointer bg-brand hover:bg-brand-100 transition-all rounded-full text-[14px] leading-[20px] font-medium",
          className
        )}
      >
        <Image src={uploadIcon} alt="upload-icon" width={24} height={24} />
        <p>Upload</p>
      </Button>

      {files.length > 0 && (
        <ul className="fixed bottom-0 right-10 z-50 flex size-full h-fit max-w-[480px] flex-col gap-3 rounded-[20px] bg-white p-7 shadow-drop-3">
          <h4 className="h4 text-light-100">Uploading</h4>
          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);
            return (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-3 rounded-xl p-3 shadow-drop-3"
              >
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />
                  <div className="subtitle-2 mb-2 line-clamp-1 max-w-[300px]">
                    {file.name}
                    <Image
                      src={loaderGif}
                      alt="loader-gif"
                      width={80}
                      height={26}
                      unoptimized
                    />
                  </div>
                </div>

                <Image
                  src={removeIcon}
                  alt="remove-icon"
                  width={24}
                  height={24}
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
export default FileUploader;
