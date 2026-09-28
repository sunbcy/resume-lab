/**
 * 深度合并：src 覆盖到 dist 上（用于 locales 覆盖合并）
 * 与原项目 helpers/customAssign 行为一致
 */
const MAX_MIX_LEVEL = 5;
const toString = Object.prototype.toString;

const isType = (value: unknown, type: string): boolean =>
  toString.call(value) === `[object ${type}]`;

const isObjectLike = (value: unknown): value is object =>
  typeof value === 'object' && value !== null;

const isPlainObject = (value: unknown): value is object => {
  if (!isObjectLike(value) || !isType(value, 'Object')) return false;
  let proto: object = value;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(value) === proto;
};

const deep = (
  dist: Record<string, any>,
  src: Record<string, any>,
  level = 0,
  maxLevel = MAX_MIX_LEVEL,
) => {
  for (const key in src) {
    if (!Object.prototype.hasOwnProperty.call(src, key)) continue;
    const value = src[key];
    if (!value) {
      dist[key] = value;
    } else if (isPlainObject(value)) {
      if (!isPlainObject(dist[key])) dist[key] = {};
      if (level < maxLevel) {
        deep(dist[key], value, level + 1, maxLevel);
      } else {
        dist[key] = src[key];
      }
    } else {
      dist[key] = value;
    }
  }
};

export function customAssign<T extends Record<string, any>>(
  rst: T,
  ...args: Array<Record<string, any> | undefined>
): T {
  for (const src of args) {
    if (src) deep(rst as Record<string, any>, src);
  }
  return rst;
}

/** 去掉 locales 字段后的配置（渲染/存储只保留当前语言） */
export function omitLocales<T extends Record<string, any>>(obj: T): T {
  const next = { ...obj };
  delete next.locales;
  return next;
}
