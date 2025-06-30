document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------
    // Universal Animation Trigger for Home Page (if exists)
    // -----------------------------------------------------
    // This will only run if the 'active-animation' related elements are on the page.
    // It's safe to keep it here as it won't break if those elements don't exist.
    setTimeout(() => {
        document.body.classList.add('active-animation');
    }, 100);

    // -----------------------------------------------------
    // Touch Device Detection (Universal)
    // -----------------------------------------------------
    const isTouchDevice = () => {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
    };

    // Add 'touch-device' class to body if it's a touch device
    // This class can be used in CSS for touch-specific styles if needed.
    if (isTouchDevice()) {
        document.body.classList.add('touch-device');

        // -----------------------------------------------------
        // Project Cards (Touch behavior - only if on Projects page)
        // -----------------------------------------------------
        // Check if '.project-card' elements exist on the current page
        const projectCards = document.querySelectorAll('.project-card');
        if (projectCards.length > 0) { // Only run if project cards are found
            projectCards.forEach(card => {
                card.addEventListener('click', function(event) {
                    // Prevent the default link behavior if an anchor tag inside is clicked
                    if (event.target.closest('.card-links a')) {
                        return; // Let the link click proceed naturally
                    }

                    // Toggle the 'tapped' class on the clicked card
                    this.classList.toggle('tapped');

                    // Close other flipped cards
                    projectCards.forEach(otherCard => {
                        if (otherCard !== this && otherCard.classList.contains('tapped')) {
                            otherCard.classList.remove('tapped');
                        }
                    });
                });
            });
        }

        // -----------------------------------------------------
        // Service Blocks (Touch behavior - only if on Services page)
        // -----------------------------------------------------
        // Check if '.service-block' elements exist on the current page
        const serviceBlocks = document.querySelectorAll('.service-block');
        if (serviceBlocks.length > 0) { // Only run if service blocks are found
            serviceBlocks.forEach(block => {
                block.addEventListener('click', function() {
                    // Toggle the 'service-active' class on the clicked block
                    this.classList.toggle('service-active');

                    // Close other active service blocks
                    serviceBlocks.forEach(otherBlock => {
                        if (otherBlock !== this && otherBlock.classList.contains('service-active')) {
                            otherBlock.classList.remove('service-active');
                        }
                    });
                });
            });
        }
    }
});