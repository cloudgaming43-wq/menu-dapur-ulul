const SHEET_NAME = 'Menus';
const ADMIN_TOKEN = 'mama-ulul';

function setup() {
  const sheet = getSheet_();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['id', 'name', 'price', 'category', 'badge', 'description', 'image']);
  }

  if (sheet.getLastRow() === 1) {
    sheet.getRange(2, 1, 4, 7).setValues([
      ['ayam-geprek', 'Ayam Geprek', 18000, 'makanan', 'BEST SELLER', 'Ayam crispy dengan sambal pedas dan nasi.', 'images/ayam-geprek.jpg'],
      ['seafood-platter', 'Seafood Platter', 35000, 'seafood', 'FAVORIT', 'Kerang, udang, cumi dan jagung dengan saus pilihan.', 'images/seafood-platter.jpg'],
      ['kentang-mustofa', 'Kentang Mustofa', 15000, 'snack', '', 'Kentang renyah dengan bumbu gurih dan pedas.', 'images/kentang-mustofa.jpg'],
      ['es-teh-manis', 'Es Teh Manis', 5000, 'minuman', '', 'Teh manis dingin yang menyegarkan.', 'images/es-teh.jpg']
    ]);
  }
}

function doGet() {
  return json_(readMenus_());
}

function doPost(event) {
  const body = JSON.parse(event.postData.contents || '{}');
  if (ADMIN_TOKEN && body.token !== ADMIN_TOKEN) {
    return json_({ error: 'Unauthorized' });
  }

  const action = body.action;
  if (action === 'create') createMenu_(body.menu);
  if (action === 'update') updateMenu_(body.menu);
  if (action === 'delete') deleteMenu_(body.menu.id);
  return json_({ ok: true, menus: readMenus_() });
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function readMenus_() {
  const values = getSheet_().getDataRange().getValues();
  if (values.length < 2) return [];
  return values.slice(1).filter(row => row[0]).map(row => ({
    id: String(row[0]), name: String(row[1]), price: Number(row[2]), category: String(row[3]),
    badge: String(row[4] || ''), description: String(row[5] || ''), image: String(row[6] || '')
  }));
}

function createMenu_(menu) {
  getSheet_().appendRow([menu.id, menu.name, menu.price, menu.category, menu.badge, menu.description, menu.image]);
}

function updateMenu_(menu) {
  const sheet = getSheet_();
  const row = findRow_(menu.id);
  if (!row) throw new Error('Menu tidak ditemukan.');
  sheet.getRange(row, 1, 1, 7).setValues([[menu.id, menu.name, menu.price, menu.category, menu.badge, menu.description, menu.image]]);
}

function deleteMenu_(id) {
  const row = findRow_(id);
  if (row) getSheet_().deleteRow(row);
}

function findRow_(id) {
  const values = getSheet_().getRange('A:A').getValues();
  for (let index = 1; index < values.length; index++) {
    if (String(values[index][0]) === String(id)) return index + 1;
  }
  return null;
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
