// QR-based OTP service — generates random 6-digit OTP displayed as QR code on frontend
// In production, replace with Firebase/SMS gateway

const OTP_EXPIRY_MINUTES = 10;

const generateOTP = () => {
  // Generate a cryptographically random 6-digit number
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

const sendOTP = async (phoneNumber, otp) => {
  // Mock: just log it. Replace with actual SMS gateway call in production.
  console.log(`[OTP SERVICE] Sending OTP ${otp} to ${phoneNumber}`);
  return { success: true, message: 'OTP sent (mock)' };
};

const getOTPExpiry = () => {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + OTP_EXPIRY_MINUTES);
  return expiry;
};

module.exports = { generateOTP, sendOTP, getOTPExpiry };
