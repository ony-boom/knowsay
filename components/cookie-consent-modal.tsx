import React from "react";
import CookieConsent, {
  Cookies,
  getCookieConsentValue,
} from "react-cookie-consent";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { Button } from "./ui/button";

/**
 * CookieConsentModal component displays a cookie consent banner
 * that allows users to accept or decline cookies.
 * The consent preference is stored for 365 days.
 */
export const CookieConsentModal = () => {
  const handleDecline = () => {
    Cookies.remove("cookie-consent");
  };

  const containerStyle = {
    background: "var(--background)",
    color: "hsl(var(--foreground))",
    border: "2px solid hsl(var(--muted))",
    borderRadius: "var(--radius)",
    maxWidth: "28rem",
    boxShadow: "var(--shadow-lg)",
    position: "fixed" as const,
    padding: "1.5rem",
    zIndex: 50,
    left: "1rem",
    marginBottom: "1rem",
  };

  const buttonStyle = {
    backgroundColor: "hsl(var(--primary))",
    color: "hsl(var(--primary-foreground))",
    fontSize: "0.875rem",
    fontWeight: 500,
    borderRadius: "var(--radius)",
    padding: "0.25rem 0.75rem",
  };

  const declineButtonStyle = {
    backgroundColor: "transparent",
    color: "hsl(var(--foreground))",
    fontSize: "0.875rem",
    fontWeight: 500,
    border: "1px solid hsl(var(--border))",
    borderRadius: "var(--radius)",
    padding: "0.25rem 0.75rem",
    marginRight: "0.5rem",
  };

  if (getCookieConsentValue("cookie-consent") === "true") {
    return null; // Consent already given, do not show the modal
  }

  return (
    <CookieConsent
      buttonText="Accept All"
      declineButtonText="Decline"
      enableDeclineButton
      cookieName="cookie-consent"
      style={containerStyle}
      buttonStyle={buttonStyle}
      declineButtonStyle={declineButtonStyle}
      expires={365}
      onDecline={handleDecline}
      overlay={false}
      ButtonComponent={({
        onClick,
        className,
        style,
        children,
      }: {
        onClick: React.MouseEventHandler<HTMLButtonElement>;
        className?: string;
        style?: React.CSSProperties;
        children: React.ReactNode;
      }) => (
        <Button
          onClick={onClick}
          className={className}
          style={style}
          variant={children === "Accept All" ? "default" : "outline"}
          size="sm"
        >
          {children}
        </Button>
      )}
    >
      <div className="absolute -top-3 right-3">
        <div className="bg-primary rounded-full p-2">
          <Cookie className="text-primary-foreground h-5 w-5" />
        </div>
      </div>
      <h3 className="mb-2 text-lg font-semibold">Cookie Policy</h3>
      <p className="text-muted-foreground text-sm">
        We use cookies to enhance your browsing experience, serve personalized
        ads, and analyze our traffic. By clicking &quot;Accept All&quot;, you
        consent to our use of cookies as described in our{" "}
        <Link href="/privacy-policy" className="text-primary underline">
          Cookie Policy
        </Link>
        .
      </p>
    </CookieConsent>
  );
};
