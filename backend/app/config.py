"""全局配置"""

# GitHub raw 地址模板：用户的同名仓库下存放 resume.json
GITHUB_RAW_TEMPLATE = (
    "https://raw.githubusercontent.com/{user}/{user}/{branch}/resume.json"
)

# 服务端缓存时间（秒）
CACHE_TTL = 300

# 请求超时（秒）
REQUEST_TIMEOUT = 10

# 支持的语言
SUPPORTED_LANGS = ("zh_CN", "en_US")
