import IconMoonStars from "https://deno.land/x/tabler_icons_tsx@0.0.2/tsx/moon-stars.tsx"
import IconSun from "https://deno.land/x/tabler_icons_tsx@0.0.2/tsx/sun.tsx"
import { useState } from "preact/hooks";

export default function Changer() {
  const [isDark, setIsDark] = useState(true);
  return (
    <>
      <span data-toggle-theme="halloween,light" className="cursor-pointer" onClick={() => setIsDark(!isDark)}>
        {isDark ? <IconMoonStars class="w-5 h-5 text-gray-500" /> : <IconSun class="w-6 h-6" />}
      </span>
    </>
  )
}