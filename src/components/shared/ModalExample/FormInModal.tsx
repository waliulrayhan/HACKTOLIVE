"use client";

import React, { useState } from "react";

export default function FormInModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 xl:p-7.5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-medium text-black dark:text-white">
            Form in Modal
          </h3>
        </div>
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
      >
        Open Form Modal
      </button>

      {isOpen && (
        <div className="fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5">
          <div className="w-full max-w-142.5 rounded-lg bg-white px-8 py-12 dark:bg-boxdark md:px-17.5 md:py-15">
            <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
              Contact Form
            </h3>
            <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
            
            <form className="space-y-4">
              <div>
                <label className="mb-2.5 block text-black dark:text-white">Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-2.5 block text-black dark:text-white">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-2.5 block text-black dark:text-white">Message</label>
                <textarea
                  rows={4}
                  placeholder="Type your message"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                ></textarea>
              </div>
              <div className="-mx-3 flex flex-wrap gap-y-4">
                <div className="w-full px-3 2xsm:w-1/2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
                  >
                    Cancel
                  </button>
                </div>
                <div className="w-full px-3 2xsm:w-1/2">
                  <button
                    type="submit"
                    className="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
