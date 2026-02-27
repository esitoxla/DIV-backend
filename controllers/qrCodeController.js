import QrCode from "../models/qrCodeModel.js";
import cloudinary from "../config/cloudinary.js";
import User from "../models/auth.js";

export const createQrCode = async (req, res, next) => {
  try {
    const {
      folderId,
      name,
      qrType,
      content,
      fileFormat,
      size,
      imageBase64,
      status,
      scans,
    } = req.body;

    if (!folderId || !name || !qrType || !content || !fileFormat || !size) {
      const error = new Error("All fields required!");
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Upload image to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(imageBase64, {
      folder: "qr_codes",
      public_id: `${req.user._id}_${Date.now()}`,
      overwrite: true,
    });

    //imageBase64 → the actual image data (sent from frontend as base64 string)
    //Cloudinary uploads it and returns a response (uploadRes) that includes:
    // folder: "qr_codes" — groups all QR images into a folder in your Cloudinary dashboard.

    // public_id — a custom name for the file (includes the user’s ID and timestamp).
    //is like a unique character of the image you are saving on cloudinary, cloudinary gives a default public_id but you can specify how you want it to be saved, in my case i am saving it by combining two unique identifiers:

    // req.user._id → the user’s unique MongoDB ID.
    // Date.now() → the current timestamp in milliseconds.

    

    // overwrite: true — allows replacing the image if it already exists with the same name.
    //By default, Cloudinary doesn’t allow replacing an image with the same public_id.

    // If you try to upload another image using an existing public_id, it will create a new version instead.
    //so with this, the new upload will replace the old one with the same name.

    const qrCode = await QrCode.create({
      folderId: folderId,
      name,
      qrType,
      content,
      imageUrl: uploadRes.secure_url,
      fileFormat,
      size,
      status,
      scans,
      vendorId: req.user?._id
    });

    res.status(201).json({
      success: true,
      StatusCode: 201,
      message: "Qr code saved successful!",
      qrCode,
    });
  } catch (error) {
    next(error);
  }
};

export const getVendorsQrCode = async (req, res, next) => {
  try {
    const qrCodes = await QrCode.find({ vendorId: req.user._id })
      .populate("folderId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "QR codes fetched successfully!",
      qrCodes,
    });
  } catch (error) {
    next(error);
  }
};


// GET /api/qrcodes/vendor/:vendorId
// export const getVendorQRCodes = async (req, res, next) => {
//   try {
//     const { vendorId } = req.params;

//     if (!vendorId) {
//       const error = new Error("Vendor ID is required");
//       error.statusCode = 400;
//       return next(error);
//     }

//     const qrcodes = await QrCode.find({ vendorId })
//       .populate("folderId", "name") // just get folder name
//       .sort({ createdAt: -1 });

//     if (!qrcodes || qrcodes.length === 0) {
//       const error = new Error("No QR codes found for this vendor");
//       error.statusCode = 404;
//       return next(error);
//     }

//     res.status(200).json({
//       success: true,
//       count: qrcodes.length,
//       qrcodes,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// GET /api/qrcodes/folder/:folderId
export const getFolderQRCodes = async (req, res, next) => {
  try {
    const { folderId } = req.params;

    if (!folderId) {
      const error = new Error("Folder ID is required");
      error.statusCode = 400;
      return next(error);
    }

    const qrcodes = await QrCode.find({ folderId })
      .populate("vendorId", "firstName lastName businessName email")
      .sort({ createdAt: -1 });

    if (!qrcodes || qrcodes.length === 0) {
      const error = new Error("No QR codes found in this folder");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      count: qrcodes.length,
      qrcodes,
    });
  } catch (err) {
    next(err);
  }
};

export const updateQRCodeStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Ensure logged-in user exists
    const user = await User.findById(req.user._id);
    if (!user) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      return next(error);
    }

    // Find QR code
    const qr = await QrCode.findById(id);
    if (!qr) {
      const error = new Error("QR Code not found");
      error.statusCode = 404;
      return next(error);
    }

    

    // Toggle status
    qr.status = qr.status === "active" ? "inactive" : "active";
    await qr.save();

    res.status(200).json({
      success: true,
      message: `QR code ${
        qr.status === "active" ? "activated" : "deactivated"
      } successfully!`,
      qr,
    });
  } catch (err) {
    return next(err);
  }
};



export const deleteQrcode = async (req, res, next) => {
  const { id } = req.params; 

  try {
    // Get logged-in user
    const user = await User.findById(req.user._id);
    if (!user) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      return next(error);
    }

    const qrCode = await QrCode.findByIdAndDelete(id);

    if (!qrCode) {
      const error = new Error("Qrcode not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Qrcode deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};