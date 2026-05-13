import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'zh',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    resources: {
      zh: {
        translation: {
          // 全局
          'app-title': '选择终结者',
          'back': '返回',
          'back-to-menu': '返回主菜单',
          'advertisement': '广告',
          'close': '关闭',
          'delete': '删除',
          
          // Home 主菜单
          'home-classic': '经典模式',
          'home-tyrant': '暴君模式',
          'home-pain-transfer': '痛苦转移',
          'home-toxicity': '毒性测试',
          'home-classic-desc': '淘汰赛 + 转盘 + 直觉测试',
          'home-tyrant-desc': '不可逆的阅后即焚',
          'home-pain-transfer-desc': '社交甩锅',
          'home-toxicity-desc': '逆向淘汰',

          // Home 科普文案
          'home-science-title': '为什么我们总是在做选择时感到焦虑？',
          'home-science-buridan': '布里丹之驴效应',
          'home-science-buridan-desc': '一头完全理性的驴子，站在两堆完全相同的干草之间，由于无法做出选择而最终饿死。这个悖论揭示了人类在面临多个等价选项时的困境。',
          'home-science-paradox': '选择悖论',
          'home-science-paradox-desc': '随着选项数量的增加，我们的幸福感并没有随之提升，反而因为害怕做出错误选择而感到更加焦虑。过多的选择会让我们陷入「分析瘫痪」，消耗大量的心理能量却迟迟无法做出决定。',
          'home-science-cognitive': '认知负荷',
          'home-science-cognitive-desc': '我们的大脑处理信息的能力是有限的，当面临太多选择时，大脑需要同时处理大量信息进行比较和评估，这会让我们感到疲惫和焦虑。每一个选择都意味着放弃其他可能性，这种「机会成本」的计算会进一步加重心理负担。',
          'home-science-mission': 'XZ-Terminator 的使命',
          'home-science-mission-desc': '所以，不必为小事纠结！让 XZ-Terminator 替你承担这些琐碎的决策，把宝贵的精力留给那些真正重要的事情吧。毕竟，生活的意义不在于做出完美的选择，而在于享受选择之后的旅程。',
          'home-science-tag-1': '等价选项困境',
          'home-science-tag-2': '选项越多越焦虑',
          'home-science-tag-3': '大脑处理极限',
          
          // 经典模式 Hub
          'hub-classic': '经典淘汰赛',
          'hub-coin': '极速二选一',
          'hub-radar': '理性天平',
          'hub-history': '决断档案馆',
          
          // 淘汰赛
          'elimination-title': '淘汰赛',
          'elimination-input': '输入你纠结的选项',
          'elimination-placeholder': '选项 {{index}}',
          'elimination-add': '+ 添加更多选项',
          'elimination-start': '开始淘汰赛',
          'elimination-subtitle': '选择你更喜欢的一个',
          'elimination-winner': '胜者',
          
          // 决策圈
          'decision-circle': '决策圈',
          'decision-wheel': '命运转盘',
          'decision-intuition': '直觉探测器',
          
          // 命运转盘
          'wheel-title': '命运转盘',
          'wheel-spin': 'Spin',
          'wheel-regret-title': '反悔任务',
          'wheel-regret-hint': '写出你此刻想反悔的真实理由',
          'wheel-regret-confirm': '直接确认，我不反悔',
          'wheel-regret-retry': '重新旋转',
          'wheel-regret-time': '剩余时间',
          
          // 直觉探测器
          'intuition-title': '直觉探测器',
          'intuition-next': '下一个',
          'intuition-result': '测试结果',
          'intuition-tense': '紧绷/收缩',
          'intuition-relaxed': '放松/舒展',
          'intuition-question': '刚才想到它时，第一个身体感觉是？',
          'intuition-recommend': '推荐选择',
          
          // 薛定谔的硬币
          'coin-title': '薛定谔的硬币',
          'coin-option-a': '选项 A',
          'coin-option-b': '选项 B',
          'coin-flip': '抛掷硬币',
          'coin-pause-title': '在硬币落地前',
          'coin-pause-question': '你其实在祈祷哪一个？',
          'coin-result': '结果',
          
          // 理性天平
          'radar-title': '理性天平',
          'radar-dimension-importance': '重要性',
          'radar-dimension-feasibility': '可行性',
          'radar-dimension-cost': '成本',
          'radar-dimension-time': '时间',
          'radar-dimension-satisfaction': '满意度',
          'radar-add-option': '+ 添加选项',
          'radar-calculate': '开始评估',
          'radar-result': '评估结果',
          'radar-total': '总分',
          'radar-recommend': '最优选择',
          
          // 决断档案馆
          'history-title': '决断档案馆',
          'history-empty': '暂无历史记录',
          'history-empty-title': '档案馆空空如也',
          'history-empty-desc': '去做一些选择吧，它们会记录在这里',
          'history-delete': '删除',
          'history-clear-all': '清空全部',
          'history-time': '时间',
          'history-options': '参与选项',
          'history-winner': '最终赢家',
          
          // 暴君模式
          'tyrant-title': '暴君模式',
          'tyrant-flip': '翻开',
          'tyrant-accept': '就决定是你了！',
          'tyrant-discard': '永远丢弃',
          'tyrant-last': '这是最后一个，你没得选了！',
          'tyrant-input': '输入选项',
          'tyrant-start': '开始独裁',
          
          // 痛苦转移
          'pain-transfer': '痛苦转移',
          'pain-transfer-title': '痛苦转移器',
          'pain-transfer-desc': '让朋友替你做选择，把命运交给别人掌控',
          'pain-transfer-option': '选项',
          'pain-transfer-add-option': '添加更多选项',
          'pain-transfer-generate': '生成甩锅链接',
          'pain-transfer-copied': '链接已复制！',
          'pain-transfer-waiting': '等待朋友决定',
          'pain-transfer-scanning': '雷达扫描中...',
          'pain-transfer-waiting-desc': '等待朋友打开链接并做出选择',
          'pain-transfer-share-hint': '发送给朋友，让他们帮你做决定',
          'pain-transfer-restart': '重新选择',
          'pain-transfer-stay-open': '请保持此页面打开，朋友做出选择后会自动更新',
          'pain-transfer-friend': '帮朋友做决定',
          'pain-transfer-friend-title': '你的朋友需要你！',
          'pain-transfer-friend-desc': '他们在纠结这些选项，点击其中一个来终结他们的痛苦',
          'pain-transfer-friend-choice': '你的选择将代表朋友做出最终决定',
          'pain-transfer-result': '命运已定',
          'pain-transfer-friend-decision': '你已成功决定了朋友的命运',
          'pain-transfer-copy-result': '复制结果告诉TA',
          'pain-transfer-link-ready': '甩锅链接已生成并复制！',
          'pain-transfer-link-ready-desc': '快发给朋友，然后坐等他的微信回复吧~',
          
          // 毒性测试
          'toxicity-test': '毒性测试',
          'toxicity-test-desc': '逆向淘汰法，找到最不坏的选择',
          'toxicity-option': '选项',
          'toxicity-add-option': '添加更多选项',
          'toxicity-start': '开始测试',
          'toxicity-tip': '假设必然发生最糟糕的情况，你更能忍受哪一个带来的失望？',
          'toxicity-worst-case': '假设必然发生最糟糕的情况',
          'toxicity-question': '你更能忍受哪一个带来的失望？',
          'toxicity-remaining': '剩余',
          'toxicity-options': '个选项',
          'toxicity-result': '最不坏的选择',
          'toxicity-result-desc': '这是所有选项中，即使发生最坏情况，你也能接受的那一个',
          
          // 通用
          'submit': '提交',
          'cancel': '取消',
          'ok': '确定',
          'yes': '是',
          'no': '否'
        }
      },
      en: {
        translation: {
          // Global
          'app-title': 'Decision Terminator',
          'back': 'Back',
          'back-to-menu': 'Back to Menu',
          'advertisement': 'Advertisement',
          'close': 'Close',
          'delete': 'Delete',
          
          // Home Menu
          'home-classic': 'Classic Mode',
          'home-tyrant': 'Tyrant Mode',
          'home-pain-transfer': 'Pain Transfer',
          'home-toxicity': 'Toxicity Test',
          'home-classic-desc': 'Elimination + Wheel + Intuition',
          'home-tyrant-desc': 'Burn after reading',
          'home-pain-transfer-desc': 'Social delegation',
          'home-toxicity-desc': 'Reverse elimination',

          // Home Science Content
          'home-science-title': 'Why do we always feel anxious when making choices?',
          'home-science-buridan': "Buridan's Ass",
          'home-science-buridan-desc': 'Like the donkey that starved to death between two identical bales of hay, when we weigh the pros and cons, our brain\'s "cognitive load" spikes rapidly. This internal friction is the source of anxiety.',
          'home-science-paradox': 'The Paradox of Choice',
          'home-science-paradox-desc': "Modern psychologist Barry Schwartz proposed that the more options we have, the more powerless we feel. Too many choices do not bring freedom, but lead to 'analysis paralysis', consuming massive psychological energy while preventing us from making decisions.",
          'home-science-cognitive': 'Cognitive Load',
          'home-science-cognitive-desc': "Our brain's capacity to process information is limited. When facing too many choices, the brain needs to simultaneously process large amounts of information for comparison and evaluation, making us feel exhausted and anxious. Every choice means giving up other possibilities, and this 'opportunity cost' calculation further increases psychological burden.",
          'home-science-mission': 'The Mission of XZ-Terminator',
          'home-science-mission-desc': "So why stress over the small things! Let XZ-Terminator handle these trivial decisions for you, saving your precious energy for what truly matters. After all, the meaning of life lies not in making perfect choices, but in enjoying the journey after making them.",
          'home-science-tag-1': 'Equivalent Options Dilemma',
          'home-science-tag-2': 'More Options = More Anxiety',
          'home-science-tag-3': 'Brain Processing Limit',
          
          // Classic Hub
          'hub-classic': 'Classic Elimination',
          'hub-coin': 'Quick Coin Flip',
          'hub-radar': 'Rational Balance',
          'hub-history': 'Decision Archive',
          
          // Elimination
          'elimination-title': 'Elimination Tournament',
          'elimination-input': 'Enter your options',
          'elimination-placeholder': 'Option {{index}}',
          'elimination-add': '+ Add more options',
          'elimination-start': 'Start Tournament',
          'elimination-subtitle': 'Choose your preference',
          'elimination-winner': 'Winner',
          
          // Decision Circle
          'decision-circle': 'Decision Circle',
          'decision-wheel': 'Wheel of Destiny',
          'decision-intuition': 'Intuition Detector',
          
          // Wheel
          'wheel-title': 'Wheel of Destiny',
          'wheel-spin': 'Spin',
          'wheel-regret-title': 'Regret Task',
          'wheel-regret-hint': 'Write down your true reason for wanting to regret',
          'wheel-regret-confirm': 'Confirm directly, no regrets',
          'wheel-regret-retry': 'Spin Again',
          'wheel-regret-time': 'Remaining time',
          
          // Intuition
          'intuition-title': 'Intuition Detector',
          'intuition-next': 'Next',
          'intuition-result': 'Test Results',
          'intuition-tense': 'Tense/Contract',
          'intuition-relaxed': 'Relaxed/Expand',
          'intuition-question': 'What was your first physical sensation when thinking about it?',
          'intuition-recommend': 'Recommended',
          
          // Coin Flip
          'coin-title': "Schrödinger's Coin",
          'coin-option-a': 'Option A',
          'coin-option-b': 'Option B',
          'coin-flip': 'Flip Coin',
          'coin-pause-title': 'Before the coin lands',
          'coin-pause-question': 'Which one are you actually praying for?',
          'coin-result': 'Result',
          
          // Radar
          'radar-title': 'Rational Balance',
          'radar-dimension-importance': 'Importance',
          'radar-dimension-feasibility': 'Feasibility',
          'radar-dimension-cost': 'Cost',
          'radar-dimension-time': 'Time',
          'radar-dimension-satisfaction': 'Satisfaction',
          'radar-add-option': '+ Add option',
          'radar-calculate': 'Start Evaluation',
          'radar-result': 'Evaluation Results',
          'radar-total': 'Total Score',
          'radar-recommend': 'Best Choice',
          
          // History
          'history-title': 'Decision Archive',
          'history-empty': 'No history records',
          'history-empty-title': 'Archive is empty',
          'history-empty-desc': 'Make some choices, they will be recorded here',
          'history-delete': 'Delete',
          'history-clear-all': 'Clear All',
          'history-time': 'Time',
          'history-options': 'Options',
          'history-winner': 'Winner',
          
          // Tyrant Mode
          'tyrant-title': 'Tyrant Mode',
          'tyrant-flip': 'Flip',
          'tyrant-accept': 'This is it!',
          'tyrant-discard': 'Discard Forever',
          'tyrant-last': 'This is the last one, you have no choice!',
          'tyrant-input': 'Enter options',
          'tyrant-start': 'Start Dictatorship',
          
          // Pain Transfer
          'pain-transfer': 'Pain Transfer',
          'pain-transfer-title': 'Pain Transfer',
          'pain-transfer-desc': 'Let friends make choices for you, hand over your fate',
          'pain-transfer-option': 'Option',
          'pain-transfer-add-option': 'Add more options',
          'pain-transfer-generate': 'Generate Share Link',
          'pain-transfer-copied': 'Link copied!',
          'pain-transfer-waiting': 'Waiting for friend',
          'pain-transfer-scanning': 'Scanning...',
          'pain-transfer-waiting-desc': 'Waiting for friend to open link and decide',
          'pain-transfer-share-hint': 'Send to friend and let them decide for you',
          'pain-transfer-restart': 'Choose Again',
          'pain-transfer-stay-open': 'Keep this page open, it will update when friend decides',
          'pain-transfer-friend': 'Help friend decide',
          'pain-transfer-friend-title': 'Your friend needs you!',
          'pain-transfer-friend-desc': 'They are struggling with these options, click one to end their pain',
          'pain-transfer-friend-choice': 'Your choice will decide your friend\'s fate',
          'pain-transfer-result': 'Fate Decided',
          'pain-transfer-friend-decision': 'You have successfully decided your friend\'s fate',
          'pain-transfer-copy-result': 'Copy & Tell Them',
          'pain-transfer-link-ready': 'Link copied!',
          'pain-transfer-link-ready-desc': 'Send it to your friend and wait for their reply~',
          
          // Toxicity Test
          'toxicity-test': 'Toxicity Test',
          'toxicity-test-desc': 'Reverse elimination to find the least bad choice',
          'toxicity-option': 'Option',
          'toxicity-add-option': 'Add more options',
          'toxicity-start': 'Start Test',
          'toxicity-tip': 'Assuming the worst case happens, which disappointment can you better tolerate?',
          'toxicity-worst-case': 'Assuming the worst case happens',
          'toxicity-question': 'Which disappointment can you better tolerate?',
          'toxicity-remaining': 'Remaining',
          'toxicity-options': 'options',
          'toxicity-result': 'The Least Bad Choice',
          'toxicity-result-desc': 'This is the one you can accept even if the worst happens',
          
          // Common
          'submit': 'Submit',
          'cancel': 'Cancel',
          'ok': 'OK',
          'yes': 'Yes',
          'no': 'No'
        }
      }
    }
  })

export default i18n