#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 项目根目录
const projectRoot = path.resolve(__dirname, '..');

// 重构的store文件列表
const STANDARD_STORE_FILES = [
  'app-store.standard.ts',
  'blog-page-store.standard.ts',
  'blog-store.standard.ts',
  'docs-global-structure-store.standard.ts',
  'docs-store.standard.ts',
  // 'friends-store.standard.ts',  // 已移除友链版块
  'layout-store.standard.ts',
  'navbar-store.standard.ts',
  'search-store.standard.ts',
  'theme-store.standard.ts',
];

// 验证函数
function validateStoreFile(fileName) {
  const filePath = path.join(projectRoot, 'src', 'stores', fileName);
  
  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    console.error(`❌ 文件不存在: ${fileName}`);
    return false;
  }
  
  // 读取文件内容
  const content = fs.readFileSync(filePath, 'utf8');
  
  // 检查必需的接口是否存在
  const requiredInterfaces = ['State', 'Actions', 'DerivedState', 'Store'];
  const missingInterfaces = requiredInterfaces.filter(interfaceName => 
    !content.includes(`export interface ${interfaceName}`)
  );
  
  if (missingInterfaces.length > 0) {
    console.error(`❌ ${fileName} 缺少接口: ${missingInterfaces.join(', ')}`);
    return false;
  }
  
  // 检查initialState是否存在
  if (!content.includes('export const initialState')) {
    console.error(`❌ ${fileName} 缺少 initialState`);
    return false;
  }
  
  // 检查createStore函数是否存在
  if (!content.includes('export const createStore')) {
    console.error(`❌ ${fileName} 缺少 createStore 函数`);
    return false;
  }
  
  // 检查默认导出是否存在
  if (!content.includes('export const use')) {
    console.error(`❌ ${fileName} 缺少默认导出`);
    return false;
  }
  
  // 检查resetState方法是否存在
  if (!content.includes('resetState:')) {
    console.error(`❌ ${fileName} 缺少 resetState 方法`);
    return false;
  }
  
  console.log(`✅ ${fileName} 验证通过`);
  return true;
}

// 验证所有store文件
console.log('开始验证重构的store文件...\n');

let passed = 0;
let failed = 0;

for (const file of STANDARD_STORE_FILES) {
  if (validateStoreFile(file)) {
    passed++;
  } else {
    failed++;
  }
}

console.log(`\n验证完成:`);
console.log(`✅ 通过: ${passed}`);
console.log(`❌ 失败: ${failed}`);
console.log(`总计: ${STANDARD_STORE_FILES.length}`);

if (failed > 0) {
  process.exit(1);
}