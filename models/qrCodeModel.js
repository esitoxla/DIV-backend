import { model, Schema } from "mongoose";

const qrCodeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "user" },
  folder: { type: Schema.Types.ObjectId, ref: "folder" },
  name: { type: String, required: true },
  type: { type: String, enum: ["static", "dynamic"], required: true },
  destination: { type: String, required: true }, //actual destination of qr code, here it routes you to
  shortCode: { type: String }, // for dynamic redirects
  status: {
    type: String,
    enum: ["active", "paused", "expired"],
    default: "active",
  },

  design: {
    size: { type: Number, default: 300 },
    color: { type: String, default: "#000000" },
    bgColor: { type: String, default: "#ffffff" },
    logoUrl: { type: String },
    shape: { type: String },
  },

  file: {
    pngUrl: { type: String },
    svgUrl: { type: String },
    pdfUrl: { type: String },
  },

  rules: {
    expiryDate: { type: Date },
    maxScans: { type: Number },
  },

  scansTotal: { type: Number, default: 0 },
});

const QrCode = model('qrCode', qrCodeSchema);

export default QrCode;