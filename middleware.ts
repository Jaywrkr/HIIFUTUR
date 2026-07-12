import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/habits/:path*",
    "/wheel/:path*",
    "/modules/:path*",
    "/onboarding/:path*",
    "/leaderboard/:path*",
    "/cuenta/:path*",
    "/upgrade/:path*",
  ],
};
