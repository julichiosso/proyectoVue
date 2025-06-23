<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-section footer-left">
        <h3>Cryto Coin</h3>
        <p>© 2025 Todos los derechos reservados.</p>
      </div>
  
      <div class="footer-section footer-right">
        <div class="social-section">
          <p class="social-text">Seguinos en redes:</p>
          <div class="social-icons">
            <a href="https://www.facebook.com/profile.php?id=100070193445177" target="_blank" aria-label="Facebook" class="icon facebook">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path d="M22 12a10 10 0 1 0-11.6 9.8v-6.9h-2.6v-2.9h2.6v-2.2c0-2.6 1.5-4 3.8-4 1.1 0 2.3.2 2.3.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.7v2h2.9l-.5 2.9h-2.4v6.9A10 10 0 0 0 22 12z"/>
              </svg>
            </a>
            <a href="https://x.com/cryptocoin" target="_blank" aria-label="Twitter" class="icon twitter">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path d="M23 3a10.9 10.9 0 0 1-3.1.9 4.9 4.9 0 0 0 2.2-2.7 9.7 9.7 0 0 1-3.1 1.2 4.8 4.8 0 0 0-8.2 4.4A13.7 13.7 0 0 1 1.7 2.1 4.8 4.8 0 0 0 3.1 9.7a4.8 4.8 0 0 1-2.2-.6v.1a4.8 4.8 0 0 0 3.9 4.7 4.8 4.8 0 0 1-2.2.1 4.8 4.8 0 0 0 4.5 3.3 9.6 9.6 0 0 1-6 2.1c-.4 0-.7 0-1-.1A13.6 13.6 0 0 0 7.5 21c9 0 13.9-7.5 13.9-14 0-.2 0-.5 0-.7A9.8 9.8 0 0 0 23 3z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/crypto_coin/" target="_blank" aria-label="Instagram" class="icon instagram">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm8 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-5 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Sin lógica por ahora, solo estructura y estilo
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #0a0f1c, #1e3c72);
  padding: 2rem 1rem;
  color: #f5f7fa;
  font-family: 'Proxima Nova', sans-serif;
  font-size: 0.9rem;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
}

.footer-section {
  flex: 1 1 250px;
}

.footer-left h3 {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  color: #e2e8f0;
}

.footer-left p {
  font-weight: 400;
  color: #818994;
}

.footer-right {
  display: flex;
  justify-content: flex-end;
}

.social-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.social-text {
  margin: 0;
  color: #818994;
}

.social-icons {
  display: flex;
  gap: 12px;
}

.icon {
  color: #5682ad;
  cursor: pointer;
  transition: color 0.3s ease, transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
}

.icon:hover {
  color: #1e40af;
  transform: translateY(-3px);
  background-color: rgba(255, 255, 255, 0.2);
}

/* Responsive */
@media (max-width: 700px) {
  .footer-container {
    flex-direction: column;
    gap: 2rem;
  }
  
  .footer-left, .footer-right {
    text-align: center;
  }
  
  .footer-right {
    justify-content: center;
  }
  
  .social-section {
    align-items: center;
  }
}
</style>