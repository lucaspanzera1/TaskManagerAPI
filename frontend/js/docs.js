document.addEventListener('DOMContentLoaded', () => {
  const getStartedBtn = document.getElementById('get-started-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const token = localStorage.getItem('token');

  // Redirecionamento do botão "Get Started"
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
      if (token) {
        window.location.href = 'index.html';
      } else {
        window.location.href = 'auth.html';
      }
    });
  }

  // Lógica do botão "Sair"
  if (logoutBtn) {
    if (!token) {
      // Oculta botão se não estiver logado
      logoutBtn.style.display = 'none';
    } else {
      // Mostra e ativa logout se estiver logado
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'docs.html';
      });
    }
  }
});


        // Theme Toggle
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;
        let isDark = true;

        themeToggle.addEventListener('click', () => {
            isDark = !isDark;
            if (isDark) {
                body.classList.remove('light-theme');
                themeToggle.textContent = '🌙';
                themeToggle.style.backgroundColor = '#374151';
            } else {
                body.classList.add('light-theme');
                themeToggle.textContent = '☀️';
                themeToggle.style.backgroundColor = '#B99EFC';
                themeToggle.style.color = '#ffffff';
            }
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Add active state to sidebar links
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', function() {
                document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active-link'));
                this.classList.add('active-link');
            });
        });

        // Copy code functionality
        document.querySelectorAll('.copy-btn').forEach(button => {
            button.addEventListener('click', function() {
                const codeBlock = this.closest('.code-block');
                const code = codeBlock.querySelector('code').textContent;
                
                navigator.clipboard.writeText(code).then(() => {
                    const originalText = this.textContent;
                    this.textContent = 'Copiado!';
                    this.classList.add('text-green-400');
                    
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.classList.remove('text-green-400');
                    }, 2000);
                }).catch(err => {
                    console.error('Erro ao copiar código:', err);
                });
            });
        });

        // Animate elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.bg-gray-800, .gradient-bg').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Add hover effects to endpoint cards
        document.querySelectorAll('.bg-gray-800').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px)';
                this.style.boxShadow = '0 10px 25px rgba(185, 158, 252, 0.15)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });

        // Simulate API status (for demo purposes)
        function updateApiStatus() {
            const statusElement = document.createElement('div');
            statusElement.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium';
            statusElement.innerHTML = '🟢 API Online - Resposta em 45ms';
            document.body.appendChild(statusElement);
            
            setTimeout(() => {
                statusElement.remove();
            }, 4000);
        }
