import { Head } from "$fresh/runtime.ts";
import { ComponentChildren } from "preact";
import NavBar from "./NavBar.tsx";

type Props = {
  title: string; // 页面标签
  menusActive?: string; // 激活的菜单
  imageUrl?: string; // 顶部图
  children: ComponentChildren // 子组件
};

export default function Layout(props: Props) {
  return (
    <>
      <Head>
        <title>{props.title}</title>
      </Head>

      <NavBar active={props.menusActive || ""} imageUrl={props.imageUrl} />

      <main className="px-4 mx-auto max-w-screen-lg">{props.children}</main>
    </>
  )
}
