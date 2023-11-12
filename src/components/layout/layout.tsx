import type { FC } from "react";
import React from "react";

const Layout: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-full flex-col">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <h1 className="text-4xl font-extrabold">
                  <span className="text-blue-500">pigeon</span>
                  <span className="text-slate-800">type</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="relative flex-grow py-10">
        <main className="absolute inset-0">
          <div className="mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-24">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
