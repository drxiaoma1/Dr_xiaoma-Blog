---
title: "Auto-claude-code-research-in-sleep: 专业的科研agent team，梦中真能投CCF-A！"
date: 2026-05-05
summary: 介绍国人开源项目 ARIS——基于 Claude Code + Codex 双 agent 协作的自动科研助手，并演示 /idea-discovery 功能从模糊方向到可执行 idea 的完整流程。
tags: [开源项目, 科研助力]
draft: false
---

## 什么是Auto-claude-code-research-in-sleep（ARIS）？

这是一个主要由国人贡献者创作的 GitHub 开源项目，今年 4 月 2 日上线第一版，保持持续更新，目前已揽星 8.5k

项目的名字就已经表明其用途，本项目是一个基于 claude code 的自动科研助手，目标是在你睡觉时仍然帮你写论文

当然，为了特化这一目标，这个项目做出了很多努力，其中最值得称道的 core idea 就是"双agent协作"

说是协作，其实主要是让 cc 先进行创作（idea、code、draft...），然后由 codex 进行 review，若结果不佳，便打回给 cc 继续优化

**和人类的科研方式几乎一致，对不对？**

按照项目作者的表述，引入另一位不同模型的 agent 进行 peer review 能有效减轻单 agent 的幻觉，避免落入局部最小值：

> 💭 **Why not self-play with a single model?** Using Claude Code subagents or agent teams for both execution and review is technically possible, but tends to fall into **local minima** — the same model reviewing its own patterns creates blind spots.
>
> *Think of it like adversarial vs. stochastic bandits: a single model self-reviewing is the stochastic case (predictable reward noise), while cross-model review is adversarial (the reviewer actively probes weaknesses the executor didn't anticipate) — and adversarial bandits are fundamentally harder to game.*
>
> 💭 **Why two models, not more?** Two is the minimum needed to break self-play blind spots, and 2-player games converge to Nash equilibrium far more efficiently than n-player ones. Adding more reviewers increases API cost and coordination overhead with diminishing returns — the biggest gain is going from 1→2, not 2→4.
>
> Claude Code's strength is fast, fluid execution; Codex (GPT-5.4 xhigh) is slower but more deliberate and rigorous in critique. These complementary styles — **speed × rigor** — produce better outcomes than either model talking to itself.

原作者给出了一个完整的科研 workflow，既可以全线一路从 idea discovery 到 rebuttal，也可以单独使用某个 workflow，只需要调用已经写好的 skill 搭配上你的提示词即可！

![ARIS workflow](/Dr_xiaoma-Blog/images/aris/hero_combined.svg)

## 如何安装ARIS？

如果你已经看过[之前的博客](/Dr_xiaoma-Blog/blog/claude-code-vscode-setup)并且自己配置好了 cc 和 codex，离配置好 ARIS 就只差一点点了

首先将 ARIS 项目 clone 到本地：

```bash
git clone https://github.com/wanshuiyin/Auto-claude-code-research-in-sleep.git
```

（倘若你还不知道什么是 clone 并且本地没有 git，也可以直接登入 GitHub 下载压缩包到本地解压，如果你是计算机专业的同学，请不要使用后者，先去学习 git）

然后跟着 README.md 的指示走就行，但是考虑到我们已经做好很多前期工作，只需要按顺序运行下面的指令就行：

```bash
mkdir -p ~/.claude/skills/    # create if it doesn't exist (new Claude Code versions)
cp -r Auto-claude-code-research-in-sleep/skills/* ~/.claude/skills/

claude mcp add codex -s user -- codex mcp-server
```

（可以看到是通过 mcp 工具协议来实现 codex 调用的）

做完上面的工作后，打开 claude code 页面，就可以开始了！

> **Windows 用户**：如果你在 Windows 系统上操作，请先参考[Windows系统 cc/Codex 配置教程](/Dr_xiaoma-Blog/blog/windows-claude-code-setup)确认 cc 和 codex 均已接通，再回来继续。

## 项目实例：/idea-discovery 功能

无论你是什么领域的研究者，想必都少不了这个关键环节——idea discovery

要写论文，总得有个好的 idea 吧，实际上，一篇好的论文可以实验数据不完美，可以不开源代码，可以少图表...但绝对不能怠慢的就是论文的 idea 和 story，如果你已经接触过科研，一定深有体会

熟练的 reviewer 连 abstract 都可以不看，仅凭论文标题展现出来的"这篇论文在做什么"就直接给出第一印象分，好的 idea 是好论文的开篇也是核心

但是，作为一名刚接触专业领域不久，论文没读过几篇的科研新人，通常不具备所谓的"科研品味"，你的导师可以从最新的论文中找到可以做工作且比较 promising 的方向，而你提出的研究方向——假如你不是完全没有科研方向——往往要不就是早早有人做过，要不就是缺乏创新被 reviewer 评价为"tiny progress"，要不就是无底洞几乎无法产出

这是难免的，你的导师在这个领域中深入这么多年可不是白干的。作为科研新人，通过 agent 来细化探索方向、精确到具体可做的 idea 是相当好的方案（如果你的导师没有给你细致可执行的任务而是丢给你个方向和十几篇论文的话）

我自己尝试过 ARIS 的 `/idea-discovery` 功能，效果相当不错，给大家演示一下：

首先需要调用 ARIS 的 skill，再加上一个相当 huge 的模糊方向：

```
/idea-discovery "关于让agent智能体自己更新优化 Harness 来优化上下文管理和输出规范"
```

我这里给出了一个只有一行且缺少足够限定词的方向，并且这个方向相当"新"，主要的工作集中在 3 个月以内，很多工作只在 arxiv 上预印甚至没有见刊，如果在这种前提下 agent 能有效地写出文献调研和给出可选研究方向，可以说明其能力强大

![cc 给出 TODO 计划](/Dr_xiaoma-Blog/images/aris/plan.png)

cc 很快给出回复，先列出了 TODO，可以看到很有章法，没有想一步是一步

![文献调研完成](/Dr_xiaoma-Blog/images/aris/literature.png)

大约十多分钟，cc 完成了文献调研，并且写好了 `literature_survey.md`，短时间内总结了远超一般科研者能检索到的重要论文，并且分析出了最 promising 的方向（视情况而定，这个时间可能会更长）

这个文献调研有足足 300 多行，分量很足，所有重要论文提供了超链接可以直接跳转，没有任何不存在引用

![等待用户反馈](/Dr_xiaoma-Blog/images/aris/check.png)

然后 agent 会在这里停下来一次，等待你给出指令，你可以在这一步提供反馈和 agent battle 一下。我这里没有选择 battle，让他进入下一步

![GPT 介入 review](/Dr_xiaoma-Blog/images/aris/gpt.png)

接下来要总结可选的 idea，这一环节体现了 ARIS 的独有优势，可以调用 gpt 来辅助调研，通过两个 agent 的 battle 可以筛掉不够 promising 的 idea，保留最有价值的部分

![外部 review](/Dr_xiaoma-Blog/images/aris/review.png)

外部的 review 是好 idea 的关键

![最终 idea 报告](/Dr_xiaoma-Blog/images/aris/final.png)

这个过程耗时比较长，可能需要半小时或者更多，最终会产出一份 idea 方向 `IDEA_REPORT.md`

这个文件会给出最推荐的和备选的 ideas，并且指出推荐理由和相关论文源，此外甚至会给出下一步开展实验的链路

此处按 cc 的推荐执行 `/run-experiment` 指令即可进入下一段 workflow，开始实验复现和改进

考虑到并非所有研究者都需要下一步的辅助实验，暂时就不做展示了。到这里，你只用了一点提示词，烧了一点 token，用了半天就从浩如烟海的论文中找出了值得做的科研 idea，尽管这并不能保证你一定能有成果，至少省去了很多麻烦

**不过，要想成为领域内的专家，你一定要自己读论文，自己去思考，自己去体会**
