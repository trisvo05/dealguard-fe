#!/bin/bash

# Script quản lý Docker cho DealGuard Frontend

COMMAND=$1

function show_help {
    echo "Sử dụng: ./run.sh {build|dev|down}"
    echo "  build : Build lại Docker image"
    echo "  dev   : Chạy container (logs hiện trực tiếp)"
    echo "  down  : Dừng và xóa container"
}

if [ -z "$COMMAND" ]; then
    show_help
    exit 1
fi

case "$COMMAND" in
    build)
        echo "🔄 Đang build Docker image..."
        docker compose build
        ;;
    dev)
        echo "🚀 Đang khởi động server (Development Mode)..."
        docker compose up
        ;;
    down)
        echo "🛑 Đang dừng services..."
        docker compose down
        ;;
    *)
        show_help
        exit 1
        ;;
esac
