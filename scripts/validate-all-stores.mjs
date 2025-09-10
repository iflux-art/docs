#!/usr/bin/env node

// 验证所有store是否正确导出
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const storesDir = join(projectRoot, 'src', 'stores');

console.log('验证store索引文件...\n');

// 读取index.ts文件
const indexPath = join(storesDir, 'index.ts');
const indexContent = fs.readFileSync(indexPath, 'utf8');

// 定义store名称到导出名称的映射
const STORE_MAPPINGS = {
  'app-store': 'useAppStore',
  'docs-global-structure-store': 'useDocsGlobalStructureStore',
  'docs-store': 'useDocsStore',
  // 'friends-store': 'useFriendsStore',  // 已移除友链版块
  'layout-store': 'useLayoutStore',
  // 'navbar-store': 'useNavbarStore',  // 已移动到 src/features/navbar/stores/
  // 'search-store': 'useSearchStore',  // 已移动到 src/features/search/stores/
  // 'theme-store': 'useThemeStore',  // 已移动到 src/features/theme/
};

// 特殊处理的store（不在src/stores目录下）
const SPECIAL_STORES = {
  'navbar-store': {
    path: '../features/navbar/stores/navbar-store.standard',
    exportName: 'useNavbarStore'
  },
  'search-store': {
    path: '../features/search/stores/search-store.standard',
    exportName: 'useSearchStore'
  },
  'theme-store': {
    path: '../features/theme/theme-store',
    exportName: 'useThemeStore'
  }
};

// 获取所有标准化store文件
const standardStoreFiles = Object.keys(STORE_MAPPINGS);
const specialStoreFiles = Object.keys(SPECIAL_STORES);

console.log(`发现 ${standardStoreFiles.length} 个标准化store:`);
console.log(standardStoreFiles.map(f => `- ${f}`).join('\n'));

if (specialStoreFiles.length > 0) {
  console.log(`\n发现 ${specialStoreFiles.length} 个特殊处理的store:`);
  console.log(specialStoreFiles.map(f => `- ${f}`).join('\n'));
}

// 检查index.ts中是否正确导出了所有标准store
let passed = 0;
let failed = 0;

for (const storeName of standardStoreFiles) {
  const exportName = STORE_MAPPINGS[storeName];
  const exportLine = `export { ${exportName} } from "./${storeName}.standard";`;
  
  if (indexContent.includes(exportLine)) {
    console.log(`✅ ${storeName}: 正确导出为 ${exportName}`);
    passed++;
  } else {
    console.error(`❌ ${storeName}: 缺少导出或导出格式不正确`);
    console.error(`   应该包含: ${exportLine}`);
    failed++;
  }
}

// 检查特殊处理的store是否在正确的文件中导出
for (const [storeName, config] of Object.entries(SPECIAL_STORES)) {
  const exportLine = `export { ${config.exportName} } from "${config.path}";`;
  
  // 检查主index.ts是否正确导出
  if (indexContent.includes(exportLine)) {
    console.log(`✅ ${storeName}: 正确导出为 ${config.exportName}`);
    passed++;
  } else {
    // 检查是否在原来的stores/index.ts中有注释说明已移动
    const movedComment = `// 已移动到 src/features/${storeName.split('-')[0]} 目录下集中管理`;
    if (indexContent.includes(movedComment)) {
      console.log(`✅ ${storeName}: 已正确标记为已移动`);
      passed++;
    } else {
      console.error(`❌ ${storeName}: 缺少导出或导出格式不正确`);
      console.error(`   应该包含: ${exportLine}`);
      console.error(`   或者包含注释: ${movedComment}`);
      failed++;
    }
  }
}

// 检查是否有重复导出
const exportMatches = indexContent.match(/export { use\w+Store }/g);
if (exportMatches) {
  const uniqueExports = new Set(exportMatches);
  if (uniqueExports.size !== exportMatches.length) {
    console.error(`\n❌ 发现重复导出`);
    failed++;
  }
}

console.log(`\n验证完成:`);
console.log(`✅ 通过: ${passed}`);
console.log(`❌ 失败: ${failed}`);
console.log(`总计: ${standardStoreFiles.length}`);

process.exit(failed > 0 ? 1 : 0);