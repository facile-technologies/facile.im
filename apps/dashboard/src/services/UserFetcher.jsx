// src/components/auth/UserLoader.jsx
"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setProfileImage, setUser } from "@/app/stores/slices/userSlice";
import { getUserProfile } from "./user";

export default function UserLoader() {
  const dispatch = useDispatch();

  // useEffect(() => {


  //   const fetchUser = async () => {
  //     try {
  //       const res = await getUserProfile();
  //       const username = res.data.user.username;
  //       const profileImage = res.data.profile?.profile_image || null; // safer access

 

  //       dispatch(setUser(username));
  //       dispatch(setProfileImage(profileImage));
  //     } catch (err) {
  //       console.error("Failed to fetch user profile:", err);
  //       // Optionally: redirect to login if unauthorized
  //       // router.push("/login");
  //     }
  //   };

  //   fetchUser();
  // }, []); // ← EMPTY dependency array = run only once on mount

  return null;
}
