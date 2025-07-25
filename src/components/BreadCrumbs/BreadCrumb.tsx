"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  productName?: string;
};

const labelMap: Record<string, string> = {
  acccount: "Account",
  "create-account": "Create Account",
  "forgot-password": "Forgot Password",
  "contact-us": "Contact Us",
  login: "Login",
  market: "Market",
  aboutus: "About Us",
};

const Breadcrumb = ({ productName }: Props) => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const visibleSegments = segments.filter(
    (segment) =>
      !(
        segments[0] === "acccount" &&
        [
          "login",
          "create-account",
          "forgot-password",
          "reset-password",
          "send-otp",
        ].includes(segment)
      )
  );

  return (
    <nav
      className="text-sm text-gray-600 font-normal mb-4 ml-20 pt-5"
      aria-label="Breadcrumb"
    >
      <ul className="flex items-center flex-wrap">
        {/* Home Link First */}
        <li className="flex items-center">
          <Link
            href="/"
            className="text-[#969696] text-[14px] font-dm-sans tracking-[0.03em] hover:underline"
          >
            Home
          </Link>
          {visibleSegments.length > 0 && <span className="mx-3">/</span>}
        </li>

        {/* Other Segments */}
        {visibleSegments.map((segment, index) => {
          const isLast = index === visibleSegments.length - 1;
          const href =
            "/" + segments.slice(0, segments.indexOf(segment) + 1).join("/");

          const label =
            isLast && productName
              ? productName
              : labelMap[segment] ||
                segment
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase());

          return (
            <li key={href} className="flex items-center">
              {!isLast ? (
                <>
                  <Link
                    href={href}
                    className="text-[#969696] text-[14px] font-dm-sans tracking-[0.03em] hover:underline capitalize"
                  >
                    {label}
                  </Link>
                  <span className="mx-1">/</span>
                </>
              ) : (
                <span className="text-[#88B04B] text-[14px] font-dm-sans tracking-[0.03em] capitalize">
                  {label}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
