import Folder from "../models/folderModel.js";
import User from "../models/auth.js";
import QrCode from "../models/qrCodeModel.js";

export const fetchFolders = async (req, res, next) => {
  try {
    
    const folders = await Folder.find({ user: req.user._id }).populate("user")
    res.status(200).json({
      success: true,
      StatusCode: 200,
      folders,
      total: folders.length,
    });
  } catch (error) {
    next(error)
  }
};


export const addFolder = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
     const error = new Error("Folder name is required");
     error.statusCode = 400;
     return next(error);
    }

    const folder = await Folder.create({
      name,
      user: req.user._id, // always from the signed-in user
    });

    res.status(201).json({
      success: true,
      StatusCode: 201,
      message: "Folder created successfully",
      folder,
    });
  } catch (error) {
    next(error);
  }
};


export const deleteFolder = async (req, res, next) => {
  const { id } = req.params; // Folder ID

  try {
    // Verify logged-in user
    const user = await User.findById(req.user._id);
    if (!user) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      return next(error);
    }

    // Find and delete the folder
    const folder = await Folder.findByIdAndDelete(id);

    if (!folder) {
      const error = new Error("Folder not found");
      error.statusCode = 404;
      return next(error);
    }

    // Delete all QR codes linked to this folder
    await QrCode.deleteMany({ folderId: id });

    res.status(200).json({
      success: true,
      message: "Folder and associated QR codes deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};