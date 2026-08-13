import { createPortal } from "react-dom";
import Loader from "@/store/utils/Loader";

/**
 * Full-screen Loader rendered to <body> so it stays viewport-fixed even when an
 * ancestor has a CSS `filter` (the auth form animation blurs its wrapper, which
 * would otherwise make `position: fixed` resolve against that wrapper).
 */
export default function PortalLoader() {
  return createPortal(<Loader />, document.body);
}
