import Layout from "../components/Layout.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import NotionData from "../lib/notionData.ts";
import { PageData, processBlocks, processPages } from "../lib/process.ts";
import { NotionBlock } from "../lib/notionTypes.ts";
import CosmosBag from "../components/CosmosBag.tsx";

type pageAndBlocks = {
  pageInfo: PageData;
  blocks: NotionBlock[];
};

// 必须命名为 handler 否则 fresh 无法识别
export const handler: Handlers<pageAndBlocks> = {
  async GET(_, ctx) {
    const notion = new NotionData();
    const page = await notion.getPageData().then((r) => r);
    const pageInfo = processPages(page);
    const blocks = await notion.getPageBlock().then((r) => r);
    // 整理 blocks 的数据，针对存在子模块的情况进行遍历
    for (let block of blocks) {
      if (block.has_children) { // 如果存在子模块，则递归遍历
        const children = await processBlocks(block).then((r) => r);
        block = children; // 为当前块重新赋值
      }
      if (block.type === "child_database") { // 如果是数据库模块，则获取数据库中的页面列表
        const pageList = await notion.getDatabasePageList(block.id).then((r) =>
          r
        );
        block.database_pages = pageList; // 在当前块中添加 database_pages 属性
      }
    }
    return ctx.render({ pageInfo, blocks });
  },
};

export default function HomePage({ data }: PageProps<pageAndBlocks>) {
  const HomeImageUrl = data.pageInfo.cover; // 首页封面图
  const HomeTitle = Deno.env.get("SITE_NAME") || "首页"; // 首页标题

  return (
    <Layout title={HomeTitle} menusActive="/" imageUrl={HomeImageUrl}>
      {data.blocks.map((block, _index) => <CosmosBag block={block} />)}
    </Layout>
  );
}

{
  /*
<div className="bg-yellow-200 leading-6">
  <p>页面ID： {data.pageInfo.id}</p>
  <p>页面标题： {data.pageInfo.title}</p>
  <p>页面图标： {data.pageInfo.icon}</p>
  <p>页面封面： {data.pageInfo.cover}</p>
</div>
  */
}
