@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "MVNW_DIR=%~dp0"
if "%MVNW_DIR:~-1%"=="\" set "MVNW_DIR=%MVNW_DIR:~0,-1%"
set "WRAPPER_PROPERTIES=%MVNW_DIR%\.mvn\wrapper\maven-wrapper.properties"

if not exist "%WRAPPER_PROPERTIES%" (
  echo [ERROR] Arquivo nao encontrado: "%WRAPPER_PROPERTIES%"
  exit /b 1
)

set "DIST_URL="
for /f "usebackq tokens=1,* delims==" %%A in ("%WRAPPER_PROPERTIES%") do (
  if /i "%%A"=="distributionUrl" set "DIST_URL=%%B"
)

if not defined DIST_URL (
  echo [ERROR] distributionUrl nao definido em "%WRAPPER_PROPERTIES%"
  exit /b 1
)

for %%I in ("%DIST_URL%") do set "ZIP_NAME=%%~nxI"
if not defined ZIP_NAME set "ZIP_NAME=apache-maven-bin.zip"

set "CACHE_ROOT=%USERPROFILE%\.m2\wrapper\dists"
set "ZIP_PATH=%CACHE_ROOT%\%ZIP_NAME%"
set "MAVEN_CMD="

if not exist "%CACHE_ROOT%" mkdir "%CACHE_ROOT%" >nul 2>&1

for /d %%D in ("%CACHE_ROOT%\apache-maven-*") do (
  if exist "%%~fD\bin\mvn.cmd" (
    set "MAVEN_CMD=%%~fD\bin\mvn.cmd"
  )
)

if not defined MAVEN_CMD (
  echo [INFO] Maven nao encontrado em cache. Baixando distribuicao...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%DIST_URL%' -OutFile '%ZIP_PATH%'"
  if errorlevel 1 (
    echo [ERROR] Falha ao baixar Maven em "%DIST_URL%"
    exit /b 1
  )

  echo [INFO] Extraindo Maven para "%CACHE_ROOT%"...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -LiteralPath '%ZIP_PATH%' -DestinationPath '%CACHE_ROOT%' -Force"
  if errorlevel 1 (
    echo [ERROR] Falha ao extrair "%ZIP_PATH%"
    exit /b 1
  )

  for /d %%D in ("%CACHE_ROOT%\apache-maven-*") do (
    if exist "%%~fD\bin\mvn.cmd" (
      set "MAVEN_CMD=%%~fD\bin\mvn.cmd"
    )
  )
)

if not defined MAVEN_CMD (
  echo [ERROR] Nao foi possivel localizar o executavel do Maven apos o download.
  exit /b 1
)

call "%MAVEN_CMD%" %*
exit /b %ERRORLEVEL%