export default function Footer() {
  return (
    <footer className="w-full pt-24 pb-8">
      <div class="px-4 mx-auto max-w-screen-md">
        <div class="text-center">
          <p>
            &copy; {new Date().getFullYear()} {Deno.env.get("SITE_AUTHOR")} •{" "}
            <a class="hover:text-underline" style={"text-underline-offset:4px"} href="https://github.com/xijaja/fresh-notion-blog">
              View Source
            </a>
          </p>
        </div>

        {/* 备案信息，如果有才会被展示 */}
        {Deno.env.get("ICP") && (
          <a
            href="/"
            target="_blank"
            rel="noopener"
            class="text-center m-2 flex items-center justify-center text-sm text-gray-500 hover:text-underline"
            style={"text-underline-offset:4px"}
          >
            {Deno.env.get("ICP")}
          </a>
        )}
      </div>
    </footer>
  )
}