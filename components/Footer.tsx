import IconBrandGithub from "https://deno.land/x/tabler_icons_tsx@0.0.2/tsx/brand-github.tsx"

export default function Footer() {
  return (
    <footer className="w-full pt-24 pb-8">
      <div className="px-4 mx-auto max-w-screen-md">
        {/* 版权信息 */}
        <div className="flex justify-center items-center">
          <span className="text-xl mr-1">&copy;</span> {new Date().getFullYear()} • <IconBrandGithub className="w-5 h-5 mx-1" />
          <a className="hover:text-underline" style={"text-underline-offset:4px"} href="https://github.com/xijaja/fresh-notion-blog">
            {Deno.env.get("SITE_AUTHOR")}
          </a>
        </div>

        {/* 备案信息，如果有才会被展示 */}
        {Deno.env.get("ICP") && (
          <a
            href="/"
            target="_blank"
            rel="noopener"
            className="text-center m-2 flex items-center justify-center text-sm text-gray-500 hover:text-underline"
            style={"text-underline-offset:4px"}
          >
            {Deno.env.get("ICP")}
          </a>
        )}
      </div>
    </footer>
  )
}