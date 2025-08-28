import { NextRequest, NextResponse } from "next/server";

const ALLOWED_IPS =
  "2406:7400:98:67a8:f8a9:3943:7485:5385,::1,127.0.0.1,49.205.146.68";

export function middleware(req: NextRequest) {
  const allowedIps = ALLOWED_IPS.split(",");

  const xForwardedFor = req.headers.get("x-forwarded-for") || "";
  const clientIp =
    xForwardedFor.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  console.log("Request headers:", Object.fromEntries(req.headers.entries()));

  if (allowedIps.includes(clientIp)) {
    console.log("IP allowed: ", clientIp);
    return NextResponse.next();
  }

  // Block access for unauthorized IPs
  console.log("IP blocked: ", clientIp);
  return NextResponse.redirect(new URL("/no-access", req.url));
}

export const config = {
  matcher: ["/production", "/dashboard/production"],
  //   matcher: ["/", "/orders/:path*"],
};
