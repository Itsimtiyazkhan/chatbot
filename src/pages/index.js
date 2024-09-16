import React, { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import ChatbotLayout from "@/components/layout/ChatbotLayout";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <ChatbotLayout />
    </>
  );
}
