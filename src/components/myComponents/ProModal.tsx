"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Modal from "react-modal";
import { Zap } from "lucide-react";
import CardsArray from "./dashboard/CardsArray";
import { useProModalStore } from "@/lib/useProModal";
import { API, fetcher } from "@/lib/fetcher";
const ProModal = ({ isPro = false }: { isPro?: boolean }) => {
  const { isOpen, closeModal, openModal } = useProModalStore();
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // Cleanup function to set isMounted to false when component unmounts
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Button
        variant={"gradient"}
        className="mt-4"
        onClick={() => {
          console.log("clicked");
          if (isMounted) openModal();
        }}
      >
        {isPro ? "You are pro" : "Upgrade to Genius"}{" "}
        <Zap className="w-4 h-4 fill-white ml-2" />
      </Button>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        overlayClassName="bg-[rgba(0,0,0,.4)] flex justify-center items-center fixed top-0 left-0 h-full w-screen "
        className=" bg-white rounded-xl p-8 relative text-center"
        appElement={window.document.getElementById("modal")!}
      >
        <h2 className="text-lg font-bold flex items-center justify-center">
          {isPro ? "You are pro" : "Upgrade to Genius"}
          <span className="uppercase text-white inline-block px-2 py-1 font-semibold bg-gradient-to-r from-pink-600 to-purple-400 text-xs ml-2 rounded-2xl">
            Pro
          </span>
        </h2>
        <CardsArray />
        <Button
          className="bg-black px-4 py-2 rounded-md text-white mt-4 inline-block"
          onClick={async () => {
            const res = await fetcher({
              url: API.PAY,
              method: "GET",
            });
            window.location.href = res.url;
          }}
        >
          {isPro ? "Manage Subscription" : "Pay Now"}
        </Button>
      </Modal>
    </>
  );
};

export default ProModal;
