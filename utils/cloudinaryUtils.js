// utils/cloudinaryUtils.js
exports.getCloudinaryPublicId = (imageUrl) => {
  if (!imageUrl) return null;

  const parts = imageUrl.split("/");
  const fileName = parts.pop();
  const folder = parts.slice(parts.indexOf("jamb_slips")).join("/");
  const publicId = folder.replace(/\.[^/.]+$/, "");

  return publicId;
};
