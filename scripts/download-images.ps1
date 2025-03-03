# Скрипт для скачивания изображений для продуктов суши

# Создаем директории, если они не существуют
$directories = @(
    "public/images/products/rolls",
    "public/images/products/sushi",
    "public/images/products/sets",
    "public/images/products/drinks",
    "public/images/categories"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        Write-Host "Creating directory: $dir"
        New-Item -Path $dir -ItemType Directory -Force | Out-Null
    }
}

# Определяем изображения для скачивания с Unsplash
$imagesToDownload = @(
    # Роллы
    @{
        Name = "california";
        Url = "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop";
        Path = "public/images/products/rolls/california.jpg";
        DisplayName = "California Roll";
    },
    @{
        Name = "dragon";
        Url = "https://www.foodiesfeed.com/wp-content/uploads/2021/03/sushi.jpg";
        Path = "public/images/products/rolls/dragon.jpg";
        DisplayName = "Dragon Roll";
    },
    @{
        Name = "spicy-salmon";
        Url = "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=800&auto=format&fit=crop";
        Path = "public/images/products/rolls/spicy-salmon.jpg";
        DisplayName = "Spicy Salmon Roll";
    },
    
    # Суши
    @{
        Name = "nigiri-salmon";
        Url = "https://images.unsplash.com/photo-1534256958597-7fe685cbd745?q=80&w=800&auto=format&fit=crop";
        Path = "public/images/products/sushi/nigiri-salmon.jpg";
        DisplayName = "Nigiri Salmon";
    },
    @{
        Name = "nigiri-shrimp";
        Url = "https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?q=80&w=800&auto=format&fit=crop";
        Path = "public/images/products/sushi/nigiri-shrimp.jpg";
        DisplayName = "Nigiri Shrimp";
    },
    
    # Сеты
    @{
        Name = "california-set";
        Url = "https://images.unsplash.com/photo-1617196034183-421b4917c92d?q=80&w=800&auto=format&fit=crop";
        Path = "public/images/products/sets/california-set.jpg";
        DisplayName = "California Set";
    },
    @{
        Name = "assorted-set";
        Url = "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=800&auto=format&fit=crop";
        Path = "public/images/products/sets/assorted-set.jpg";
        DisplayName = "Assorted Set";
    },
    
    # Напитки
    @{
        Name = "green-tea";
        Url = "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=800&auto=format&fit=crop";
        Path = "public/images/products/drinks/green-tea.jpg";
        DisplayName = "Green Tea";
    },
    @{
        Name = "cola";
        Url = "https://images.unsplash.com/photo-1554866585-cd94860890b7?q=80&w=800&auto=format&fit=crop";
        Path = "public/images/products/drinks/cola.jpg";
        DisplayName = "Cola";
    },
    @{
        Name = "sprite";
        Url = "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?q=80&w=800&auto=format&fit=crop";
        Path = "public/images/products/drinks/sprite.jpg";
        DisplayName = "Sprite";
    },
    
    # Категории
    @{
        Name = "category-rolls";
        Url = "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop";
        Path = "public/images/categories/category-rolls.jpg";
        DisplayName = "Category Rolls";
    },
    @{
        Name = "category-sushi";
        Url = "https://images.unsplash.com/photo-1534256958597-7fe685cbd745?q=80&w=800&auto=format&fit=crop";
        Path = "public/images/categories/category-sushi.jpg";
        DisplayName = "Category Sushi";
    },
    @{
        Name = "category-sets";
        Url = "https://images.unsplash.com/photo-1617196034183-421b4917c92d?q=80&w=800&auto=format&fit=crop";
        Path = "public/images/categories/category-sets.jpg";
        DisplayName = "Category Sets";
    },
    @{
        Name = "category-drinks";
        Url = "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?q=80&w=800&auto=format&fit=crop";
        Path = "public/images/categories/category-drinks.jpg";
        DisplayName = "Category Drinks";
    },
    @{
        Name = "category-default";
        Url = "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?q=80&w=800&auto=format&fit=crop";
        Path = "public/images/categories/category-default.jpg";
        DisplayName = "Category Default";
    }
)

# Скачиваем изображения
foreach ($image in $imagesToDownload) {
    try {
        Write-Host "Downloading $($image.DisplayName) from $($image.Url) to $($image.Path)"
        Invoke-WebRequest -Uri $image.Url -OutFile $image.Path
        Write-Host "Successfully downloaded: $($image.DisplayName)" -ForegroundColor Green
    }
    catch {
        Write-Host "Error downloading $($image.DisplayName): $_" -ForegroundColor Red
    }
}

Write-Host "`nAll images downloaded. Now update the getProductImage function in app/menu/page.tsx" -ForegroundColor Cyan 