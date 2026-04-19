import SendRecoveryCodeForm from "@/components/SendRecoveryCodeForm";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Card,
} from "@/components/ui/card";
import Link from "next/link";

const PasswordRecoveryPage = () => {
  return (
    <div className="relative flex h-auto n items-center justify-center overflow-x-hidden p-4 sm:px-6 lg:px-8">
      <Card className="z-1 w-full border-none shadow-md sm:max-w-lg">
        <CardHeader className="gap-6">
          <div>
            <CardTitle className="mb-1.5 text-2xl">Reset Password</CardTitle>
            <CardDescription className="text-base">
              Insert your email, read the code and reset password
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <SendRecoveryCodeForm />
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
      </Card>
    </div>
  );
};

export default PasswordRecoveryPage;
