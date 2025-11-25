"use client";

import React, { useState } from "react";

export default function ModalBasedAlerts() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 xl:p-7.5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-medium text-black dark:text-white">
            Modal Based Alerts
          </h3>
        </div>
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-md bg-meta-1 px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
      >
        Show Alert
      </button>

      {isOpen && (
        <div className="fixed left-0 top-0 z-999999 flex h-screen w-full items-center justify-center bg-black/90 px-4 py-5">
          <div className="w-full max-w-142.5 rounded-lg bg-white px-8 py-12 text-center dark:bg-boxdark md:px-17.5 md:py-15">
            <div className="mx-auto mb-7.5 flex h-22.5 w-22.5 items-center justify-center rounded-full bg-meta-1">
              <svg
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
              Are you sure?
            </h3>
            <p className="mb-10">
              This action cannot be undone. Do you want to continue?
            </p>
            <div className="-mx-3 flex flex-wrap gap-y-4">
              <div className="w-full px-3 2xsm:w-1/2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
                >
                  Cancel
                </button>
              </div>
              <div className="w-full px-3 2xsm:w-1/2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="block w-full rounded border border-meta-1 bg-meta-1 p-3 text-center font-medium text-white transition hover:bg-opacity-90"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
