import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: ["/api/logs", "/log/:id", "/", "/policy"]
})

export const config = {

    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],

};