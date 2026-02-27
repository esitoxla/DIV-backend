import { model, Schema } from "mongoose";

const qrCodeSchema = new Schema(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    folderId: { type: Schema.Types.ObjectId, ref: "folder", required: true }, // reference Folder
    name: { type: String, required: true },
    qrType: { type: String, required: true }, // url, wifi, sms, vcard
    content: { type: String, required: true }, // actual URL/text used
    imageUrl: { type: String, required: true }, // Cloudinary URL
    fileFormat: {type: String},
    size: {type: String},
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    scans: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const QrCode = model("qrCode", qrCodeSchema);

export default QrCode;
