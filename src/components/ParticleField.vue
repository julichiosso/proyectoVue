<template>
  <canvas ref="canvas" class="particle-canvas"></canvas>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const canvas = ref(null)

onMounted(() => {
  const c = canvas.value
  const ctx = c.getContext('2d')

  const resize = () => {
    c.width = window.innerWidth
    c.height = window.innerHeight
  }

  resize()
  window.addEventListener('resize', resize)

  const particles = Array.from({ length: 65 }).map(() => ({
    x: Math.random() * c.width,
    y: Math.random() * c.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3
  }))

  function draw() {
    ctx.clearRect(0, 0, c.width, c.height)

    particles.forEach(p => {
      p.x += p.vx
      p.y += p.vy

      if (p.x < 0 || p.x > c.width) p.vx *= -1
      if (p.y < 0 || p.y > c.height) p.vy *= -1

      ctx.beginPath()
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(145, 255, 255, 0.85)" /* cian elegante crypto */
      ctx.fill()
    })

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx*dx + dy*dy)

        if (dist < 120) {
          ctx.strokeStyle = "rgba(145, 255, 255, 0.12)"
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }

    requestAnimationFrame(draw)
  }

  draw()
})
</script>

<style scoped>
.particle-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2; /* Sobre fondo, debajo de contenido */
}
</style>
