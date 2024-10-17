import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div>
      <h1>Welcome to AI Response Refiner</h1>
      <p>Please sign in to continue.</p>
    </div>
  );
}
