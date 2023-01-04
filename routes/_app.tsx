import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import Footer from "../components/Footer.tsx";

export default function App({ Component }: AppProps) {
  return (
    <>
      <Head>
        {/* 网站图标 */}
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* 描述、关键词、作者等 */}
        <meta name="description" content={Deno.env.get("SITE_DESCRIPTION")} />
        <meta name="keywords" content={Deno.env.get("SITE_KEYWORDS")} />
        <meta name="author" content={Deno.env.get("SITE_AUTHOR")} />
        <meta property="og:image" content={Deno.env.get("SITE_IMAGE")} />

        {/* 一些库 */}
        <link href={"https://cdn.jsdelivr.net/npm/daisyui@2.46.0/dist/full.css"} rel="stylesheet" type="text/css" />
        <script src={"https://cdn.jsdelivr.net/npm/theme-change@2.0.2/index.js"} />
        <link href={"https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.7.0/build/styles/default.min.css"}
          rel="stylesheet" />
        <script src={"https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.7.0/build/highlight.min.js"} />
        <script>hljs.highlightAll();</script>
      </Head>

      <Component />
      <Footer />

      {/* <div
        class="min-h-screen grid grid-cols-1"
        style="grid-template-rows: auto 1fr auto;"
      >
        <Component />
        <Footer />
      </div> */}
    </>
  )
}