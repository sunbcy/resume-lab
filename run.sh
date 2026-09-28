#!/usr/bin/env bash
#
# Resume Generator 项目统一运行脚本
#
# 用法：
#   ./run.sh setup      安装前后端依赖（首次执行）
#   ./run.sh dev        同时启动后端(8000) + 前端(5173)
#   ./run.sh backend    只启动后端
#   ./run.sh frontend   只启动前端
#   ./run.sh build      前端类型检查 + 生产构建
#   ./run.sh stop       停止所有通过本脚本启动的服务
#   ./run.sh status     查看服务运行状态
#   ./run.sh restart    重启所有服务
#   ./run.sh logs       实时查看日志（Ctrl+C 退出）
#   ./run.sh clean      清理 venv / node_modules / dist / 日志
#
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
LOG_DIR="$ROOT_DIR/.logs"
VENV_DIR="$BACKEND_DIR/.venv"

BACKEND_PORT=8000
FRONTEND_PORT=5173

BACKEND_LOG="$LOG_DIR/backend.log"
FRONTEND_LOG="$LOG_DIR/frontend.log"
BACKEND_PID="$LOG_DIR/backend.pid"
FRONTEND_PID="$LOG_DIR/frontend.pid"

# ---------- 基础工具 ----------
if [[ -t 1 ]]; then
  C_RESET=$'\033[0m'; C_RED=$'\033[31m'; C_GREEN=$'\033[32m'
  C_YELLOW=$'\033[33m'; C_CYAN=$'\033[36m'; C_BOLD=$'\033[1m'
else
  C_RESET=''; C_RED=''; C_GREEN=''; C_YELLOW=''; C_CYAN=''; C_BOLD=''
fi

log()  { printf '%s[INFO]%s %s\n'    "$C_CYAN"   "$C_RESET" "$*"; }
ok()   { printf '%s[OK]%s   %s\n'    "$C_GREEN"  "$C_RESET" "$*"; }
warn() { printf '%s[WARN]%s %s\n'    "$C_YELLOW" "$C_RESET" "$*"; }
err()  { printf '%s[ERR]%s  %s\n'    "$C_RED"    "$C_RESET" "$*" >&2; }
title(){ printf '\n%s==> %s%s\n'     "$C_BOLD"   "$*"       "$C_RESET"; }

port_in_use() { lsof -nP -iTCP:"$1" -sTCP:LISTEN >/dev/null 2>&1; }

pid_alive() { [[ -f "$1" ]] && kill -0 "$(cat "$1")" 2>/dev/null; }

stop_one() {
  local name="$1" pidfile="$2" port="$3"
  if pid_alive "$pidfile"; then
    kill "$(cat "$pidfile")" 2>/dev/null || true
    sleep 1
    kill -9 "$(cat "$pidfile")" 2>/dev/null || true
  fi
  rm -f "$pidfile"
  # 兜底：按端口清理遗留进程
  local pids
  pids="$(lsof -nP -iTCP:"$port" -sTCP:LISTEN -t 2>/dev/null || true)"
  if [[ -n "$pids" ]]; then
    warn "$name 端口 $port 仍被占用，尝试清理 PID: $(echo "$pids" | tr '\n' ' ')"
    echo "$pids" | xargs kill -9 2>/dev/null || true
  fi
  ok "$name 已停止"
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || { err "缺少命令：$1，请先安装后重试"; exit 1; }
}

ensure_log_dir() { mkdir -p "$LOG_DIR"; }

# ---------- 依赖安装 ----------
setup_backend() {
  title "安装后端依赖 (FastAPI)"
  require_cmd python3
  if [[ ! -d "$VENV_DIR" ]]; then
    log "创建虚拟环境 $VENV_DIR"
    python3 -m venv "$VENV_DIR"
  fi
  # shellcheck disable=SC1091
  source "$VENV_DIR/bin/activate"
  log "pip 安装 requirements.txt"
  python -m pip install --upgrade pip -q
  pip install -r "$BACKEND_DIR/requirements.txt"
  ok "后端依赖安装完成"
}

setup_frontend() {
  title "安装前端依赖 (Vue3 + Vite)"
  if ! command -v yarn >/dev/null 2>&1; then
    err "未找到 yarn，请先执行: npm i -g yarn"
    exit 1
  fi
  cd "$FRONTEND_DIR"
  # 避免 NODE_ENV=production 导致跳过 devDependencies
  log "yarn install（强制 NODE_ENV=development）"
  NODE_ENV=development yarn install --frozen-lockfile
  ok "前端依赖安装完成"
}

cmd_setup() {
  setup_backend
  setup_frontend
  ok "全部依赖安装完成，接下来执行: ./run.sh dev"
}

# ---------- 启动 ----------
start_backend() {
  title "启动后端 http://127.0.0.1:$BACKEND_PORT"
  if port_in_use "$BACKEND_PORT"; then
    warn "端口 $BACKEND_PORT 已被占用，跳过启动（可先执行 ./run.sh stop）"
    return 0
  fi
  [[ -d "$VENV_DIR" ]] || setup_backend
  # shellcheck disable=SC1091
  source "$VENV_DIR/bin/activate"
  cd "$BACKEND_DIR"
  nohup python -m uvicorn app.main:app --reload --host 127.0.0.1 --port "$BACKEND_PORT" \
    >"$BACKEND_LOG" 2>&1 &
  echo $! >"$BACKEND_PID"

  for _ in {1..30}; do
    if curl -fsS "http://127.0.0.1:$BACKEND_PORT/api/health" >/dev/null 2>&1; then
      ok "后端已就绪  http://127.0.0.1:$BACKEND_PORT  (PID $(cat "$BACKEND_PID"))"
      return 0
    fi
    sleep 1
  done
  err "后端启动超时，请查看日志: $BACKEND_LOG"
  tail -n 20 "$BACKEND_LOG" || true
  return 1
}

start_frontend() {
  title "启动前端 http://localhost:$FRONTEND_PORT"
  if port_in_use "$FRONTEND_PORT"; then
    warn "端口 $FRONTEND_PORT 已被占用，跳过启动（可先执行 ./run.sh stop）"
    return 0
  fi
  if [[ ! -d "$FRONTEND_DIR/node_modules" ]]; then
    warn "未检测到 node_modules，先安装依赖"
    setup_frontend
  fi
  cd "$FRONTEND_DIR"
  NODE_ENV=development nohup yarn dev >"$FRONTEND_LOG" 2>&1 &
  echo $! >"$FRONTEND_PID"

  for _ in {1..30}; do
    if curl -fsS "http://localhost:$FRONTEND_PORT" >/dev/null 2>&1; then
      ok "前端已就绪  http://localhost:$FRONTEND_PORT  (PID $(cat "$FRONTEND_PID"))"
      return 0
    fi
    sleep 1
  done
  err "前端启动超时，请查看日志: $FRONTEND_LOG"
  tail -n 20 "$FRONTEND_LOG" || true
  return 1
}

cmd_dev() {
  ensure_log_dir
  require_cmd curl
  start_backend
  start_frontend
  title "全部启动完成"
  printf '  前端  %shttp://localhost:%s%s\n' "$C_GREEN" "$FRONTEND_PORT" "$C_RESET"
  printf '  后端  %shttp://127.0.0.1:%s/api/health%s\n' "$C_GREEN" "$BACKEND_PORT" "$C_RESET"
  printf '  停止  %s./run.sh stop%s   日志  %s./run.sh logs%s\n' "$C_YELLOW" "$C_RESET" "$C_YELLOW" "$C_RESET"
}

# ---------- 构建 ----------
cmd_build() {
  title "前端生产构建"
  if [[ ! -d "$FRONTEND_DIR/node_modules" ]]; then
    setup_frontend
  fi
  cd "$FRONTEND_DIR"
  NODE_ENV=development yarn build
  ok "构建产物: $FRONTEND_DIR/dist"
}

# ---------- 停止 / 状态 / 日志 ----------
cmd_stop() {
  title "停止服务"
  stop_one "后端" "$BACKEND_PID" "$BACKEND_PORT"
  stop_one "前端" "$FRONTEND_PID" "$FRONTEND_PORT"
}

cmd_status() {
  if pid_alive "$BACKEND_PID"; then
    ok "后端运行中  PID $(cat "$BACKEND_PID")  http://127.0.0.1:$BACKEND_PORT"
  else
    warn "后端未运行"
  fi
  if pid_alive "$FRONTEND_PID"; then
    ok "前端运行中  PID $(cat "$FRONTEND_PID")  http://localhost:$FRONTEND_PORT"
  else
    warn "前端未运行"
  fi
}

cmd_restart() {
  cmd_stop
  cmd_dev
}

cmd_logs() {
  ensure_log_dir
  log "实时日志（Ctrl+C 退出）"
  touch "$BACKEND_LOG" "$FRONTEND_LOG"
  tail -f "$BACKEND_LOG" "$FRONTEND_LOG"
}

cmd_clean() {
  title "清理本地产物"
  rm -rf "$VENV_DIR" "$FRONTEND_DIR/node_modules" "$FRONTEND_DIR/dist" "$LOG_DIR"
  find "$ROOT_DIR" -name '__pycache__' -type d -prune -exec rm -rf {} + 2>/dev/null || true
  ok "已清理 venv / node_modules / dist / logs"
}

usage() {
  cat <<'EOF'
用法: ./run.sh <command>

  setup      安装前后端依赖
  dev        启动后端(8000) + 前端(5173)      [默认]
  backend    仅启动后端
  frontend   仅启动前端
  build      前端类型检查 + 生产构建
  stop       停止所有服务
  restart    重启所有服务
  status     查看运行状态
  logs       实时查看日志
  clean      清理依赖与产物
  help       显示本帮助
EOF
}

main() {
  local cmd="${1:-dev}"
  case "$cmd" in
    setup)    ensure_log_dir; cmd_setup ;;
    dev)      cmd_dev ;;
    backend)  ensure_log_dir; start_backend ;;
    frontend) ensure_log_dir; start_frontend ;;
    build)    cmd_build ;;
    stop)     cmd_stop ;;
    restart)  cmd_restart ;;
    status)   cmd_status ;;
    logs)     cmd_logs ;;
    clean)    cmd_clean ;;
    help|-h|--help) usage ;;
    *)        err "未知命令: $cmd"; usage; exit 1 ;;
  esac
}

main "$@"
