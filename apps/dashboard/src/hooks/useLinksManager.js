import { useDispatch, useSelector } from "react-redux";
import {
  addPlatformLink,
  removePlatformLink,

  addCustomLink,
  removeCustomLink,
} from "@/app/stores/slices/profileSlice";

export const useLinksManager = () => {
  const dispatch = useDispatch();

  const platformLinks = useSelector((s) => s.profile.platformLinks || []);
  const customLinks = useSelector((s) => s.profile.customLinks || []);

  return {
    platformLinks,
    customLinks,

    addPlatformLink: (link) => dispatch(addPlatformLink(link)),
    deletePlatformLink: (id) => dispatch(removePlatformLink(id)),

    addCustomLink: (link) => dispatch(addCustomLink(link)),
    deleteCustomLink: (id) => dispatch(removeCustomLink(id)),
  };
};
