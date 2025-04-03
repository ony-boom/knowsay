"use client";
import Lottie from "lottie-react";
import loaderData from "./loader.json";

export default function Loader() {
  return <Lottie animationData={loaderData} loop />;
}
