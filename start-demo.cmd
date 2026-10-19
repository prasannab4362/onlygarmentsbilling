@echo off
cd /d "%~dp0"
echo Open http://127.0.0.1:8080 in Chrome or Edge.
echo Keep this window open while using the demo. Press Ctrl+C to stop.
node server.mjs
pause
