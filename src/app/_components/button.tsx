import { ButtonHTMLAttributes } from "react";

export default function Button({
  children,
  props,
}: {
  children?: React.ReactNode;
  props?: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
}) {
  return (
    <button
      className="rounded-sm bg-black/10 p-2 font-semibold hover:bg-black/20"
      {...props}
    >
      {children}
    </button>
  );
}
