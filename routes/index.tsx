import Layout from "../components/Layout.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import NotionData from "../lib/notionData.ts";
import { PageData, processPages } from "../lib/process.ts";
import { NotionBlock } from "../lib/notionTypes.ts";
import CosmosBag from "../components/CosmosBag.tsx";

type pageAndBlocks = {
  pageInfo: PageData;
  blocks: NotionBlock[];
}

// 必须命名为 handler 否则 fresh 无法识别
export const handler: Handlers<pageAndBlocks> = {
  async GET(_, ctx) {
    const notion = new NotionData();
    const page = await notion.getPageData().then(r => r);
    const pageInfo = processPages(page);
    const blocks = await notion.getPageBlock().then(r => r);
    return ctx.render({ pageInfo, blocks });
  }
}

export default function Home({ data }: PageProps<pageAndBlocks>) {
  const HomeImageUrl = Deno.env.get("HOME_COVER") || data.pageInfo.cover;
  const HomeTitle = Deno.env.get("SITE_NAME") || "首页";

  return (
    <Layout title={HomeTitle} menusActive="/" imageUrl={HomeImageUrl}>
      {data.blocks.map((block, _index) => <CosmosBag block={block} />)}
    </Layout>
  );
}


{/* 
<div className="bg-yellow-200 leading-6">
  <p>页面ID： {data.pageInfo.id}</p>
  <p>页面标题： {data.pageInfo.title}</p>
  <p>页面图标： {data.pageInfo.icon}</p>
  <p>页面封面： {data.pageInfo.cover}</p>
</div> 
*/}