const SHEET_NAME = 'Menus';
const TOKEN_PROPERTY = 'ADMIN_TOKEN';

function setup() {
  const sheet = getSheet_();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['id', 'name', 'price', 'category', 'badge', 'description', 'image']);
  }

}

function doGet() {
  return json_(readMenus_());
}

function doPost(event) {
  const body = JSON.parse(event.postData.contents || '{}');
  const adminToken = getAdminToken_();
  if (!adminToken || String(body.token || '').trim() !== adminToken) {
    return json_({ error: 'Unauthorized' });
  }

  const action = body.action;
  if (action === 'create') createMenu_(body.menu);
  if (action === 'update') updateMenu_(body.menu);
  if (action === 'delete') deleteMenu_(body.menu.id);
  return json_({ ok: true, menus: readMenus_() });
}

function getAdminToken_() {
  return PropertiesService.getScriptProperties().getProperty(TOKEN_PROPERTY) || '';
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
