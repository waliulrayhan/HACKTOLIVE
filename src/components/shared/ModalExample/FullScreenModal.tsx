"use client";

import React, { useState } from "react";

export default function FullScreenModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 xl:p-7.5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-medium text-black dark:text-white">
            Full Screen Modal
          </h3>
        </div>
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
      >
        Open Fullscreen
      </button>

      {isOpen && (
        <div className="fixed left-0 top-0 z-999999 h-screen w-full overflow-y-auto bg-white px-4 py-5 dark:bg-boxdark">
          <div className="container mx-auto">
            <div className="flex items-center justify-between border-b border-stroke pb-5 dark:border-strokedark">
              <h3 className="text-xl font-bold text-black dark:text-white sm:text-2xl">
                Full Screen Modal
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-black hover:text-primary dark:text-white dark:hover:text-primary"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="py-10">
              <p className="mb-4">
                This is a full-screen modal that takes up the entire viewport.
              </p>
              <p className="mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded border border-primary bg-primary px-5 py-3 font-medium text-white transition hover:bg-opacity-90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
