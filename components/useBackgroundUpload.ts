import { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";

interface BackgroundUploadProps {
  url: string;
  filePath: string;
  useToken?: boolean;
  body?: unknown | unknown[];
  onSuccess?: (res?: FileSystem.FileSystemUploadResult) => void;
  onError?: (arg?: unknown) => void;
  options?: FileSystem.FileSystemUploadOptions;
}

const useBackgroundUpload = () => {
  const [error, setError] = useState<unknown | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (error != null) {
    }
  }, [error]);

  const uploadFile = async ({
    url,
    filePath,
    onSuccess,
    onError,
    options,
  }: BackgroundUploadProps) => {
    const handleError = (arg: unknown) => {
      onError?.(arg);
      setError(arg);
    };

    let _headers: {
      [key: string]: string;
    } = {
      "Content-Type": "multipart/form-data",
    };

    _headers = { ..._headers, ...options?.headers };

    setUploading(true);
    const config: FileSystem.FileSystemUploadOptions = {
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
      httpMethod: "POST",
      ...options,
      headers: _headers,
    };
    console.log("Upload CONFIG:", config, filePath, url);
    try {
      const task = FileSystem.createUploadTask(
        url,
        filePath,
        config,
        (result) => {
          const { totalBytesSent, totalBytesExpectedToSend } = result;
          console.log(
            "UploadTask Progress:",
            `${((totalBytesSent / totalBytesExpectedToSend) * 100).toFixed(0)}%`
          );
        }
      );
      task
        .uploadAsync()
        .then((res) => {
          if (res != null && res?.status >= 200 && res?.status < 300) {
            onSuccess?.(res);
            // if (Platform.OS === "ios") {
            //   void FileSystem.deleteAsync(cacheFilePath);
            // }
          } else {
            handleError(res);
          }
        })
        .catch((err: Error) => {
          handleError(err);
        })
        .finally(() => {
          setUploading(false);
        });
    } catch (error) {
      handleError(error);
    }
  };

  return { uploading, uploadFile, error };
};

export default useBackgroundUpload;
