document.addEventListener('DOMContentLoaded', function () {
    const products = document.querySelectorAll(".ps-product");

    // Filters object to store filter values
    const filters = {
        availability: "all",
        minPrice: 0,
        maxPrice: Infinity,
        productCategory: "all",
        sortBy: "best-selling",
    };

    // Function to filter products based on current filters
    function filterProducts() {
        products.forEach(product => {
            const availability = product.dataset.availability;
            const price = parseFloat(product.dataset.price);
            const productCategory = product.dataset.productCategory;

            let show = true;

            if (filters.availability !== "all" && filters.availability !== availability) {
                show = false;
            }

            if (price < filters.minPrice || price > filters.maxPrice) {
                show = false;
            }

            if (filters.productCategory !== "all" && filters.productCategory !== productCategory) {
                show = false;
            }

            product.style.display = show ? "block" : "none";
        });

        updateResultCount(); // Update result count after filtering
    }

    // Function to sort products based on current sort option
    function sortProducts() {
        const container = document.querySelector(".product-grid");
        const sortedProducts = Array.from(products).sort((a, b) => {
            const aValue = getSortValue(a);
            const bValue = getSortValue(b);

            switch (filters.sortBy) {
                case "best-selling":
                    return 0;
                case "title-az":
                    return aValue.localeCompare(bValue);
                case "title-za":
                    return bValue.localeCompare(aValue);
                case "price-low-high":
                    return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
                case "price-high-low":
                    return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
                case "date-new-old":
                    return new Date(b.dataset.date) - new Date(a.dataset.date);
                case "date-old-new":
                    return new Date(a.dataset.date) - new Date(b.dataset.date);
                default:
                    return 0;
            }
        });

        // Clear current product grid
        container.innerHTML = "";

        // Append sorted products to container
        sortedProducts.forEach(product => container.appendChild(product));
    }

    // Helper function to get sort value for a product element
    function getSortValue(product) {
        switch (filters.sortBy) {
            case "best-selling":
                return "best-selling"; // Dummy value for best-selling sort
            case "title-az":
            case "title-za":
                return product.querySelector(".ps-title").innerText.trim().toLowerCase();
            case "price-low-high":
            case "price-high-low":
                return parseFloat(product.dataset.price);
            case "date-new-old":
            case "date-old-new":
                return new Date(product.dataset.date);
            default:
                return "";
        }
    }

    // Function to update the result count in the price range dropdown
    function updateResultCount() {
        const visibleProducts = Array.from(products).filter(product => product.style.display !== "none").length;
        const resultsText = document.querySelector("#priceRangeDropdownButton + .dropdown-menu .results-text");
        resultsText.textContent = `Showing ${visibleProducts} product${visibleProducts !== 1 ? 's' : ''}`;
    }

    // Event listener for applying price range filter
    document.getElementById("apply-price-filter").addEventListener("click", function (e) {
        e.preventDefault();
        applyPriceRangeFilter();
    });

    // Event listener for clearing price range filter
    document.querySelector(".clear-price-filter").addEventListener("click", function (e) {
        e.preventDefault();
        document.getElementById("min-price").value = "";
        document.getElementById("max-price").value = "";
        filters.minPrice = 0;
        filters.maxPrice = Infinity;
        filterProducts();
    });

    // Event listener for min price input
    document.getElementById("min-price").addEventListener("input", function (e) {
        filters.minPrice = parseFloat(e.target.value) || 0;
        filterProducts();
    });

    // Event listener for max price input
    document.getElementById("max-price").addEventListener("input", function (e) {
        filters.maxPrice = parseFloat(e.target.value) || Infinity;
        filterProducts();
    });

    // Event listeners for other filters (availability, category, sort)
    document.getElementById("availabilityDropdownButton").addEventListener("click", function (e) {
        e.preventDefault();
    });

    document.querySelectorAll("#availabilityDropdownButton + .dropdown-menu .dropdown-item").forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            filters.availability = this.getAttribute('data-filter');
            filterProducts();
        });
    });

    document.getElementById("categoryDropdownButton").addEventListener("click", function (e) {
        e.preventDefault();
    });

    document.querySelectorAll("#categoryDropdownButton + .dropdown-menu .dropdown-item").forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            filters.productCategory = this.getAttribute('data-filter');
            filterProducts();
        });
    });

    document.getElementById("sortDropdownButton").addEventListener("click", function (e) {
        e.preventDefault();
    });

    document.querySelectorAll("#sortDropdownButton + .dropdown-menu .dropdown-item").forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            filters.sortBy = this.getAttribute('data-sort');
            sortProducts();
        });
    });

    // Initial filter and sort
    filterProducts();
    sortProducts();
});
