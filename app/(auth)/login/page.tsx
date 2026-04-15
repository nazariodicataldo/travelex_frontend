import LoginForm from "@/components/LoginForm";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";

const LoginPage = () => {
  return (
    <>
      <CardHeader className="gap-6 mx-auto">
        <div>
          <CardTitle className="mb-1.5 text-2xl">
            Login in to TravelEx
          </CardTitle>
          <CardDescription className="text-base">
            Share your travel experiences.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {/* Login Form */}
        <div className="space-y-4">
          <LoginForm />

          <p className="text-center text-muted-foreground">
            New on our platform?{" "}
            <Link
              href="/register"
              className="text-card-foreground hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </CardContent>
    </>
  );
};

export default LoginPage;
