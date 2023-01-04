import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "../components/Layout.tsx";
import NotionData from "../lib/notionData.ts";
import { PageData, processPages, processBlocks } from "../lib/process.ts";
import { NotionBlock } from "../lib/notionTypes.ts";
import CosmosBag from "../components/CosmosBag.tsx";

type pageAndBlocks = {
  pageInfo: PageData;
  blocks: NotionBlock[];
}

export const handler: Handlers<pageAndBlocks> = {
  async GET(_, ctx) {
    const { pageId } = ctx.params; // 获取页面 ID
    // 如果 pageId 不是一个 uuid 则返回 404 页面
    if (!pageId || !pageId.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/)) {
      return ctx.renderNotFound();
    }
    const notion = new NotionData();
    const page = await notion.getPageData(pageId).then(r => r);
    const pageInfo = processPages(page);
    const blocks = await notion.getPageBlock(pageId).then(r => r);
    // 整理 blocks 的数据，针对存在子模块的情况进行遍历
    for (let block of blocks) {
      if (block.has_children) { // 如果存在子模块，则递归遍历
        const children = await processBlocks(block).then(r => r);
        block = children; // 为当前块重新赋值
      }
      if (block.type === "child_database") { // 如果是数据库模块，则获取数据库中的页面列表
        const pageList = await notion.getDatabasePageList(block.id).then(r => r);
        block.database_pages = pageList; // 在当前块中添加 database_pages 属性
      }
    }
    return ctx.render({ pageInfo, blocks });
  }
}


export default function ChildPage({ data }: PageProps<pageAndBlocks>) {
  return (
    <Layout title={data.pageInfo.title || "无标题"} imageUrl={data.pageInfo.cover}>
      {data.blocks.map((block, _index) => <CosmosBag block={block} />)}
    </Layout>
  );
}
