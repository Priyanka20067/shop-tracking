// checked-1
import QRCode from "qrcode.react";

export const generateQRCode = (data) => {
  return <QRCode value={data} size={128} />;
};