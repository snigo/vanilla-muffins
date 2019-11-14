(function() {
    // Define function for creating random numbers for mocking async response in the promise
    const random = (num) => Math.floor(Math.random() * num);

    // Search bar and its controls
    const searchBar = {
        input: document.getElementById('searchInput'),
        btn: document.getElementById('searchBtn')
    };
    searchBar.clear = () => {
        searchBar.input.value = '';
    }

    // As we'll have different tables, define Table class
    class Table {
        constructor(tableId, itemsPerPage) {
            this.itemsPerPage = itemsPerPage;
            this.firstItemIndex = 0;
            this.hasHead = false;
            this.heading = document.getElementById(`${tableId}TableHeading`);
            this.resetSearchBtn = document.getElementById(`${tableId}TableShowAllBtn`);
            this.head = document.getElementById(`${tableId}TableHead`);
            this.body = document.getElementById(`${tableId}TableBody`);
            this.controlBar = document.getElementById(`${tableId}TableControlBar`);
            this.loader = document.getElementById(`${tableId}TableLoader`);
            this.controlMessage = document.getElementById(`${tableId}TableControlMessage`);
            this.itemsPerPageSelector = document.getElementById(`${tableId}TableMaxItemsSelect`);
            this.itemsVisible = document.getElementById(`${tableId}TableItemsVisible`);
            this.itemsTotal = document.getElementById(`${tableId}TableItemsTotal`);
            this.pagePrevBtn = document.getElementById(`${tableId}TablePagePrevBtn`);
            this.pageNextBtn = document.getElementById(`${tableId}TablePageNextBtn`);
            this.query = '';
            this.colSize = 0;
            this.filter = 0;

            this.itemsPerPageHandler = this.itemsPerPageHandler.bind(this);
            this.prevPageHandler = this.prevPageHandler.bind(this);
            this.nextPageHandler = this.nextPageHandler.bind(this);
            this.rowClickHandler = this.rowClickHandler.bind(this);
        }

        insert(obj) {
            let row = document.createElement('tr');
            row.setAttribute('tabIndex', '0');
            for (let key in obj) {
                let td = document.createElement('td');
                td.textContent = key.match(/price/i) !== null ? `$${obj[key].toFixed(2)}` : obj[key];
                row.appendChild(td);
            }
            this.body.appendChild(row);
        }

        appendHead(arr) {
            let row = document.createElement('tr');
            arr.forEach(i => {
                let td = document.createElement('th');
                td.textContent = i.replace('_', ' ');
                row.appendChild(td);
            });
            this.head.appendChild(row);
            this.hasHead = true;
            this.colSize = arr.length;
            this.controlBar.setAttribute('colspan', this.colSize);
        }

        controlMessageHandler(message) {
            this.controlMessage.style.display = 'flex';
            this.controlMessage.innerHTML = `<span>${message}</span>`;
        }

        clear() {
            this.body.innerHTML = '';
        }

        populate(callback) {
            this.clear();
            this.controlMessageHandler('Loading...');
            this.loader.style.display = 'block';
            const loadData = new Promise((res, rej) => {
                setTimeout(() => {
                    let loadedData = mockData;
                    if(loadedData) {
                        res(loadedData)
                    } else {
                        rej(new Error('Oh No!'));
                    }
                }, random(1000));
            });
            loadData.then(data => {
                data = (callback === undefined) ? data : data.filter(callback);
                if (!data.length) {
                    this.controlMessageHandler('No matching records found. Please try again...');
                    this.loader.style.display = 'none';
                } else {
                    !this.hasHead && this.appendHead(Object.keys(data[0]));
                    if (data.length < this.firstItemIndex) this.firstItemIndex = 0;
                    for (let i = this.firstItemIndex; i < (this.firstItemIndex + this.itemsPerPage); i++) {
                        if(data[i] === undefined) break;
                        this.insert(data[i]); 
                    }
                    this.controlMessage.style.display = 'none';
                    [...this.itemsPerPageSelector.children].filter(i => i.value == this.itemsPerPage)[0].selected = true;
                    this.itemsVisible.textContent = (() => {
                        if (data.length === 1) return 1;
                        if ((this.firstItemIndex + this.itemsPerPage) > data.length) return `${this.firstItemIndex + 1} - ${data.length}`;;
                        return `${this.firstItemIndex + 1} - ${this.firstItemIndex + this.itemsPerPage}`;
                    })();
                    this.itemsTotal.textContent = data.length;
                    this.firstItemIndex === 0 ? this.pagePrevBtn.classList.add('unclickable') : this.pagePrevBtn.classList.remove('unclickable');
                    data.length <= (this.firstItemIndex + this.itemsPerPage) ? this.pageNextBtn.classList.add('unclickable') : this.pageNextBtn.classList.remove('unclickable');
                    this.loader.style.display = 'none';
                } 
            });
        }

        search(str) {
            this.clear();
            this.query = str.trim();
            const re = new RegExp(str, 'ig');
            const callback = (obj) => {
                for (let key in obj) {
                    if (key === 'id' && obj[key] == this.query) return true;
                    if (key.match(/price/i) !== null) continue;
                    if (key !== 'id' && obj[key].toString().match(re) !== null) return true;
                }
            }
            this.heading.textContent = 'Search results';
            this.resetSearchBtn.style.display = 'inline';
            this.populate(callback);
        }

        resetSearch(msg) {
            this.heading.textContent = msg;
            this.resetSearchBtn.style.display = 'none';
            this.query = '';
            this.filter = 0;
            this.populate();
        }

        itemsPerPageHandler() {
            this.itemsPerPage = Number(this.itemsPerPageSelector.value);
            !this.query ? !this.filter ? this.populate() : this.populate(this.filter) : this.search(this.query);
        }

        prevPageHandler() {
            if (![...this.pagePrevBtn.classList].includes('unclickable')) {
                this.firstItemIndex -= this.itemsPerPage;
                this.firstItemIndex = this.firstItemIndex < 0 ? 0 : this.firstItemIndex;
                !this.query ? !this.filter ? this.populate() : this.populate(this.filter) : this.search(this.query);
            }
        }

        nextPageHandler() {
            if (![...this.pageNextBtn.classList].includes('unclickable')) {
                this.firstItemIndex += this.itemsPerPage;
                !this.query ? !this.filter ? this.populate() : this.populate(this.filter) : this.search(this.query);
            }
        }

        rowClickHandler(e) {
            if (e.type === 'click' || e.key === 'Enter') {
                const obj = {};
                const row = e.type === 'click' ? e.target.parentElement : e.target;
                for (let i = 0; i < this.colSize; i++) {
                    obj[this.head.firstElementChild.children[i].textContent.replace(' ', '_')] = row.children[i].textContent;
                }
                !modal.isOpen ? modal.build(obj) : modal.update(obj);
            }
        }

        listen() {
            this.itemsPerPageSelector.addEventListener('change', this.itemsPerPageHandler);
            this.pagePrevBtn.addEventListener('click', this.prevPageHandler);
            this.pageNextBtn.addEventListener('click', this.nextPageHandler);
            this.body.addEventListener('click', this.rowClickHandler);
            this.body.addEventListener('keydown', this.rowClickHandler);
        }

        removeListeners() {
            this.itemsPerPageSelector.removeEventListener('change', this.itemsPerPageHandler);
            this.pagePrevBtn.removeEventListener('click', this.prevPageHandler);
            this.pageNextBtn.removeEventListener('click', this.nextPageHandler);
            this.body.removeEventListener('click', this.rowClickHandler);
        }
    }

    // Define modal window
    const modal = {
        overlay: document.getElementById('modalOverlay'),
        isOpen: false
    }

    // Build the modal with it's own ecosystem inside
    modal.build = (obj) => {
        // Helper function to generate HTML elements
        const generate = (tag, className, content) => {
            const element = document.createElement(tag);
            className !== undefined && element.classList.add(className);
            element.innerHTML = content !== undefined ? content : '';
            return element;
        };

        // Generate all necessary elements
        const container = generate('div', 'modal-container');
        const modalWindow = generate('div', 'modal');
        const modalHeader = generate('div', 'modal-header', `
            <h2>Product details</h2>
            <button class="table-control-btn" id="modalCloseBtn">
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="#9fb8c8"/>
                    </svg>
                </span>
            </button>
        `);
        const modalBody = generate('div', 'modal-body');
        const productCard = generate('div', 'product-card', `
            <div class="product-card-aux">Product ID: ${obj.id}</div>
            <div class="product-card-name">${obj.product_name}</div>
            <div class="product-card-price-container">
                <div>Product type: ${obj.product_type}</div>
                <div>Price: ${obj.price}</div>
            </div>
        `);
        productCard.id = 'modalProductCard';
        const productList = generate('div', 'product-list', `
            <h3 class="table-heading" id="modalTableHeading">Similar products</h3>
            <span class="aux-link">Show in price range: 
                <select id="modalTablePriceFilter" class="table-page-select">
                    <option value="10">$10</option>
                    <option value="20">$20</option>
                    <option value="50" selected>$50</option>
                </select>
            </span>
            <table id="modalTable">
                <thead id="modalTableHead"></thead>
                <tbody id="modalTableBody"></tbody>
                <tfoot>
                    <tr>
                        <td class="table-control-container" id="modalTableControlBar">
                            <div class="loader" id="modalTableLoader"></div>
                            <div class="table-control">
                                <div>
                                    <span>Items per page: </span>
                                    <select id="modalTableMaxItemsSelect" class="table-page-select">
                                        <option value="10" selected>10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                </div>
                                <div>
                                    <span id="modalTableItemsVisible"></span>
                                    <span>of</span>
                                    <span id="modalTableItemsTotal"></span>
                                </div>
                                <div>
                                    <button class="table-control-btn" id="modalTablePagePrevBtn">
                                        <span class="icon-small">
                                            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve">
                                                <path d="M15.41,16.59L10.83,12l4.58-4.59L14,6l-6,6l6,6L15.41,16.59z" fill="#9fb8c8"/>
                                            </svg>
                                        </span>
                                    </button>
                                    <button class="table-control-btn" id="modalTablePageNextBtn">
                                        <span class="icon-small">
                                            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve">
                                                <path d="M8.59,16.59L13.17,12L8.59,7.41L10,6l6,6l-6,6L8.59,16.59z" fill="#9fb8c8"/>
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                                <div class="table-control-message" id="modalTableControlMessage">
                                    <span>Loading...</span>  
                                </div>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
        `);

        // Append elements
        modalBody.appendChild(productCard);
        modalBody.appendChild(productList);
        modalWindow.appendChild(modalHeader);
        modalWindow.appendChild(modalBody);
        container.appendChild(modalWindow);
        modal.overlay.appendChild(container);

        // Make modal visible
        modal.overlay.style.display = 'block';
        document.getElementById('app').style.display = 'none';
        modal.isOpen = true;

        // Create modal table of similar products
        const modalTable = new Table('modal', 10);

        // Modal table will have specific properties as well
        modalTable.priceRange = 50;
        modalTable.priceRangeSelector = document.getElementById('modalTablePriceFilter');
        modalTable.priceRangeHandler = () => {
            modalTable.priceRange = Number(modalTable.priceRangeSelector.value);
            !modalTable.query ? !modalTable.filter ? modalTable.populate() : modalTable.populate(modalTable.filter) : modalTable.search(modalTable.query);
        };
        modal.closeBtn = document.getElementById('modalCloseBtn');
        modalTable.populateSimilar = (obj) => {
            modalTable.filter = (o) => {
                const objPrice = Number(obj.price.match(/\d+\.\d{2}/)[0]);
                return (o.product_type === obj.product_type) && (o.price >= objPrice - modalTable.priceRange) && (o.price <= objPrice + modalTable.priceRange);
            };
            modalTable.populate(modalTable.filter);
        };
        modal.update = (obj) => {
            const modalProductCard = document.getElementById('modalProductCard');
            modalProductCard.innerHTML = `
                <div class="product-card-aux">Product ID: ${obj.id}</div>
                <div class="product-card-name">${obj.product_name}</div>
                <div class="product-card-price-container">
                    <div>Product type: ${obj.product_type}</div>
                    <div>Price: ${obj.price}</div>
                </div>
            `;
            modalTable.populateSimilar(obj);
        };
        modal.kill = () => {
            modalTable.removeListeners();
            modalTable.priceRangeSelector.removeEventListener('change', modalTable.priceRangeHandler);
            modalTable.query = '';
            modalTable.filter = 0;
            modal.overlay.innerHTML = '';
            modal.overlay.style.display = 'none';
            document.getElementById('app').style.display = 'block';
            modal.isOpen = false;
            modal.closeBtn.removeEventListener('click', modal.kill);
            modal.overlay.removeEventListener('click', modal.overlayClickHandler);
            document.removeEventListener('keydown', modal.keybordCloseHandler);
        };
        
        // Populate modal table
        modalTable.populateSimilar(obj);
        modalTable.listen();

        // Add event listeners specific to modal table
        modalTable.priceRangeSelector.addEventListener('change', modalTable.priceRangeHandler);
        modal.overlayClickHandler = (e) => {
            e.target === modal.overlay && modal.kill();
        };
        modal.keybordCloseHandler = (e) => e.key === 'Escape' && modal.kill();
        modal.closeBtn.addEventListener('click', modal.kill);
        modal.overlay.addEventListener('click', modal.overlayClickHandler);
        document.addEventListener('keydown', modal.keybordCloseHandler);
    };

    // Create and populate main table
    const mainTable = new Table('main', 10);
    mainTable.populate();
    mainTable.listen();

    // Add event listeners, specific to main table only
    searchBar.btn.addEventListener('click', (e) => {
        e.preventDefault();
        mainTable.search(searchBar.input.value);
        searchBar.clear();
    });

    searchBar.input.addEventListener('keydown', (e) => {
        e.key === 'Enter' && searchBar.btn.click();
    });

    mainTable.resetSearchBtn.addEventListener('click', () => mainTable.resetSearch('All products'));
})();