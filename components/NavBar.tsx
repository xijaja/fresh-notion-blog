import LemonIcon from "https://deno.land/x/tabler_icons_tsx@0.0.1/tsx/lemon-2.tsx";
import Changer from "../islands/Changer.tsx";

type Props = {
  active: string; // 激活的菜单
  imageUrl?: string; // 顶部图
};

export default function Header({ active, imageUrl }: Props) {
  // 菜单列表
  const menus = [
    { name: "首页", href: "/" },
    { name: "留言", href: "/message" },
  ];

  return (
    <>
      {/* 导航栏 */}
      <div className="flex justify-center">
        <div className="w-full max-w-screen-xl py-6 px-8 flex flex-col sm:flex-row gap-4">
          {/* 导航栏左侧图标和站点名称 */}
          <a href="/" className="flex items-center flex-1">
            <LemonIcon />
            <div className="text-2xl  ml-1 font-bold">
              {Deno.env.get("SITE_NAME")}
            </div>
          </a>

          {/* 导航栏右侧菜单 */}
          <ul className="flex items-center gap-6">
            {menus.map((menu) => (
              <li>
                <a
                  href={menu.href}
                  className={"text-gray-500 hover:text-gray-700 py-1 border-gray-500" +
                    (menu.href === active ? " font-bold border-b-2" : "")}
                >
                  {menu.name}
                </a>
              </li>
            ))}

            {/* 切换主题按钮 */}
            <li>
              <Changer />
            </li>
          </ul>

        </div>
      </div>

      {/* 顶部封面图 */}
      {imageUrl && (
        <div
          className="bg-cover h-48 bg-center mb-6"
          style={{
            backgroundImage: "url(" + imageUrl + ")",
            backgroundSize: "cover"
          }}
        ></div>
      )}
    </>
  );
}
