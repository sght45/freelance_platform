import os
import re

def update_html_files():
    # Путь к папке templates
    templates_dir = "templates"
    
    # Все замены, которые нужно сделать
    replacements = [
        # CSS файл
        (r'<link rel="stylesheet" href="style\.css">',
         '<link rel="stylesheet" href="{{ url_for(\'static\', path=\'/css/style.css\') }}">'),
        
        # JavaScript файл
        (r'<script src="main\.js" type="module"></script>',
         '<script src="{{ url_for(\'static\', path=\'/js/main.js\') }}" type="module"></script>'),
        
        # Логотип
        (r'<img src="logo\.png"',
         '<img src="{{ url_for(\'static\', path=\'/images/logo.png\') }}"'),
        
        # Навигационные ссылки
        (r'href="index\.html"', 'href="/"'),
        (r'href="jobs\.html"', 'href="/jobs"'),
        (r'href="post_project\.html"', 'href="/post-project"'),
        (r'href="login\.html"', 'href="/login"'),
        (r'href="dashboard\.html"', 'href="/dashboard"'),
        
        # Формы
        (r'<form class="auth-form">', '<form action="/api/login" method="POST" class="auth-form">'),
        (r'<form class="project-post-form">', '<form action="/api/create-project" method="POST" class="project-post-form">')
    ]
    
    # Обрабатываем каждый HTML файл
    for filename in os.listdir(templates_dir):
        if filename.endswith(".html"):
            filepath = os.path.join(templates_dir, filename)
            print(f"📄 Обрабатываю {filename}...")
            
            # Читаем файл
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Делаем все замены
            original_content = content
            for pattern, replacement in replacements:
                content = re.sub(pattern, replacement, content)
            
            # Сохраняем изменения
            if content != original_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"  ✅ Обновлен")
            else:
                print(f"  ⚠️ Уже обновлен")
    
    print("\n🎉 Все HTML файлы обновлены!")

if __name__ == "__main__":
    update_html_files()