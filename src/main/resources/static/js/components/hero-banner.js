export async function renderHeroBanner() {

    const container = document.getElementById('hero-banner');

    if (!container) return;

    try {

        const response = await fetch('/api/banners');

        if (!response.ok) {
            throw new Error('Không thể tải banner');
        }

        const banners = await response.json();

        if (banners.length === 0) {
            return;
        }

        let currentIndex = 0;

        container.innerHTML = `
            <section class="mt-8 relative rounded-2xl overflow-hidden">

                <div id="hero-slider"
                     class="relative aspect-[21/9]">

                </div>

                <div id="hero-dots"
                     class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                </div>

            </section>
        `;

        const slider = document.getElementById('hero-slider');
        const dots = document.getElementById('hero-dots');

        function renderSlide(index) {

            const banner = banners[index];

            slider.innerHTML = `
                <img
                    src="/images/banners/${banner.image}"
                    class="w-full h-full object-cover"
                    alt="${banner.title}">

                <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-12">

                    <h1 class="font-h1 text-h1 text-white max-w-lg leading-tight">
                        ${banner.title ?? ''}
                    </h1>

                </div>
            `;

            dots.innerHTML = banners.map((_, i) => `
                <div class="
                    ${i === index ? 'w-12 bg-white' : 'w-2 bg-white/40'}
                    h-1.5 rounded-full transition-all duration-300">
                </div>
            `).join('');
        }

        renderSlide(currentIndex);

        setInterval(() => {

            currentIndex++;

            if (currentIndex >= banners.length) {
                currentIndex = 0;
            }

            renderSlide(currentIndex);

        }, 4000);

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="text-center py-10 text-red-500">
                Không thể tải banner
            </div>
        `;
    }
}