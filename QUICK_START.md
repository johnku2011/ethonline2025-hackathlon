# ⚡ 快速開始指南

**5 分鐘內開始測試！**

---

## 🎯 核心結論

### ✅ 好消息：一切就緒！

1. **Lab 合約已部署** ✅
   - Arbitrum Sepolia: `0x84Bd1674AEdCEdE32caAE8bA405e0E9a23AB5179`
   - 5 個 Demo Plans 已創建（Basic/Netflix/Spotify/ChatGPT/GitHub）

2. **前端已配置** ✅
   - 合約地址已設置
   - ABI 已更新
   - `useAllPlans` hook 已實現
   - 支援 Arbitrum Sepolia (421614)

3. **Lab 工具可用** ✅
   - `lab/EVM_Subscription_Contracts/scripts/interact.ts`
   - 可以 mint 代幣、創建 Plans、查詢狀態

### 🔑 關鍵發現

**Lab 的 interact.ts 和前端使用的是同一套合約！**

這意味著：
- ✅ 你可以用 Lab CLI 創建 Plans
- ✅ 前端會自動讀取這些 Plans
- ✅ 用戶在前端訂閱後，可以用 CLI 查看狀態
- ✅ 完美的工具組合：CLI (管理) + Web UI (用戶體驗)

---

## 🚀 立即開始（3 個步驟）

### Step 1: 啟動前端（1 分鐘）

```bash
cd frontend
pnpm dev
```

打開 `http://localhost:3000`

### Step 2: 連接 MetaMask（1 分鐘）

1. 點擊 "Connect Wallet"
2. 切換到 **Arbitrum Sepolia** (Chain ID: 421614)
3. 導航到 `/subscriptions` 頁面

**你應該看到 5 個 Plans！** 🎉

### Step 3: 準備測試代幣（1 分鐘）

```bash
# 新的 Terminal
cd lab/EVM_Subscription_Contracts

# Mint 1000 PYUSD 到你的地址
npx tsx scripts/interact.ts mint 1000

# 檢查餘額
npx tsx scripts/interact.ts balance
```

---

## 📝 測試訂閱流程（5 分鐘）

### 在前端 UI:

1. **選擇 Plan**: 點擊 "GitHub Pro" (最便宜 - 7 PYUSD/月)

2. **（可選）質押年度**: 勾選 "Stake Year Upfront" checkbox

3. **訂閱**: 點擊 "Subscribe Monthly"

4. **MetaMask 確認** (會彈出 2 次):
   - 第一次: Approve PYUSD 支出
   - 第二次: Subscribe 交易

5. **查看訂閱**: 滾動到 "Your Subscriptions" 區域

### 用 Lab CLI 驗證:

```bash
# 查看你的訂閱
npx tsx scripts/interact.ts get-subscription <YOUR_ADDRESS> 5

# 或查看所有活躍訂閱
npx tsx scripts/interact.ts active
```

---

## 🛠️ Lab CLI 常用命令

```bash
cd lab/EVM_Subscription_Contracts

# 查看合約信息
npx tsx scripts/interact.ts info

# Mint 測試代幣
npx tsx scripts/interact.ts mint 1000

# 查看餘額
npx tsx scripts/interact.ts balance

# 查看 Plan 詳情
npx tsx scripts/interact.ts get-plan 1

# 創建新 Plan (owner only)
npx tsx scripts/interact.ts create-plan 5 50 "New Plan"

# 監聽事件
npx tsx scripts/interact.ts watch
```

完整命令列表: `lab/EVM_Subscription_Contracts/scripts/README.md`

---

## 📋 5 個已創建的 Plans

| ID | 名稱 | 月費 | 年費 | 適合測試 |
|----|------|------|------|---------|
| 1 | Basic Plan | 0.1 | 1 | ⭐ 最便宜 |
| 2 | Netflix Premium | 10 | 100 | 中等 |
| 3 | Spotify Premium | 12 | 120 | 中等 |
| 4 | ChatGPT Plus | 20 | 200 | 較貴 |
| 5 | GitHub Pro | 7 | 70 | ⭐ 推薦測試 |

**建議**: 先用 Plan 1 或 Plan 5 測試（價格較低）

---

## 🎬 Demo 演示（2 分鐘腳本）

### 準備

```bash
# Terminal 1: 前端
cd frontend && pnpm dev

# Terminal 2: Lab CLI (用於演示管理功能)
cd lab/EVM_Subscription_Contracts
npx tsx scripts/interact.ts watch
```

### 演示流程

1. **[0-20s] 介紹**
   - "PyUSD 訂閱平台，支援月付/年付，自動續訂，賺取收益"

2. **[20-40s] 展示 Plans**
   - 連接錢包，展示 5 個 Plans
   - 強調：從智能合約動態讀取

3. **[40-70s] 訂閱演示**
   - 選擇 "GitHub Pro"
   - 勾選 "Stake Year Upfront"
   - Subscribe + MetaMask 確認
   - CLI 顯示 "SubscriptionCreated" 事件 ⭐

4. **[70-90s] 查看訂閱**
   - 前端顯示訂閱詳情
   - （可選）CLI 查詢驗證

5. **[90-110s] 取消演示**
   - Cancel Subscription
   - 展示退款

6. **[110-120s] 總結**
   - 技術亮點 + 用戶價值

---

## 🎯 技術亮點（Demo 時強調）

### 1. **完整的工具鏈**
- Web UI: 用戶友好的訂閱體驗
- CLI: 強大的管理和查詢工具
- 兩者使用同一套智能合約

### 2. **真實場景**
- 5 個不同價格點的訂閱服務
- 模擬 Netflix、Spotify 等真實案例

### 3. **兩種業務模型**
- 月度訂閱（可選質押年度金額賺收益）
- 年度訂閱（全額自動質押）

### 4. **DeFi 整合**
- PyUSD 穩定幣支付
- Morpho Vault 收益生成
- Arbitrum L2 低成本

### 5. **自動化**
- Auto-pay 默認啟用
- 收益自動管理
- 取消時自動返還

---

## 🐛 常見問題

### Q1: 前端看不到 Plans？

**檢查**:
- MetaMask 是否切換到 Arbitrum Sepolia (421614)
- 瀏覽器 Console 是否有錯誤

**驗證**:
```bash
npx tsx scripts/interact.ts get-plan 1
```

### Q2: Approve 失敗？

**原因**: PYUSD 餘額不足

**解決**:
```bash
npx tsx scripts/interact.ts mint 1000
```

### Q3: Subscribe 失敗？

**原因**: Approve 額度不足或 Gas 不足

**解決**:
```bash
# 增加 Approve 額度
npx tsx scripts/interact.ts approve 1000

# 確保有 Sepolia ETH (用於 gas)
```

---

## 📊 現在的狀態

```
✅ Lab 合約已部署並驗證
✅ 5 個 Demo Plans 已創建
✅ 前端已配置並適配
✅ Lab CLI 工具可用
✅ 整合完成，可以測試

⏳ 待測試：前端訂閱流程
⏳ 待測試：取消訂閱流程
⏳ 待完成：Demo 腳本準備
```

---

## 🎉 準備好了嗎？

**你現在可以**:
1. ✅ 啟動前端看到 Plans
2. ✅ 用 CLI Mint 測試代幣
3. ✅ 在前端訂閱服務
4. ✅ 用 CLI 查詢鏈上狀態
5. ✅ 展示完整的工具鏈

**開始吧！** 🚀

```bash
# 啟動前端
cd frontend && pnpm dev

# 打開瀏覽器
open http://localhost:3000
```

---

**需要更詳細的信息？**  
查看 `FRONTEND_LAB_INTEGRATION_STATUS.md` 📄

