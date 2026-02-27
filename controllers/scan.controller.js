export const scanQrCode = async (req, res) => {
  try {
    const { id } = req.params;
    const qr = await QrCode.findById(id);

    // 1️⃣ Check if QR exists
    if (!qr) {
      return res.status(404).send("❌ QR code not found.");
    }

    // 2️⃣ Check status — block inactive QRs
    if (qr.status === "inactive") {
      return res
        .status(403)
        .send("⚠️ This QR code has been deactivated by the owner.");
    }

    // 3️⃣ (Optional) Track scan analytics
    qr.scans = (qr.scans || 0) + 1;
    await qr.save();

    // 4️⃣ Handle different QR types
    switch (qr.qrType) {
      case "url":
        // Ensure valid URL before redirect
        if (
          qr.content.startsWith("http://") ||
          qr.content.startsWith("https://")
        ) {
          return res.redirect(qr.content);
        } else {
          return res.status(400).send("Invalid URL format in QR content.");
        }

      case "txt":
        return res.status(200).send(`📝 Text: ${qr.content}`);

      case "sms":
        return res
          .status(200)
          .send(`📱 SMS Info: ${qr.content} (open with a messaging app)`);

      case "wifi":
        return res.status(200).send(`📶 Wi-Fi Config: ${qr.content}`);

      case "vcard":
        res.setHeader("Content-Type", "text/vcard; charset=utf-8");
        return res.send(qr.content);

      default:
        return res.status(200).send(`QR Content: ${qr.content}`);
    }
  } catch (error) {
    console.error("❌ Error scanning QR:", error);
    res.status(500).send("Server error while processing QR scan.");
  }
};
