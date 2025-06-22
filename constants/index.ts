const generateId = (() => {
  let counter = 0;
  return () => `id-${counter++}`;
})();

export const navItems = [
  {
    id: generateId(),
    name: "Dashboard",
    icon: "/assets/icons/dashboard.svg",
    url: "/",
  },
  {
    id: generateId(),
    name: "Documents",
    icon: "/assets/icons/documents.svg",
    url: "/documents",
  },
  {
    id: generateId(),
    name: "Images",
    icon: "/assets/icons/images.svg",
    url: "/images",
  },
  {
    id: generateId(),
    name: "Media",
    icon: "/assets/icons/video.svg",
    url: "/media",
  },
  {
    id: generateId(),
    name: "Others",
    icon: "/assets/icons/others.svg",
    url: "/others",
  },
];

export const actionsDropdownItems = [
  {
    id: generateId(),
    label: "Rename",
    icon: "/assets/icons/edit.svg",
    value: "rename",
  },
  {
    id: generateId(),
    label: "Details",
    icon: "/assets/icons/info.svg",
    value: "details",
  },
  {
    id: generateId(),
    label: "Share",
    icon: "/assets/icons/share.svg",
    value: "share",
  },
  {
    id: generateId(),
    label: "Download",
    icon: "/assets/icons/download.svg",
    value: "download",
  },
  {
    id: generateId(),
    label: "Delete",
    icon: "/assets/icons/delete.svg",
    value: "delete",
  },
];

export const sortTypes = [
  {
    label: "Date created (newest)",
    value: "$createdAt-desc",
  },
  {
    label: "Created Date (oldest)",
    value: "$createdAt-asc",
  },
  {
    label: "Name (A-Z)",
    value: "name-asc",
  },
  {
    label: "Name (Z-A)",
    value: "name-desc",
  },
  {
    label: "Size (Highest)",
    value: "size-desc",
  },
  {
    label: "Size (Lowest)",
    value: "size-asc",
  },
];

export const avatarPlaceholderUrl =
  "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg";

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
