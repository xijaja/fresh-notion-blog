export default function Footer() {
  return (
    <footer className="w-full pt-10 pb-4">
      <div class="px-4 mx-auto max-w-screen-md">
        <div class="text-center">
          <p>
            &copy; {new Date().getFullYear()} {Deno.env.get("SITE_AUTHOR")} •{" "}
            <a class="hover:text-underline" href="https://github.com/xijaja">
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
            class="text-center m-4 flex items-center justify-center text-sm text-gray-500 hover:text-underline"
          >
            {Deno.env.get("ICP")}
          </a>
        )}
      </div>
    </footer>
  )
}