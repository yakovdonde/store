#!/bin/bash
# Store Type Switcher Script
# Usage: ./switch-store.sh [store-type]
# Example: ./switch-store.sh car-parts

STORE_TYPE=$1

if [ -z "$STORE_TYPE" ]; then
  echo "Usage: ./switch-store.sh [store-type]"
  echo ""
  echo "Available store types:"
  echo "  - judaica"
  echo "  - car-parts"
  echo ""
  echo "Example: ./switch-store.sh car-parts"
  exit 1
fi

echo "🔄 Switching store type to: $STORE_TYPE"
echo ""

# Update docker-compose.yml
if [ -f "docker-compose.yml" ]; then
  # Mac/Linux
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/NEXT_PUBLIC_STORE_TYPE: .*/NEXT_PUBLIC_STORE_TYPE: $STORE_TYPE/g" docker-compose.yml
  else
    sed -i "s/NEXT_PUBLIC_STORE_TYPE: .*/NEXT_PUBLIC_STORE_TYPE: $STORE_TYPE/g" docker-compose.yml
  fi
  echo "✅ Updated docker-compose.yml"
fi

# Update .env files if they exist
if [ -f "frontend/.env.local" ]; then
  if grep -q "NEXT_PUBLIC_STORE_TYPE" frontend/.env.local; then
    # Mac/Linux
    if [[ "$OSTYPE" == "darwin"* ]]; then
      sed -i '' "s/NEXT_PUBLIC_STORE_TYPE=.*/NEXT_PUBLIC_STORE_TYPE=$STORE_TYPE/g" frontend/.env.local
    else
      sed -i "s/NEXT_PUBLIC_STORE_TYPE=.*/NEXT_PUBLIC_STORE_TYPE=$STORE_TYPE/g" frontend/.env.local
    fi
  else
    echo "NEXT_PUBLIC_STORE_TYPE=$STORE_TYPE" >> frontend/.env.local
  fi
  echo "✅ Updated frontend/.env.local"
fi

echo ""
echo "🎉 Store type switched to: $STORE_TYPE"
echo ""
echo "Next steps:"
echo "  1. Rebuild Docker containers: docker-compose up --build -d"
echo "  2. Or restart dev server: npm run dev"
echo ""
echo "Visit http://localhost:3000 to see your $STORE_TYPE store!"
