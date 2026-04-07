// 定义类型
interface Item {
  id: string;
  name: string;
  category: 'Electronics' | 'Furniture' | 'Clothing' | 'Tools' | 'Miscellaneous';
  quantity: number;
  price: number;
  supplierName: string;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  popularItem: 'Yes' | 'No';
  comment: string;
}

// 库存数据
let inventory: Item[] = [
  {
    id: '1',
    name: 'Laptop',
    category: 'Electronics',
    quantity: 10,
    price: 1200,
    supplierName: 'Tech Supplier',
    stockStatus: 'In Stock',
    popularItem: 'Yes',
    comment: 'High performance laptop'
  },
  {
    id: '2',
    name: 'Desk',
    category: 'Furniture',
    quantity: 5,
    price: 300,
    supplierName: 'Furniture World',
    stockStatus: 'In Stock',
    popularItem: 'No',
    comment: 'Wooden desk'
  },
  {
    id: '3',
    name: 'T-Shirt',
    category: 'Clothing',
    quantity: 20,
    price: 20,
    supplierName: 'Clothing Co.',
    stockStatus: 'In Stock',
    popularItem: 'Yes',
    comment: 'Cotton t-shirt'
  }
];

// DOM 元素
const addForm = document.getElementById('addForm') as HTMLFormElement;
const editForm = document.getElementById('editForm') as HTMLFormElement;
const searchInput = document.getElementById('searchInput') as HTMLInputElement;
const inventoryList = document.getElementById('inventoryList') as HTMLElement;
const popularItemsList = document.getElementById('popularItemsList') as HTMLElement;
const messageDiv = document.getElementById('message') as HTMLElement;

// 显示消息
function showMessage(message: string, isError: boolean = false) {
  messageDiv.textContent = message;
  messageDiv.className = isError ? 'error' : 'success';
  messageDiv.style.display = 'block';
  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 3000);
}

// 生成唯一ID
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// 检查库存状态
function checkStockStatus(quantity: number): 'In Stock' | 'Low Stock' | 'Out of Stock' {
  if (quantity === 0) return 'Out of Stock';
  if (quantity < 5) return 'Low Stock';
  return 'In Stock';
}

// 添加项目
function addItem(item: Omit<Item, 'id' | 'stockStatus'>): void {
  // 检查ID是否唯一
  const existingItem = inventory.find(i => i.id === item.id);
  if (existingItem) {
    showMessage('Item ID already exists', true);
    return;
  }

  // 检查名称是否已存在
  const existingName = inventory.find(i => i.name === item.name);
  if (existingName) {
    showMessage('Item name already exists', true);
    return;
  }

  const newItem: Item = {
    ...item,
    id: generateId(),
    stockStatus: checkStockStatus(item.quantity)
  };

  inventory.push(newItem);
  showMessage('Item added successfully');
  renderInventory();
  renderPopularItems();
}

// 更新项目
function updateItem(name: string, updatedItem: Partial<Item>): void {
  const index = inventory.findIndex(i => i.name === name);
  if (index === -1) {
    showMessage('Item not found', true);
    return;
  }

  inventory[index] = {
    ...inventory[index],
    ...updatedItem,
    stockStatus: checkStockStatus(updatedItem.quantity || inventory[index].quantity)
  };

  showMessage('Item updated successfully');
  renderInventory();
  renderPopularItems();
}

// 删除项目
function deleteItem(name: string): void {
  const index = inventory.findIndex(i => i.name === name);
  if (index === -1) {
    showMessage('Item not found', true);
    return;
  }

  inventory.splice(index, 1);
  showMessage('Item deleted successfully');
  renderInventory();
  renderPopularItems();
}

// 搜索项目
function searchItems(query: string): Item[] {
  return inventory.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
}

// 渲染库存列表
function renderInventory(items: Item[] = inventory): void {
  inventoryList.innerHTML = '';
  
  if (items.length === 0) {
    inventoryList.innerHTML = '<p>No items found</p>';
    return;
  }

  const table = document.createElement('table');
  table.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Category</th>
      <th>Quantity</th>
      <th>Price</th>
      <th>Supplier</th>
      <th>Stock Status</th>
      <th>Popular</th>
      <th>Comment</th>
      <th>Actions</th>
    </tr>
  `;

  items.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${item.quantity}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>${item.supplierName}</td>
      <td>${item.stockStatus}</td>
      <td>${item.popularItem}</td>
      <td>${item.comment}</td>
      <td>
        <button onclick="editItem('${item.name}')">Edit</button>
        <button onclick="confirmDelete('${item.name}')">Delete</button>
      </td>
    `;
    table.appendChild(row);
  });

  inventoryList.appendChild(table);
}

// 渲染流行项目
function renderPopularItems(): void {
  const popularItems = inventory.filter(item => item.popularItem === 'Yes');
  popularItemsList.innerHTML = '';
  
  if (popularItems.length === 0) {
    popularItemsList.innerHTML = '<p>No popular items found</p>';
    return;
  }

  const table = document.createElement('table');
  table.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Category</th>
      <th>Quantity</th>
      <th>Price</th>
      <th>Supplier</th>
      <th>Stock Status</th>
    </tr>
  `;

  popularItems.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${item.quantity}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>${item.supplierName}</td>
      <td>${item.stockStatus}</td>
    `;
    table.appendChild(row);
  });

  popularItemsList.appendChild(table);
}

// 编辑项目
function editItem(name: string): void {
  const item = inventory.find(i => i.name === name);
  if (!item) return;

  (document.getElementById('editName') as HTMLInputElement).value = item.name;
  (document.getElementById('editCategory') as HTMLSelectElement).value = item.category;
  (document.getElementById('editQuantity') as HTMLInputElement).value = item.quantity.toString();
  (document.getElementById('editPrice') as HTMLInputElement).value = item.price.toString();
  (document.getElementById('editSupplier') as HTMLInputElement).value = item.supplierName;
  (document.getElementById('editPopular') as HTMLSelectElement).value = item.popularItem;
  (document.getElementById('editComment') as HTMLTextAreaElement).value = item.comment;

  editForm.style.display = 'block';
}

// 确认删除
function confirmDelete(name: string): void {
  if (confirm(`Are you sure you want to delete ${name}?`)) {
    deleteItem(name);
  }
}

// 事件监听器
if (addForm) {
  addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (document.getElementById('addName') as HTMLInputElement).value;
    const category = (document.getElementById('addCategory') as HTMLSelectElement).value as Item['category'];
    const quantity = parseInt((document.getElementById('addQuantity') as HTMLInputElement).value);
    const price = parseFloat((document.getElementById('addPrice') as HTMLInputElement).value);
    const supplier = (document.getElementById('addSupplier') as HTMLInputElement).value;
    const popular = (document.getElementById('addPopular') as HTMLSelectElement).value as Item['popularItem'];
    const comment = (document.getElementById('addComment') as HTMLTextAreaElement).value;

    if (!name || !category || isNaN(quantity) || isNaN(price) || !supplier || !popular) {
      showMessage('Please fill in all required fields', true);
      return;
    }

    addItem({
      name,
      category,
      quantity,
      price,
      supplierName: supplier,
      popularItem: popular,
      comment
    });

    addForm.reset();
  });
}

if (editForm) {
  editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (document.getElementById('editName') as HTMLInputElement).value;
    const category = (document.getElementById('editCategory') as HTMLSelectElement).value as Item['category'];
    const quantity = parseInt((document.getElementById('editQuantity') as HTMLInputElement).value);
    const price = parseFloat((document.getElementById('editPrice') as HTMLInputElement).value);
    const supplier = (document.getElementById('editSupplier') as HTMLInputElement).value;
    const popular = (document.getElementById('editPopular') as HTMLSelectElement).value as Item['popularItem'];
    const comment = (document.getElementById('editComment') as HTMLTextAreaElement).value;

    if (!name || !category || isNaN(quantity) || isNaN(price) || !supplier || !popular) {
      showMessage('Please fill in all required fields', true);
      return;
    }

    updateItem(name, {
      category,
      quantity,
      price,
      supplierName: supplier,
      popularItem: popular,
      comment
    });

    editForm.style.display = 'none';
    editForm.reset();
  });
}

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value;
    const results = searchItems(query);
    renderInventory(results);
  });
}

// 初始化渲染
renderInventory();
renderPopularItems();

// 暴露函数到全局作用域
declare global {
  interface Window {
    editItem: (name: string) => void;
    confirmDelete: (name: string) => void;
  }
}

window.editItem = editItem;
window.confirmDelete = confirmDelete;