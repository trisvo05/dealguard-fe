#!/bin/bash

# Script quản lý Docker cho DealGuard Frontend

COMMAND=$1

function show_help {
    echo "Sử dụng: ./run.sh {build|dev|down|logs}"
    echo "  build : Build lại Docker image"
    echo "  dev   : Chạy container (Tự động Restart nếu đang chạy)"
    echo "  down  : Dừng và xóa container"
    echo "  logs  : Xem log realtime"
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
        # Check current containers
        amount=$(docker compose ps -q | wc -l)
        if [ "$amount" -gt 0 ]; then
            echo "♻️  Phát hiện container đang chạy. Đang dừng để khởi động lại..."
            docker compose down
        fi
        docker compose up
        ;;
    down)
        echo "🛑 Đang dừng services..."
        docker compose down
        ;;
    logs)
        echo "📜 Đang xem logs (Ctrl+C để thoát)..."
        docker compose logs -f
        ;;
    *)
        show_help
        exit 1
        ;;
esac
