import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import store from "store2";

const secret = process.env.JWT_TOKEN_SECRET || "";
const ERROR_PATH = "/404";

async function verify(token: string, secret: string): Promise<any> {
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
  console.log("payload.exp", payload.exp);
  return payload;
}

const isTokenExpired = (tokenDate: number) => {
  return tokenDate < Date.now();
};

export default async function middleware(
  request: NextRequest,
  response: NextResponse
) {
  const token = request.headers.get("authorization");
  const { nextUrl } = request;
  if (nextUrl.pathname === "/" || nextUrl.pathname.includes("/_next/static")) {
    return NextResponse.next()
  } else if (
    !token &&
    (!store || !store.get("token")) &&
    nextUrl.pathname !== "/"
  ) {
    nextUrl.pathname = ERROR_PATH;
    return NextResponse.rewrite(nextUrl);
  } else {
    if (
      token &&
      ["/create-task", "/update-contact"].includes(nextUrl.pathname)
    ) {
      try {
        await verify(token, secret);
        store.set("token", token);
        return NextResponse.next();
      } catch (e) {
        console.error("Error validating token", e);
        nextUrl.pathname = ERROR_PATH;
        nextUrl.pathname = "/success-screen";
        return NextResponse.rewrite(nextUrl);
      }
    } else if (
      store.get("token") &&
      ["/save-task"].includes(nextUrl.pathname)
    ) {
      const storedToken = store.get("token");
      const { exp } = await verify(storedToken, secret);
      if (isTokenExpired(exp)) {
        nextUrl.pathname = ERROR_PATH;
        return NextResponse.rewrite(nextUrl);
      }
      nextUrl.pathname = "/success-screen";
      store.remove("token");
      return NextResponse.rewrite(nextUrl);
    }
    console.error(`Error url path didn't matched`);
    nextUrl.pathname = ERROR_PATH;
    return NextResponse.rewrite(nextUrl);
  }
}
