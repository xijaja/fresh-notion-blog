import { Client } from "https://deno.land/x/notion_sdk@v1.0.4/src/mod.ts";
import "https://deno.land/x/dotenv@v3.2.0/load.ts"; // 该库用以读取 .env 文件
import { NotionBlock, NotionDataBase, NotionPage } from "./notionTypes.ts";

const auth = Deno.env.get("NOTION_TOKEN");
const homePageId = Deno.env.get("HOME_PAGE_ID");

/**
 * 声明一个 NotionData 类，用于获取 Notion 数据
 */
export default class NotionData {
  // notion 的 client
  client: Client;

  // 初始化
  constructor() {
    if (!auth)
      throw new Error("NOTION_TOKEN is not set, NOTION_TOKEN 是必须的");
    if (!homePageId)
      throw new Error("HOME_PAGE_ID is not set, HOME_PAGE_ID 是必须的");
    this.client = new Client({ auth });
  }

  // 获取页面属性数据
  async getPageData(pageId?: string): Promise<NotionPage> {
    return (await this.client.pages.retrieve({
      page_id: !pageId ? homePageId! : pageId, // 这里使用 ! 断言，表示 homePageId 一定有值
    })) as NotionPage;
  }

  // 获取页面块数据
  async getPageBlock(pageId?: string): Promise<NotionBlock[]> {
    const response = await this.client.blocks.children.list({
      block_id: !pageId ? homePageId! : pageId,
      page_size: 50,
    });
    // const blocks = response.results as NotionBlock[];
    // for (const block of blocks) {
    //   console.log(block.type);
    //   console.log(block[block.type]);
    //   console.log("-----");
    // }
    // console.log(response);
    return response.results as NotionBlock[];
  }

  // 检索单个块
  async retrieveBlock(blockId: string) {
    const response = await this.client.blocks.retrieve({
      block_id: blockId,
    });
    // console.log("检索的块：", response);
    return response as NotionBlock;
  }

  // 查询数据库，数据库ID示例：6982ea5a-d3fe-4c24-a316-8b9207e504b2
  async getDatabase(databaseId: string) {
    const response = await this.client.databases.retrieve({
      database_id: databaseId,
    });
    console.log("查询数据库：", response);
    return response as NotionDataBase;
  }

  // 查询数据库中的页面列表
  async getDatabasePageList(databaseId: string) {
    const response = await this.client.databases.query({
      database_id: databaseId,
    });
    console.log("查询数据库中的页面列表：", response);
    return response.results as NotionPage[];
  }
}
