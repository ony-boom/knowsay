
import { SignUp } from "@clerk/nextjs";


export default function RegisterWithUsername() {

  return (
    <div className="flex h-full min-h-[60vh] w-full items-center justify-center px-4">
      <SignUp routing="hash"/>
    </div>
  );
}
