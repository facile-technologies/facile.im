import { useState, useEffect } from "react";
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
import { login } from "@/services/auth";
import { showToast } from "@/store/utils/toast";
import SelectProfileLayout from "./SelectProfileLayout";
import { setuser } from "@/app/stores/slices/profileSlice";
import { useDispatch } from "react-redux";
import { acceptTeamInvitation } from "@/services/teams";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import TeamInviteModal from "../shared/TeamInviteModal";

export default function Login() {
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSelectProfile, setShowSelectProfile] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showInviteModal, setShowInviteModal] = useState(false);

  const invitedMemberId =
    searchParams.get("member_id") ||
    searchParams.get("memberId") ||
    searchParams.get("id");

  useEffect(() => {
    if (invitedMemberId) {
      setShowInviteModal(true);
      localStorage.setItem("inviteId", invitedMemberId);
    }
  }, [invitedMemberId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if email and password are provided
    if (!formData.emailOrUsername || !formData.password) {
      showToast("error", "Please fill in all fields!");
      setLoading(false);
      return;
    }

    try {
      // Attempt to log in the user
      const res = await login({
        email: formData.emailOrUsername,
        password: formData.password,
      });

      if (res.status === 200) {
        showToast("success", "Login successful!");

        const accessToken = res.data.data.access_token;

        localStorage.setItem("token", accessToken);
        const { username } = res.data.data.user;

        dispatch(setuser({ username }));
        // 🔥 Accept invitation AFTER login
        const inviteId = localStorage.getItem("inviteId");

        if (inviteId) {
          try {
            await acceptTeamInvitation(inviteId);
            localStorage.removeItem("inviteId");
          } catch (err) {
            console.log("Accept invitation failed:", err);
          }
        }

        navigate("/home");
      } else {
        showToast("error", res.data?.message || "Login failed!");
      }
    } catch (err) {
      console.log("Error Response:", err);
      showToast(
        "error",
        err.response?.data?.message || "Something went wrong!",
      );
    } finally {
      setLoading(false);
    }
  };

  if (showSelectProfile) {
    return <SelectProfileLayout />;
  }

  return (
    <>
      {loading && <PortalLoader />}
      <div className="mb-8">
        <h1 className={authHeadingClass}>Welcome back</h1>
        <p className={`mt-3 ${authMutedClass}`}>
          Don&apos;t have an account?{" "}
          <Link to="/signup" className={authLinkClass}>
            Sign up
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Email</label>
          <Input
            type="text"
            name="emailOrUsername"
            placeholder="you@example.com"
            value={formData.emailOrUsername}
            onChange={handleChange}
            className={authInputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className={`${authInputClass} pr-11`}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className={authEyeClass}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </span>
          </div>
          <div className="text-right text-sm">
            <Link
              to="/forgot-password"
              className="text-neutral-500 hover:text-neutral-800 hover:underline dark:text-neutral-400 dark:hover:text-neutral-200"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`${authBtnClass} mt-1`}
        >
          {loading ? "Logging in..." : "Continue"}
        </button>

        <p className="text-center text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
          By continuing you agree to our{" "}
          <a href="#" className="text-accent hover:underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="text-accent hover:underline">
            Privacy Policy
          </a>
        </p>
      </form>

      <TeamInviteModal
        isOpen={showInviteModal}
        onOpenChange={setShowInviteModal}
      />
    </>
  );
}
