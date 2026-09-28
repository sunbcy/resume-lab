"""API 路由"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Any, Dict

from . import services

router = APIRouter()


class ResumeResponse(BaseModel):
    config: Dict[str, Any]
    raw: Dict[str, Any]


@router.get("/health")
async def health() -> Dict[str, str]:
    return {"status": "ok"}


@router.get("/resume", response_model=ResumeResponse)
async def get_resume(
    user: str = Query(..., description="GitHub 用户名"),
    branch: str = Query("master", description="分支名"),
    lang: str = Query("zh_CN", description="语言：zh_CN / en_US"),
) -> ResumeResponse:
    """拉取用户仓库中的 resume.json，并按语言合并后返回"""
    try:
        data = await services.get_resume(user, branch, lang)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=f"无法获取简历数据: {exc}")
    return ResumeResponse(**data)


@router.get("/resume/default", response_model=ResumeResponse)
async def get_default_resume(
    lang: str = Query("zh_CN", description="语言：zh_CN / en_US"),
) -> ResumeResponse:
    """内置默认模板数据"""
    return ResumeResponse(**await services.get_default_resume(lang))


@router.post("/cache/clear")
async def clear_cache() -> Dict[str, str]:
    services.clear_cache()
    return {"status": "cache cleared"}
