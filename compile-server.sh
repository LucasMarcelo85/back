#!/bin/bash
# Script para compilar apenas os arquivos necessários para o servidor
find src -type f -name "*.ts" ! -path "*/scripts/migrateData.ts" | xargs npx tsc
