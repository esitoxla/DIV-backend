import { model, Schema } from "mongoose";

const folderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Folder = model('folder', folderSchema);

export default Folder;
