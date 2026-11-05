@echo off
rem Double-click to run the portfolio locally at http://localhost:4321
cd /d "%~dp0"
start "" http://localhost:4321
node dev-server.js
