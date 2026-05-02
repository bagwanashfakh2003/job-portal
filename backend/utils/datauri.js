import path from "path";

const getDataUri = (file) => {
  if (!file || !file.buffer) return null;

  const ext = path.extname(file.originalname || "");
  const mime = file.mimetype || "application/octet-stream";

  return {
    content: `data:${mime};base64,${file.buffer.toString("base64")}`,
    extension: ext,
  };
};

export default getDataUri;