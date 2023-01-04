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
      if (block.has_children) {
        const children = await processBlocks(block).then(r => r);
        block = children;
      }
      // todo 数据库模块
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
