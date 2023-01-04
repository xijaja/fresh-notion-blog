import { NotionBlock, NotionPage } from "../lib/notionTypes.ts";
import IconFileText from "https://deno.land/x/tabler_icons_tsx@0.0.2/tsx/file-text.tsx"

type props = {
  block: NotionBlock;
}

export default function CosmosBag({ block }: props) {

  // 匹配块类型
  switch (block.type) {
    case "heading_1":  // 标题 1
      return (<h1 className="text-2xl my-6 font-black">{block!.heading_1!.rich_text[0].plain_text}</h1>);

    case "heading_2": // 标题 2
      return (<h2 className="text-xl my-4 font-bold">{block.heading_2!.rich_text[0].plain_text}</h2>);

    case "heading_3": // 标题 3
      return (<h3 className="text-lg my-2">{block.heading_3!.rich_text[0].plain_text}</h3>);

    case "paragraph":  // 段落
      return (
        // 如果段落有内容，就循环读取段落内容并渲染，否则是一个空行
        <div className="my-2">
          {block.paragraph!.rich_text.length >= 1
            ? block.paragraph!.rich_text.map(
              (text, _index) => (
                <span>{text.href ? <a href={text.href} className="underline" style={"text-underline-offset:4px"}>{text.plain_text}</a> : text.plain_text}</span>
              ))
            : <br />}
        </div>
      );

    case "bulleted_list_item": // 无序列表
      return (
        <div className="">
          <span className="text-2xl">• </span>{block.bulleted_list_item!.rich_text.map((text, index) => (
            <span key={index}>{text.plain_text}</span>
          ))}
        </div>
      );

    case "numbered_list_item": // 有序列表 todo 有序列表块的序号与上一个有序列表块有关，所以需要知道连续的有序列表，当前这种匹配方式是无序的
      return (
        <div className="">
          {block.numbered_list_item!.rich_text.map((text, index) => (
            <span key={index}>{index + 1}. {text.plain_text}</span>
          ))}
        </div>
      );

    case "callout": // 提示框 todo 背景颜色可根据 notion 设置的颜色来设置（需要一个颜色映射关系）
      return (
        <div className="px-2.5 py-4 bg-green-50 rounded-md my-2">
          <span className="p-2">
            {block.callout!.icon?.type === "emoji"
              ? block.callout!.icon?.emoji
              : block.callout!.icon?.external?.url
            }
          </span>
          {block.callout!.rich_text.map((text, index) => (
            <span key={index}>{text.plain_text}</span>
          ))}
        </div>
      );

    case "toggle":  // 折叠块
      // console.log("block: ", block);
      return (
        <div className="my-2">
          <details>
            <summary className="text-lg font-bold">{block.toggle?.rich_text[0].plain_text}</summary>
            {block.has_children && (
              <div className="pl-4">
                {block.children.map((bc: NotionBlock, _index: number) => <CosmosBag block={bc} />)}
              </div>
            )}
          </details>
        </div>
      );

    case "quote": // 引用块
      return (
        <div className="">
          “{block.quote!.rich_text.map((text, index) => (
            <span key={index}>{text.plain_text}</span>
          ))}”
        </div>
      );

    case "code": // 代码块
      return (
        <div className="my-2">
          <pre>
            <code className={block.code!.language}>
              {block.code!.rich_text[0].plain_text}
            </code>
          </pre>
        </div>
      );

    case "child_page": // 子页面
      return (
        <div className="my-2">
          <a href={"/" + block.id}>
            <span className="flex gap-1 items-center underline" style={"text-underline-offset:4px"}>
              <IconFileText class="w-6 h-6" /> {block.child_page!.title}
            </span>
          </a>
        </div>
      );

    case "child_database": // 子数据库
      // console.log("块: ", block);
      // for (const p of block.database_pages) {
      //   console.log("页面的标题: ", p.properties.名称.title[0].plain_text);
      // }
      return (
        <div className="my-2">
          {/* 是否需要显示标题 */}
          {Deno.env.get("SHOW_DATABASE_TITLE") === "true"
            && <p className="my-2 pl-2 border-l-4 border-gray-300 text-lg">{block.child_database!.title}</p>
          }
          {/* 数据库页面卡片 */}
          <div className="grid gap-4 grid-cols-3">
            {block.database_pages.map((page: NotionPage, _index: number) => (
              <a href={"/" + page.id} className="shadow rounded border border-gray-200">
                {/* 数据库页面的卡片封面 */}
                <div className="h-32">
                  {page.cover &&
                    <img
                      src={page.cover?.external?.url || page.cover?.file?.url}
                      alt="cover"
                      width="100%"
                      className="h-32"
                    />}
                </div>
                {/* 数据库页面的图标和标题 */}
                <div className="p-2">
                  {page.icon && <span>{page.icon?.emoji || page.icon?.external?.url}</span>}
                  <span>
                    {page.properties.title?.title[0]?.plain_text
                      ? page.properties.title?.title[0]?.plain_text
                      : page.properties.名称?.title[0]?.plain_text}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      );

    case "column_list": // 多列列表
      // console.log("块: ", block);
      return (
        <div className="my-2 flex gap-6 justify-between">
          {block.children.map((bc: NotionBlock, _index: number) => <CosmosBag block={bc} />)}
        </div>
      );

    case "column": // 列
      return (
        <div className="my-2 flex flex-col w-1/2">
          {block.children.map((bc: NotionBlock, _index: number) => <CosmosBag block={bc} />)}
        </div>
      );

    case "divider": // 分割线
      return (
        <div className="my-2">
          <hr className="border border-gray-200" />
        </div>
      );

    case "image": // 图片
      return (
        <div className="my-2">
          {block.image!.type === "file"
            ? <img src={block.image?.file?.url} alt={block.image!.caption[0].plain_text} />
            : <img src={block.image?.external?.url} alt={block.image!.caption[0].plain_text} />
          }
        </div>
      );

    default:
      console.log("尚不支持块：", block);
      return <p className="text-red-500">块类型：{block.type} 尚不支持</p>
  }
}
