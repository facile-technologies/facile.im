import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  authInputClass,
  authBtnClass,
  authEyeClass,
  authHeadingClass,
  authMutedClass,
  authLinkClass,
} from "../shared/authStyles";
import { EyeIcon, EyeOffIcon } from "../shared/authIcons";
import PortalLoader from "../shared/PortalLoader";
import { validateForm, validatePassword } from "@/store/utils/validation";
import { showToast } from "@/store/utils/toast";
import { checkUsername, signup } from "@/services/auth";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getTeamMemberByInviteId } from "@/services/teams";
import TeamInviteModal from "../shared/TeamInviteModal";

export default function SignupPage() {
  const initialData = {
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [loadingUsername, setLoadingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const [validation, setValidation] = useState({});
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordConditions, setPasswordConditions] = useState({});
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [loadingInvitedMember, setLoadingInvitedMember] = useState(false);
  const [lockInvitedFields, setLockInvitedFields] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const invitedMemberId =
    searchParams.get("member_id") ||
    searchParams.get("memberId") ||
    searchParams.get("id");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (lockInvitedFields && (name === "name" || name === "email")) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!invitedMemberId) return;
    if (invitedMemberId) {
      setShowInviteModal(true);
    }

    let isMounted = true;

    const fetchInvitedMember = async () => {
      try {
        setLoadingInvitedMember(true);
        const res = await getTeamMemberByInviteId(invitedMemberId);
        const member = res?.data?.data || {};
        const invitedName = member?.full_name || "";
        const invitedEmail = member?.email || "";

        if (!isMounted) return;

        setFormData((prev) => ({
          ...prev,
          name: invitedName,
          email: invitedEmail,
        }));
        setLockInvitedFields(Boolean(invitedName || invitedEmail));
      } catch (err) {
        if (!isMounted) return;
        showToast(
          "error",
          err?.response?.data?.message ||
            "Failed to load invited member details.",
        );
      } finally {
        if (isMounted) {
          setLoadingInvitedMember(false);
        }
      }
    };

    fetchInvitedMember();

    return () => {
      isMounted = false;
    };
  }, [invitedMemberId]);

  useEffect(() => {
    if (!formData.username.trim()) {
      setIsUsernameAvailable(null);
      return;
    }
    const delay = setTimeout(async () => {
      try {
        setLoadingUsername(true);
        const res = await checkUsername(formData.username);

        const data = res.data;
        setIsUsernameAvailable(data.status);
      } catch {
        setIsUsernameAvailable(false);
      } finally {
        setLoadingUsername(false);
      }
    }, 800);

    return () => clearTimeout(delay);
  }, [formData.username]);
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, password: value }));
    const { conditions } = validatePassword(value);
    setPasswordConditions(conditions);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Existing form validation
    const validater = {
      name: { required: true, label: "Full name" },
      username: { required: true, label: "Username" },
      email: { required: true, type: "email", label: "Email" },
      password: { required: true, type: "Password" },
    };

    const validationError = validateForm(formData, validater);
    setValidation(validationError);

    if (Object.keys(validationError).length > 0) {
      showToast("error", "Please fill in all required fields correctly!");
      setLoading(false);
      return;
    }

    // Check password match
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatchError("Passwords do not match!");
      showToast("error", "Passwords do not match!");
      setLoading(false);
      return;
    }

    // NEW: Validate password strength
    const { isValid, conditions } = validatePassword(formData.password);
    if (!isValid) {
      showToast("error", "Password does not meet the required criteria!");
      setPasswordConditions(conditions); // Update UI to show red crosses
      setLoading(false);
      return;
    }

    // Check username availability
    if (isUsernameAvailable === false) {
      showToast("error", "This username is already taken!");
      setLoading(false);
      return;
    }

    // Optional: Wait for username check to complete
    if (formData.username.trim() && isUsernameAvailable === null) {
      showToast("error", "Please wait for username availability check!");
      setLoading(false);
      return;
    }

    // Check policy agreement
    if (!agreePolicy) {
      showToast("error", "You must agree to the Privacy Policy and Terms!");
      setLoading(false);
      return;
    }

    // Proceed with signup
    try {
      const res = await signup({
        full_name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        is_team_member: Boolean(invitedMemberId),
      });

      showToast(
        "success",
        res?.data?.message || "Account created successfully!",
      );

      navigate("/verify-otp", { state: { email: formData.email } });
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Something went wrong. Try again.";
      showToast("error", msg);
    } finally {
      setLoading(false);
    }
  };

  if (invitedMemberId) {
    localStorage.setItem("inviteId", invitedMemberId);
  }

  return (
    <>
      {(loading || loadingInvitedMember) && <PortalLoader />}
      <div className="mb-6">
        <h1 className={authHeadingClass}>Create your free account</h1>
        <p className={`mt-3 ${authMutedClass}`}>
          Already using facile?{" "}
          <Link to="/login" className={authLinkClass}>
            Log in
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Full Name <span className="text-[#FF676B]">*</span>
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              readOnly={lockInvitedFields}
              className={`${authInputClass} ${lockInvitedFields ? "cursor-not-allowed opacity-70" : ""}`}
            />
            {validation.name && (
              <p className="text-[#FF676B] text-xs">{validation.name}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Username <span className="text-[#FF676B]">*</span>
            </label>
            <Input
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={authInputClass}
            />
            {loadingUsername && (
              <p className="text-sm text-neutral-400">Checking availability...</p>
            )}
            {isUsernameAvailable && (
              <p className="flex gap-1 text-sm text-green-500">
                <img src="/check.svg" />
                Username available
              </p>
            )}
            {isUsernameAvailable === false && (
              <p className="flex gap-1 text-sm text-[#FF676B]">
                <img src="/cross.svg" />
                Username not available
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Email <span className="text-[#FF676B]">*</span>
            </label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              readOnly={lockInvitedFields}
              className={`${authInputClass} ${lockInvitedFields ? "cursor-not-allowed opacity-70" : ""}`}
            />
            {validation.email && (
              <p className="text-[#FF676B] text-xs">{validation.email}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Password <span className="text-[#FF676B]">*</span>
            </label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handlePasswordChange}
                className={`${authInputClass} pr-11`}
              />
              <span onClick={() => setShowPassword(!showPassword)} className={authEyeClass}>
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </span>
            </div>

            {formData.password && (
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
            <label className="text-sm font-medium">
              Confirm Password <span className="text-[#FF676B]">*</span>
            </label>
            <div className="relative">
              <Input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`${authInputClass} pr-11`}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={authEyeClass}
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </span>
            </div>
            {passwordMatchError && (
              <p className="mt-1 text-xs text-[#FF676B]">{passwordMatchError}</p>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={agreePolicy}
              onChange={(e) => setAgreePolicy(e.target.checked)}
              className="h-5 w-5 scale-90 accent-[#4f7cff]"
            />
            <span className="leading-none">
              Agree to{" "}
              <a href="#" className={authLinkClass}>
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="#" className={authLinkClass}>
                Terms &amp; Conditions
              </a>
            </span>
          </label>

          <button type="submit" disabled={loading} className={`${authBtnClass} mt-1`}>
            {loading ? "Creating account..." : "Continue"}
          </button>
        </form>

      <TeamInviteModal
        isOpen={showInviteModal}
        onOpenChange={setShowInviteModal}
      />
    </>
  );
}

export const ConditionItem = ({ valid, text }) => (
  <div className="flex items-start gap-2">
    <div className={`mt-1 ${valid ? "text-green-500" : "text-red-500"}`}>
      {valid ? <img src="/check.svg" alt="" /> : <img src="/cross.svg" alt="" />}
    </div>
    <p className={`${valid ? "text-green-500" : "text-red-400"} text-sm`}>
      {text}
    </p>
  </div>
);
