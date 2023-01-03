import NotionData from "../lib/notionData.ts";
import { NotionBlock } from "../lib/notionTypes.ts";

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
          {block.paragraph!.rich_text.length >= 1 ? block.paragraph!.rich_text.map((text, index) => (
            <span key={index}>{text.plain_text}</span>
          )) : <br />}
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

    // case "toggle":  // 折叠块

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
            📓 <span className="underline" style={"text-underline-offset:4px"}>{block.child_page!.title}</span>
          </a>
        </div>
      );

    case "child_database": // 子数据库
      return (
        <div className="">子数据库：{block.child_database!.title}</div>
      );

    case "column_list": // 多列列表
      return (
        <div className="my-2 flex justify-between">
          <p>多列列表</p>
        </div>
      );


    default:
      return <p className="text-red-500">块类型：{block.type} 尚不支持</p>
  }
}


// async function columnList(blockId: string) {
//   const notion = new NotionData();
//   const blocks = await notion.getPageBlock(blockId);
//   for (const block of blocks) {
//     if (block.type === "column") {
//       const co = await notion.getPageBlock(block.id);
//       block.column = co;
//     }
//   }
//   console.log(blocks);
//   return (
//     <div className="my-2 flex justify-between">
//       <div className={`w-1/${blocks.length} flex flex-col`}>
//         {blocks.map((block: NotionBlock, _index: number) => {
//           return block.column!.map((block: NotionBlock, _index: number) => <CosmosBag block={block} />)
//         })}
//       </div>
//     </div>
//   );
// }