import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PwaRegister } from "@/components/PwaRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "ചായക്കട · Chayakada",
  description:
    "A roadside tea-stall radio for 80s & 90s Malayalam classics — glass player, live vinyl, YouTube-driven.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Chayakada",
  },
  icons: {
    apple: "/icons/icon-192.png",
  },
};

// viewportFit: "cover" lets the background bleed under the notch / home
// indicator; the fixed corners then reclaim space with env(safe-area-inset-*).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0b0d",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Intercept Page Visibility API + addEventListener before YouTube loads so YT never auto-pauses on minimize */}
        <script dangerouslySetInnerHTML={{__html: `(function(){var d=Object.getOwnPropertyDescriptor(Document.prototype,'visibilityState')||Object.getOwnPropertyDescriptor(document,'visibilityState');if(d&&d.get){window.__realVisState=d.get.bind(document);}try{Object.defineProperty(document,'visibilityState',{get:function(){return'visible';},configurable:true});Object.defineProperty(document,'hidden',{get:function(){return false;},configurable:true});}catch(e){}var orig=document.addEventListener.bind(document);document.addEventListener=function(type,fn,opts){if(type!=='visibilitychange')return orig(type,fn,opts);return orig('visibilitychange',function(e){if(window.__realVisState&&window.__realVisState()==='hidden')return;fn.call(this,e);},opts);};orig('visibilitychange',function(){document.dispatchEvent(new CustomEvent('__vischange',{detail:{hidden:!!(window.__realVisState&&window.__realVisState()==='hidden')}}));},true);})();`}} />
      </head>
      <body>
        <PwaRegister />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
