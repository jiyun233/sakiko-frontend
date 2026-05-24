import {
  Sparkles,
  type LucideIcon,
} from "@lucide/vue"

export interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

export interface Command {
  name: string
  description: string
  usage: string
}

export interface SiteConfig {
  bot: {
    name: string
    tagline: string
    description: string
    avatar: string
  }
  nav: { label: string; href: string }[]
  hero: {
    badges: string[]
    cta: { label: string; href: string }
    secondaryCta: { label: string; href: string }
  }
  features: {
    title: string
    subtitle: string
    items: Feature[]
  }
  commands: {
    title: string
    subtitle: string
    items: Command[]
  }
  stats: {
    servers: number
    users: number
    messages: number
    uptime: string
  }
  footer: {
    copyright: string
    links: { label: string; href: string }[]
  }
}

export const siteConfig: SiteConfig = {
  bot: {
    name: "Sakiko",
    tagline: "CHUNITHM 游戏助手",
    description:
      "Sakiko是一款《CHUNITHM》助手QQ机器人, 提供数据查询, 图表生成等功能",
    avatar: "/favicon.png",
  },

  nav: [
    { label: "开始使用", href: "#features" },
    { label: "隐私条款", href: "/terms" },
    { label: "功能投票", href: "/vote" }
  ],

  hero: {
    badges: ["快速绑定", "方便快捷", "信息查询", "高度可定制"],
    cta: { label: "邀请机器人", href: "/dev" },
    secondaryCta: { label: "查看文档", href: "#" },
  },

  features: {
    title: "核心功能",
    subtitle: "Sakiko 提供丰富的功能，满足群聊中的各种需求",
    items: [
      {
        icon: Sparkles,
        title: "持续更新",
        description: "定期推出新功能和优化，积极响应社区反馈，保持生命力。",
      },
    ],
  },

  commands: {
    title: "常用命令",
    subtitle: "快速上手，这里是一些最常用的指令",
    items: [
      {
        name: "/help",
        description: "查看帮助菜单与可用命令列表",
        usage: "/help [模块名]",
      },
    ],
  },

  stats: {
    servers: 0,
    users: 0,
    messages: 0,
    uptime: "0.00%",
  },

  footer: {
    copyright: "Origin Technology 2019 - 2024. All rights reserved.",
    links: [
      { label: "使用文档", href: "#" },
      { label: "服务条款", href: "#" },
      { label: "隐私政策", href: "#" },
      { label: "问题反馈", href: "#" },
    ],
  },
}
