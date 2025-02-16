#!/bin/zsh

# Remove only the directories we created, preserving Vite bootstrap files
rm -rf src/features
rm -rf src/shared
rm -rf src/app

# Remove any potential leftover directories from previous structure
rm -rf src/domain
rm -rf src/ports
rm -rf src/adapters

echo "Cleaned up previous structure while preserving Vite bootstrap files!"