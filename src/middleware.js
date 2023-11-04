import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: ["/api/logs", "/log/:id", "/", "/policy"],
    ignoredRoutes: ["/((?!api|trpc))(_next|.+\..+)(.*)", "/logs"]
})

export const config = {

    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],

};