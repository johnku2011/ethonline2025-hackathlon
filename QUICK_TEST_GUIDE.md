# 🚀 快速測試指南

## 選項 A: 測試 Arbitrum Sepolia Testnet（推薦）⭐

### 前置條件
- ✅ MetaMask 已安裝
- ✅ Arbitrum Sepolia RPC 已配置
- ✅ 有一些 Sepolia ETH（用於 gas）

### 步驟 1: 啟動前端
```bash
cd frontend
pnpm dev
```

### 步驟 2: 連接錢包
1. 打開 http://localhost:3000
2. 點擊 "Connect Wallet"
3. 在 MetaMask 中切換到 **Arbitrum Sepolia** (Chain ID: 421614)

### 步驟 3: 獲取測試代幣（使用 Lab 工具）
```bash
# 在另一個 Terminal
cd lab/EVM_Subscription_Contracts

# Mint 1000 PYUSD 到你的地址
pnpm tsx scripts/interact.ts mint 1000

# 檢查餘額
pnpm tsx scripts/interact.ts balance
```

### 步驟 4: 創建測試 Plans（如果還沒有）
```bash
# 創建 5 個測試 Plans
pnpm tsx scripts/interact.ts create-plan 10 100 "Netflix Premium"
pnpm tsx scripts/interact.ts create-plan 12 120 "Spotify Premium"
pnpm tsx scripts/interact.ts create-plan 20 200 "ChatGPT Plus"
pnpm tsx scripts/interact.ts create-plan 7 70 "GitHub Pro"
pnpm tsx scripts/interact.ts create-plan 50 500 "Gym Membership"

# 驗證 Plans
pnpm tsx scripts/interact.ts get-plan 1
```

### 步驟 5: 測試訂閱流程
在前端：
1. 瀏覽 Subscriptions 頁面
2. 選擇一個 Plan
3. 勾選 "Stake Year Upfront" (可選)
4. 點擊 "Subscribe"
5. 在 MetaMask 中：
   - 批准 PYUSD 支出 (Approve)
   - 確認訂閱交易 (Subscribe)

### 步驟 6: 查看訂閱狀態
1. 滾動到頁面底部 "Your Subscriptions"
2. 驗證訂閱信息顯示正確
3. 注意 💡 提示：yield 會在取消時自動返還

### 步驟 7: 測試取消
1. 點擊 "Cancel Subscription"
2. 確認交易
3. 驗證退款（檢查 PYUSD 餘額）

---

## 選項 B: 測試 Localhost（需要部署）

### 步驟 1: 啟動 Hardhat 節點
```bash
# Terminal 1
cd contracts
npx hardhat node
```

### 步驟 2: 部署 Lab 版本合約
```bash
# Terminal 2
cd contracts

# 編譯合約
npx hardhat compile

# 部署（使用 Hardhat Ignition）
npx hardhat ignition deploy ignition/modules/SubscriptionManager.ts --network localhost

# 記錄合約地址
```

### 步驟 3: 更新前端配置
編輯 `frontend/src/lib/contracts/addresses.ts`:
```typescript
31337: {
  subscriptionManager: '0x...', // 從部署輸出複製
  pyusd: '0x...',
  morphoVault: '0x...',
},
```

### 步驟 4: 創建測試 Plans
```bash
# 使用 Hardhat console 或創建腳本
npx hardhat run scripts/create-demo-plans.ts --network localhost
```

### 步驟 5: 啟動前端並測試
```bash
# Terminal 3
cd frontend
pnpm dev
```

然後按照選項 A 的步驟 2-7 測試。

---

## ✅ 測試 Checklist

### 基礎功能
- [ ] 連接錢包成功
- [ ] 切換到正確網絡（Sepolia 或 Localhost）
- [ ] 可以看到可用 Plans
- [ ] PYUSD 餘額顯示正確

### 訂閱流程
- [ ] Approve PYUSD 成功
- [ ] 訂閱月度計劃成功
- [ ] 訂閱顯示在 "Your Subscriptions"
- [ ] 訂閱信息正確（價格、到期時間）

### Auto-pay 功能驗證
- [ ] UI 顯示 "Auto-Pay Enabled" ✓ 圖標
- [ ] 沒有 enableAutoPay checkbox（已移除）
- [ ] 訂閱時 auto-pay 默認啟用

### Stake Yearly 功能
- [ ] Stake Yearly checkbox 可用
- [ ] 勾選後價格變為年度價格
- [ ] Staked Amount 顯示正確

### 收益管理
- [ ] 沒有 "Withdraw Yield" 按鈕（已移除）
- [ ] 顯示提示：「💡 Yield will be automatically returned when you cancel」

### 取消流程
- [ ] 取消訂閱成功
- [ ] 收到退款（驗證餘額增加）
- [ ] 訂閱從列表中移除

---

## 🐛 常見問題

### 1. MetaMask 交易失敗
**症狀**: "Transaction reverted" 或 "Execution reverted"

**解決方案**:
- 檢查 PYUSD 餘額是否足夠
- 確認已 Approve 足夠的額度
- 驗證合約地址正確
- 使用 Lab interact.ts 測試合約是否正常

### 2. 看不到 Plans
**症狀**: "No subscription plans available yet"

**解決方案**:
- 確認網絡 ID 正確（421614 或 31337）
- 使用 interact.ts 創建 Plans
- 檢查 Plans 是否 `isActive = true`

### 3. Approve 失敗
**症狀**: Approve 交易 revert

**解決方案**:
- 確認 PYUSD 合約地址正確
- 檢查是否有足夠的 gas
- 嘗試先 reset allowance 到 0

### 4. 前端連接錯誤
**症狀**: "Could not fetch subscription"

**解決方案**:
- 檢查 wagmi 配置
- 確認 RPC URL 可用
- 查看瀏覽器 Console 錯誤訊息
- 驗證 ABI 與合約匹配

### 5. 參數錯誤
**症狀**: "Invalid argument" 或 "Wrong number of arguments"

**原因**: 可能使用了舊版 ABI

**解決方案**:
- 確認已提交最新的 ABI (Commit 6)
- 清除瀏覽器緩存
- 重啟開發服務器

---

## 🔍 調試工具

### 使用 Lab interact.ts 測試合約
```bash
cd lab/EVM_Subscription_Contracts

# 查看合約信息
pnpm tsx scripts/interact.ts info

# 查看 Plan
pnpm tsx scripts/interact.ts get-plan 1

# 查看訂閱
pnpm tsx scripts/interact.ts get-subscription <YOUR_ADDRESS> 1

# 監聽事件
pnpm tsx scripts/interact.ts watch
```

### 瀏覽器 Console
```javascript
// 檢查合約地址
console.log('Contract Addresses:', CONTRACT_ADDRESSES[421614])

// 檢查網絡 ID
console.log('Current Chain ID:', window.ethereum.chainId)

// 檢查 wagmi 狀態
// (在 React DevTools 中查看 hooks)
```

### Hardhat Console（Localhost）
```bash
cd contracts
npx hardhat console --network localhost

# 在 console 中：
const SubscriptionManager = await ethers.getContractAt("SubscriptionManager", "0x...")
const plan = await SubscriptionManager.subscriptionPlans(1)
console.log(plan)
```

---

## 📊 預期結果

### 成功的訂閱流程
1. ✅ 兩次 MetaMask 彈窗（Approve + Subscribe）
2. ✅ "Your Subscriptions" 顯示新訂閱
3. ✅ 訂閱卡片顯示：
   - Plan 名稱
   - 價格（Monthly/Yearly）
   - 到期時間
   - Status: Active ✓
   - (可選) Staked Amount

### 成功的取消流程
1. ✅ 一次 MetaMask 彈窗（Cancel）
2. ✅ 訂閱從列表消失
3. ✅ PYUSD 餘額增加（退款）

---

## 🎯 下一步

測試完成後：
1. ✅ 記錄任何發現的 bugs
2. ✅ 創建更多測試 Plans（如果需要）
3. ✅ 準備 Demo 演示腳本
4. ✅ 考慮添加更多 UI 優化（Toast、Loading 等）

---

## 💡 Pro Tips

1. **使用 Lab interact.ts**：這是最可靠的測試工具
2. **保持 Terminal 開啟**：可以看到實時 logs
3. **檢查 MetaMask Activity**：驗證所有交易
4. **使用 Sepolia Explorer**：查看鏈上數據
5. **定期清除緩存**：避免緩存問題

---

**準備好開始測試了嗎？** 🚀

選擇選項 A（Testnet）或選項 B（Localhost），開始你的測試之旅！

