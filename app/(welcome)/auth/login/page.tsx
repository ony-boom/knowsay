

import { SignIn } from "@clerk/nextjs";

export default function LoginPreview() {

  return (
    <div className="flex h-full min-h-[50vh] w-full flex-col items-center justify-center px-4">
      <SignIn signUpForceRedirectUrl={"/home"} routing="hash"/>
    </div>
  );
}
