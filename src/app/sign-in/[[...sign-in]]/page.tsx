import { SignIn } from '@clerk/nextjs';

/** Page rendered at /sign-in/[[...sign-in]]. */
export default function SignInPage() {
  return <SignIn />;
}
