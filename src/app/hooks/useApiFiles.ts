import { apiUrl } from "@/libs/utils";

const useApiFiles = () => {
  const getImageFiles = (path: string) => {
    return `${apiUrl}images/${path}`;
  };
  const getFiles = (path: string) => {
    return `${apiUrl}files/${path}`;
  };

  return { getImageFiles, getFiles };
};

export { useApiFiles };
