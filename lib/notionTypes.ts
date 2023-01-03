// deno-lint-ignore-file no-explicit-any
/**
 * 许多地方写得比较冗余，还没来得及优化
 * todo 优化冗余代码
 */

// 页面属性数据结构体
export type NotionPage = {
  id: string; // 页面 ID 是一个 UUID
  created_time: string; // 创建时间
  created_by: {
    object: string; // 创建者的类型，这里是 user
    id: string; // 创建者的 ID
  };
  last_edited_time: string; // 最后编辑时间
  last_edited_by: {
    object: string; // 最后编辑者的类型，这里是 user
    id: string; // 最后编辑者的 ID
  };
  cover: cover; // 页面封面
  icon: icon; // 页面图标
  parent: {
    type: string; // 父级的类型，可以是 database_id, page_id 或者 workspace
    database_id?: string; // 如果父级是 database，这里是 database 的 ID
    page_id?: string; // 如果父级是 page，这里是 page 的 ID
    workspace?: boolean; // 如果父级是 workspace，这里是 true
  };
  archived: boolean; // 是否归档
  properties: {
    title?: title; // 标题
  };
  url: string; // 页面的 URL
};

// 页面内容块结构体
export type NotionBlock = {
  object: string; // 类型，这里是 block
  id: string; // 块 ID 是一个 UUID
  parent: {
    type: string; // 父级的类型，可以是 page_id 或者 database_id
    page_id?: string; // 如果父级是 page，这里是 page 的 ID
    database_id?: string; // 如果父级是 database，这里是 database 的 ID
  };
  created_time: string; // 创建时间
  last_edited_time: string; // 最后编辑时间
  created_by: {
    object: string; // 创建者的类型，这里是 user
    id: string; // 创建者的 ID
  };
  has_children: boolean; // 是否有子块
  archived: boolean; // 是否归档
  type: string; // 块的类型，可以是 paragraph, heading_1, heading_2, heading_3, bulleted_list_item, numbered_list_item, to_do, toggle, child_page, unsupported
  // 块类型为 heading_1, heading_2, heading_3 时
  heading_1?: {
    rich_text: rich_text; // 富文本
    is_toggleable: boolean; // 是否可以折叠，如果为 true，则需要以该块的 ID 为参数获取子块
    color: string; // 颜色
  };
  heading_2?: {
    rich_text: rich_text; // 富文本
    is_toggleable: boolean; // 是否可以折叠，如果为 true，则需要以该块的 ID 为参数获取子块
    color: string; // 颜色
  };
  heading_3?: {
    rich_text: rich_text; // 富文本
    is_toggleable: boolean; // 是否可以折叠，如果为 true，则需要以该块的 ID 为参数获取子块
    color: string; // 颜色
  };
  // 块类型为 paragraph 时，这是一个段落
  paragraph?: {
    rich_text: rich_text; // 富文本
    color: string; // 颜色
  };
  // 块类型为 bulleted_list_item, numbered_list_item 时，这是一个列表项
  bulleted_list_item?: {
    rich_text: rich_text; // 富文本
    color: string; // 颜色
  };
  numbered_list_item?: {
    rich_text: rich_text; // 富文本
    color: string; // 颜色
  };
  // 块类型为 callout 时，这是一个提示块
  callout?: {
    rich_text: rich_text; // 富文本
    icon: icon; // 图标
    color: string; // 颜色
  };
  // 块类型为 toggle 时，这是一个折叠块，里面可能有一个或多个甚至多级子块
  toggle?: {
    rich_text: rich_text; // 富文本
    color: string; // 颜色
  };
  // 块类型为 quote 时，这是一个引用块，在引用块中换行使用的是 \n 符号
  quote?: {
    rich_text: rich_text; // 富文本
    color: string; // 颜色
  };
  // 块类型为 code 时，这是一段代码块
  code?: {
    caption: [];
    rich_text: rich_text; // 富文本
    language: string; // 代码的编程语言
  };
  // 块类型为 table_of_contents 时，这是一个目录
  // fixme 它没有子模块，目前不知道怎么获取具体内容
  table_of_contents?: {
    color: string; // 颜色
  };
  // 块类型为 child_page 时，这是一个页面
  // todo 这里不会显示页面的图标和封面，如果想在这里显示又不想请求太多次网络，好的办法应该是缓存起来
  child_page?: {
    title: string; // 页面的标题
  };
  // 块类型为 child_database 时，这是一个数据库块
  child_database?: {
    title: string; // 数据库的标题
  };
  // 块类型为 column_list 时，这里是有多个列的列表
  // 要获取列的内容，需要以该块的 ID 为参数继而查询子块
  column_list?: any;
  // 块类型为 column 时，这是一个列
  column?: any;
  // 块类型为 divider 时，这是一个分割线
  divider?: {
    color: string; // 颜色
  };
  [key: string]: any; // todo 其他属性
};

// 数据库结构体
export type NotionDataBase = {
  object: string; // 对象类型，固定为 database
  id: string; // 数据库的 ID
  cover?: {
    type: string; // 封面的类型，固定为 external
    external: {
      url: string; // 封面的 URL
    };
  };
  icon?: icon; // 数据库的图标
  created_time: string; // 创建时间
  created_by: {
    object: string; // 固定为 user
    id: string; // 用户的 ID
  };
  last_edited_by: {
    object: string; // 固定为 user
    id: string; // 用户的 ID
  };
  last_edited_time: string; // 最后编辑时间
  title: rich_text; // 数据库的标题
  description: any; // 数据库的描述
  properties: {
    [key: string]: any; // 数据库的属性
  };
  parent: {
    type: string; // 父级的类型，数据是挂在页面下的，所以这里是 page_id
    page_id: string; // 父级的 ID
  };
  url: string; // 数据库的 URL
  archived: boolean; // 是否已归档
  [key: string]: any; // 其他属性
};

/**
 * 内容属性结构体，种类繁多:
 * title, rich_text, number, select, multi_select, date,
 * people, file, checkbox, url, email, phone_number, formula, relation, rollup,
 * created_time, created_by, last_edited_time, last_edited_by ...
 */

// title 标题
export type title = {
  id: string; // 属性 ID
  type: string; // title 类型
  title: [
    {
      type: string; // rich_text 类型
      text: rich_text; // 富文本
      annotations: {
        bold?: boolean; // 是否加粗
        italic?: boolean; // 是否斜体
        strikethrough?: boolean; // 是否删除线
        underline?: boolean; // 是否下划线
        code?: boolean; // 是否代码
        color?: string; // 颜色
      };
      plain_text: string; // 纯文本
      href?: string; // 链接的 URL
    }
  ];
};

// icon 图标
export type icon = {
  type: string; // icon 类型 emoji 或者 external
  emoji?: string; // emoji 图标
  external?: {
    url: string; // 图片的 URL
  };
} | null;

// cover 封面
export type cover = {
  type: string; // 页面封面的类型，可以是 external 或者 file
  external?: {
    url: string; // 图片的 URL
  };
  file?: {
    url: string; // 图片的 URL
    expiry_time: string; // 过期时间
  };
} | null;

// rich_text 富文本
export type rich_text = [
  {
    type: string; // rich_text 类型
    text: {
      content: string; // rich_text 的文本内容
      link?: {
        url: string; // 链接的 URL
      };
    };
    annotations: {
      bold?: boolean; // 是否加粗
      italic?: boolean; // 是否斜体
      strikethrough?: boolean; // 是否删除线
      underline?: boolean; // 是否下划线
      code?: boolean; // 是否是行内代码，注意它不是代码块
      color?: string; // 颜色
    };
    plain_text: string; // 纯文本
    href?: string; // 链接的 URL
  }
];
