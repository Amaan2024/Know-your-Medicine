document.addEventListener('DOMContentLoaded', () => {
    // --- Find all elements (it's OK if some are 'null') ---
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-bar input');
    const resultsSection = document.getElementById('search-results-section');
    const resultsContainer = document.getElementById('results-container');
    const resultsTitle = document.getElementById('results-title');
    const featuredContainer = document.getElementById('featured-grid-container');

    // Modal elements (these should be on all pages)
    const detailsModal = document.getElementById('details-modal');
    const modalContent = document.getElementById('modal-content-body');
    const closeModalBtn = document.getElementById('modal-close-btn');

    // --- 1. Load Featured Medicines (Guarded) ---
    async function loadFeaturedMedicines() {
        if (!featuredContainer) {
            return;
        }
        // ... (rest of this function is unchanged)
    }
    loadFeaturedMedicines();

    // --- 2. Handle Search Form Submit (Guarded) ---
    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const query = searchInput.value;
            if (!query) return;

            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const medicines = await response.json();
                displayResults(medicines, query);
            } catch (error) {
                console.error('Fetch error:', error);
                if (resultsContainer) {
                    resultsContainer.innerHTML = `
                        <p class="error-msg" style="text-align: center; color: #ef4444; grid-column: 1 / -1; padding: 1rem;">
                            Could not fetch results. Please try again later.
                        </p>`;
                    resultsSection.style.display = 'block';
                }
            }
        });
    }

    // --- 3. Display Search Results (Guarded) ---
    function displayResults(medicines, query) {
        if (!resultsContainer || !resultsTitle) {
            console.error("Results container or title not found!");
            return;
        }
        
        resultsContainer.innerHTML = ''; 
        resultsTitle.textContent = `Search Results for "${query}"`; 
        
        if (medicines.length === 0) {
            resultsContainer.innerHTML = '<p style="text-align: center; color: #6b7280; grid-column: 1 / -1;">No medicines found matching your search.</p>';
        } else {
            medicines.forEach(med => {
                const medCard = document.createElement('div');
                medCard.className = 'medicine-card';
                medCard.innerHTML = `
                    <h4>${med.name} (<strong>${med.brand}</strong>)</h4>
                    <p style="font-size: 0.9rem; color: #6b7280; margin-bottom: 0.5rem; flex-grow: 0;">
                        By ${med.manufacturer}
                    </p>
                    <p>₹${med.price.toFixed(2)}</p>
                    <button class="btn btn-details" data-id="${med.id}">View Details</button>
                `;
                resultsContainer.appendChild(medCard);
            });
        }
        
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    // --- 4. Handle "View Details" Clicks (No guard needed) ---
    document.body.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-details')) {
            const medId = e.target.dataset.id;
            try {
                const response = await fetch(`/api/medicine/${medId}`);
                if (!response.ok) throw new Error('Medicine details not found');
                const medDetails = await response.json();
                populateModal(medDetails);
            } catch (error) {
                console.error('Fetch details error:', error);
                populateModal({
                    name: "Error",
                    brand: "Details Not Found",
                    description: "We couldn't load the details for this medicine. Please try again later."
                });
            }
        }
    });

    // --- 5. Populate Modal (Guarded) ---
    function populateModal(med) {
        if (!modalContent || !detailsModal) {
            console.error('Modal elements not found on this page.');
            return;
        }
        
        // Helper to build the bullet point list for 'uses'
        const usesList = (med.uses || []).map(use => `<li>${use}</li>`).join('');

        // Helper to build quick tips
        const quickTipsList = (med.quick_tips || []).map(tip => `
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        <span>${tip}</span>
                    </li>
                `).join('');

        // Helper to build safety grid
        const safetyGridHtml = med.safety_advice ? buildSafetyAdvice(med.safety_advice) : '';

        // Helper for 'also known as'
        const alsoKnownAsHtml = med.also_known_as && med.also_known_as.length ?
            `<p class="modal-also-known-as">Also known as: ${med.also_known_as.join(', ')}</p>` : '';

        modalContent.innerHTML = `
                    <h2>${med.name} (${med.brand})</h2>
                    ${alsoKnownAsHtml}
                    <hr>
                    <div class="modal-detail-item safety-advice-section">
                        <p><strong>Safety Advice</strong></p>
                        <div class="safety-advice-grid">
                            ${safetyGridHtml}
                        </div>
                    </div>
                    <div class="modal-detail-item">
                        <p><strong>About ${med.brand}</strong></p>
                        <p>${med.description || 'N/A'}</p>
                    </div>
                    <div class="modal-detail-item">
                        <p><strong>Uses of ${med.brand}</strong></p>
                        <ul class="modal-uses-list">
                            ${usesList || '<li>Details not available.</li>'}
                        </ul>
                    </div>
                    <div class="modal-detail-item">
                        <p><strong>Quick Tips</strong></p>
                        <ul class="quick-tips-list">
                            ${quickTipsList || '<li>Details not available.</li>'}
                        </ul>
                    </div>
                    <div class="modal-detail-item">
                        <p><strong>How ${med.brand} Works</strong></p>
                        <p>${med.how_it_works || 'N/A'}</p>
                    </div>
                    <div class="modal-detail-item">
                        <p><strong>Common Side Effects</strong></p>
                        <p>${med.side_effects || 'N/A'}</p>
                    </div>
                    <div class="modal-detail-item">
                        <p><strong>How to use ${med.brand}</strong></p>
                        <p>${med.how_to_use || 'N/A'}</p>
                    </div>
                    <div class="modal-detail-item">
                        <p><strong>Drug Interactions</strong></p>
                        <p>${med.drug_interactions || 'N/A'}</p>
                    </div>
                    <hr>
                    <div class="modal-detail-item">
                        <p><strong>Medicine Details</strong></p>
                        <div class="modal-detail-grid">
                            <p><strong>Chemical Class:</strong> ${med.chemical_class || 'N/A'}</p>
                            <p><strong>Habit Forming:</strong> ${med.habit_forming || 'N/A'}</p>
                            <p><strong>Therapeutic Class:</strong> ${med.therapeutic_class || 'N/A'}</p>
                            <p><strong>Action Class:</strong> ${med.action_class || 'N/A'}</p>
                            <p><strong>Manufacturer:</strong> ${med.manufacturer || 'N/A'}</p>
                        </div>
                    </div>
                `;
        if (detailsModal) detailsModal.style.display = 'flex';
    }

    // Helper function to create the Safety Advice HTML
    function buildSafetyAdvice(advice) {
        // ... (this function is unchanged)
        const labels = {
            alcohol: 'Alcohol', pregnancy: 'Pregnancy', driving: 'Driving',
            lactation: 'Lactation', kidney: 'Kidney Disease', liver: 'Liver Disease'
        };
        const icons = {
            UNSAFE: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" /></svg>',
            SAFE: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>',
            SAFE_WITH_CAUTION: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>',
            CONSULT_DOCTOR: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.668.442m.668-.442-5.604 5.605m-4.242 0c-1.172-1.025-1.172-2.687 0-3.712s3.07-1.025 4.242 0m-4.242 3.712 5.604-5.605m0 0v-1.025c0-.986.799-1.785 1.785-1.785h.001c.986 0 1.785.799 1.785 1.785v1.025m-1.785 0s.203.179.668.442" /></svg>'
        };
        const adviceText = {
            UNSAFE: 'Unsafe', SAFE: 'Safe',
            SAFE_WITH_CAUTION: 'Caution', CONSULT_DOCTOR: 'Consult Doctor'
        };
        let html = '';
        for (const [key, value] of Object.entries(advice)) {
            html += `
                        <div class="safety-advice-item safety-level-${value}">
                            <div class="icon-wrapper">${icons[value] || icons.CONSULT_DOCTOR}</div>
                            <div class="advice-text">
                                <span>${labels[key] || key}</span>
                                <strong>${adviceText[value] || 'Consult Doctor'}</strong>
                            </div>
                        </div>
                    `;
        }
        return html;
    }

    // --- 6. Close the Modal (Guarded) ---
    if (closeModalBtn && detailsModal) {
        closeModalBtn.addEventListener('click', () => {
            detailsModal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target == detailsModal) {
                detailsModal.style.display = 'flex';
            }
        });
    }

    // --- 7. NEW: Load Lottie Animation ---
    function loadLottieAnimation() {
        const animationContainer = document.getElementById('lottie-animation');
        
        // Only run this if the lottie player is loaded AND the container exists
        if (typeof lottie !== 'undefined' && animationContainer) {
            lottie.loadAnimation({
                container: animationContainer,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                // --- THIS IS THE FIX ---
                path: 'doctor-animation.json' // Corrected filename
            });
        }
    }
    loadLottieAnimation(); // Call on page load

});