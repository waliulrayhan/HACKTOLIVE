"use client";

import React, { useState } from "react";

export default function VerticallyCenteredModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 xl:p-7.5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-medium text-black dark:text-white">
            Vertically Centered Modal
          </h3>
        </div>
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
      >
        Open Modal
      </button>

      {isOpen && (
        <div className="fixed left-0 top-0 z-999999 flex h-screen w-full items-center justify-center bg-black/90 px-4 py-5">
          <div className="w-full max-w-142.5 rounded-lg bg-white px-8 py-12 text-center dark:bg-boxdark md:px-17.5 md:py-15">
            <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
              Vertically Centered
            </h3>
            <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
            <p className="mb-10">
              This modal is vertically centered on the screen.
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
