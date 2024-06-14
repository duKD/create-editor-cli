import minimist from "minimist";
import fs from "node:fs";
import path from "node:path";
export const getParams = () =>
  minimist<{
    t?: string;
    template?: string;
  }>(process.argv.slice(2), { string: ["_"] });

export const formatTargetDir = (targetDir: string | undefined) => {
  return targetDir?.trim().replace(/\/+$/g, "");
};

/**
 * 检查给定的项目名称是否为有效的包名称。
 *
 * 有效的包名称应符合以下规则：
 * - 可以选择以 @ 符号开头，后面跟着一个组织名或用户名，接着是一个斜杠 (/)。
 * - 接下来是包名，由字母、数字、连字符、下划线、点和波浪线组成。
 * - 包名不能以连字符或点开头或结尾。
 * - 包名中不允许使用空格。
 *
 * @param projectName 要检查的项目名称。
 * @returns 如果项目名称是有效的包名称，则返回 true；否则返回 false。
 */
export const isValidPackageName = (projectName: string) => {
  if (!projectName) return false;
  // 使用正则表达式测试项目名称是否符合有效的包名称格式。
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
    projectName
  );
};

/**
 * 将给定的项目名称转换为有效的包名称格式。
 *
 * 有效的包名称应满足以下条件：
 * - 去除首尾空格。
 * - 转换为小写字母。
 * - 将连续的空格替换为单个破折号。
 * - 删除开头的下划线或点号。
 * - 将非字母、数字、破折号或波浪线的字符替换为破折号。
 *
 * 这样处理的目的是为了确保包名称符合常见的命名规范，
 * 以便在各种编程环境中使用和引用。
 *
 * @param projectName 待转换的项目名称。
 * @returns 转换后的有效包名称。
 */
export const toValidPackageName = (projectName: string) => {
  // 去除首尾空格并转换为小写
  return (
    projectName
      .trim()
      .toLowerCase()
      // 将连续空格替换为单个破折号
      .replace(/\s+/g, "-")
      // 删除开头的下划线或点号
      .replace(/^[._]/, "")
      // 将非字母、数字、破折号或波浪线的字符替换为破折号
      .replace(/[^a-z\d\-~]+/g, "-")
  );
};

export const emptyDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const file of fs.readdirSync(dir)) {
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
  }
};
