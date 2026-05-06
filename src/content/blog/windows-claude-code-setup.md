---
title: Windows系统Claude Code & Codex插件安装配置
date: 2026-05-05
summary: 针对 Windows 用户的 cc/Codex 部署补充教程：如何在 Windows 中找到配置文件目录、建立工作区，以及 Codex 配置文件的写法。
tags: [Windows, Claude Code, Codex]
draft: false
---

## 一些反思

笔者在写完[上一期博客](/Dr_xiaoma-Blog/blog/claude-code-vscode-setup)后回头再看，意识到自己仍然是站在计算机相关专业的学生角度写教程的，似乎默认了大家使用linux系统作为工作站操作系统（实际上网上90%的指导教程都基于这个前提），然而可能很多人实际使用的操作系统是Windows或者MacOS，后者呢，笔者没用过，读者只能自行寻求解决方案了，但是Windows系统笔者还是可以给出教程的

实际上，如果你已经阅读了[上一期博客](/Dr_xiaoma-Blog/blog/claude-code-vscode-setup)，但是苦于系统差异无法完成部署，那么这一期教程可以快速解决问题，大部分步骤与linux系统并无差异。此外，[上一篇博客](/Dr_xiaoma-Blog/blog/claude-code-vscode-setup)省略了Codex的部署流程，考虑到这可能导致教程不够轮椅，笔者这期一并补上

## 如果你是计算机相关专业！

如果你是计算机相关专业的学生，想必你已经初步接触到了linux操作系统，或者至少听过其威名。需要告知你的是，学校的以及你能找到的各种服务器90%都是linux系统，有时你也会遇到课程使用的工具只有linux系统适配

所以，**不会用linux是不行的**，请你一定要重视！

笔者推荐你从今往后所有的课程项目、编码需求都放在linux系统工作站上进行，而这其实不难，微软甚至专门为Windows写了个类似于虚拟机的应用，名为**WSL**，可以在不真正加装新系统的情况下基于Windows系统开辟一块独立的linux空间，同时和宿主机的联动性能远超自行搭建的虚拟机，网络托管、数据互传...可以说是在常规的Windows系统设备上用到linux系统工作的最佳范式

当然，笔者这里不提供**WSL**的安装和配置教程，作为计算机专业的同学，你必须具备根据官方文档或者可靠教程自行解决问题的能力。如果你成功安装了**WSL**并且通过vscode连接到了属于你自己的linux工作站，那么恭喜你，你不再需要本教程，通过[上一篇教程](/Dr_xiaoma-Blog/blog/claude-code-vscode-setup)你可以轻松部署自己的agent了

当然，你可能得花点时间熟悉linux系统的操作，没有可视化页面，所有操作通过bash指令实现，但这一定难不倒你！

## 上手操作

vscode的安装和插件的下载与linux系统没有任何区别，API key的申请也是。假设你已经完成了这些前置准备工作，可以根据下面的教程一步步开始配置了

### 第一步：建立你的工作区

首先，什么是工作区/工作站？对于linux系统，这个问题几乎不存在，因为大多数人使用linux系统都是直接把根目录`/home/用户名`作为工作站兼工作区，项目目录直接在此目录下开辟，例如`/home/mmk/模电`

然而Windows系统并非如此，分盘和可视化界面导致多数用户的存储结构是很混乱的，很多时候都不知道什么软件下载在了哪里，什么图片文档保存在了哪里。鉴于Windows系统有一个可视化的桌面，稍微有心的用户会在桌面开辟很多文件夹并合理命名来保存重要工作数据，将软件源文件下载到D盘并将快捷方式放在桌面，如果你能做到这点，就已经超越至少50%的电脑使用者了

那么在Windows系统开辟工作区，笔者认为，直接在桌面创建一个`Projects`目录便是，对于大多数情况，真正用来工作的目录中占用存储并不大（大体量的数据放置在其他数据盘中），不会让C盘"脸红红的"。如果你按照笔者的方法来，应该能得到工作区路径为`C:\Users\你的用户名\Desktop\Projects`（右键"复制文件地址"查看）

![desktop](/Dr_xiaoma-Blog/images/windows-claude-code-setup/desktop.png)

↑ 笔者自己的桌面，应该算是比较有条理的了

### 第二步：更改cc和codex的配置文件

[第一篇博客](/Dr_xiaoma-Blog/blog/claude-code-vscode-setup)已经说过如何修改配置文件来绕过登录并且启用自己的API key了，在Windows系统中主要是配置文件位置不同

如果你这时候通过vscode查看你的工作区`C:\Users\你的用户名\Desktop\Projects`（具体方法为点进`Projects`目录Ctrl+右键呼出功能栏，点击"通过Code打开"），你肯定能看到显示项目文件的侧边栏，但是不同于linux系统，没有`.claude`和`.codex`目录，少了很多东西，严格来说，是**空无一物**

废话，这个文件目录中的确没东西，那么去哪里找那两个存储着配置文件的关键目录呢？

如果你的操作与我完全一致，你会在这个路径找到这两个目录：`C:\Users\你的用户名`，如下图：

![配置文件](/Dr_xiaoma-Blog/images/windows-claude-code-setup/配置文件.png)

点开之后你会发现内部情况与此前linux的完全一致，只需要重复之前的步骤

#### 修改cc配置文件

在`.claude`目录下创建`settings.json`，内容如下：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://cn.luckyapi.chat",
    "ANTHROPIC_AUTH_TOKEN": "sk-你的API密钥"
  },
  "includeCoAuthoredBy": false
}
```

#### 修改codex配置文件

在`.codex`目录下创建`auth.json`和`config.toml`，若已经存在，则覆盖

`auth.json:`

```json
{
  "OPENAI_API_KEY": "sk-你的API密钥"
}
```

`config.toml:`

```toml
model_provider = "luckyapi"
model = "gpt-5.4"
model_reasoning_effort = "high"
disable_response_storage = true
preferred_auth_method = "apikey"

[model_providers.luckyapi]
name = "luckyapi"
base_url = "https://cn.luckyapi.chat/v1"
wire_api = "responses"
```

想用gpt-5.5的话改一下就行，最近笔者发现gpt-5.5是真不赖，配上gpt-image2生图相当生猛

### 第三步：在工作区试用agent

最后就是测试一下agent是否接通

问点关于工作区的问题就好，随便你，如果一切正常应该能看到类似下面的结果：

![claude](/Dr_xiaoma-Blog/images/windows-claude-code-setup/claude.png)

![codex](/Dr_xiaoma-Blog/images/windows-claude-code-setup/codex.png)

模型接入正常，工作区文件可以正常查看，你现在已经可以在工作区创建新的项目目录，然后开始鞭策你的agent干活了！

如果可以，还是建议你像[上一篇博客](/Dr_xiaoma-Blog/blog/claude-code-vscode-setup)指出的那样完善一下Harness，写点规范文档，装点skill，相信agents能帮助你渡过难关！
