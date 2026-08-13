import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authOtpClass, authBtnClass, authHeadingClass, authMutedClass } from "../shared/authStyles";
import PortalLoader from "../shared/PortalLoader";
import { resendOtp, verifyOtp } from "@/services/auth";
import { showToast } from "@/store/utils/toast";

export default function VerifyOtp() {
  const location = useLocation();
  const email = location?.state?.email || "";

  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(59);
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    let countdown;
    if (resendDisabled && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(countdown);
  }, [resendDisabled, timer]);

  const handleResendCode = async () => {
    setResendDisabled(true);
    setTimer(60);
    try {
      setLoading(true);
      await resendOtp({ email });
      showToast("success", "OTP resent successfully!");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showToast("error", "Failed to resend code!");
      setResendDisabled(false);
    }
  };
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").trim();
    if (!/^[0-9]{6}$/.test(paste)) return;

    const newOtp = paste.split("");
    setOtp(newOtp);
    const lastInput = document.getElementById("otp-5");
    lastInput?.focus();
  };

  const handleChangeOtp = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };
  const maskEmail = (email) => {
    if (!email || !email.includes("@")) return email;
    const [name, domain] = email.split("@");
    if (name.length <= 2) return `**@${domain}`;
    const visibleStart = name.slice(0, 2);
    const visibleEnd = name.slice(-1);
    const masked = `${visibleStart}${"*".repeat(
      name.length - 3,
    )}${visibleEnd}@${domain}`;
    return masked;
  };

  // verify otp
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      showToast("error", "Please enter the full 6-digit code!");
      return;
    }

    if (!email) {
      showToast("error", "Email missing! Please sign up again.");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtp({ email, otp: otpCode });
      const accessToken = res?.data?.access_token;
      console.log("token", res);

      localStorage.setItem("token", accessToken);

      showToast("success", "OTP verified successfully!");

      navigate("/home");
    } catch (error) {
      showToast("error", "Invalid or expired OTP!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <PortalLoader />}
      <form onSubmit={handleSubmit} className="flex w-full flex-col">
          <div className="mb-6">
            <h1 className={authHeadingClass}>Verify code</h1>
            <p className={`mt-3 ${authMutedClass}`}>
              We&apos;ve sent a 6-digit verification code to{" "}
              <span className="font-medium text-accent">{maskEmail(email)}</span>. Enter
              it below to continue.
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

          <button type="submit" disabled={loading} className={`${authBtnClass} mt-8`}>
            {loading ? "Verifying..." : "Verify"}
          </button>

          <div className="mt-6 flex flex-col items-center">
            <p className="text-lg font-medium tabular-nums">
              {`00:${timer.toString().padStart(2, "0")}`}
            </p>
            <p className={`mt-1 ${authMutedClass}`}>
              Didn&apos;t receive the code?
              <a
                onClick={!resendDisabled ? handleResendCode : null}
                className={`ml-1 ${
                  resendDisabled
                    ? "cursor-not-allowed text-neutral-400 dark:text-neutral-600"
                    : "cursor-pointer font-medium text-accent hover:underline"
                }`}
              >
                Resend
              </a>
            </p>
          </div>
        </form>
    </>
  );
}
