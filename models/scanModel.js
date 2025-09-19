import { model, Schema } from "mongoose";

const scanSchema = new Schema(
  {
    qrCode: { type: Schema.Types.ObjectId, ref: "qrCode" },
    user: { type: Schema.Types.ObjectId, ref: "user" },

    location: { type: String },
    device: { type: String }, //Stores the device type that scanned the QR.
    browser: { type: String }, //Stores the browser used during the scan.
   
  },
  { timestamps: true }
);

const Scan = model('scan', scanSchema);

export default Scan;