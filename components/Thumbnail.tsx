import { cn, getFileIcon } from "@/lib/utils";
import Image from "next/image";

const Thumbnail = ({
  type,
  extension,
  url = "",
  imageClassName,
  className,
}: ThumbnailProps) => {
  const isImage = type === "image" && extension !== "svg";
  return (
    <figure
      className={cn(
        "flex items-center justify-center size-[50px] min-w-[50px] overflow-hidden rounded-full bg-brand/10",
        className
      )}
    >
      <Image
        src={isImage ? url : getFileIcon(extension, type)}
        alt="thumbnail"
        width={100}
        height={100}
        className={cn(
          "size-8 object-contain",
          imageClassName,
          isImage && "size-full object-cover rounded-full"
        )}
      />
    </figure>
  );
};
export default Thumbnail;
