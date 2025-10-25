# Interact CLI Tool

強大的命令行工具，用於與 SubscriptionManager 合約互動。

## 📦 安裝

```bash
cd contracts
pnpm install
```

## ⚙️ 配置

在 `contracts/.env` 中設置以下環境變量：

```bash
# 私鑰（用於簽署交易）
PRIVATE_KEY=0x...

# Arbitrum Sepolia RPC
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc

# 合約地址（部署後填入）
SUBSCRIPTION_MANAGER_ADDRESS=0x...
MOCK_PYUSD_ADDRESS=0x...
MOCK_VAULT_ADDRESS=0x...
```

## 🚀 使用方法

### 基礎命令

```bash
# 查看合約信息
npx tsx scripts/interact.ts info

# 查看 PYUSD 餘額
npx tsx scripts/interact.ts balance

# Mint 測試代幣
npx tsx scripts/interact.ts mint 1000

# 批准代幣支出
npx tsx scripts/interact.ts approve 1000
```

### Plans 管理

```bash
# 創建訂閱 Plan（Owner only）
npx tsx scripts/interact.ts create-plan 10 100 "Premium Plan"
# 參數：月費 年費 名稱

# 查看 Plan 詳情
npx tsx scripts/interact.ts get-plan 1
```

### 訂閱操作

```bash
# 月度訂閱（可選質押年度金額）
npx tsx scripts/interact.ts subscribe 1 true
# 參數：planId stakeYearly(true/false)

# 年度訂閱
npx tsx scripts/interact.ts subscribe-yearly 1

# 查看訂閱詳情
npx tsx scripts/interact.ts get-subscription

# 查看用戶所有活躍訂閱
npx tsx scripts/interact.ts active

# 取消訂閱
npx tsx scripts/interact.ts cancel 1
```

## 📝 完整流程示例

```bash
# 1. Mint 測試代幣
npx tsx scripts/interact.ts mint 1000

# 2. 查看餘額
npx tsx scripts/interact.ts balance

# 3. 批准支出
npx tsx scripts/interact.ts approve 500

# 4. 查看可用 Plans
npx tsx scripts/interact.ts get-plan 1

# 5. 訂閱（質押年度金額）
npx tsx scripts/interact.ts subscribe 1 true

# 6. 查看訂閱狀態
npx tsx scripts/interact.ts get-subscription

# 7. 查看活躍訂閱
npx tsx scripts/interact.ts active

# 8. 取消訂閱
npx tsx scripts/interact.ts cancel 1
```

## 🔧 開發說明

這個工具由 4 個模塊組成：

- `interact-config.ts` - 配置和基礎設置
- `interact-functions.ts` - 讀取操作
- `interact-write.ts` - 寫入操作
- `interact.ts` - CLI 入口

**為什麼分模塊？**
- 每個文件 <100 行，符合 Hackathon commit 規範
- 模塊化設計，易於維護和測試
- 可以單獨導入使用（例如在測試腳本中）

## 🎯 注意事項

1. **首次使用**：確保先部署合約，並配置 `.env`
2. **Testnet 使用**：目前配置為 Arbitrum Sepolia
3. **Gas 費用**：確保錢包有足夠的 Sepolia ETH
4. **MockPyUSD**：只在測試網可以 mint

## 📚 更多資訊

- 合約文檔：`../contracts/SubscriptionManager.sol`
- 部署指南：`../README.md`
- 前端整合：`../../frontend/`

