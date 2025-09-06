/**
 * 个人资料链接数据模型
 * 用于关于页面的个人资料链接展示
 */
export interface ProfileLink {
  /** 唯一标识符 */
  id: string;
  /** 链接标题 */
  title: string;
  /** 链接URL */
  url: string;
  /** 链接描述 */
  description?: string;
  /** 所属分类，个人资料固定为 "profile" */
  category: "profile";
  /** 标签列表 */
  tags?: string[];
  /** 是否推荐 */
  featured?: boolean;
  /** 链接图标 */
  icon?: string;
  /** 图标类型 */
  iconType?: "image" | "text";
}
