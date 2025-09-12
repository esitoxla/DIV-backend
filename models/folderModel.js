import { model, Schema } from "mongoose";

const folderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    name: {type: String, required: true}
  },
}, 
{timestamps: true}
);

const Folder = model('folder', folderSchema);

export default Folder;
