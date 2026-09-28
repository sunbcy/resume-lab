"""简历数据服务：GitHub 抓取 + 服务端缓存 + locale 合并"""

import copy
import time
from typing import Any, Dict

import httpx

from .config import CACHE_TTL, GITHUB_RAW_TEMPLATE, REQUEST_TIMEOUT
from .default_resume import DEFAULT_RESUME

MAX_MERGE_LEVEL = 5

# 简易内存缓存：{cache_key: (timestamp, data)}
_CACHE: Dict[str, tuple] = {}


def deep_merge(dst: Dict[str, Any], src: Dict[str, Any], level: int = 0) -> Dict[str, Any]:
    """深合并：src 覆盖 dst（对应前端 customAssign 的行为）"""
    for key, value in src.items():
        if not value:
            dst[key] = value
        elif isinstance(value, dict):
            if not isinstance(dst.get(key), dict):
                dst[key] = {}
            if level < MAX_MERGE_LEVEL:
                deep_merge(dst[key], value, level + 1)
            else:
                dst[key] = value
        else:
            dst[key] = value
    return dst


def merge_locale(raw: Dict[str, Any], lang: str) -> Dict[str, Any]:
    """合并指定语言的配置，并去掉 locales 字段"""
    merged = deep_merge(copy.deepcopy(raw), (raw.get("locales") or {}).get(lang) or {})
    merged.pop("locales", None)
    return merged


async def fetch_raw(user: str, branch: str) -> Dict[str, Any]:
    """从 GitHub 同名仓库拉取 resume.json（带 TTL 缓存）"""
    cache_key = f"{user}:{branch}"
    now = time.time()

    cached = _CACHE.get(cache_key)
    if cached and now - cached[0] < CACHE_TTL:
        return cached[1]

    url = GITHUB_RAW_TEMPLATE.format(user=user, branch=branch)
    async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT, follow_redirects=True) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        data = resp.json()

    _CACHE[cache_key] = (now, data)
    return data


def clear_cache() -> None:
    _CACHE.clear()


async def get_resume(user: str, branch: str, lang: str) -> Dict[str, Any]:
    """返回 {"config": 合并后配置, "raw": 原始数据}"""
    raw = await fetch_raw(user, branch)
    return {"config": merge_locale(raw, lang), "raw": raw}


async def get_default_resume(lang: str) -> Dict[str, Any]:
    """默认模板数据"""
    raw = copy.deepcopy(DEFAULT_RESUME)
    return {"config": merge_locale(raw, lang), "raw": raw}
