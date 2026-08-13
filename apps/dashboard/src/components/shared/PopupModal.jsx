import React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const PopupModal = ({ isOpen, onClose, children }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;
  const handleClose = () => {
    onClose();
    navigate("/login");
  };
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#2A2A2A] rounded-2xl p-6 w-full max-w-[677px] max-h-[490px] h-[490px] text-center shadow-lg ">
        <div className="flex flex-col items-center p-10 justify-center gap-2">
          <img
            src="https://picsum.photos/200/147"
            alt="inside-card"
            className="w-[262px] h-[188px] object-cover rounded-lg"
          />
          <h3 className="text-white text-xl font-medium text-center">
            Password Changed
          </h3>
          <p className="text-[#D2D2D2] text-[14px] font-regular leading-[1.2] tracking-[0.03em] text-center font-['SF_Pro_Display']">
            Your password has been changed successfully.
          </p>
        </div>
        <div className="mt-[20px]">
          <Button
            type="button"
            onClick={handleClose}
            className="w-full max-w-[336px] h-[51px] bg-accent text-[#FFFFFF] border-2 border-[#C6A3FF] text-[18px] font-medium rounded-[118px]"
          >
            Login Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
