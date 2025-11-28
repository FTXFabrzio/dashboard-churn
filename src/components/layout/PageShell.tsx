import { PropsWithChildren } from "react";

const PageShell = ({ children }: PropsWithChildren) => {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
      <div className="flex flex-col gap-6">{children}</div>
    </main>
  );
};

export default PageShell;
