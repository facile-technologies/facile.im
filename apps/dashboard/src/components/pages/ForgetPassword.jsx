import { useState } from "react";
import { createPortal } from "react-dom";
import { Input } from "@/components/ui/input";
import {
  authInputClass,
  authOtpClass,
  authBtnClass,
  authEyeClass,
  authHeadingClass,
  authMutedClass,
  authLinkClass,
} from "../shared/authStyles";
import { EyeIcon, EyeOffIcon } from "../shared/authIcons";
import PortalLoader from "../shared/PortalLoader";
import PopupModal from "../shared/PopupModal";
import {
  forgotPassword,
  resetPassowrd,
  resetPasswordOtp,
} from "@/services/auth";
import { showToast } from "@/store/utils/toast";
import { Link, useLocation } from "react-router-dom";
import { ConditionItem } from "./SignUp";
import { validatePassword } from "@/store/utils/validation";

export default function Forgetpassword() {
  const [email, setEmail] = useState("");
  const [showCodeInputs, setShowCodeInputs] = useState(false);
  const [showResetFields, setShowResetFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const location = useLocation();
  const [passwordConditions, setPasswordConditions] = useState({});
  const registeredEmail = location?.state?.email || "";
  const [resetToken, setResetToken] = useState("");

  // Send OTP to email
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast("error", "Please enter your email!");
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPassword({ email });
      showToast("success", "OTP sent successfully!");
      setShowCodeInputs(true);
    } catch (error) {
      showToast("error", "User Not Found");
    } finally {
      setLoading(false);
    }
  };
  const maskEmail = (registeredEmail) => {
    if (!registeredEmail || !registeredEmail.includes("@"))
      return registeredEmail;
    const [name, domain] = registeredEmail.split("@");
    if (name.length <= 2) return `**@${domain}`;
    const visibleStart = name.slice(0, 2);
    const visibleEnd = name.slice(-1);
    const masked = `${visibleStart}${"*".repeat(
      name.length - 3,
    )}${visibleEnd}@${domain}`;
    return masked;
  };
  //Handle OTP change
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").trim();
    if (!/^[0-9]{6}$/.test(paste)) return;

    const newOtp = paste.split("");
    setOtp(newOtp);
    const lastInput = document.getElementById("otp-5");
    lastInput?.focus();
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };
  //Handle OTP verification
  const handleSubmitotp = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      showToast("error", "Please enter the full 6-digit code!");
      return;
    }
    try {
      setLoading(true);
      const res = await resetPasswordOtp({ email, otp: otpCode });

      if (res?.data?.status === true && res?.data?.data?.reset_token) {
        // Store the reset_token in state
        setResetToken(res.data.data.reset_token);
        showToast("success", "OTP verified successfully!");
        setShowResetFields(true);
      } else {
        showToast("error", "Failed to verify OTP.");
      }
    } catch (error) {
      showToast("error", "Invalid or expired OTP!");
    } finally {
      setLoading(false);
    }
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (!newPassword || !confirmPassword)
      return showToast("error", "Please fill both password fields!");

    try {
      setLoading(true);
      await resetPassowrd({
        reset_token: resetToken,
        new_password: newPassword,
      });
      showToast("success", "Password reset successfully!");
      setShowPopup(true);
    } catch (error) {
      showToast("error", error?.message || "Failed to reset password!");
    } finally {
      setLoading(false);
    }
  };
  const handleChangeOtp = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    // move next
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    const { conditions } = validatePassword(value);
    setNewPassword(value);
    setPasswordConditions(conditions);
  };

  return (
    <>
      {loading && <PortalLoader />}
      {createPortal(
        <PopupModal isOpen={showPopup} onClose={() => setShowPopup(false)} />,
        document.body,
      )}
      <>
        {!showCodeInputs && !showResetFields && (
          <>
            <div className="mb-6">
              <h1 className={authHeadingClass}>Forgot password</h1>
              <p className={`mt-3 ${authMutedClass}`}>
                Enter your email address and we&apos;ll send you a code to reset
                your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={authInputClass}
                />
              </div>
              <button type="submit" disabled={loading} className={authBtnClass}>
                {loading ? "Sending..." : "Send Code"}
              </button>
              <p className={`text-center ${authMutedClass}`}>
                Remembered it?{" "}
                <Link to="/login" className={authLinkClass}>
                  Log in
                </Link>
              </p>
            </form>
          </>
        )}

        {showCodeInputs && !showResetFields && (
          <>
            <div className="mb-6">
              <h1 className={authHeadingClass}>Verify code</h1>
              <p className={`mt-3 ${authMutedClass}`}>
                Enter the code we sent to{" "}
                <span className="font-medium text-accent">
                  {maskEmail(registeredEmail)}
                </span>{" "}
                to reset your password.
              </p>
            </div>

            <div className="flex w-full justify-between gap-2 sm:gap-3">
              {otp.map((value, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={value}
                  onChange={(e) => handleChangeOtp(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={index === 0 ? handlePaste : null}
                  className={authOtpClass}
                />
              ))}
            </div>

            <button
              onClick={handleSubmitotp}
              disabled={loading}
              className={`${authBtnClass} mt-8`}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </>
        )}

        {showResetFields && (
          <>
            <div className="mb-6">
              <h1 className={authHeadingClass}>Reset password</h1>
              <p className={`mt-3 ${authMutedClass}`}>
                Enter your new password below to reset your account.
              </p>
            </div>

            <form className="flex w-full flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">New Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => handlePasswordChange(e)}
                    className={`${authInputClass} pr-11`}
                  />
                  <span onClick={() => setShowPassword(!showPassword)} className={authEyeClass}>
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </span>
                </div>
                {newPassword && (
                  <div className="mt-2 space-y-1 text-sm">
                    <ConditionItem
                      valid={passwordConditions.length}
                      text="At least 8 characters"
                    />
                    <ConditionItem
                      valid={passwordConditions.uppercase}
                      text="At least one capital letter"
                    />
                    <ConditionItem
                      valid={passwordConditions.lowercase}
                      text="At least one small letter"
                    />
                    <ConditionItem
                      valid={passwordConditions.numberOrSymbol}
                      text="Contain a number or symbol"
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`${authInputClass} pr-11`}
                  />
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={authEyeClass}
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetPassword}
                disabled={loading}
                className={authBtnClass}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </>
    </>
  );
}
