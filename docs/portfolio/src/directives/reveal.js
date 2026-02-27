const observerMap = new WeakMap()

export default {
  mounted(el, binding) {
    const delay = binding.value || 0
    el.style.setProperty('--reveal-delay', `${delay}ms`)
    el.classList.add('reveal')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('active')
          observer.unobserve(entry.target)
        })
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -8% 0px'
      }
    )

    observer.observe(el)
    observerMap.set(el, observer)
  },
  unmounted(el) {
    const observer = observerMap.get(el)
    if (observer) observer.disconnect()
    observerMap.delete(el)
  }
}
