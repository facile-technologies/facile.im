import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resolveProfileTypeByCode } from "@/services/user";
import Loader from "@/store/utils/Loader";

/**
 * Handles the generic /:code route.
 * Calls the resolve API to get the profile type, then redirects:
 *   SOS        → /sos/:code  (SosPublicProfile)
 *   PET        → /pet/:code  (PetPublicProfile)
 *   PERSONAL / BUSINESS / STOREFRONT → stay on PublicProfileView (/:code treated as username)
 */
export default function CodeRouter() {
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!code) return;

    resolveProfileTypeByCode(code)
      .then((res) => {
        const profileType = (res.data?.profileType || "").toUpperCase();
        if (profileType === "SOS") {
          navigate(`/sos/${code}`, { replace: true });
        } else if (profileType === "PET") {
          navigate(`/pet/${code}`, { replace: true });
        } else {
          // Personal / Business / Storefront — PublicProfileView handles it
          navigate(`/u/${code}`, { replace: true });
        }
      })
      .catch(() => {
        // Fallback: treat as a username-based profile
        navigate(`/u/${code}`, { replace: true });
      });
  }, [code]);

  return <Loader />;
}
