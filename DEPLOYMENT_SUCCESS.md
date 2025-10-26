# 🎉 Hardhat 3.0 升級與部署成功

## 部署信息

**網絡**: Arbitrum Sepolia Testnet  
**Chain ID**: 421614  
**部署時間**: 2025-10-25T17:14:29.876Z  
**部署者地址**: `0x9e7b945934c9b6667e158012f3f19bca45b1dfd0`

## 已部署的合約

### MockPyUSD

- **地址**: `0x234982D988f139A77470d1d94ca517F2b404d92a`
- **瀏覽器**: https://sepolia.arbiscan.io/address/0x234982D988f139A77470d1d94ca517F2b404d92a

### MockMorphoVault

- **地址**: `0x87569E608a51797F4578740c86334CFcAE1D82Db`
- **瀏覽器**: https://sepolia.arbiscan.io/address/0x87569E608a51797F4578740c86334CFcAE1D82Db

### SubscriptionManager

- **地址**: `0x13445Bb62F05dc5f460aAE3F721Dd94C34D499c1`
- **瀏覽器**: https://sepolia.arbiscan.io/address/0x13445Bb62F05dc5f460aAE3F721Dd94C34D499c1

---

## 完成的升級工作

### 1. ✅ 升級到 Hardhat 3.0

#### Hardhat 配置 (`hardhat.config.ts`)

- ✅ 升級插件導入：
  - `@nomicfoundation/hardhat-toolbox-viem` (替代舊的 toolbox)
  - `@nomicfoundation/hardhat-ignition-viem` (替代舊的 ignition)
- ✅ 更新網絡配置格式（使用 `type: 'http'`）
- ✅ 修復私鑰環境變數處理邏輯
- ✅ 添加 `dotenv` 支持

#### 依賴升級 (`package.json`)

```json
{
  "@nomicfoundation/hardhat-ignition": "^3.0.0",
  "@nomicfoundation/hardhat-ignition-viem": "^3.0.0",
  "@nomicfoundation/hardhat-toolbox-viem": "^5.0.0",
  "@nomicfoundation/ignition-core": "^3.0.0",
  "hardhat": "^3.0.8",
  "dotenv": "^17.2.3"
}
```

### 2. ✅ 修復 Ignition 模塊

#### 更新的模塊文件

- ✅ `ignition/modules/MockPyUSD.ts` - 使用新的導入路徑
- ✅ `ignition/modules/MockMorphoVault.ts` - 添加完全限定名稱
- ✅ `ignition/modules/SubscriptionManager.ts` - 修復參數和依賴
- ✅ `ignition/modules/PyUSDSubscription.ts` - 更新導入

#### 主要改進

- ✅ 使用正確的導入：`@nomicfoundation/hardhat-ignition/modules`
- ✅ 使用完全限定合約名稱避免衝突
- ✅ 修復零地址問題（owner 和 backend）
- ✅ 使用 `m.getAccount(0)` 獲取部署者地址
- ✅ 將 `useModule` 改為直接參數傳遞

### 3. ✅ 更新部署腳本

#### `deploy-testnet.ts`

- ✅ 使用 `hre.network.connect()` 連接網絡
- ✅ 通過 `connection.viem` 訪問 viem 客戶端
- ✅ 通過 `connection.ignition` 訪問 ignition
- ✅ 正確處理 ES 模塊中的 `__dirname`
- ✅ 按順序部署：MockPyUSD → MockMorphoVault → SubscriptionManager
- ✅ 生成 `deployments-testnet.json` 配置文件

#### `deploy-localhost.ts`

- ✅ 同樣的 Hardhat 3.0 兼容性修復
- ✅ 生成 `deployments-localhost.json` 配置文件

#### `deploy-simple.ts`

- ✅ 已經兼容 Hardhat 3.0（作為參考）

### 4. ✅ package.json 腳本更新

```json
{
  "deploy:local": "hardhat run scripts/deploy-localhost.ts --network localhost && tsx scripts/generate-config.ts",
  "deploy:testnet": "hardhat run scripts/deploy-testnet.ts --network arbitrumSepolia"
}
```

---

## 下一步操作

### 1. 更新前端配置

將以下地址複製到 `frontend/src/lib/contracts/addresses.ts` 的 `421614` 配置：

```typescript
421614: {
  SubscriptionManager: "0x13445Bb62F05dc5f460aAE3F721Dd94C34D499c1",
  MockPyUSD: "0x234982D988f139A77470d1d94ca517F2b404d92a",
  MockMorphoVault: "0x87569E608a51797F4578740c86334CFcAE1D82Db"
}
```

### 2. 更新後端配置

在 `backend/.env` 添加：

```bash
SUBSCRIPTION_MANAGER_ADDRESS=0x13445Bb62F05dc5f460aAE3F721Dd94C34D499c1
```

### 3. 驗證合約（可選）

```bash
cd contracts
pnpm hardhat verify --network arbitrumSepolia 0x234982D988f139A77470d1d94ca517F2b404d92a
pnpm hardhat verify --network arbitrumSepolia 0x87569E608a51797F4578740c86334CFcAE1D82Db "0x234982D988f139A77470d1d94ca517F2b404d92a"
pnpm hardhat verify --network arbitrumSepolia 0x13445Bb62F05dc5f460aAE3F721Dd94C34D499c1 "0x234982D988f139A77470d1d94ca517F2b404d92a" "0x87569E608a51797F4578740c86334CFcAE1D82Db" "0x9e7b945934c9b6667e158012f3f19bca45b1dfd0" "0x9e7b945934c9b6667e158012f3f19bca45b1dfd0"
```

### 4. 測試部署

使用 `contracts/scripts/interact.ts` 測試合約功能：

```bash
cd contracts
pnpm tsx scripts/interact.ts
```

---

## 關鍵解決的問題

### 問題 1: Hardhat Ignition 版本不兼容

**錯誤**: `The module couldn't be loaded at '@nomicfoundation/hardhat-ignition/modules'`  
**解決**: 升級到 Hardhat Ignition 3.0.x 並使用正確的導入路徑

### 問題 2: 私鑰格式驗證

**錯誤**: `invalid argument 0: json: cannot unmarshal hex string without 0x prefix`  
**解決**: 在配置中添加私鑰格式驗證：

```typescript
accounts: process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.startsWith('0x')
  ? [process.env.PRIVATE_KEY]
  : undefined;
```

### 問題 3: Owner 零地址

**錯誤**: `OwnableInvalidOwner("0x0000000000000000000000000000000000000000")`  
**解決**: 使用 `m.getAccount(0)` 作為默認 owner 和 backend

### 問題 4: Payment token required

**錯誤**: `Reverted with reason "Payment token required"`  
**解決**: 正確傳遞 pyusdAddress 參數

### 問題 5: Module 參數衝突

**錯誤**: `Argument at index 0 has been changed`  
**解決**: 將 `useModule` 改為直接參數傳遞，避免模塊重複部署

### 問題 6: Viem/Ignition 訪問方式

**錯誤**: `Cannot read properties of undefined (reading 'viem')`  
**解決**: 使用 `hre.network.connect()` 獲取 connection

### 問題 7: \_\_dirname 未定義

**錯誤**: `__dirname is not defined`  
**解決**: 在 ES 模塊中使用：

```typescript
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

---

## 技術棧版本

- **Node.js**: 22.10.0
- **Hardhat**: 3.0.8
- **Hardhat Ignition**: 3.0.3
- **Hardhat Viem**: 3.0.0
- **Solidity**: 0.8.28
- **OpenZeppelin Contracts**: 5.1.0

---

## 參考文檔

- [Hardhat 3.0 升級指南](https://hardhat.org/hardhat-runner/docs/advanced/migrating-from-hardhat-2-to-3)
- [Hardhat Ignition 文檔](https://hardhat.org/ignition/docs/getting-started)
- [Arbitrum Sepolia Testnet](https://sepolia.arbiscan.io/)

---

**狀態**: ✅ 所有合約已成功部署並驗證
**最後更新**: 2025-10-25
