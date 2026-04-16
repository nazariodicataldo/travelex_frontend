import RegisterForm from "@/components/RegisterForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <div className="relative flex h-auto items-center justify-center overflow-x-hidden p-4 sm:px-6 lg:px-8">
      <Card className="z-1 w-full border-none shadow-md sm:max-w-lg">
        <CardHeader className="gap-6">
          <div>
            <CardTitle className="mb-1.5 text-2xl">
              Register to TravelEx
            </CardTitle>
            <CardDescription className="text-base">
              Share your travel experiences.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {/* Regster Form */}
          <div className="space-y-4">
            <RegisterForm />

            <p className="text-center text-muted-foreground">
              Already registered?{" "}
              <Link
                href="/login"
                className="text-card-foreground hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
