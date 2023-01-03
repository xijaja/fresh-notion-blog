import {NotionPage} from "./notionTypes.ts";


// 要反回的数据
export type PageData = {
  id: string; // 页面的 ID
  title: string | undefined; // 标题
  icon: string | undefined; // 图标
  cover: string | undefined; // 封面
}

// 处理页面数据
export function processPages(pageData: NotionPage): PageData {
  const title = pageData.properties.title?.title[0]?.plain_text;
  const icon = pageData.icon?.type === "emoji" ? pageData.icon.emoji : pageData.icon?.external?.url;
  const cover = pageData.cover?.type === "external" ? pageData.cover.external?.url : pageData.cover?.file?.url;

  return {
    id: pageData.id,
    title: title,
    icon: icon,
    cover: cover
  }
}
