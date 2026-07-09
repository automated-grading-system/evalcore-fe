import { ApiClientError } from "@/lib/api/errors";

export async function uploadToPresignedUrl(
  uploadUrl: string,
  file: File,
): Promise<void> {
  const body = await file.arrayBuffer();

  let response: Response;

  try {
    response = await fetch(uploadUrl, {
      method: "PUT",
      body,
    });
  } catch (error) {
    throw new ApiClientError(
      "PRESIGNED_UPLOAD_NETWORK_ERROR",
      "Browser upload to storage failed. Please try again.",
      {
        cause: error instanceof Error ? error.message : String(error),
      },
    );
  }

  if (!response.ok) {
    const responseBody = await response.text().catch(() => "");

    throw new ApiClientError(
      "PRESIGNED_UPLOAD_FAILED",
      `Presigned upload failed (${response.status})${
        responseBody ? `: ${responseBody}` : ""
      }`,
      {
        responseBody,
      },
      response.status,
    );
  }
}
