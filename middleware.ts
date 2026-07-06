import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/habits/:path*", "/wheel/:path*", "/modules/:path*", "/onboarding/:path*"],
};
