import Folder from "../models/folderModel.js";
import User from "../models/auth.js";

export const fetchFolders = async (req, res, next) => {
  try {
    const search = req.query.search || "";

    const folders = await Folder.find(
      search ? { name: { $regex: search, $options: "i" } } : {}
    );

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
  const { id } = req.params; // folder ID
  
  try {
    //Get logged-in user
    const user = await User.findById(req.user._id);
    if (!user) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      return next(error);
    }

    const folder = await Folder.findByIdAndDelete(id);

    if (!folder) {
      const error = new Error("Qrcode not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Folder deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};