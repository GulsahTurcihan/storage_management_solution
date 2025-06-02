import { cn, formatDateTime } from "@/lib/utils";

const FormattedDateTime = ({
  date,
  className,
}: {
  date: string;
  className?: string;
}) => {
  return (
    <p
      className={cn(
        "text-sm leading-[24px] font-normal text-light-200",
        className
      )}
    >
      {formatDateTime(date)}
    </p>
  );
};
export default FormattedDateTime;
